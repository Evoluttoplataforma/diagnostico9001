import { useState } from "react";
import { Briefcase } from "lucide-react";
import { QuizButton } from "../QuizButton";
import { FormInput } from "../FormInput";

interface VendorSegmentStepProps {
  onSubmit: (segment: string) => void;
}

export const VendorSegmentStep = ({ onSubmit }: VendorSegmentStepProps) => {
  const [segment, setSegment] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Qual o segmento da sua empresa?
          </h2>
          <p className="text-muted-foreground text-sm">
            Precisamos dessa informação para personalizar as perguntas do diagnóstico.
          </p>
        </div>

        <div className="mb-8">
          <FormInput
            name="segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            label="Segmento de atuação"
            icon={Briefcase}
            delay={200}
            placeholder="Ex: Indústria, Tecnologia, Saúde..."
          />
        </div>

        <div
          className="animate-slide-up opacity-0"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          <QuizButton onClick={() => onSubmit(segment.trim())} disabled={!segment.trim()}>
            Continuar
          </QuizButton>
        </div>
      </div>
    </div>
  );
};
