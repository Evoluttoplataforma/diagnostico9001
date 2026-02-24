import { useState } from "react";
import { QuizButton } from "../QuizButton";
import { CheckCircle, ShieldCheck, TrendingUp, AlertTriangle, ChevronDown, Star, Shield, Award, MapPin, HelpCircle } from "lucide-react";
import templumLogo from "@/assets/logo-templum.jpeg";

interface WelcomeStepProps {
  onNext: () => void;
}

const faqItems = [
  { q: "O que é a ISO 9001?", a: "É a norma internacional de Sistema de Gestão da Qualidade mais reconhecida no mundo. Ela define requisitos para padronizar processos, reduzir erros e aumentar a satisfação do cliente." },
  { q: "Minha empresa precisa da ISO 9001?", a: "Se você quer conquistar novos clientes, participar de licitações, reduzir retrabalho e profissionalizar a gestão, sim. A ISO 9001 é indicada para empresas de qualquer porte ou segmento." },
  { q: "Quanto tempo leva para certificar?", a: "Com a Templum, o processo leva em média de 4 a 8 meses, dependendo do porte e complexidade da empresa. Nossa metodologia acelera cada etapa." },
  { q: "Qual o investimento para certificar?", a: "O investimento varia conforme o tamanho da empresa e escopo. Entre em contato para uma proposta personalizada. Lembre-se: o retorno costuma superar o investimento já nos primeiros meses." },
  { q: "O que é a Templum Consultoria?", a: "Somos a maior consultoria de ISO 9001 do Brasil, com mais de 8.000 clientes atendidos e mais de 2.000 empresas certificadas. Nota 4,9 no Google." },
  { q: "O que é a Garantia 200% da Templum?", a: "Se sua empresa não conseguir a certificação seguindo nossa metodologia, devolvemos o dobro do valor investido. É a nossa confiança na entrega de resultados." },
  { q: "A Templum atende minha região?", a: "Sim! Atendemos todo o Brasil, em mais de 800 cidades, com consultoria presencial e remota combinadas para máxima eficiência." },
  { q: "O diagnóstico é realmente gratuito?", a: "Sim, 100% gratuito e sem compromisso. Em 5 minutos você recebe um raio-X completo do nível de gestão da sua empresa." },
  { q: "Preciso parar minha operação para implantar?", a: "Não. Nossa metodologia é desenhada para se encaixar na rotina da empresa, sem interromper a operação. A implantação acontece de forma gradual e prática." },
  { q: "Quais os benefícios reais da certificação?", a: "Acesso a licitações e grandes clientes, redução de custos operacionais, processos claros, menos retrabalho, maior satisfação dos clientes e credibilidade no mercado." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqItems.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 p-4 text-left"
          >
            <span className="text-sm font-medium text-white/90">{item.q}</span>
            <ChevronDown
              className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-white/60 leading-relaxed animate-fade-in">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="h-dvh flex flex-col bg-[hsl(var(--hero-dark))] text-white overflow-y-auto animate-fade-in">
      {/* Hero Section */}
      <section className="relative px-5 pt-6 pb-6 flex flex-col items-center text-center">
        <img src={templumLogo} alt="Templum" className="h-10 rounded-md mb-5 relative z-10" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
        </div>

        <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-primary/25 relative z-10 uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          Templum Consultoria • Líder nacional em ISO 9001
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 relative z-10 max-w-md">
          ISO 9001 não é apenas um certificado na parede. É{" "}
          <span className="text-primary">Gestão e processos afiados!</span>
        </h1>

        <p className="text-base text-white/60 mb-6 relative z-10 max-w-sm leading-relaxed">
          Inicie agora sua jornada rumo à certificação <strong className="text-white">ISO 9001</strong>.
          <br /><br />
          Responda ao nosso diagnóstico e descubra exatamente em que nível de gestão sua empresa está — e o que falta para alcançar a certificação e melhorar seus processos.
        </p>

        <div className="w-full max-w-sm relative z-10 mb-3">
          <QuizButton onClick={onNext}>
            QUERO MEU DIAGNÓSTICO AGORA!
          </QuizButton>
          <p className="text-center text-xs text-white/40 mt-2.5">
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
            <h2 className="text-base font-bold uppercase tracking-wider text-white/80">Isso parece familiar?</h2>
          </div>
          <div className="space-y-2.5">
            {[
              "Planilhas espalhadas por toda parte",
              "Retrabalho constante e erros repetidos",
              "Reuniões que não geram resultado",
              "Equipe apagando incêndio todos os dias",
              "Perda de prazos e oportunidades",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-base text-white/70">
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
          <h2 className="text-base font-bold uppercase tracking-wider text-white/80 mb-4">Com a ISO 9001 você transforma:</h2>
          <div className="space-y-3">
            {[
              { title: "Processos claros e padronizados", desc: "Elimine a dependência de pessoas-chave" },
              { title: "Gestão profissionalizada", desc: "Decisões baseadas em fatos e indicadores" },
              { title: "Portas que estavam fechadas", desc: "Licitações, grandes empresas e novos contratos" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base text-white">{item.title}</p>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="px-5 py-6 bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-3 text-center mb-5">
            <div>
              <div className="text-2xl font-extrabold text-primary">+8.000</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Clientes</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary">+2.000</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Certificados</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary flex items-center justify-center gap-0.5">
                4,9 <Star className="w-4 h-4 fill-primary" />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Google</div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/25 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base text-primary">Garantia 200%</p>
              <p className="text-sm text-white/50">Se não certificar, devolvemos o dobro</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-base text-white/70 italic leading-relaxed">
              "A Templum transformou completamente nossa gestão. Em 6 meses conseguimos a certificação ISO 9001 e já fechamos 3 contratos que antes eram impossíveis sem o selo."
            </p>
            <p className="text-sm text-white/40 mt-2 font-medium">— Carlos Eduardo Silva • Cliente verificado</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-5 py-6 bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold uppercase tracking-wider text-white/80">Perguntas Frequentes</h2>
          </div>
          <FAQSection />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-6 pb-8">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-1 justify-center">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <p className="text-sm text-white/50">Atendemos todo o Brasil • 800+ cidades</p>
          </div>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-base font-semibold text-white/80">Descubra onde sua empresa trava.</p>
          </div>
          <QuizButton onClick={onNext}>
            QUERO MEU DIAGNÓSTICO AGORA!
          </QuizButton>
        </div>
      </section>
    </div>
  );
};
