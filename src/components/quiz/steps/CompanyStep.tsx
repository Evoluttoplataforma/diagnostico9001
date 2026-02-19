import { useState } from "react";
import { Building2, Briefcase, Users, Rocket } from "lucide-react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import { FormStepIndicator } from "../FormStepIndicator";
import { FormInput } from "../FormInput";
import { RevenueSelect } from "../RevenueSelect";

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
  revenue: string;
}

const REVENUE_RANGES = [
  { value: "abaixo_100k", label: "Abaixo de R$ 100 mil/mês" },
  { value: "acima_100k", label: "Acima de R$ 100 mil/mês" },
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
    revenue: "",
  });
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
    formData.companySize &&
    formData.revenue;

  const handleSubmit = async () => {
    if (isValid) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in bg-gradient-to-b from-background via-background to-muted/30">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-lg w-full">
          {/* Step Indicator */}
          <FormStepIndicator currentStep={2} />

          {/* Header with animation */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">Último passo!</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              Sobre sua empresa
            </h2>

            <p className="text-muted-foreground">
              Conte-nos um pouco mais para personalizar o diagnóstico
            </p>
          </div>

          {/* Form with staggered animations */}
          <div className="space-y-5 mb-8">
            <FormInput
              name="company"
              value={formData.company}
              onChange={handleChange}
              label="Nome da empresa"
              icon={Building2}
              delay={100}
            />

            <FormInput
              name="segment"
              value={formData.segment}
              onChange={handleChange}
              label="Segmento de atuação"
              icon={Briefcase}
              delay={200}
            />

            <FormInput
              type="number"
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              label="Número de funcionários"
              icon={Users}
              delay={300}
              min={0}
            />

            <RevenueSelect
              value={formData.revenue}
              onChange={(value) => handleSelectChange("revenue", value)}
              delay={400}
            />
          </div>

          {/* Button with delayed animation */}
          <div 
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <QuizButton onClick={handleSubmit} disabled={!isValid}>
              Continuar
            </QuizButton>
          </div>

          <p 
            className="text-xs text-muted-foreground text-center mt-4 animate-slide-up opacity-0"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            Ao continuar, você concorda com nossa{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
