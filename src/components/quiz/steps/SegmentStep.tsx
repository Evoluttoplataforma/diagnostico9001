import { useState } from "react";
import templumLogo from "@/assets/templum-logo.png";

interface SegmentStepProps {
  onSubmit: (segment: string) => void;
}

export const SegmentStep = ({ onSubmit }: SegmentStepProps) => {
  const [segment, setSegment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (segment.trim()) {
      onSubmit(segment.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-4 px-6">
        <div className="max-w-2xl mx-auto flex justify-center">
          <img src={templumLogo} alt="Templum" className="h-8" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Qual o segmento da sua empresa?
            </h2>
            <p className="text-muted-foreground text-sm">
              Precisamos dessa informação para personalizar seu diagnóstico.
            </p>
          </div>

          <div className="group relative rounded-2xl transition-all duration-300 bg-card border-2 border-border hover:border-primary/40 hover:shadow-md focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/10">
            <label className="absolute left-4 top-2 text-xs font-medium text-primary pointer-events-none">
              Segmento / Ramo de atividade
            </label>
            <input
              type="text"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              placeholder="Ex: Indústria alimentícia, Varejo, Consultoria..."
              required
              className="w-full px-4 pt-6 pb-3 bg-transparent outline-none text-foreground text-base font-medium placeholder:text-muted-foreground/50"
            />
          </div>

          <button
            type="submit"
            disabled={!segment.trim()}
            className="quiz-button w-full"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};
