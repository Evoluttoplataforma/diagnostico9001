import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { VendorContactStep, VendorContactData } from "./steps/VendorContactStep";
import { VendorCompanyStep, VendorCompanyData } from "./steps/VendorCompanyStep";
import { questions, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Step = "questions" | "contact" | "company";

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
  const [currentStep, setCurrentStep] = useState<Step>("questions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
    company: null,
  });

  const totalQuestions = questions.length;
  const totalSteps = totalQuestions + 2;

  const handleAnswer = (value: AnswerValue) => {
    const questionId = questions[currentQuestionIndex].id;
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
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
    setData((prev) => ({ ...prev, contact: contactData }));
    setCurrentStep("company");
  };

  const handleContactBack = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(totalQuestions - 1);
  };

  const handleCompanyBack = () => {
    setCurrentStep("contact");
  };

  const handleCompanySubmit = async (companyData: VendorCompanyData) => {
    const score = getScore(data.answers);
    const diagnosis = getDiagnosis(score);
    const contactData = data.contact!;
    const pillarScores = calculatePillarScores(data.answers);

    try {
      // Save to database
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
      });

      if (error) {
        console.error("Error saving lead:", error);
        toast.error("Erro ao salvar dados. Tente novamente.");
        return;
      }

      // Update the existing Pipedrive deal instead of creating a new one
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
          },
        });

        if (pipedriveResponse.error) {
          console.error("Pipedrive update error:", pipedriveResponse.error);
        } else {
          console.log("Deal updated in Pipedrive:", pipedriveResponse.data);
          dealOwnerName = pipedriveResponse.data?.owner_name || ownerName;
        }
      } catch (pipedriveErr) {
        console.error("Pipedrive integration error:", pipedriveErr);
      }

      setData((prev) => ({ ...prev, company: companyData }));

      // Navigate with all data needed for the premium report
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
    case "questions":
      const currentQuestion = questions[currentQuestionIndex];
      return (
        <QuestionStep
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedAnswer={data.answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onBack={handleQuestionBack}
        />
      );

    case "contact":
      return (
        <VendorContactStep
          currentStep={totalQuestions + 1}
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
          currentStep={totalQuestions + 2}
          totalSteps={totalSteps}
          onSubmit={handleCompanySubmit}
          onBack={handleCompanyBack}
          initialData={{
            company: initialData.company,
            companySize: initialData.companySize,
            segment: initialData.segment,
            revenue: initialData.revenue,
          }}
        />
      );

    default:
      return null;
  }
};
