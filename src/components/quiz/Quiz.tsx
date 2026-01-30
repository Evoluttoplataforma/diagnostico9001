import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { CompanyStep, CompanyData } from "./steps/CompanyStep";
import { questions, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUTM } from "@/hooks/use-utm";

type Step = "questions" | "contact" | "company";

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: ContactData | null;
  company: CompanyData | null;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const utmParams = useUTM();
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

  const handleContactNext = (contactData: ContactData) => {
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

  const handleCompanySubmit = async (companyData: CompanyData) => {
    const score = getScore(data.answers);
    const diagnosis = getDiagnosis(score);
    const contactData = data.contact!;
    const pillarScores = calculatePillarScores(data.answers);

    const finalSegment = companyData.segment;

    try {
      // Save to database
      const { error } = await supabase.from("quiz_leads").insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: companyData.company,
        segment: finalSegment,
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

      // Send to Pipedrive and get owner info
      let ownerName: string | null = null;
      let dealId: number | null = null;
      try {
        const pipedriveResponse = await supabase.functions.invoke("create-pipedrive-lead", {
          body: {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            company: companyData.company,
            segment: finalSegment,
            company_size: companyData.companySize,
            revenue: companyData.revenue,
            score: score,
            diagnosis_level: diagnosis.level,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_content: utmParams.utm_content,
            utm_term: utmParams.utm_term,
            answers: data.answers,
            pillar_scores: pillarScores,
          },
        });

        if (pipedriveResponse.error) {
          console.error("Pipedrive error:", pipedriveResponse.error);
        } else {
          console.log("Lead created in Pipedrive:", pipedriveResponse.data);
          ownerName = pipedriveResponse.data?.owner_name || null;
          dealId = pipedriveResponse.data?.deal_id || null;
        }
      } catch (pipedriveErr) {
        console.error("Pipedrive integration error:", pipedriveErr);
      }

      setData((prev) => ({ ...prev, company: companyData }));

      // Navigate with all data needed for the premium report
      const navigationState = {
        name: contactData.name,
        score: score,
        answers: data.answers,
        segment: finalSegment,
        companySize: companyData.companySize,
        revenue: companyData.revenue,
        company: companyData.company,
        pillarScores: pillarScores,
        ownerName: ownerName,
        dealId: dealId,
      };

      console.log("Navigating to /obrigado-diagnostico with state:", navigationState);

      navigate("/obrigado-diagnostico", {
        state: navigationState,
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
        <ContactStep
          currentStep={totalQuestions + 1}
          totalSteps={totalSteps}
          onNext={handleContactNext}
          onBack={handleContactBack}
        />
      );

    case "company":
      return (
        <CompanyStep
          currentStep={totalQuestions + 2}
          totalSteps={totalSteps}
          onSubmit={handleCompanySubmit}
          onBack={handleCompanyBack}
        />
      );

    default:
      return null;
  }
};
