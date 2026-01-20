import { useLocation, Navigate } from "react-router-dom";
import { ResultStep } from "@/components/quiz/steps/ResultStep";

interface LocationState {
  name: string;
  score: number;
}

const Obrigado = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  // If no state, redirect to home
  if (!state?.name || state?.score === undefined) {
    return <Navigate to="/" replace />;
  }

  return <ResultStep name={state.name} score={state.score} />;
};

export default Obrigado;
