import { QuizHeader } from "../QuizHeader";
import { QuizOption } from "../QuizOption";

interface CertificationStepProps {
  currentStep: number;
  totalSteps: number;
  selected: string;
  onSelect: (value: string) => void;
  onBack: () => void;
}

const options = [
  { value: "nenhuma", label: "Nenhuma certificação", emoji: "📝" },
  { value: "em_processo", label: "Estou em processo de certificação", emoji: "⏳" },
  { value: "iso_9001", label: "Já tenho ISO 9001", emoji: "✅" },
  { value: "outras", label: "Tenho outras certificações", emoji: "🏆" },
];

export const CertificationStep = ({
  currentStep,
  totalSteps,
  selected,
  onSelect,
  onBack,
}: CertificationStepProps) => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Sua empresa possui alguma certificação?
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Entender seu ponto de partida nos ajuda a personalizar sua jornada
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
