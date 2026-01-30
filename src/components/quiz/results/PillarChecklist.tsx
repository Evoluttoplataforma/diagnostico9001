import { useState } from "react";
import { ChevronDown, Cog, Users, Heart, BarChart3, Rocket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillarChecklistProps {
  pillarScores: { name: string; score: number }[];
  checklist: Record<string, string[]>;
}

const pillarIcons: Record<string, React.ElementType> = {
  Processos: Cog,
  Pessoas: Users,
  Clientes: Heart,
  Controle: BarChart3,
  Crescimento: Rocket,
};

const pillarColors: Record<string, string> = {
  Processos: "from-blue-500 to-blue-600",
  Pessoas: "from-purple-500 to-purple-600",
  Clientes: "from-pink-500 to-pink-600",
  Controle: "from-emerald-500 to-emerald-600",
  Crescimento: "from-orange-500 to-orange-600",
};

export const PillarChecklist = ({ pillarScores, checklist }: PillarChecklistProps) => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const togglePillar = (pillarName: string) => {
    setExpandedPillar(expandedPillar === pillarName ? null : pillarName);
  };

  return (
    <div className="space-y-3">
      {pillarScores.map((pillar) => {
        const Icon = pillarIcons[pillar.name] || Cog;
        const isExpanded = expandedPillar === pillar.name;
        const actions = checklist[pillar.name] || [];
        const colorClass = pillarColors[pillar.name] || "from-gray-500 to-gray-600";

        return (
          <div
            key={pillar.name}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          >
            {/* Header - Always visible */}
            <button
              onClick={() => togglePillar(pillar.name)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br text-white flex-shrink-0",
                colorClass
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">{pillar.name}</span>
                  <span className="text-sm font-bold text-primary">{pillar.score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", colorClass)}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            {/* Expanded content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-4 pb-4 space-y-3">
                {actions.length > 0 ? (
                  actions.map((action, index) => {
                    // Handle both string and object formats from AI
                    const actionText = typeof action === 'string' 
                      ? action 
                      : (action as { action?: string })?.action || JSON.stringify(action);
                    
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground leading-relaxed">{actionText}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Carregando recomendações...
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
