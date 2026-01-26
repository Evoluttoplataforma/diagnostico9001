import { useState, useEffect } from "react";
import { Loader2, Award, Star, FileCheck } from "lucide-react";

const confidenceMessages = [
  {
    icon: Award,
    text: "+2.000 empresas certificadas",
  },
  {
    icon: Star,
    text: "4,9 estrelas no Google",
  },
  {
    icon: FileCheck,
    text: "Garantimos sua certificação em contrato",
  },
];

export const LoadingConfidenceCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % confidenceMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = confidenceMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="flex items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
      <div className="flex items-center gap-2 animate-fade-in" key={currentIndex}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{currentMessage.text}</span>
      </div>
    </div>
  );
};
