import { User, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStepIndicatorProps {
  currentStep: 1 | 2;
}

const steps = [
  { id: 1, label: "Seus dados", icon: User },
  { id: 2, label: "Sua empresa", icon: Building2 },
];

export const FormStepIndicator = ({ currentStep }: FormStepIndicatorProps) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border rounded-full mx-12" />
        
        {/* Animated progress line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full mx-12 transition-all duration-500 ease-out"
          style={{ 
            width: currentStep === 1 ? '0%' : 'calc(100% - 6rem)',
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  "border-2 shadow-lg",
                  isCompleted && "bg-primary border-primary scale-100",
                  isCurrent && "bg-card border-primary scale-110 shadow-primary/25",
                  !isCompleted && !isCurrent && "bg-card border-border"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-primary-foreground animate-scale-in" />
                ) : (
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300 whitespace-nowrap",
                  isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
