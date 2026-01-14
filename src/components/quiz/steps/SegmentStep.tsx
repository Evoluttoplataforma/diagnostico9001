import { QuizHeader } from "../QuizHeader";
import { QuizOption } from "../QuizOption";

interface SegmentStepProps {
  currentStep: number;
  totalSteps: number;
  selected: string;
  onSelect: (value: string) => void;
}

const options = [
  { value: "industria", label: "Indústria / Manufatura", emoji: "🏭" },
  { value: "servicos", label: "Prestação de Serviços", emoji: "💼" },
  { value: "comercio", label: "Comércio", emoji: "🛒" },
  { value: "construcao", label: "Construção Civil", emoji: "🏗️" },
  { value: "tecnologia", label: "Tecnologia / TI", emoji: "💻" },
  { value: "saude", label: "Saúde", emoji: "🏥" },
  { value: "outro", label: "Outro segmento", emoji: "📋" },
];

export const SegmentStep = ({
  currentStep,
  totalSteps,
  selected,
  onSelect,
}: SegmentStepProps) => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Qual o segmento da sua empresa?
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Cada setor tem necessidades específicas de certificação
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
