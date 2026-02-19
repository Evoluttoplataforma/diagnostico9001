import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionStep } from "./steps/QuestionStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { CompanyStep, CompanyData } from "./steps/CompanyStep";
import { questions, AnswerValue, getScore, getDiagnosis, calculatePillarScores } from "./quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUTM } from "@/hooks/use-utm";

type Step = "contact" | "company" | "questions";

interface QuizData {
  answers: Record<string, AnswerValue>;
  contact: ContactData | null;
  company: CompanyData | null;
}

export const Quiz = () => {
  const navigate = useNavigate();
  const utmParams = useUTM();
  const [currentStep, setCurrentStep] = useState<Step>("contact");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [data, setData] = useState<QuizData>({
    answers: {},
    contact: null,
    company: null,
  });
  const dealIdRef = useRef<number | null>(null);
  const ownerNameRef = useRef<string | null>(null);

  const totalQuestions = questions.length;
  const totalSteps = totalQuestions + 2;

  // --- Contact step ---
  const handleContactNext = (contactData: ContactData) => {
    setData((prev) => ({ ...prev, contact: contactData }));
    setCurrentStep("company");
  };

  const handleContactBack = () => {};

  // --- Company step: create lead in Pipedrive ---
  const handleCompanyNext = async (companyData: CompanyData) => {
    const contactData = data.contact!;
    setData((prev) => ({ ...prev, company: companyData }));

    // Create lead in Pipedrive in background (don't block navigation)
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

      if (pipedriveResponse.error) {
        console.error("Pipedrive error:", pipedriveResponse.error);
      } else {
        console.log("Lead created in Pipedrive:", pipedriveResponse.data);
        dealIdRef.current = pipedriveResponse.data?.deal_id || null;
        ownerNameRef.current = pipedriveResponse.data?.owner_name || null;
      }
    } catch (err) {
      console.error("Pipedrive creation error:", err);
    }

    setCurrentStep("questions");
  };

  const handleCompanyBack = () => {
    setCurrentStep("contact");
  };

  // --- Questions step ---
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
    const lastQuestionId = questions[totalQuestions - 1].id;
    const allAnswers = { ...data.answers, [lastQuestionId]: lastAnswerValue };

    const score = getScore(allAnswers);
    const diagnosis = getDiagnosis(score);
    const contactData = data.contact!;
    const companyData = data.company!;
    const pillarScores = calculatePillarScores(allAnswers);
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
        answers: allAnswers,
        diagnosis_level: diagnosis.level,
      });

      if (error) {
        console.error("Error saving lead:", error);
        toast.error("Erro ao salvar dados. Tente novamente.");
        return;
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
            },
          });

          if (updateResponse.error) {
            console.error("Pipedrive update error:", updateResponse.error);
          } else {
            console.log("Deal updated in Pipedrive:", updateResponse.data);
            ownerNameRef.current = updateResponse.data?.owner_name || ownerNameRef.current;
          }
        } catch (updateErr) {
          console.error("Pipedrive update error:", updateErr);
        }
      }

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
          dealId: currentDealId,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao processar. Tente novamente.");
    }
  };

  switch (currentStep) {
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

    default:
      return null;
  }
};
