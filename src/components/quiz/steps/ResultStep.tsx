import { QuizButton } from "../QuizButton";
import templumLogo from "@/assets/templum-logo.png";
import { getDiagnosis } from "../quizData";
import { Award, MessageCircle, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface ResultStepProps {
  name: string;
  score: number;
}

export const ResultStep = ({ name, score }: ResultStepProps) => {
  const firstName = name.split(" ")[0];
  const diagnosis = getDiagnosis(score);

  const levelColors = {
    low: "text-red-400",
    medium: "text-yellow-400",
    high: "text-green-400",
  };

  const levelBgColors = {
    low: "bg-red-500/20 border-red-500/30",
    medium: "bg-yellow-500/20 border-yellow-500/30",
    high: "bg-green-500/20 border-green-500/30",
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row animate-fade-in">
      {/* Left Side - Dark Hero */}
      <div className="lg:w-1/2 bg-[hsl(220,25%,12%)] text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
          <img src={templumLogo} alt="Templum" className="h-8 mb-8 brightness-0 invert" />

          <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/30">
            RESULTADO DO DIAGNÓSTICO
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Parabéns, {firstName}! 🎉
          </h1>

          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            Seu diagnóstico de maturidade está pronto. Veja abaixo sua pontuação e próximos passos.
          </p>

          {/* Score Display */}
          <div className={`rounded-2xl p-6 border ${levelBgColors[diagnosis.level]} mb-8`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">{diagnosis.emoji}</div>
              <div>
                <div className={`text-5xl font-bold ${levelColors[diagnosis.level]}`}>
                  {score}%
                </div>
                <div className="text-white/60 text-sm">de maturidade</div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{diagnosis.title}</h2>
            <p className="text-white/70">{diagnosis.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-primary mb-1">+2.000</div>
              <div className="text-sm text-white/60">Empresas certificadas</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-primary mb-1">30+</div>
              <div className="text-sm text-white/60">Anos de experiência</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Light Content */}
      <div className="lg:w-1/2 bg-background p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Próximos Passos
            </h2>
            <p className="text-muted-foreground">
              Um especialista entrará em contato para apresentar um plano personalizado.
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Nossa recomendação:</p>
                <p className="text-sm text-muted-foreground">{diagnosis.recommendation}</p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              O que acontece agora:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Contato em até 24h úteis</p>
                  <p className="text-sm text-muted-foreground">Nossa equipe entrará em contato</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Plano de Ação Personalizado</p>
                  <p className="text-sm text-muted-foreground">Estratégia sob medida para sua empresa</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Consultoria Gratuita</p>
                  <p className="text-sm text-muted-foreground">Sem compromisso e 100% gratuito</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <QuizButton
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send?phone=551140035284&text=Ol%C3%A1!%20Acabei%20de%20fazer%20o%20Raio-X%20de%20Processos%20e%20quero%20saber%20mais!",
                  "_blank"
                )
              }
            >
              <MessageCircle className="w-5 h-5" />
              Falar com consultor agora
            </QuizButton>
            <p className="text-center text-xs text-muted-foreground">
              💬 Atendimento via WhatsApp • Resposta imediata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
