import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: LucideIcon;
  delay?: number;
}

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  delay = 0,
}: FormSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

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
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 pt-6 pb-3 bg-transparent outline-none appearance-none cursor-pointer",
              "text-foreground text-base font-medium",
              !hasValue && "text-transparent",
              Icon ? "pr-16" : "pr-12"
            )}
          >
            <option value="" disabled>{label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Icons container */}
          <div className="absolute right-4 flex items-center gap-2 pointer-events-none">
            {Icon && (
              <Icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isFocused ? "text-primary" : "text-muted-foreground"
                )} 
              />
            )}
            <ChevronDown 
              className={cn(
                "w-5 h-5 transition-all duration-300",
                isFocused 
                  ? "text-primary rotate-180" 
                  : "text-muted-foreground"
              )}
            />
          </div>
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
};
