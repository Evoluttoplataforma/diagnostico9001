import { QuizHeader } from "../QuizHeader";
import { QuizOption } from "../QuizOption";

interface TimelineStepProps {
  currentStep: number;
  totalSteps: number;
  selected: string;
  onSelect: (value: string) => void;
}

const options = [
  { value: "urgente", label: "Urgente (até 30 dias)", emoji: "🚀" },
  { value: "curto", label: "Curto prazo (1-3 meses)", emoji: "📅" },
  { value: "medio", label: "Médio prazo (3-6 meses)", emoji: "📆" },
  { value: "longo", label: "Estou apenas pesquisando", emoji: "🔍" },
];

export const TimelineStep = ({
  currentStep,
  totalSteps,
  selected,
  onSelect,
}: TimelineStepProps) => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Qual seu prazo para certificação?
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Isso nos ajuda a definir a melhor estratégia para você
          </p>

          <div className="space-y-3">
            {options.map((option) => (
              <QuizOption
                key={option.value}
                label={option.label}
                emoji={option.emoji}
                selected={selected === option.value}
                onClick={() => onSelect(option.value)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
