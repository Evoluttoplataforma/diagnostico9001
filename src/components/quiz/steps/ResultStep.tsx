import { QuizButton } from "../QuizButton";
import templumLogo from "@/assets/templum-logo.png";
import { getDiagnosis } from "../quizData";

interface ResultStepProps {
  name: string;
  score: number;
}

export const ResultStep = ({ name, score }: ResultStepProps) => {
  const firstName = name.split(" ")[0];
  const diagnosis = getDiagnosis(score);

  const levelColors = {
    low: "bg-red-100 text-red-600 border-red-200",
    medium: "bg-yellow-100 text-yellow-600 border-yellow-200",
    high: "bg-green-100 text-green-600 border-green-200",
  };

  const levelBgColors = {
    low: "bg-red-50",
    medium: "bg-yellow-50",
    high: "bg-green-50",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in bg-background">
      <div className="max-w-xl w-full text-center">
        <img src={templumLogo} alt="Templum" className="h-10 mx-auto mb-8" />

        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl ${levelBgColors[diagnosis.level]}`}>
          {diagnosis.emoji}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          {firstName}, seu resultado chegou!
        </h1>

        <div className={`inline-block px-4 py-2 rounded-full border-2 font-bold text-lg mb-6 ${levelColors[diagnosis.level]}`}>
          {score} de 20 pontos
        </div>

        <div className={`rounded-2xl p-6 mb-6 ${levelBgColors[diagnosis.level]}`}>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {diagnosis.title}
          </h2>
          <p className="text-foreground/80 text-lg">
            {diagnosis.description}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 mb-6 text-left shadow-sm border border-border">
          <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
            <span>💡</span> Nossa recomendação:
          </h3>
          <p className="text-foreground/80">
            {diagnosis.recommendation}
          </p>
        </div>

        <div className="bg-primary/10 rounded-2xl p-6 mb-8">
          <p className="text-foreground font-medium">
            ⏰ Um especialista da Templum entrará em contato em até{" "}
            <strong>24 horas úteis</strong> para apresentar um plano de ação personalizado!
          </p>
        </div>

        <QuizButton
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send?phone=551140035284&text=Ol%C3%A1!%20Acabei%20de%20fazer%20o%20Raio-X%20de%20Processos%20e%20quero%20saber%20mais!",
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
