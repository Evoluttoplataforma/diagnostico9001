import { useState } from "react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyStepProps {
  currentStep: number;
  totalSteps: number;
  onSubmit: (data: CompanyData) => Promise<void>;
  onBack: () => void;
}

export interface CompanyData {
  company: string;
  segment: string;
  companySize: string;
}

const COMPANY_SIZES = [
  { value: "micro", label: "Microempresa (até 9 funcionários)" },
  { value: "pequena", label: "Pequena (10 a 49 funcionários)" },
  { value: "media", label: "Média (50 a 99 funcionários)" },
  { value: "media-grande", label: "Média-grande (100 a 499 funcionários)" },
  { value: "grande", label: "Grande (500+ funcionários)" },
];

export const CompanyStep = ({
  currentStep,
  totalSteps,
  onSubmit,
  onBack,
}: CompanyStepProps) => {
  const [formData, setFormData] = useState<CompanyData>({
    company: "",
    segment: "",
    companySize: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid =
    formData.company &&
    formData.segment &&
    formData.companySize;

  const handleSubmit = async () => {
    if (isValid && !isLoading) {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Último passo! 🚀
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Conte-nos um pouco mais sobre sua empresa
          </p>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Digite o nome da empresa"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Segmento de atuação
              </label>
              <input
                type="text"
                name="segment"
                value={formData.segment}
                onChange={handleChange}
                placeholder="Digite o segmento da sua empresa"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Porte da empresa
              </label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => handleSelectChange("companySize", value)}
              >
                <SelectTrigger className="w-full px-4 py-4 h-auto rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground">
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <QuizButton onClick={handleSubmit} disabled={!isValid} loading={isLoading}>
            Receber Diagnóstico Gratuito
          </QuizButton>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Ao continuar, você concorda com nossa{" "}
            <a href="#" className="underline hover:text-foreground">
              Política de Privacidade
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
