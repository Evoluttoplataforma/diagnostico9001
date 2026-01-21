import { Loader2 } from "lucide-react";

export const DiagnosisLoading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Analisando suas respostas com IA...
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded-lg w-full" />
          <div className="h-4 bg-muted rounded-lg w-11/12" />
          <div className="h-4 bg-muted rounded-lg w-10/12" />
        </div>
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-muted rounded-lg w-full" />
          <div className="h-4 bg-muted rounded-lg w-9/12" />
          <div className="h-4 bg-muted rounded-lg w-10/12" />
        </div>
      </div>

      {/* Checklist skeleton */}
      <div className="space-y-3 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 bg-muted rounded-xl"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
