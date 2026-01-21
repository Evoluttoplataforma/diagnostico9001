import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
}

export const QuizButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
}: QuizButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={cn(
        "quiz-button",
        variant === "outline" && "quiz-button-outline"
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
};
