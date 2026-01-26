import { cn } from "@/lib/utils";
import { LoadingConfidenceCards } from "./LoadingConfidenceCards";

interface QuizButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
  className?: string;
}

export const QuizButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className,
}: QuizButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={cn(
        "quiz-button",
        variant === "outline" && "quiz-button-outline",
        className
      )}
    >
      {loading ? (
        <LoadingConfidenceCards />
      ) : (
        children
      )}
    </button>
  );
};
