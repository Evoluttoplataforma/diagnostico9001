import { useState } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { ResultStep } from "./steps/ResultStep";
import { questions, AnswerValue, getScore, getDiagnosis } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Step = "welcome" | "questions" | "contact" | "result";

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: ContactData | null;
}

export const Quiz = () => {
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

      setData((prev) => ({ ...prev, contact: contactData }));
      setCurrentStep("result");
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

    case "result":
      return (
        <ResultStep
          name={data.contact?.name || "Visitante"}
          score={getScore(data.answers)}
        />
      );

    default:
      return <WelcomeStep onNext={handleStartQuiz} />;
  }
};
