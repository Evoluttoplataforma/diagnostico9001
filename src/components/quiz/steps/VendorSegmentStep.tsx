import { useState } from "react";
import { Briefcase } from "lucide-react";
import { QuizButton } from "../QuizButton";
import { FormSelect } from "../FormSelect";

interface VendorSegmentStepProps {
  onSubmit: (segment: string) => void;
}

const segments = [
  { value: "industria", label: "Indústria" },
  { value: "comercio", label: "Comércio" },
  { value: "servicos", label: "Serviços" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "construcao", label: "Construção" },
  { value: "agronegocio", label: "Agronegócio" },
  { value: "outro", label: "Outro" },
];

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
          <FormSelect
            value={segment}
            onChange={setSegment}
            label="Segmento de atuação"
            options={segments}
            icon={Briefcase}
            delay={200}
          />
        </div>

        <div
          className="animate-slide-up opacity-0"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          <QuizButton onClick={() => onSubmit(segment)} disabled={!segment}>
            Continuar
          </QuizButton>
        </div>
      </div>
    </div>
  );
};
