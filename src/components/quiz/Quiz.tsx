import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "./steps/WelcomeStep";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { questions, AnswerValue, getScore, getDiagnosis } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Step = "welcome" | "questions" | "contact";

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: ContactData | null;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
  });

  const totalQuestions = questions.length;

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

  const handleContactBack = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(totalQuestions - 1);
  };

  const handleContactSubmit = async (contactData: ContactData) => {
    const score = getScore(data.answers);
    const diagnosis = getDiagnosis(score);
    
    try {
      // Save to database
      const { error } = await supabase.from("quiz_leads").insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
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
            company: contactData.company,
            score: score,
            diagnosis_level: diagnosis.level,
            utm_source: contactData.utm_source,
            utm_medium: contactData.utm_medium,
            utm_campaign: contactData.utm_campaign,
            utm_content: contactData.utm_content,
            utm_term: contactData.utm_term,
          },
        });

        if (pipedriveResponse.error) {
          console.error("Pipedrive error:", pipedriveResponse.error);
          // Don't block the user flow, just log the error
        } else {
          console.log("Lead created in Pipedrive:", pipedriveResponse.data);
        }
      } catch (pipedriveErr) {
        console.error("Pipedrive integration error:", pipedriveErr);
        // Don't block the user flow
      }

      setData((prev) => ({ ...prev, contact: contactData }));
      
      // Navigate to result page with state
      navigate("/obrigado-diagnostico", {
        state: {
          name: contactData.name,
          score: score,
        },
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
          totalSteps={totalQuestions + 1}
          onSubmit={handleContactSubmit}
          onBack={handleContactBack}
        />
      );

    default:
      return <WelcomeStep onNext={handleStartQuiz} />;
  }
};
