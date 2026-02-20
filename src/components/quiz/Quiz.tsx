import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { CompanyStep, CompanyData } from "./steps/CompanyStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { DynamicQuestion, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUTM } from "@/hooks/use-utm";
import { DiagnosisLoading } from "./results/DiagnosisLoading";
import { QuestionsLoading } from "./results/QuestionsLoading";

type Step = "welcome" | "contact" | "company" | "generating" | "questions";

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: ContactData | null;
  company: CompanyData | null;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const utmParams = useUTM();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
    company: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dealIdRef = useRef<number | null>(null);
  const ownerNameRef = useRef<string | null>(null);

  const totalQuestions = dynamicQuestions.length || 20;
  const totalSteps = totalQuestions + 2;

  // --- Contact step ---
  const handleContactNext = (contactData: ContactData) => {
    setData((prev) => ({ ...prev, contact: contactData }));
    setCurrentStep("company");
  };

  const handleContactBack = () => {
    setCurrentStep("welcome");
  };

  // --- Company step: create lead + generate questions ---
  const handleCompanyNext = async (companyData: CompanyData) => {
    const contactData = data.contact!;
    setData((prev) => ({ ...prev, company: companyData }));
    setCurrentStep("generating");

    try {
      // Run Pipedrive creation and question generation in parallel
      const [, questionsResult] = await Promise.all([
        // Create lead in Pipedrive
        (async () => {
          try {
            const pipedriveResponse = await supabase.functions.invoke("create-pipedrive-lead", {
              body: {
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                job_title: contactData.jobTitle,
                company: companyData.company,
                segment: companyData.segment,
                company_size: companyData.companySize,
                revenue: companyData.revenue,
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
        })(),
        // Generate personalized questions via AI
        (async () => {
          const { data: questionsData, error } = await supabase.functions.invoke("generate-questions", {
            body: {
              segment: companyData.segment,
              companySize: companyData.companySize,
              revenue: companyData.revenue,
              jobTitle: contactData.jobTitle,
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
      setCurrentStep("company");
    }
  };

  const handleCompanyBack = () => {
    setCurrentStep("contact");
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
      setCurrentStep("company");
    }
  };

  const handleSubmit = async (lastAnswerValue: AnswerValue) => {
    setIsSubmitting(true);

    const lastQuestionId = dynamicQuestions[dynamicQuestions.length - 1].id;
    const allAnswers = { ...data.answers, [lastQuestionId]: lastAnswerValue };

    const score = getScore(allAnswers);
    const diagnosis = getDiagnosis(score);
    const contactData = data.contact!;
    const companyData = data.company!;
    const pillarScores = calculatePillarScores(allAnswers, dynamicQuestions);
    const finalSegment = companyData.segment;

    try {
      const minLoadingPromise = new Promise((resolve) => setTimeout(resolve, 8000));

      const submitPromise = (async () => {
        // Save to database
        const { error } = await supabase.from("quiz_leads").insert({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
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

        // Update existing Pipedrive deal with diagnosis results
        const currentDealId = dealIdRef.current;
        if (currentDealId) {
          try {
            const updateResponse = await supabase.functions.invoke("update-pipedrive-deal", {
              body: {
                deal_id: currentDealId,
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                job_title: contactData.jobTitle,
                company: companyData.company,
                segment: finalSegment,
                company_size: companyData.companySize,
                revenue: companyData.revenue,
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

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "tally_form_submit" });

      navigate("/obrigado-diagnostico", {
        state: {
          name: contactData.name,
          score: score,
          answers: allAnswers,
          segment: finalSegment,
          companySize: companyData.companySize,
          revenue: companyData.revenue,
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
        <WelcomeStep onNext={() => setCurrentStep("contact")} />
      );

    case "contact":
      return (
        <ContactStep
          currentStep={1}
          totalSteps={totalSteps}
          onNext={handleContactNext}
          onBack={handleContactBack}
        />
      );

    case "company":
      return (
        <CompanyStep
          currentStep={2}
          totalSteps={totalSteps}
          onSubmit={handleCompanyNext}
          onBack={handleCompanyBack}
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
