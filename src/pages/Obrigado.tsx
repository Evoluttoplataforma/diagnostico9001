import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ResultStep } from "@/components/quiz/steps/ResultStep";
import { PostQuizChat } from "@/components/quiz/steps/PostQuizChat";
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
  const [showFullResult, setShowFullResult] = useState(false);
  const [openScheduling, setOpenScheduling] = useState(false);

  useEffect(() => {
    if (state) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "tally_form_submit" });
      console.log("[GTM] Evento disparado: tally_form_submit");

      (window as any).dataLayer.push({
        event: "thank_you_page_view",
        page_url: window.location.href,
        page_path: window.location.pathname,
      });
      console.log("[GTM] Evento disparado: thank_you_page_view");
    } else {
      console.warn("[GTM] State não encontrado — eventos NÃO disparados");
    }
  }, []);

  if (
    !state ||
    !state.name ||
    typeof state.score !== "number" ||
    !state.answers ||
    !state.pillarScores
  ) {
    return <Navigate to="/" replace />;
  }

  const employeeCount = parseInt(state.companySize, 10) || 0;
  const isDisqualified = employeeCount < 10 && state.revenue === "abaixo_100k";

  if (showFullResult) {
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
        autoOpenScheduling={openScheduling}
      />
    );
  }

  return (
    <PostQuizChat
      name={state.name}
      score={state.score}
      pillarScores={state.pillarScores}
      segment={state.segment}
      companySize={state.companySize}
      company={state.company}
      isDisqualified={isDisqualified}
      onShowFullResult={() => setShowFullResult(true)}
      onScheduleMeeting={() => {
        setOpenScheduling(true);
        setShowFullResult(true);
      }}
    />
  );
};

export default Obrigado;
