import { useState, useEffect } from "react";
import { Loader2, Award, Star, ShieldCheck } from "lucide-react";

const confidenceCards = [
  {
    icon: Award,
    title: "+2.000",
    subtitle: "empresas certificadas",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Star,
    title: "4,9",
    subtitle: "estrelas no Google",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: ShieldCheck,
    title: "100%",
    subtitle: "garantia em contrato",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export const DiagnosisLoading = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % confidenceCards.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const currentCard = confidenceCards[currentIndex];
  const Icon = currentCard.icon;

  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm font-medium text-muted-foreground">
          Analisando suas respostas com IA...
        </span>
      </div>

      {/* Confidence Card */}
      <div className="flex justify-center">
        <div
          key={currentIndex}
          className={`
            w-48 h-48 rounded-2xl border-2 border-border
            flex flex-col items-center justify-center gap-3
            ${currentCard.bgColor}
            animate-scale-in shadow-lg
          `}
        >
          <div className={`p-4 rounded-full ${currentCard.bgColor}`}>
            <Icon className={`w-12 h-12 ${currentCard.color}`} />
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${currentCard.color}`}>
              {currentCard.title}
            </div>
            <div className="text-sm text-muted-foreground font-medium px-4">
              {currentCard.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2">
        {confidenceCards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
