import { QuizButton } from "../QuizButton";
import { CheckCircle, ShieldCheck, TrendingUp, AlertTriangle, ChevronDown, Star } from "lucide-react";


interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="h-dvh flex flex-col bg-[hsl(var(--hero-dark))] text-white overflow-y-auto animate-fade-in">
      {/* Hero Section */}
      <section className="relative px-5 pt-8 pb-6 flex flex-col items-center text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
        </div>

        

        <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-primary/25 relative z-10 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Diagnóstico ISO 9001 Gratuito
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4 relative z-10 max-w-md">
          Sua empresa está{" "}
          <span className="text-primary">perdendo dinheiro</span>{" "}
          por falta de gestão?
        </h1>

        <p className="text-sm text-white/60 mb-6 relative z-10 max-w-sm leading-relaxed">
          Empresas sem processos claros perdem até <strong className="text-white">30% do faturamento</strong> com retrabalho. Descubra onde você está travando.
        </p>

        {/* CTA */}
        <div className="w-full max-w-sm relative z-10 mb-3">
          <QuizButton onClick={onNext}>
            Quero meu diagnóstico grátis →
          </QuizButton>
          <p className="text-center text-[11px] text-white/40 mt-2.5">
            ⏱️ 5 min • 100% gratuito • Resultado imediato
          </p>
        </div>

        <ChevronDown className="w-5 h-5 text-white/20 animate-bounce mt-2" />
      </section>

      {/* Problem Section */}
      <section className="px-5 py-6 bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/80">Isso parece familiar?</h2>
          </div>
          <div className="space-y-2.5">
            {[
              "Processos que dependem de uma só pessoa",
              "Retrabalho constante e reclamações de clientes",
              "Crescimento travado sem saber o motivo",
              "Equipe desalinhada e sem padrão",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="text-primary mt-0.5 text-base leading-none">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-5 py-6">
        <div className="max-w-sm mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-4">O que você recebe de graça:</h2>
          <div className="space-y-3">
            {[
              { title: "Nota ISO 9001", desc: "Score de 0 a 100% em 5 pilares" },
              { title: "Raio-X dos gargalos", desc: "Veja onde sua empresa trava" },
              { title: "Plano de ação", desc: "Passos práticos para destravar o crescimento" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-5 py-6 bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-3 text-center mb-5">
            <div>
              <div className="text-xl font-extrabold text-primary">+2.000</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Certificadas</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-primary">98%</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Aprovação</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-primary flex items-center justify-center gap-0.5">
                4,9 <Star className="w-3.5 h-3.5 fill-primary" />
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Google</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-white/70 italic leading-relaxed">
              "A Templum nos mostrou exatamente onde estávamos perdendo tempo e dinheiro. Em 6 meses, certificamos na ISO 9001."
            </p>
            <p className="text-xs text-white/40 mt-2 font-medium">— Diretor Industrial, SP</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-6 pb-8">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-white/80">Comece agora. É rápido e gratuito.</p>
          </div>
          <QuizButton onClick={onNext}>
            Fazer meu diagnóstico →
          </QuizButton>
        </div>
      </section>
    </div>
  );
};
