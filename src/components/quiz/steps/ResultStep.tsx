import { QuizButton } from "../QuizButton";
import templumLogo from "@/assets/templum-logo.png";
import { Check } from "lucide-react";

interface ResultStepProps {
  name: string;
}

export const ResultStep = ({ name }: ResultStepProps) => {
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-xl w-full text-center">
        <img src={templumLogo} alt="Templum" className="h-10 mx-auto mb-8" />

        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Parabéns, {firstName}! 🎉
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Seu diagnóstico foi gerado com sucesso!
        </p>

        <div className="bg-card rounded-2xl p-6 mb-8 text-left shadow-sm">
          <h3 className="font-bold text-lg text-foreground mb-4">
            📊 O que descobrimos:
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span className="text-foreground">
                Sua empresa tem alto potencial para certificação ISO 9001
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span className="text-foreground">
                Com a ISO, você pode aumentar seu faturamento em até 30%
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span className="text-foreground">
                Um consultor especializado entrará em contato em breve
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-primary/10 rounded-2xl p-6 mb-8">
          <p className="text-foreground font-medium">
            ⏰ Um especialista da Templum entrará em contato com você em até{" "}
            <strong>24 horas úteis</strong> para apresentar seu diagnóstico
            completo!
          </p>
        </div>

        <QuizButton
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send?phone=551140035284&text=Ol%C3%A1!%20Acabei%20de%20fazer%20o%20diagn%C3%B3stico%20ISO%209001",
              "_blank"
            )
          }
        >
          Falar com consultor agora
        </QuizButton>

        <p className="text-sm text-muted-foreground mt-6">
          +30 anos de experiência | +2.000 clientes certificados
        </p>
      </div>
    </div>
  );
};
