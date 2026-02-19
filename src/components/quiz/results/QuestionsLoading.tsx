import { Loader2, Brain } from "lucide-react";

export const QuestionsLoading = () => {
  return (
    <div className="space-y-8 text-center animate-fade-in">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Preparando seu diagnóstico...
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Estamos criando perguntas personalizadas para o seu segmento e porte de empresa.
        </p>
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
