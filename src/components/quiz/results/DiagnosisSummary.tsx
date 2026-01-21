import { Sparkles } from "lucide-react";

interface DiagnosisSummaryProps {
  paragraph1: string;
  paragraph2: string;
}

export const DiagnosisSummary = ({ paragraph1, paragraph2 }: DiagnosisSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Seu Diagnóstico</h2>
      </div>

      <div className="space-y-4">
        <p className="text-foreground leading-relaxed">{paragraph1}</p>
        <p className="text-muted-foreground leading-relaxed">{paragraph2}</p>
      </div>
    </div>
  );
};
