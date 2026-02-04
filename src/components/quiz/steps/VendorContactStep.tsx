import { useState, useEffect } from "react";
import { User, Mail, Phone, Sparkles, Briefcase, CheckCircle } from "lucide-react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import { FormStepIndicator } from "../FormStepIndicator";
import { FormInput } from "../FormInput";

interface VendorContactStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: (data: VendorContactData) => void;
  onBack: () => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
  };
}

export interface VendorContactData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
}

export const VendorContactStep = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  initialData,
}: VendorContactStepProps) => {
  const [formData, setFormData] = useState<VendorContactData>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  });

  // Pre-fill with initial data from Pipedrive
  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      jobTitle: initialData.jobTitle || "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = formData.name && formData.email && formData.phone && formData.jobTitle;

  const handleNext = () => {
    if (isValid) {
      onNext(formData);
    }
  };

  const hasPrefilledData = initialData.name || initialData.email || initialData.phone;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />
      
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <FormStepIndicator currentStep={1} />
        
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {/* Title with delayed animation */}
          <div 
            className="text-center space-y-2 animate-slide-up opacity-0"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Confirme seus dados
            </h2>
            <p className="text-sm text-muted-foreground">
              Verifique se as informações estão corretas
            </p>
          </div>

          {/* Pre-filled notice */}
          {hasPrefilledData && (
            <div 
              className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3 animate-slide-up opacity-0"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                Seus dados foram pré-preenchidos. Você pode editá-los se necessário.
              </p>
            </div>
          )}

          {/* Form fields with staggered animations */}
          <div 
            className="space-y-4 animate-slide-up opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="Nome completo"
              icon={User}
              delay={0}
              autoComplete="name"
            />
            
            <FormInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="E-mail"
              type="email"
              icon={Mail}
              delay={100}
              autoComplete="email"
            />

            <FormInput
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              label="WhatsApp"
              type="tel"
              icon={Phone}
              delay={200}
              autoComplete="tel"
            />

            <FormInput
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              label="Cargo"
              icon={Briefcase}
              delay={300}
              autoComplete="organization-title"
            />
          </div>

          {/* Button with delayed animation */}
          <div 
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <QuizButton onClick={handleNext} disabled={!isValid}>
              Continuar
            </QuizButton>
          </div>

          <p 
            className="text-xs text-muted-foreground text-center mt-4 animate-slide-up opacity-0"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            Ao continuar, você concorda com nossa{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              política de privacidade
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
