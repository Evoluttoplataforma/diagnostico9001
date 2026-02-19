import { QuizHeader } from "../QuizHeader";
import { DynamicQuestion } from "../quizData";

interface QuestionStepProps {
  question: DynamicQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswer: (value: number) => void;
  onBack: () => void;
}

const scaleColors = [
  { bg: "bg-red-500", bgLight: "bg-red-100", text: "text-white", textLight: "text-red-600", border: "border-red-500" },
  { bg: "bg-orange-500", bgLight: "bg-orange-100", text: "text-white", textLight: "text-orange-600", border: "border-orange-500" },
  { bg: "bg-yellow-500", bgLight: "bg-yellow-100", text: "text-white", textLight: "text-yellow-600", border: "border-yellow-500" },
  { bg: "bg-emerald-500", bgLight: "bg-emerald-100", text: "text-white", textLight: "text-emerald-600", border: "border-emerald-500" },
  { bg: "bg-green-600", bgLight: "bg-green-100", text: "text-white", textLight: "text-green-700", border: "border-green-600" },
];

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
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg">
              <span className="text-2xl font-bold">
                {question.block}
              </span>
              <div className="w-px h-6 bg-white/30" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {question.blockTitle}
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.answers.map((option, idx) => {
              const isSelected = selectedAnswer === option.value;
              const color = scaleColors[idx] || scaleColors[0];
              return (
                <button
                  key={option.value}
                  onClick={() => onAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left
                    ${
                      isSelected
                        ? `${color.border} bg-primary/5 shadow-md`
                        : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? color.bg : color.bgLight}`}>
                    <span className={`text-sm font-bold ${isSelected ? color.text : color.textLight}`}>
                      {option.value}
                    </span>
                  </div>
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
