import { useState } from "react";
import { User, Mail, Phone, Sparkles, Briefcase } from "lucide-react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";
import { FormStepIndicator } from "../FormStepIndicator";
import { FormInput } from "../FormInput";

interface ContactStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: (data: ContactData) => void;
  onBack: () => void;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
}

export const ContactStep = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
}: ContactStepProps) => {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  });

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

  return (
    <div className="h-dvh flex flex-col animate-fade-in bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-2 sm:py-8 min-h-0">
        <div className="max-w-lg w-full flex flex-col min-h-0">
          {/* Step Indicator - hidden on very small screens */}
          <div className="hidden sm:block">
            <FormStepIndicator currentStep={1} />
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-2 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Quase lá!</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-1 sm:mb-3">
              Seus dados pessoais
            </h2>

            <p className="text-sm text-muted-foreground">
              Preencha para receber seu diagnóstico personalizado
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 sm:space-y-5 mb-4 sm:mb-8">
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="Seu nome completo"
              icon={User}
              delay={100}
              autoComplete="name"
            />

            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="E-mail corporativo"
              icon={Mail}
              delay={200}
              autoComplete="email"
            />

            <FormInput
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              label="WhatsApp"
              icon={Phone}
              delay={300}
              autoComplete="tel"
            />

            <FormInput
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              label="Cargo"
              icon={Briefcase}
              delay={400}
              autoComplete="organization-title"
            />
          </div>

          {/* Button */}
          <div 
            className="animate-slide-up opacity-0 mt-auto"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <QuizButton onClick={handleNext} disabled={!isValid}>
              Continuar
            </QuizButton>
          </div>

          <p 
            className="text-xs text-muted-foreground text-center mt-2 sm:mt-4 pb-2 animate-slide-up opacity-0"
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
