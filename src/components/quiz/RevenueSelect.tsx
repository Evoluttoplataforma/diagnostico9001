import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, TrendingDown, TrendingUp, Check } from "lucide-react";
import { RevenueSelectMenu } from "./RevenueSelectMenu";

interface RevenueOption {
  value: string;
  label: string;
  color: "red" | "blue";
}

const REVENUE_OPTIONS: RevenueOption[] = [
  { 
    value: "abaixo_100k", 
    label: "Abaixo de R$ 100 mil/mês", 
    color: "red" 
  },
  { 
    value: "acima_100k", 
    label: "Acima de R$ 100 mil/mês", 
    color: "blue" 
  },
];

interface RevenueSelectProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export const RevenueSelect = ({ value, onChange, delay = 0 }: RevenueSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = REVENUE_OPTIONS.find((opt) => opt.value === value);
  const hasValue = value.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  const getColorClasses = (color: "red" | "blue", isSelected: boolean) => {
    if (color === "red") {
      return {
        bg: isSelected ? "bg-destructive/10" : "hover:bg-destructive/5",
        text: "text-destructive",
        border: isSelected ? "border-destructive" : "border-transparent",
        icon: "text-destructive",
        dot: "bg-destructive",
      };
    }
    return {
      bg: isSelected ? "bg-primary/10" : "hover:bg-primary/5",
      text: "text-primary",
      border: isSelected ? "border-primary" : "border-transparent",
      icon: "text-primary",
      dot: "bg-primary",
    };
  };

  return (
    <div
      ref={containerRef}
      className="animate-slide-up opacity-0 relative"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsFocused(true);
        }}
        onFocus={() => setIsFocused(true)}
        className={cn(
          "w-full relative rounded-2xl transition-all duration-300 text-left",
          "bg-card border-2",
          isFocused || isOpen
            ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/40 hover:shadow-md"
        )}
      >
        {/* Floating label */}
        <span
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none z-10",
            isFocused || hasValue
              ? "top-2 text-xs font-medium text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          )}
        >
          Faturamento mensal
        </span>

        <div className="flex items-center px-4 pt-6 pb-3 pr-12">
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-3 h-3 rounded-full",
                   selectedOption.color === "red" ? "bg-destructive" : "bg-primary"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                   selectedOption.color === "red" ? "text-destructive" : "text-primary"
                )}
              >
                {selectedOption.label}
              </span>
            </div>
          ) : (
            <span className="text-transparent">Selecione</span>
          )}
        </div>

        {/* Chevron icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isOpen ? "text-primary rotate-180" : "text-muted-foreground"
            )}
          />
        </div>

        {/* Focus glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
            "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
            isFocused || isOpen ? "opacity-100" : "opacity-0"
          )}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <RevenueSelectMenu
          anchorEl={triggerRef.current}
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
        >
          {REVENUE_OPTIONS.map((option) => {
            const isSelected = value === option.value;
            const colors = getColorClasses(option.color, isSelected);
            const Icon = option.color === "red" ? TrendingDown : TrendingUp;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-4 flex items-center gap-3 transition-all duration-200",
                  "border-l-4",
                  colors.bg,
                  colors.border
                )}
              >
                <span className={cn("w-3 h-3 rounded-full flex-shrink-0", colors.dot)} />
                <Icon className={cn("w-5 h-5 flex-shrink-0", colors.icon)} />
                <span className={cn("flex-1 text-left font-medium", colors.text)}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check className={cn("w-5 h-5 flex-shrink-0", colors.icon)} />
                )}
              </button>
            );
          })}
        </RevenueSelectMenu>
      )}
    </div>
  );
};
