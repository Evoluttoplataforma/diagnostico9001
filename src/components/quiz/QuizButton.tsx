import { Loader2 } from "lucide-react";

interface QuizButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const QuizButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
}: QuizButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className="quiz-button"
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
