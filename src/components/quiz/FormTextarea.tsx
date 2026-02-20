import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: LucideIcon;
  delay?: number;
  hint?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, icon: Icon, delay = 0, hint, className, ...props }, ref) => {
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
                : "top-4 text-sm text-muted-foreground"
            )}
          >
            {label}
          </label>

          <div className="flex">
            <textarea
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
              rows={3}
              className={cn(
                "w-full px-4 pt-7 pb-3 bg-transparent outline-none resize-none",
                "text-foreground text-base font-medium",
                "placeholder:text-muted-foreground/50 placeholder:text-sm",
                Icon && "pr-12",
                className
              )}
            />

            {/* Icon */}
            {Icon && (
              <div 
                className={cn(
                  "absolute right-4 top-4 transition-all duration-300",
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

        {/* Hint text below */}
        {hint && (
          <p className="text-xs text-muted-foreground mt-2 px-1 leading-relaxed">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
