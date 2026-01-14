import templumLogo from "@/assets/templum-logo.png";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export const QuizHeader = ({ currentStep, totalSteps, onBack }: QuizHeaderProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <img src={templumLogo} alt="Templum" className="h-8" />

          <span className="text-sm text-muted-foreground font-medium">
            {currentStep} / {totalSteps}
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
