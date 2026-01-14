import { useState } from "react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import { Check } from "lucide-react";

interface ObjectiveStepProps {
  currentStep: number;
  totalSteps: number;
  selected: string[];
  onSelect: (values: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  {
    value: "licitacoes",
    label: "Participar de licitações públicas",
    emoji: "🏛️",
  },
  {
    value: "contratos",
    label: "Fechar contratos com grandes empresas",
    emoji: "🤝",
  },
  {
    value: "processos",
    label: "Melhorar processos internos",
    emoji: "⚙️",
  },
  {
    value: "credibilidade",
    label: "Aumentar credibilidade no mercado",
    emoji: "⭐",
  },
  {
    value: "exportacao",
    label: "Exportar produtos/serviços",
    emoji: "🌍",
  },
];

export const ObjectiveStep = ({
  currentStep,
  totalSteps,
  selected,
  onSelect,
  onNext,
  onBack,
}: ObjectiveStepProps) => {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter((v) => v !== value));
    } else {
      onSelect([...selected, value]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Qual seu principal objetivo?
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Você pode selecionar mais de uma opção
          </p>

          <div className="space-y-3 mb-8">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`quiz-card w-full flex items-center justify-between gap-4 text-left ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0" />
                    )}
                    <span className="font-semibold text-foreground text-lg">
                      {option.label}
                    </span>
                  </div>
                  <span className="text-3xl">{option.emoji}</span>
                </button>
              );
            })}
          </div>

          <QuizButton onClick={onNext} disabled={selected.length === 0}>
            Continuar
          </QuizButton>
        </div>
      </main>
    </div>
  );
};
