import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { ChatStep, ChatStepData } from "./steps/ChatStep";
import { WelcomeStep, WelcomeFormData } from "./steps/WelcomeStep";
import { DynamicQuestion, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUTM } from "@/hooks/use-utm";
import { DiagnosisLoading } from "./results/DiagnosisLoading";
import { QuestionsLoading } from "./results/QuestionsLoading";

type Step = "welcome" | "chat" | "generating" | "questions";

interface QuizData {
  answers: Record<string, AnswerValue>;
  welcomeData: WelcomeFormData | null;
  company: ChatStepData | null;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const utmParams = useUTM();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [data, setData] = useState<QuizData>({
    answers: {},
    welcomeData: null,
    company: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dealIdRef = useRef<number | null>(null);
  const ownerNameRef = useRef<string | null>(null);

  const totalQuestions = dynamicQuestions.length || 20;
  const totalSteps = totalQuestions + 2;

  // --- Welcome popup submitted: immediately create Pipedrive lead ---
  const handleWelcomeNext = async (welcomeFormData: WelcomeFormData) => {
    setData((prev) => ({ ...prev, welcomeData: welcomeFormData }));
    setCurrentStep("chat");

    // Fire-and-forget Pipedrive creation with initial 4 fields
    try {
      const pipedriveResponse = await supabase.functions.invoke("create-pipedrive-lead", {
        body: {
          name: welcomeFormData.name,
          email: welcomeFormData.email,
          phone: welcomeFormData.phone,
          job_title: "",
          company: "",
          segment: "",
          company_size: "",
          revenue: welcomeFormData.revenue,
          score: 0,
          diagnosis_level: "pending",
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          answers: {},
          pillar_scores: [],
        },
      });
      if (!pipedriveResponse.error) {
        dealIdRef.current = pipedriveResponse.data?.deal_id || null;
        ownerNameRef.current = pipedriveResponse.data?.owner_name || null;
      } else {
        console.error("Pipedrive error:", pipedriveResponse.error);
      }
    } catch (err) {
      console.error("Pipedrive creation error:", err);
    }
  };

  // --- Chat step complete: generate questions (Pipedrive already created) ---
  const handleChatComplete = async (chatData: ChatStepData) => {
    const welcomeData = data.welcomeData!;
    setData((prev) => ({ ...prev, company: chatData }));
    setCurrentStep("generating");

    try {
      // Update existing deal with chat data if available
      const currentDealId = dealIdRef.current;
      const [, questionsResult] = await Promise.all([
        currentDealId ? (async () => {
          try {
            await supabase.functions.invoke("update-pipedrive-deal", {
              body: {
                deal_id: currentDealId,
                name: welcomeData.name,
                email: welcomeData.email,
                phone: welcomeData.phone,
                job_title: chatData.jobTitle,
                company: chatData.company,
                segment: chatData.segment,
                company_size: chatData.companySize,
                revenue: welcomeData.revenue,
                score: 0,
                diagnosis_level: "pending",
                answers: {},
                pillar_scores: [],
                questions: [],
              },
            });
          } catch (err) {
            console.error("Pipedrive update error:", err);
          }
        })() : Promise.resolve(),
        // Generate personalized questions via AI
        (async () => {
          const { data: questionsData, error } = await supabase.functions.invoke("generate-questions", {
            body: {
              segment: chatData.segment,
              companySize: chatData.companySize,
              revenue: welcomeData.revenue,
              jobTitle: chatData.jobTitle,
            },
          });
          if (error) throw error;
          return questionsData;
        })(),
      ]);

      if (questionsResult?.questions) {
        setDynamicQuestions(questionsResult.questions);
        setCurrentStep("questions");
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      toast.error("Erro ao gerar perguntas. Tente novamente.");
      setCurrentStep("chat");
    }
  };

  const handleChatBack = () => {
    setCurrentStep("welcome");
  };

  // --- Questions step ---
  const handleAnswer = (value: AnswerValue) => {
    const questionId = dynamicQuestions[currentQuestionIndex].id;
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));

    setTimeout(() => {
      if (currentQuestionIndex < dynamicQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        handleSubmit(value);
      }
    }, 300);
  };

  const handleQuestionBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentStep("chat");
    }
  };

  const handleSubmit = async (lastAnswerValue: AnswerValue) => {
    setIsSubmitting(true);

    const lastQuestionId = dynamicQuestions[dynamicQuestions.length - 1].id;
    const allAnswers = { ...data.answers, [lastQuestionId]: lastAnswerValue };

    const score = getScore(allAnswers);
    const diagnosis = getDiagnosis(score);
    const welcomeData = data.welcomeData!;
    const companyData = data.company!;
    const pillarScores = calculatePillarScores(allAnswers, dynamicQuestions);
    const finalSegment = companyData.segment;

    try {
      const minLoadingPromise = new Promise((resolve) => setTimeout(resolve, 8000));

      const submitPromise = (async () => {
        const { error } = await supabase.from("quiz_leads").insert({
          name: welcomeData.name,
          email: welcomeData.email,
          phone: welcomeData.phone,
          company: companyData.company,
          segment: finalSegment,
          company_size: companyData.companySize,
          score: score,
          answers: allAnswers,
          diagnosis_level: diagnosis.level,
        });

        if (error) {
          console.error("Error saving lead:", error);
          toast.error("Erro ao salvar dados. Tente novamente.");
          return false;
        }

        const currentDealId = dealIdRef.current;
        if (currentDealId) {
          try {
            const updateResponse = await supabase.functions.invoke("update-pipedrive-deal", {
              body: {
                deal_id: currentDealId,
                name: welcomeData.name,
                email: welcomeData.email,
                phone: welcomeData.phone,
                job_title: companyData.jobTitle,
                company: companyData.company,
                segment: finalSegment,
                company_size: companyData.companySize,
                revenue: welcomeData.revenue,
                score: score,
                diagnosis_level: diagnosis.level,
                answers: allAnswers,
                pillar_scores: pillarScores,
                questions: dynamicQuestions,
              },
            });

            if (updateResponse.error) {
              console.error("Pipedrive update error:", updateResponse.error);
            } else {
              ownerNameRef.current = updateResponse.data?.owner_name || ownerNameRef.current;
            }
          } catch (updateErr) {
            console.error("Pipedrive update error:", updateErr);
          }
        }
        return true;
      })();

      const [, success] = await Promise.all([minLoadingPromise, submitPromise]);

      if (success === false) {
        setIsSubmitting(false);
        return;
      }

      navigate("/obrigado-diagnostico", {
        state: {
          name: welcomeData.name,
          score: score,
          answers: allAnswers,
          segment: finalSegment,
          companySize: companyData.companySize,
          revenue: welcomeData.revenue,
          company: companyData.company,
          pillarScores: pillarScores,
          ownerName: ownerNameRef.current,
          dealId: dealIdRef.current,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao processar. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <DiagnosisLoading />
      </div>
    );
  }

  switch (currentStep) {
    case "welcome":
      return (
        <WelcomeStep onNext={handleWelcomeNext} />
      );

    case "chat":
      return (
        <ChatStep
          userName={data.welcomeData?.name || ""}
          onComplete={handleChatComplete}
          onBack={handleChatBack}
        />
      );

    case "generating":
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
          <QuestionsLoading />
        </div>
      );

    case "questions":
      const currentQuestion = dynamicQuestions[currentQuestionIndex];
      return (
        <QuestionStep
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={dynamicQuestions.length}
          selectedAnswer={data.answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onBack={handleQuestionBack}
        />
      );

    default:
      return null;
  }
};
