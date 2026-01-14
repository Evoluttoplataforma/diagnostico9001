import { QuizHeader } from "../QuizHeader";
import { Question, AnswerValue } from "../quizData";
import { Check, Minus, X } from "lucide-react";

interface QuestionStepProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  onBack: () => void;
}

const getIndicator = (value: AnswerValue, isSelected: boolean) => {
  const baseClass = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all";
  
  if (value === "positive") {
    return (
      <div className={`${baseClass} ${isSelected ? "bg-green-500" : "bg-green-100"}`}>
        <Check className={`w-4 h-4 ${isSelected ? "text-white" : "text-green-600"}`} />
      </div>
    );
  }
  if (value === "neutral") {
    return (
      <div className={`${baseClass} ${isSelected ? "bg-yellow-500" : "bg-yellow-100"}`}>
        <Minus className={`w-4 h-4 ${isSelected ? "text-white" : "text-yellow-600"}`} />
      </div>
    );
  }
  return (
    <div className={`${baseClass} ${isSelected ? "bg-red-500" : "bg-red-100"}`}>
      <X className={`w-4 h-4 ${isSelected ? "text-white" : "text-red-600"}`} />
    </div>
  );
};

export const QuestionStep = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onBack,
}: QuestionStepProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <QuizHeader
        currentStep={questionIndex + 1}
        totalSteps={totalQuestions}
        onBack={onBack}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full animate-fade-in">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Bloco {question.block}: {question.blockTitle}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.answers.map((option) => {
              const isSelected = selectedAnswer === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                    }
                  `}
                >
                  {getIndicator(option.value, isSelected)}
                  <span className="font-medium text-foreground text-lg">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
