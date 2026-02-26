import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { VendorContactStep, VendorContactData } from "./steps/VendorContactStep";
import { VendorCompanyStep, VendorCompanyData } from "./steps/VendorCompanyStep";
import { VendorSegmentStep } from "./steps/VendorSegmentStep";
import { DynamicQuestion, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuestionsLoading } from "./results/QuestionsLoading";
import { getSessionId } from "@/lib/session";

type Step = "segment" | "generating" | "questions" | "contact" | "company";

interface VendorQuizFlowProps {
  dealId: number;
  initialData: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    company: string;
    companySize: string;
    segment: string;
    revenue: string;
  };
  ownerName: string | null;
}

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: VendorContactData | null;
  company: VendorCompanyData | null;
}

export const VendorQuizFlow = ({ dealId, initialData, ownerName }: VendorQuizFlowProps) => {
  const navigate = useNavigate();
  const pageStartTime = useRef(Date.now());
  const hasInitialSegment = !!(initialData.segment && initialData.segment.trim());
  const [currentStep, setCurrentStep] = useState<Step>(hasInitialSegment ? "generating" : "segment");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [resolvedSegment, setResolvedSegment] = useState(initialData.segment || "");
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
    company: null,
  });

  const totalQuestions = dynamicQuestions.length || 20;
  const totalSteps = totalQuestions + 2;

  const generateQuestions = async (segment: string) => {
    setCurrentStep("generating");
    try {
      const { data: questionsData, error } = await supabase.functions.invoke("generate-questions", {
        body: {
          segment,
          companySize: initialData.companySize,
          revenue: initialData.revenue,
          jobTitle: initialData.jobTitle,
        },
      });
      if (error) throw error;
      if (questionsData?.questions) {
        setDynamicQuestions(questionsData.questions);
        setCurrentStep("questions");
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      toast.error("Erro ao gerar perguntas. Tente novamente.");
    }
  };

  // Auto-generate questions if segment already exists
  useEffect(() => {
    if (hasInitialSegment) {
      setResolvedSegment(initialData.segment);
      generateQuestions(initialData.segment);
    }
  }, []);

  const handleSegmentSubmit = (segment: string) => {
    setResolvedSegment(segment);
    generateQuestions(segment);
  };

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
        setCurrentStep("contact");
      }
    }, 300);
  };

  const handleQuestionBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleContactNext = (contactData: VendorContactData) => {
    const nameParts = contactData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const phoneDigitsOnly = contactData.phone.replace(/\D/g, "");

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "form_submit_success",
      session_id: getSessionId(),
      email: contactData.email,
      phoneNumber: phoneDigitsOnly,
      nome: firstName,
      sobrenome: lastName,
      time_on_page_at_submit: Math.round((Date.now() - pageStartTime.current) / 1000),
    });
    console.log("[GTM] Evento disparado: form_submit_success (vendor)");

    setData((prev) => ({ ...prev, contact: contactData }));
    setCurrentStep("company");
  };

  const handleContactBack = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(dynamicQuestions.length - 1);
  };

  const handleCompanyBack = () => {
    setCurrentStep("contact");
  };

  const handleCompanySubmit = async (companyData: VendorCompanyData) => {
    const score = getScore(data.answers);
    const diagnosis = getDiagnosis(score);
    const contactData = data.contact!;
    const pillarScores = calculatePillarScores(data.answers, dynamicQuestions);

    try {
      const { error } = await supabase.from("quiz_leads").insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: companyData.company,
        segment: companyData.segment,
        company_size: companyData.companySize,
        score: score,
        answers: data.answers,
        diagnosis_level: diagnosis.level,
        copy_variant: "V",
      });

      if (error) {
        console.error("Error saving lead:", error);
        toast.error("Erro ao salvar dados. Tente novamente.");
        return;
      }

      let dealOwnerName: string | null = ownerName;
      try {
        const pipedriveResponse = await supabase.functions.invoke("update-pipedrive-deal", {
          body: {
            deal_id: dealId,
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            job_title: contactData.jobTitle,
            company: companyData.company,
            segment: companyData.segment,
            company_size: companyData.companySize,
            revenue: companyData.revenue,
            score: score,
            diagnosis_level: diagnosis.level,
            answers: data.answers,
            pillar_scores: pillarScores,
            questions: dynamicQuestions,
          },
        });

        if (!pipedriveResponse.error) {
          dealOwnerName = pipedriveResponse.data?.owner_name || ownerName;
        }
      } catch (pipedriveErr) {
        console.error("Pipedrive integration error:", pipedriveErr);
      }

      setData((prev) => ({ ...prev, company: companyData }));

      navigate("/obrigado-diagnostico", {
        state: {
          name: contactData.name,
          score: score,
          answers: data.answers,
          segment: companyData.segment,
          companySize: companyData.companySize,
          revenue: companyData.revenue,
          company: companyData.company,
          pillarScores: pillarScores,
          ownerName: dealOwnerName,
          dealId: dealId,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao processar. Tente novamente.");
    }
  };

  switch (currentStep) {
    case "segment":
      return <VendorSegmentStep onSubmit={handleSegmentSubmit} />;

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

    case "contact":
      return (
        <VendorContactStep
          currentStep={dynamicQuestions.length + 1}
          totalSteps={totalSteps}
          onNext={handleContactNext}
          onBack={handleContactBack}
          initialData={{
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone,
            jobTitle: initialData.jobTitle,
          }}
        />
      );

    case "company":
      return (
        <VendorCompanyStep
          currentStep={dynamicQuestions.length + 2}
          totalSteps={totalSteps}
          onSubmit={handleCompanySubmit}
          onBack={handleCompanyBack}
          initialData={{
            company: initialData.company,
            companySize: initialData.companySize,
            segment: resolvedSegment,
            revenue: initialData.revenue,
          }}
        />
      );

    default:
      return null;
  }
};
