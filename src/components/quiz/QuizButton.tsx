interface QuizButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const QuizButton = ({
  children,
  onClick,
  disabled = false,
}: QuizButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className="quiz-button">
      {children}
    </button>
  );
};
