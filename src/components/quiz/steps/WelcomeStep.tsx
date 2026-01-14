import { QuizButton } from "../QuizButton";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-xl w-full text-center">

        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Diagnóstico ISO 9001
        </h1>

        <p className="text-lg text-muted-foreground mb-4">
          Questionário de 2 minutos
        </p>

        <p className="text-muted-foreground mb-12 leading-relaxed">
          <strong className="text-foreground">
            Descubra como a ISO 9001 pode transformar sua empresa.
          </strong>{" "}
          Responda algumas perguntas rápidas e receba uma análise personalizada
          para aumentar seu faturamento e conquistar novos contratos.
        </p>

        <QuizButton onClick={onNext}>Começar Diagnóstico</QuizButton>

        <p className="text-xs text-muted-foreground mt-6">
          +2.000 empresas já conquistaram a certificação com a Templum
        </p>
      </div>
    </div>
  );
};
