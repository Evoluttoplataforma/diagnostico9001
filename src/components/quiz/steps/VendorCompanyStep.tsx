import { useState, useEffect } from "react";
import { Building2, Briefcase, Users, Loader2 } from "lucide-react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import { FormStepIndicator } from "../FormStepIndicator";
import { FormInput } from "../FormInput";
import { RevenueSelect } from "../RevenueSelect";

interface VendorCompanyStepProps {
  currentStep: number;
  totalSteps: number;
  onSubmit: (data: VendorCompanyData) => void;
  onBack: () => void;
  initialData: {
    company: string;
    companySize: string;
    segment: string;
    revenue: string;
  };
}

export interface VendorCompanyData {
  company: string;
  segment: string;
  companySize: string;
  revenue: string;
}

export const VendorCompanyStep = ({
  currentStep,
  totalSteps,
  onSubmit,
  onBack,
  initialData,
}: VendorCompanyStepProps) => {
  const [formData, setFormData] = useState<VendorCompanyData>({
    company: "",
    segment: "",
    companySize: "",
    revenue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill with initial data from Pipedrive
  useEffect(() => {
    setFormData({
      company: initialData.company || "",
      companySize: initialData.companySize || "",
      segment: initialData.segment || "",
      revenue: initialData.revenue || "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRevenueChange = (value: string) => {
    setFormData((prev) => ({ ...prev, revenue: value }));
  };

  const isValid = formData.company && formData.segment && formData.companySize && formData.revenue;

  const handleSubmit = async () => {
    if (isValid && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />
      
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <FormStepIndicator currentStep={2} />
        
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {/* Title with delayed animation */}
          <div 
            className="text-center space-y-2 animate-slide-up opacity-0"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Dados da empresa
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete as informações para seu diagnóstico
            </p>
          </div>

          {/* Form fields with staggered animations */}
          <div 
            className="space-y-4 animate-slide-up opacity-0"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <FormInput
              name="company"
              value={formData.company}
              onChange={handleChange}
              label="Nome da empresa"
              icon={Building2}
              delay={0}
              autoComplete="organization"
            />
            
            <FormInput
              name="segment"
              value={formData.segment}
              onChange={handleChange}
              label="Segmento de atuação"
              icon={Briefcase}
              delay={100}
            />

            <FormInput
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              label="Número de funcionários"
              type="number"
              icon={Users}
              delay={200}
              placeholder="Ex: 25"
            />

            <RevenueSelect
              value={formData.revenue}
              onChange={handleRevenueChange}
              delay={300}
            />
          </div>

          {/* Button with delayed animation */}
          <div 
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <QuizButton onClick={handleSubmit} disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando diagnóstico...
                </>
              ) : (
                "Ver meu diagnóstico"
              )}
            </QuizButton>
          </div>
        </div>
      </main>
    </div>
  );
};
