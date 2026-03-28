import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import normaPhoto from "@/assets/norma-photo.png";
import victorPhoto from "@/assets/victor-photo.png";
import viniciusPhoto from "@/assets/vinicius-photo.png";
import diegoPhoto from "@/assets/diego-photo.png";
import { Calendar, Award, ExternalLink, Star } from "lucide-react";
import { PillarScore, getDiagnosis } from "../quizData";
import { SALESPERSON_DATA } from "../results/salespersonData";
import { supabase } from "@/integrations/supabase/client";

const PHOTO_MAP: Record<string, string> = {
  Victor: victorPhoto,
  Vinicius: viniciusPhoto,
  Diego: diegoPhoto,
};

const EXECUTIVES = Object.entries(SALESPERSON_DATA).map(([key, data]) => ({
  key,
  ...data,
  photo: PHOTO_MAP[key],
}));

interface PostQuizChatProps {
  name: string;
  score: number;
  pillarScores: PillarScore[];
  segment: string;
  companySize: string;
  company: string;
  isDisqualified: boolean;
  dealId: number | null;
  onShowFullResult: (selectedExecutive?: string) => void;
  onScheduleMeeting: (selectedExecutive?: string) => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

const ChatBubble = ({ children, isUser = false }: { children: React.ReactNode; isUser?: boolean }) => (
  <div className={cn("flex gap-2.5 mb-3", isUser ? "justify-end" : "justify-start", "animate-fade-in")}>
    {!isUser && (
      <img src={normaPhoto} alt="Norma" className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1" />
    )}
    <div className={cn(
      "max-w-[80%] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed",
      isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
    )}>
      {children}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-2.5 mb-3 animate-fade-in">
    <img src={normaPhoto} alt="Norma" className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1" />
    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

type Phase = "congrats" | "ask_result" | "showing_result" | "pitch" | "choose_executive" | "report_chat" | "post_report_pitch" | "rating" | "done";

const addPipedriveNote = async (dealId: number | null, content: string) => {
  if (!dealId) return;
  try {
    await supabase.functions.invoke("add-pipedrive-note", {
      body: { deal_id: dealId, content },
    });
  } catch (err) {
    console.error("Failed to add Pipedrive note:", err);
  }
};

export const PostQuizChat = ({
  name,
  score,
  pillarScores,
  segment,
  company,
  isDisqualified,
  dealId,
  onShowFullResult,
  onScheduleMeeting,
}: PostQuizChatProps) => {
  const firstName = name.split(" ")[0];
  const diagnosis = getDiagnosis(score);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [phase, setPhase] = useState<Phase>("congrats");
  const [showButtons, setShowButtons] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedPillars = [...pillarScores].sort((a, b) => b.score - a.score);
  const bestPillar = sortedPillars[0];
  const worstPillar = sortedPillars[sortedPillars.length - 1];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showButtons]);

  // Phase: congrats
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([{
        text: `🎉 ${firstName}, você é daqueles que vai até o fim! Respondeu todas as 20 perguntas — isso mostra comprometimento real com a gestão da ${company}.`,
        isUser: false,
      }]);
      setIsTyping(true);
    }, 600);

    const t2 = setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Poucos líderes dedicam esse tempo para entender onde estão e para onde precisam ir. Isso já te coloca à frente! 💪`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("ask_result");
      setShowButtons(true);
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [firstName, company]);

  const handleWantResult = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Sim, quero ver! 🚀", isUser: true }]);
    setIsTyping(true);

    addPipedriveNote(
      dealId,
      `👁️ **ENGAJAMENTO DO LEAD**\n\n✅ ${name} clicou em "Quero ver meu resultado" — demonstrou interesse ativo no diagnóstico.\n\n📌 **Para a SDR:** Lead engajado. Completou todas as 20 perguntas E pediu para ver o resultado. Isso indica comprometimento real com melhoria de gestão.`
    );

    const levelEmoji = diagnosis.level === "low" ? "🔴" : diagnosis.level === "medium" ? "🟡" : "🟢";

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Aqui vai o resumo do seu diagnóstico:`,
        isUser: false,
      }]);
      setIsTyping(true);
    }, 1200);

    setTimeout(() => {
      const summaryLines = [
        `${levelEmoji} **Pontuação geral: ${score}%** — ${diagnosis.title}`,
        ``,
        `📊 **Seu ponto forte:** ${bestPillar.name} (${bestPillar.score}%)`,
        `⚠️ **Maior oportunidade:** ${worstPillar.name} (${worstPillar.score}%)`,
        ``,
        `${diagnosis.description}`,
      ];
      setMessages(prev => [...prev, {
        text: summaryLines.join("\n"),
        isUser: false,
      }]);
      setIsTyping(true);
    }, 3000);

    setTimeout(() => {
      setPhase("pitch");
      if (isDisqualified) {
        setMessages(prev => [...prev, {
          text: `Continue acompanhando nosso conteúdo para fortalecer a gestão da ${company}! Siga a Templum no Instagram para dicas práticas. 📱`,
          isUser: false,
        }]);
        setIsTyping(false);
        setPhase("done");
        setShowButtons(true);
      } else {
        setMessages(prev => [...prev, {
          text: `${firstName}, agora vem a parte mais importante...`,
          isUser: false,
        }]);
        setIsTyping(true);
      }
    }, 5500);

    if (!isDisqualified) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `Sua pontuação pode **subir significativamente** com as ações certas. E eu sei exatamente o caminho — é a **ISO 9001**.`,
          isUser: false,
        }]);
        setIsTyping(true);
      }, 7500);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `Mas cada empresa é única, e o **COMO** fazer isso na ${company} precisa ser personalizado. Por isso, quero te conectar com um dos nossos consultores especialistas.`,
          isUser: false,
        }]);
        setIsTyping(true);
      }, 10000);

      const pricingText = employeeCount <= 10
        ? `💰 Para empresas de até **10 funcionários**, o investimento é de **R$ 1.500/mês**. Um valor acessível para transformar a gestão da ${company}!`
        : `💰 Para empresas a partir de **11 funcionários**, o investimento é de **R$ 2.500/mês**. Um investimento estratégico para levar a ${company} ao próximo nível!`;

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: pricingText,
          isUser: false,
        }]);
        setIsTyping(true);
      }, 12500);

      const budgetLabel = employeeCount <= 10 ? "R$ 1.500/mês (até 10 func.)" : "R$ 2.500/mês (11+ func.)";
      addPipedriveNote(
        dealId,
        `💰 **BUDGET APRESENTADO AO LEAD**\n\n${name} (${company}) recebeu a informação de investimento:\n• **${budgetLabel}**\n• Funcionários: ${companySize}\n\n📌 **Para a SDR:** O lead já foi informado sobre o valor. Validação de budget feita no chat. Use isso na abordagem: "${firstName}, como você já viu, o investimento para a ${company} é de ${budgetLabel}. Na conversa com o especialista, vamos detalhar exatamente o retorno que isso traz."`
      );

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `Em uma conversa rápida de 15 minutos, nosso especialista vai te mostrar exatamente o que priorizar para sair de ${score}% e chegar onde você quer. Sem compromisso, sem enrolação. 🎯`,
          isUser: false,
        }]);
        setIsTyping(false);
        setShowButtons(true);
      }, 15000);
    }
  };

  const handleWantSpecialist = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Quero falar com um especialista! 🚀", isUser: true }]);
    setIsTyping(true);

    addPipedriveNote(
      dealId,
      `🔥 **LEAD QUENTE — PEDIU ESPECIALISTA (direto)**\n\n🚀 ${name} escolheu "Falar com um especialista" SEM pedir o relatório primeiro.\n\n📌 **Para a SDR:** Este é o melhor sinal possível! O lead já está convencido e quer agir. Se ele não agendar sozinho nos próximos minutos, ligue imediatamente.\n\n⏰ **Urgência:** ALTA — aproveitar o momento de decisão.`
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Ótima escolha! 💪 Aqui estão nossos especialistas em ISO 9001. Escolha com quem prefere conversar:`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("choose_executive");
      setShowButtons(true);
    }, 1200);
  };

  const handleSelectExecutive = (execKey: string) => {
    const exec = SALESPERSON_DATA[execKey];
    setShowButtons(false);
    setMessages(prev => [...prev, { text: `Quero agendar com ${exec.name}! 📅`, isUser: true }]);
    setIsTyping(true);

    const pillarSummary = sortedPillars.map(p => `${p.name}: ${p.score}%`).join(" | ");

    addPipedriveNote(
      dealId,
      `📅 **LEAD ESCOLHEU EXECUTIVO — AÇÃO IMEDIATA**\n\n👤 ${name} escolheu agendar com **${exec.name}**.\n📊 Score: ${score}% | ${pillarSummary}\n\n⚡ **Para a SDR:**\n1. Checar a agenda de ${exec.name} AGORA\n2. Se o lead não aparecer na agenda em 24h, ligar para confirmar\n3. Usar o score de ${score}% como gancho: "${firstName}, vi que você agendou após o diagnóstico. Vamos garantir que ${exec.name} tenha todos os dados para te ajudar"\n\n📞 Telefone do lead: disponível no contato do negócio`
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Perfeito! Estou abrindo a agenda do **${exec.name}** para você escolher o melhor horário. 📅`,
        isUser: false,
      }]);
      setIsTyping(true);
      window.open(exec.calendarLink, "_blank");
    }, 1200);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `${firstName}, foi um prazer te guiar nesse diagnóstico! 🤝\n\nTenho certeza que a conversa com o **${exec.name}** vai ser incrível. Ele vai te mostrar exatamente como transformar esses números em resultados reais para a ${company}.\n\n**Boa reunião e sucesso!** 🚀🎯`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("done");
    }, 3500);
  };

  const handleSeeFullReport = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Quero ver o relatório completo 📊", isUser: true }]);
    setIsTyping(true);

    const pillarDetails2 = sortedPillars.map(p => {
      const emoji = p.score >= 75 ? "🟢" : p.score >= 50 ? "🟡" : "🔴";
      return `${emoji} ${p.name}: ${p.score}%`;
    }).join("\n");

    addPipedriveNote(
      dealId,
      `📊 **LEAD PEDIU RELATÓRIO COMPLETO**\n\n📄 ${name} optou por ver o relatório antes de decidir.\n\n📈 **Resumo mostrado ao lead:**\n${pillarDetails2}\n\n📌 **Para a SDR:**\n• Lead analítico — quer entender os dados antes de agir\n• Abordagem recomendada: usar os NÚMEROS do relatório como gancho\n• Script: "${firstName}, vi que você analisou seu diagnóstico com atenção. O pilar ${worstPillar.name} com ${worstPillar.score}% é onde podemos gerar mais impacto rápido para a ${company}"\n• Aguardar: o lead ainda verá opção de agendar após o relatório`
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Com certeza, ${firstName}! Vou te mostrar o detalhamento completo aqui mesmo 👇`,
        isUser: false,
      }]);
      setIsTyping(true);
    }, 1200);

    // Show pillar-by-pillar breakdown
    const pillarDetails = sortedPillars.map(p => {
      const emoji = p.score >= 75 ? "🟢" : p.score >= 50 ? "🟡" : "🔴";
      return `${emoji} **${p.name}:** ${p.score}%`;
    }).join("\n");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `📊 **Detalhamento por Pilar:**\n\n${pillarDetails}`,
        isUser: false,
      }]);
      setIsTyping(true);
    }, 3200);

    // Actionable insights
    const actionLines = [];
    if (worstPillar.score < 50) {
      actionLines.push(`🔥 **Ação urgente em ${worstPillar.name}** — com apenas ${worstPillar.score}%, esse pilar está travando o crescimento da ${company}.`);
    }
    if (bestPillar.score >= 70) {
      actionLines.push(`💪 **${bestPillar.name} é seu diferencial** — com ${bestPillar.score}%, vocês já têm uma base sólida aqui.`);
    }
    actionLines.push(`\n📈 Com as ações certas, é possível elevar seu score de **${score}%** para **${Math.min(score + 25, 95)}%** em poucos meses.`);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: actionLines.join("\n\n"),
        isUser: false,
      }]);
      setIsTyping(true);
    }, 5500);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `${firstName}, esse é o panorama. Agora a grande questão: você quer **transformar esses números** ou só conhecê-los? 😉\n\nNossos especialistas podem montar um plano personalizado para a ${company} em apenas 15 minutos.`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("post_report_pitch");
      setShowButtons(true);
    }, 8000);
  };

  const handlePostReportSpecialist = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Quero falar com um especialista! 🚀", isUser: true }]);
    setIsTyping(true);

    addPipedriveNote(
      dealId,
      `🔥 **LEAD QUENTE — PEDIU ESPECIALISTA APÓS RELATÓRIO**\n\n🚀 ${name} viu o relatório completo E decidiu falar com especialista.\n\n📌 **Para a SDR:** Lead muito qualificado! Já conhece seus números e quer agir. Se não agendar sozinho, ligar em no máximo 2h.\n\n💡 **Gancho:** "${firstName}, vi que depois de analisar seu diagnóstico de ${score}% você decidiu conversar com nosso time. Isso mostra que você leva a gestão da ${company} a sério."\n\n⏰ **Urgência:** ALTA`
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Ótima escolha! 💪 Escolha com quem prefere conversar:`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("choose_executive");
      setShowButtons(true);
    }, 1200);
  };

  const handleNotInterested = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Agora não, obrigado", isUser: true }]);
    setIsTyping(true);

    addPipedriveNote(
      dealId,
      `⚠️ **LEAD NÃO QUIS AGENDAR**\n\n❌ ${name} viu o relatório (${score}%) mas optou por NÃO agendar.\n\n📌 **Para a SDR — Plano de Follow-up:**\n1. ⏰ **Em 48h:** Enviar WhatsApp: "${firstName}, tudo bem? Vi que você fez nosso diagnóstico e sua empresa tem potencial incrível. Posso te mostrar em 15 min como elevar o score de ${score}% para +${Math.min(score + 25, 95)}%?"\n2. 📧 **Em 5 dias:** Email com conteúdo sobre ${worstPillar.name} (pilar mais fraco: ${worstPillar.score}%)\n3. 📞 **Em 10 dias:** Ligação final antes de arquivar\n\n💡 **Motivo provável:** Lead precisa de mais tempo ou aprovação interna. Não descarte — 30% dos "agora não" convertem em 2 semanas.`
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Sem problemas, ${firstName}! 😊 Antes de ir, que nota você dá para essa experiência do diagnóstico? Sua opinião nos ajuda a melhorar!`,
        isUser: false,
      }]);
      setIsTyping(false);
      setPhase("rating");
      setShowButtons(true);
    }, 1200);
  };

  const handleRating = (stars: number) => {
    setSelectedRating(stars);
    setShowButtons(false);
    setMessages(prev => [...prev, { text: `${"⭐".repeat(stars)}`, isUser: true }]);
    setIsTyping(true);

    const sentiment = stars >= 4 ? "POSITIVA" : stars >= 3 ? "NEUTRA" : "NEGATIVA";
    const followUpTip = stars >= 4
      ? `Lead satisfeito com a experiência. Usar isso no contato: "${firstName}, vi que você curtiu o diagnóstico! Imagina quando aplicar as melhorias na prática..."`
      : stars >= 3
        ? `Lead neutro. Abordar com cuidado e foco em valor prático.`
        : `Lead insatisfeito. Usar abordagem empática: "${firstName}, queremos melhorar. O que achou que faltou?"`;

    addPipedriveNote(
      dealId,
      `⭐ **AVALIAÇÃO DO DIAGNÓSTICO: ${stars}/5 — ${sentiment}**\n\n${name} avaliou a experiência do diagnóstico.\n\n📌 **Para a SDR:**\n${followUpTip}\n\n📊 Contexto: Score ${score}% | Pilar fraco: ${worstPillar.name} (${worstPillar.score}%) | Pilar forte: ${bestPillar.name} (${bestPillar.score}%)`
    );

    setTimeout(() => {
      const thankYou = stars >= 4
        ? `Que bom que você curtiu, ${firstName}! 🥳 Se mudar de ideia sobre falar com um especialista, é só voltar. Sucesso com a ${company}! 🚀`
        : `Obrigada pelo feedback, ${firstName}! Vamos usar isso para melhorar. Sucesso com a ${company}! 💪`;
      setMessages(prev => [...prev, { text: thankYou, isUser: false }]);
      setIsTyping(false);
      setPhase("done");
    }, 1200);
  };

  const renderText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => (
      <span key={lineIdx}>
        {lineIdx > 0 && <br />}
        {line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    ));
  };

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <img src={normaPhoto} alt="Norma" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-foreground text-sm">Norma</p>
          <p className="text-xs text-muted-foreground">Seu diagnóstico está pronto ✨</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} isUser={msg.isUser}>
            {renderText(msg.text)}
          </ChatBubble>
        ))}
        {isTyping && <TypingIndicator />}

        {/* Ask result button */}
        {showButtons && phase === "ask_result" && (
          <div className="flex justify-end mb-3 animate-fade-in">
            <button
              onClick={handleWantResult}
              className="relative bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Quero ver meu resultado! 🎯
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
              </span>
            </button>
          </div>
        )}

        {/* Pitch: ask specialist or report */}
        {showButtons && phase === "pitch" && !isDisqualified && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            <button
              onClick={handleWantSpecialist}
              className="flex items-center gap-3 bg-card border-2 border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:bg-primary/5"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-foreground font-semibold block">Falar com um especialista</span>
                <span className="text-muted-foreground text-xs">15 min • gratuito • sem compromisso</span>
              </div>
            </button>
            <button
              onClick={handleSeeFullReport}
              className="flex items-center gap-3 bg-card border-2 border-border hover:border-primary/40 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <span className="text-foreground block">Ver relatório completo</span>
                <span className="text-muted-foreground text-xs">Detalhamento por pilar + plano de ação</span>
              </div>
            </button>
          </div>
        )}

        {/* Choose executive */}
        {showButtons && phase === "choose_executive" && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            {EXECUTIVES.map((exec) => (
              <button
                key={exec.key}
                onClick={() => handleSelectExecutive(exec.key)}
                className="flex items-center gap-3 bg-card border-2 border-border hover:border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:bg-primary/5"
              >
                <img
                  src={exec.photo}
                  alt={exec.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                />
                <div className="text-left flex-1">
                  <span className="text-foreground font-semibold block">{exec.name}</span>
                  <span className="text-muted-foreground text-xs">{exec.role}</span>
                </div>
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Post-report pitch: specialist or not interested */}
        {showButtons && phase === "post_report_pitch" && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            <button
              onClick={handlePostReportSpecialist}
              className="flex items-center gap-3 bg-card border-2 border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:bg-primary/5"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-foreground font-semibold block">Falar com um especialista</span>
                <span className="text-muted-foreground text-xs">15 min • gratuito • sem compromisso</span>
              </div>
            </button>
            <button
              onClick={handleNotInterested}
              className="flex items-center gap-3 bg-card border-2 border-border hover:border-muted-foreground/30 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <span className="text-foreground block">Agora não, obrigado</span>
                <span className="text-muted-foreground text-xs">Avaliar a experiência</span>
              </div>
            </button>
          </div>
        )}

        {/* Star rating */}
        {showButtons && phase === "rating" && (
          <div className="flex flex-col items-center gap-3 ml-12 mb-3 animate-fade-in">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30 hover:text-yellow-400/60"
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Toque para avaliar</span>
          </div>
        )}

        {/* Disqualified leads */}
        {showButtons && phase === "done" && isDisqualified && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            <a
              href="https://www.instagram.com/templumconsultoria/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border-2 border-border hover:border-primary/40 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            >
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Seguir Templum no Instagram</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
