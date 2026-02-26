import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ResultStep } from "@/components/quiz/steps/ResultStep";
import { AnswerValue, PillarScore } from "@/components/quiz/quizData";

interface LocationState {
  name: string;
  score: number;
  answers: Record<string, AnswerValue>;
  segment: string;
  companySize: string;
  revenue: string;
  company: string;
  pillarScores: PillarScore[];
  ownerName: string | null;
  dealId: number | null;
}

const Obrigado = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (state) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "tally_form_submit" });
      (window as any).dataLayer.push({ event: "form_submit_success" });
      console.log("[GTM] Eventos disparados: tally_form_submit, form_submit_success");
    } else {
      console.warn("[GTM] State não encontrado — eventos NÃO disparados");
    }
  }, []);
  // If no state, redirect to home
  if (
    !state ||
    !state.name ||
    typeof state.score !== "number" ||
    !state.answers ||
    !state.pillarScores
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <ResultStep
      name={state.name}
      score={state.score}
      answers={state.answers}
      segment={state.segment}
      companySize={state.companySize}
      revenue={state.revenue}
      company={state.company}
      pillarScores={state.pillarScores}
      ownerName={state.ownerName}
      dealId={state.dealId}
    />
  );
};

export default Obrigado;
