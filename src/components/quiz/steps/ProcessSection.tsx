import { Search, FolderCog, Rocket, ClipboardCheck, Award } from "lucide-react";

const steps = [
  { icon: Search, number: "01", title: "Diagnóstico", description: "Identificamos o nível atual da sua gestão." },
  { icon: FolderCog, number: "02", title: "Organização", description: "Estruturamos processos, padrões e indicadores." },
  { icon: Rocket, number: "03", title: "Aplicação da Metodologia", description: "Você avança no seu ritmo, com consultoria especializada." },
  { icon: ClipboardCheck, number: "04", title: "Auditoria Interna", description: "Treinamos e preparamos toda a empresa." },
  { icon: Award, number: "05", title: "Certificação", description: "A empresa recebe o certificado ISO 9001." },
];

export const ProcessSection = () => {
  return (
    <section className="px-5 py-6 lg:py-14 lg:px-16 bg-[hsl(var(--hero-dark-accent))]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl lg:text-3xl font-extrabold text-white uppercase tracking-tight">
            Como funciona a{" "}
            <span className="text-primary">jornada de implementação</span>
          </h2>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-[100px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 rounded-full" />

          <div className="grid grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-center hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative">
                    <step.icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-lg">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-white/50">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/50 rounded-full" />
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-3 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center z-10 relative">
                    <step.icon className="w-5 h-5 text-primary" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                      Passo {step.number}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 mb-0.5">{step.title}</h3>
                    <p className="text-xs text-white/50">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
