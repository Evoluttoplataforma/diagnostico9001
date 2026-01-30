import { useState } from "react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";

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
    formData.companySize &&
    formData.revenue;

  const handleSubmit = async () => {
    if (isValid && !isLoading) {
      setIsLoading(true);
      try {
        // Minimum loading time to show all 3 confidence cards (3 cards × 2.5s = 7.5s)
        const minLoadingPromise = new Promise((resolve) => setTimeout(resolve, 8000));
        const submitPromise = onSubmit(formData);
        
        // Wait for both: minimum time AND form submission
        await Promise.all([minLoadingPromise, submitPromise]);
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
            Último passo!
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
                Número de funcionários
              </label>
              <input
                type="number"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                placeholder="Ex: 25"
                min="0"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Faturamento anual
              </label>
              <select
                name="revenue"
                value={formData.revenue}
                onChange={(e) => handleSelectChange("revenue", e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="" disabled>Selecione o faturamento</option>
                {REVENUE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
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
