import { QuizButton } from "../QuizButton";
import { CheckCircle, TrendingUp, Users, Target, Shield, Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const pillars = [
    { icon: Target, label: "Processos" },
    { icon: Users, label: "Pessoas" },
    { icon: TrendingUp, label: "Clientes" },
    { icon: Shield, label: "Controle" },
    { icon: Zap, label: "Crescimento" },
  ];

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
          <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/30">
            ⚡ DIAGNÓSTICO ISO 9001 GRATUITO
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Você está perdendo clientes por{" "}
            <span className="text-primary">falta de gestão?</span>
          </h1>

          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            Empresas sem processos claros perdem até <strong className="text-white">30% do faturamento</strong> com retrabalho e desorganização. Descubra em 5 minutos onde sua empresa está travando — baseado nos critérios da <strong className="text-white">ISO 9001</strong>.
          </p>

          {/* Visual Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-primary mb-1">+2.000</div>
              <div className="text-sm text-white/60">Empresas já certificadas</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-white/60">Taxa de aprovação</div>
            </div>
          </div>

          {/* Pillars */}
          <div className="hidden lg:block">
            <p className="text-sm text-white/50 mb-3 uppercase tracking-wider">O que avaliamos:</p>
            <div className="flex flex-wrap gap-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  <pillar.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80">{pillar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Light Content */}
      <div className="lg:w-1/2 bg-background p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Onde sua empresa está travando?
            </h2>
            <p className="text-muted-foreground">
              Responda perguntas rápidas e descubra os gargalos que impedem seu crescimento.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              O que você recebe de graça:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Nota ISO 9001</p>
                  <p className="text-sm text-muted-foreground">Score de 0 a 100% em 5 pilares de gestão</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Raio-X dos Gargalos</p>
                  <p className="text-sm text-muted-foreground">Veja exatamente onde você perde dinheiro</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Plano de Ação</p>
                  <p className="text-sm text-muted-foreground">Recomendações práticas com um especialista</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <QuizButton onClick={onNext}>
              Quero Meu Diagnóstico Gratuito →
            </QuizButton>
            <p className="text-center text-xs text-muted-foreground">
              ⏱️ 5 minutos • 100% gratuito • Resultado imediato
            </p>
          </div>

          {/* Mobile Pillars */}
          <div className="lg:hidden mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">O que avaliamos:</p>
            <div className="flex flex-wrap gap-2">
              {pillars.map((pillar) => (
                <span
                  key={pillar.label}
                  className="bg-muted px-3 py-1.5 rounded-full text-xs font-medium text-foreground"
                >
                  {pillar.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
