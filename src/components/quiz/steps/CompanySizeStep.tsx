import { QuizHeader } from "../QuizHeader";
import { QuizOption } from "../QuizOption";

interface CompanySizeStepProps {
  currentStep: number;
  totalSteps: number;
  selected: string;
  onSelect: (value: string) => void;
}

const options = [
  { value: "mei", label: "MEI / Autônomo", emoji: "👤" },
  { value: "micro", label: "Microempresa (até 9 funcionários)", emoji: "🏠" },
  { value: "pequena", label: "Pequena empresa (10-49 funcionários)", emoji: "🏢" },
  { value: "media", label: "Média empresa (50-99 funcionários)", emoji: "🏗️" },
  { value: "grande", label: "Grande empresa (100+ funcionários)", emoji: "🏛️" },
];

export const CompanySizeStep = ({
  currentStep,
  totalSteps,
  selected,
  onSelect,
}: CompanySizeStepProps) => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Qual o porte da sua empresa?
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Isso nos ajuda a entender melhor suas necessidades
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
