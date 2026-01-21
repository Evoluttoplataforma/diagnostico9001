import { useState } from "react";
import { QuizHeader } from "../QuizHeader";
import { QuizButton } from "../QuizButton";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = formData.name && formData.email && formData.phone;

  const handleNext = () => {
    if (isValid) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
            Quase lá! 🎉
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            Preencha seus dados para receber o diagnóstico personalizado
          </p>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Seu nome completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail corporativo
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <QuizButton onClick={handleNext} disabled={!isValid}>
            Continuar
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
