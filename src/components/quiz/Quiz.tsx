import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "./steps/WelcomeStep";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { CompanyStep, CompanyData } from "./steps/CompanyStep";
import { questions, AnswerValue, getScore, getDiagnosis } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUTM } from "@/hooks/use-utm";

type Step = "welcome" | "questions" | "contact" | "company";

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
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
    company: null,
  });

  const totalQuestions = questions.length;
  const totalSteps = totalQuestions + 2; // 20 questions + contact step + company step

  const handleStartQuiz = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: AnswerValue) => {
    const questionId = questions[currentQuestionIndex].id;
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));

    // Auto-advance after selecting
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
    } else {
      setCurrentStep("welcome");
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
    
    // Determine final segment value
    const finalSegment = companyData.segment === "Outros" 
      ? companyData.segmentOther || "Outros"
      : companyData.segment;

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

      // Send to Pipedrive
      try {
        const pipedriveResponse = await supabase.functions.invoke("create-pipedrive-lead", {
          body: {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            company: companyData.company,
            segment: finalSegment,
            company_size: companyData.companySize,
            score: score,
            diagnosis_level: diagnosis.level,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_content: utmParams.utm_content,
            utm_term: utmParams.utm_term,
          },
        });

        if (pipedriveResponse.error) {
          console.error("Pipedrive error:", pipedriveResponse.error);
        } else {
          console.log("Lead created in Pipedrive:", pipedriveResponse.data);
        }
      } catch (pipedriveErr) {
        console.error("Pipedrive integration error:", pipedriveErr);
      }

      setData((prev) => ({ ...prev, company: companyData }));
      
      const navigationState = {
        name: contactData.name,
        score: score,
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
    case "welcome":
      return <WelcomeStep onNext={handleStartQuiz} />;

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
      return <WelcomeStep onNext={handleStartQuiz} />;
  }
};
