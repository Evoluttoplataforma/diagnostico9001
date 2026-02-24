import { useState, useEffect, useMemo } from "react";
import { QuizButton } from "../QuizButton";
import { CheckCircle, ShieldCheck, TrendingUp, AlertTriangle, ChevronDown, Star, Shield, Award, MapPin, HelpCircle, X, User, Mail, Phone, Building2 } from "lucide-react";
import { TestimonialsSection } from "./TestimonialsSection";
import { TeamSection } from "./TeamSection";
import { ProcessSection } from "./ProcessSection";
import templumLogo from "@/assets/logo-templum.jpeg";
import { FormInput } from "../FormInput";
import { getSessionVariant, type CopyVariant } from "../copyVariants";

export interface WelcomeFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  copyVariant: string;
}

interface WelcomeStepProps {
  onNext: (data: WelcomeFormData) => void;
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
  const [showModal, setShowModal] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const variant = useMemo(() => getSessionVariant(), []);

  const isValid = formData.name && formData.email && formData.phone && formData.company;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (isValid) onNext({ ...formData, copyVariant: variant.id });
  };

  useEffect(() => {
    const container = document.getElementById("welcome-scroll");
    if (!container) return;
    const handler = () => setShowStickyBar(container.scrollTop > 400);
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return (
    <div id="welcome-scroll" className="h-dvh flex flex-col bg-[hsl(var(--hero-dark))] text-white overflow-y-auto animate-fade-in">

      {/* Sticky CTA Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-[hsl(var(--hero-dark))]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <img src={templumLogo} alt="Templum" className="h-7 rounded-md hidden sm:block" />
            <p className="text-xs sm:text-sm text-white/60 hidden lg:block">Diagnóstico gratuito de gestão ISO 9001</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm px-5 py-2 rounded-lg transition-colors whitespace-nowrap ml-auto"
            >
              FAZER DIAGNÓSTICO
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[hsl(var(--hero-dark))] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl mx-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <h3 className="text-lg font-bold text-primary text-center mb-1">
              Preencha os campos abaixo para iniciar seu diagnóstico:
            </h3>
            <p className="text-sm text-white/50 text-center mb-6">100% gratuito • Resultado imediato</p>

            <div className="space-y-4 mb-6">
              <FormInput name="name" value={formData.name} onChange={handleChange} label="Nome Completo *" icon={User} delay={0} autoComplete="name" />
              <FormInput type="email" name="email" value={formData.email} onChange={handleChange} label="Email *" icon={Mail} delay={0} autoComplete="email" />
              <FormInput type="tel" name="phone" value={formData.phone} onChange={handleChange} label="Celular com (DDD) *" icon={Phone} delay={0} autoComplete="tel" />
              <FormInput name="company" value={formData.company} onChange={handleChange} label="Nome da Empresa *" icon={Building2} delay={0} />
            </div>

            <QuizButton onClick={handleSubmit} disabled={!isValid}>
              CONTINUAR MEU DIAGNÓSTICO
            </QuizButton>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-5 pt-6 pb-6 flex flex-col items-start text-left lg:px-16 lg:pt-20 lg:pb-16">
        <div className="w-full max-w-6xl mx-auto">
          <img src={templumLogo} alt="Templum" className="h-10 rounded-md mb-5 relative z-10" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
          </div>

          <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-primary/25 relative z-10 uppercase tracking-wider self-start">
            <Award className="w-3.5 h-3.5 shrink-0" />
            Templum Consultoria • Líder nacional em ISO 9001
          </span>

          <h1 className="text-[1.75rem] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1] font-extrabold leading-[1.15] mb-4 relative z-10 uppercase tracking-tight lg:max-w-4xl">
            {variant.headline}{" "}
            <span className="text-primary">{variant.highlightedPart}</span>
          </h1>

          <p className="text-[0.95rem] lg:text-lg text-white/90 mb-8 relative z-10 leading-relaxed lg:max-w-2xl">
            {variant.description}
          </p>

          <div className="w-full max-w-sm relative z-10 mb-3">
            <QuizButton onClick={() => setShowModal(true)}>
              QUERO MEU DIAGNÓSTICO AGORA!
            </QuizButton>
            <p className="text-center text-xs text-white/40 mt-2.5">
              ⏱️ 5 min • 100% gratuito • Resultado imediato
            </p>
          </div>

          <ChevronDown className="w-5 h-5 text-white/20 animate-bounce mt-2" />
        </div>
      </section>

      {/* Problem + Transform — side by side on desktop */}
      <section className="bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Problem Section */}
          <div className="px-5 py-6 lg:py-12 lg:px-0 lg:pl-16">
            <div className="max-w-sm lg:max-w-none mx-auto">
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
          </div>

          {/* What you get */}
          <div className="px-5 py-6 lg:py-12 lg:px-0 lg:pr-16">
            <div className="max-w-sm lg:max-w-none mx-auto">
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
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="px-5 py-6 lg:py-14 lg:px-16">
        <div className="max-w-sm lg:max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-3 lg:gap-8 text-center mb-5 lg:mb-10">
            <div>
              <div className="text-2xl lg:text-4xl font-extrabold text-primary">+8.000</div>
              <div className="text-xs lg:text-sm text-white/50 uppercase tracking-wider mt-1">Clientes</div>
            </div>
            <div>
              <div className="text-2xl lg:text-4xl font-extrabold text-primary">+2.000</div>
              <div className="text-xs lg:text-sm text-white/50 uppercase tracking-wider mt-1">Certificados</div>
            </div>
            <div>
              <div className="text-2xl lg:text-4xl font-extrabold text-primary flex items-center justify-center gap-0.5">
                4,9 <Star className="w-4 h-4 lg:w-6 lg:h-6 fill-primary" />
              </div>
              <div className="text-xs lg:text-sm text-white/50 uppercase tracking-wider mt-1">Google</div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-3 p-3 lg:p-5 rounded-xl bg-primary/10 border border-primary/25 max-w-lg lg:mx-auto">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base text-primary">Garantia 200%</p>
              <p className="text-sm text-white/50">Se não certificar, devolvemos o dobro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Team Section */}
      <TeamSection />

      {/* Process Section */}
      <ProcessSection />

      {/* FAQ Section */}
      <section className="px-5 py-6 lg:py-14 lg:px-16 bg-[hsl(var(--hero-dark-accent))]">
        <div className="max-w-sm lg:max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold uppercase tracking-wider text-white/80">Perguntas Frequentes</h2>
          </div>
          <FAQSection />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-6 pb-8 lg:py-14 lg:px-16">
        <div className="max-w-sm lg:max-w-6xl mx-auto lg:text-center">
          <div className="flex items-center gap-2 mb-1 justify-center">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <p className="text-sm text-white/50">Atendemos todo o Brasil • 800+ cidades</p>
          </div>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-base font-semibold text-white/80">Descubra onde sua empresa trava.</p>
          </div>
          <div className="max-w-sm mx-auto">
            <QuizButton onClick={() => setShowModal(true)}>
              QUERO MEU DIAGNÓSTICO AGORA!
            </QuizButton>
          </div>
        </div>
      </section>
    </div>
  );
};
