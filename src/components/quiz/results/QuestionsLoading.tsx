import { useState, useEffect } from "react";
import { Loader2, Brain, ShieldCheck, TrendingUp, Users, Award, BarChart3 } from "lucide-react";

const benefitCards = [
  {
    icon: ShieldCheck,
    title: "Redução de riscos",
    description: "Empresas certificadas reduzem em até 60% os riscos operacionais e jurídicos.",
  },
  {
    icon: TrendingUp,
    title: "Aumento de faturamento",
    description: "Certificação ISO 9001 pode aumentar o faturamento em até 30% com novos contratos.",
  },
  {
    icon: Users,
    title: "Satisfação do cliente",
    description: "Processos padronizados elevam a satisfação e retenção de clientes em até 40%.",
  },
  {
    icon: Award,
    title: "Credibilidade no mercado",
    description: "Selo ISO 9001 é reconhecido globalmente e abre portas para licitações e grandes empresas.",
  },
  {
    icon: BarChart3,
    title: "Eficiência operacional",
    description: "Redução de até 25% nos custos operacionais com processos bem definidos e mensuráveis.",
  },
];

export const QuestionsLoading = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % benefitCards.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const card = benefitCards[activeIndex];
  const Icon = card.icon;

  return (
    <div className="space-y-8 text-center animate-fade-in max-w-md mx-auto">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Preparando seu diagnóstico...
        </h2>
        <p className="text-muted-foreground">
          Estamos criando perguntas personalizadas para o seu segmento e porte de empresa.
        </p>
      </div>

      {/* Rotating benefit card */}
      <div className="relative min-h-[140px] flex items-center justify-center">
        <div
          key={activeIndex}
          className="w-full rounded-xl border border-primary/20 bg-primary/5 p-5 animate-fade-in"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-left text-sm">
              {card.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm text-left leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2">
        {benefitCards.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-primary w-4" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm font-medium text-muted-foreground">
          Isso leva apenas alguns segundos...
        </span>
      </div>
    </div>
  );
};
