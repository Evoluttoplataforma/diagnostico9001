import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  delay?: number;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, delay = 0, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div 
        className="animate-slide-up opacity-0"
        style={{ 
          animationDelay: `${delay}ms`,
          animationFillMode: 'forwards'
        }}
      >
        <div
          className={cn(
            "group relative rounded-2xl transition-all duration-300",
            "bg-card border-2",
            isFocused 
              ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" 
              : "border-border hover:border-primary/40 hover:shadow-md"
          )}
        >
          {/* Floating label */}
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none z-10",
              isFocused || hasValue
                ? "top-2 text-xs font-medium text-primary"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            )}
          >
            {label}
          </label>

          <div className="flex items-center">
            <input
              ref={ref}
              {...props}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                "w-full px-4 pt-5 pb-2 sm:pt-6 sm:pb-3 bg-transparent outline-none",
                "text-foreground text-sm sm:text-base font-medium",
                "placeholder:text-transparent",
                Icon && "pr-12",
                className
              )}
            />

            {/* Icon with animation */}
            {Icon && (
              <div 
                className={cn(
                  "absolute right-4 transition-all duration-300",
                  isFocused 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Focus glow effect */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
              "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
              isFocused ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
