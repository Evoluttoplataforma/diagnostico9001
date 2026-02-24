import { useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import igor from "@/assets/team/igor.jpeg";
import rodrigoFurniel from "@/assets/team/rodrigo_furniel.jpeg";
import daniela from "@/assets/team/daniela.jpeg";
import camila from "@/assets/team/camila.jpeg";
import cristinaBollis from "@/assets/team/cristina_bollis.jpeg";
import jennifer from "@/assets/team/jennifer.jpeg";
import nathalia from "@/assets/team/nathalia.jpeg";
import viviane from "@/assets/team/viviane.jpeg";
import carlos from "@/assets/team/carlos.jpeg";
import samady from "@/assets/team/samady.jpeg";
import chris from "@/assets/team/chris.jpeg";
import raquel from "@/assets/team/raquel.jpeg";
import victor from "@/assets/team/victor.jpeg";
import mariana from "@/assets/team/mariana.jpeg";
import tatiana from "@/assets/team/tatiana.jpeg";
import debora from "@/assets/team/debora.jpeg";
import vinicius from "@/assets/team/vinicius.jpeg";
import rafaela from "@/assets/team/rafaela.jpeg";
import gabriel from "@/assets/team/gabriel.jpeg";
import maiara from "@/assets/team/maiara.jpeg";
import marchiori from "@/assets/team/marchiori.jpeg";
import robert from "@/assets/team/robert.jpeg";
import pedro from "@/assets/team/pedro.jpeg";
import rodrigoSouza from "@/assets/team/rodrigo_souza.png";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  { name: "Igor Furniel", role: "CEO", image: igor },
  { name: "Rodrigo Furniel", role: "Diretor Comercial / Sócio", image: rodrigoFurniel },
  { name: "Daniela Albuquerquer", role: "Diretora Técnica • Auditora Líder ISO 9001, 14001, 45001", image: daniela },
  { name: "Camila Marcocci", role: "Consultora • Melhoria Contínua e Qualidade", image: camila },
  { name: "Cristina Bollis", role: "Consultora • Engenheira de Alimentos", image: cristinaBollis },
  { name: "Jennifer Dantas", role: "Consultora ISO • GRC & Security", image: jennifer },
  { name: "Nathália Carvalho", role: "Consultora • Gestão de Qualidade", image: nathalia },
  { name: "Viviane Amaral", role: "Consultora • Engenheira Civil", image: viviane },
  { name: "Carlos Eduardo", role: "Consultor • Engenheiro de Produção", image: carlos },
  { name: "Sâmady Moraes", role: "Consultora • Auditora Líder SGI", image: samady },
  { name: "Christian Hart", role: "Head de Produtos / Sócio", image: chris },
  { name: "Raquel Davico", role: "Gerente de Projeto", image: raquel },
  { name: "Victor Minatel", role: "Supervisor Comercial", image: victor },
  { name: "Mariana Otsuji", role: "Gestão Administrativa e Financeira", image: mariana },
  { name: "Tatiana Ferreira", role: "Auditor Líder", image: tatiana },
  { name: "Débora Moraes", role: "Auditor Líder", image: debora },
  { name: "Vinícius Cherubim", role: "Executivo de Vendas", image: vinicius },
  { name: "Rafaela Lisboa", role: "Financeiro", image: rafaela },
  { name: "Gabriel Luz", role: "Design Produto", image: gabriel },
  { name: "Maiara", role: "Design", image: maiara },
  { name: "Bernardo Marchiori", role: "VideoMaker", image: marchiori },
  { name: "Robert Vínicius", role: "Desenvolvimento de Sistemas", image: robert },
  { name: "Pedro", role: "Copyright", image: pedro },
  { name: "Rodrigo Souza", role: "Coordenador de Marketing", image: rodrigoSouza },
];

export const TeamSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const goNext = () => setStartIndex((p) => (p + visibleCount >= teamMembers.length ? 0 : p + visibleCount));
  const goPrev = () => setStartIndex((p) => (p === 0 ? Math.max(teamMembers.length - visibleCount, 0) : Math.max(p - visibleCount, 0)));

  const visibleMembers = teamMembers.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="px-5 py-6 lg:py-14 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-base font-bold uppercase tracking-wider text-white/80">Conheça Nosso Time</span>
          </div>
          <h2 className="text-xl lg:text-3xl font-extrabold text-white uppercase tracking-tight">
            Profissionais experientes dedicados a{" "}
            <span className="text-primary">transformar sua gestão</span>
          </h2>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 scrollbar-hide">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex-shrink-0 w-[200px] snap-center">
              <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                <div className="aspect-square overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-primary mt-0.5 line-clamp-2">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/30 mt-2 lg:hidden">Deslize para ver mais →</p>

        {/* Desktop: carousel with arrows */}
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-3 gap-6">
            {visibleMembers.map((member, index) => (
              <div key={startIndex + index} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-primary mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={goPrev}
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-primary transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-primary transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(teamMembers.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * visibleCount)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  Math.floor(startIndex / visibleCount) === i ? "bg-primary scale-110" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
