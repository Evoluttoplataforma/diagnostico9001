import { Check } from "lucide-react";

interface QuizOptionProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onClick: () => void;
  description?: string;
}

export const QuizOption = ({
  label,
  emoji,
  selected = false,
  onClick,
  description,
}: QuizOptionProps) => {
  return (
    <button
      onClick={onClick}
      className={`quiz-card w-full flex items-center justify-between gap-4 text-left ${
        selected ? "selected" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {selected && (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        {!selected && (
          <div className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0" />
        )}
        <div>
          <span className="font-semibold text-foreground text-lg">{label}</span>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {emoji && <span className="text-3xl">{emoji}</span>}
    </button>
  );
};
