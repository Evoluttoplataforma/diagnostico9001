import { QuizHeader } from "../QuizHeader";
import { Question, AnswerValue } from "../quizData";

interface QuestionStepProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  onBack: () => void;
}

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
            {question.answers.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left
                  ${
                    selectedAnswer === option.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                  }
                `}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium text-foreground text-lg">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
