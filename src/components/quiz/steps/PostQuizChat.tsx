import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import normaPhoto from "@/assets/norma-photo.png";
import { Calendar, ArrowRight, Star, TrendingUp, Award } from "lucide-react";
import { PillarScore, getDiagnosis } from "../quizData";

interface PostQuizChatProps {
  name: string;
  score: number;
  pillarScores: PillarScore[];
  segment: string;
  companySize: string;
  company: string;
  isDisqualified: boolean;
  onShowFullResult: () => void;
  onScheduleMeeting: () => void;
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

type Phase = "congrats" | "ask_result" | "showing_result" | "pitch" | "done";

export const PostQuizChat = ({
  name,
  score,
  pillarScores,
  segment,
  company,
  isDisqualified,
  onShowFullResult,
  onScheduleMeeting,
}: PostQuizChatProps) => {
  const firstName = name.split(" ")[0];
  const diagnosis = getDiagnosis(score);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [phase, setPhase] = useState<Phase>("congrats");
  const [showButtons, setShowButtons] = useState(false);
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

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `Em uma conversa rápida de 15 minutos, ele vai te mostrar exatamente o que priorizar para sair de ${score}% e chegar onde você quer. Sem compromisso, sem enrolação. 🎯`,
          isUser: false,
        }]);
        setIsTyping(false);
        setShowButtons(true);
      }, 12500);
    }
  };

  const handleSchedule = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Quero agendar! 📅", isUser: true }]);
    setTimeout(() => {
      onScheduleMeeting();
    }, 500);
  };

  const handleSeeFullReport = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, { text: "Quero ver o relatório completo", isUser: true }]);
    setTimeout(() => {
      onShowFullResult();
    }, 500);
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

        {/* Buttons based on phase */}
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

        {showButtons && phase === "pitch" && !isDisqualified && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            <button
              onClick={handleSchedule}
              className="flex items-center gap-3 bg-card border-2 border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:bg-primary/5"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-foreground font-semibold block">Agendar com consultor</span>
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

        {showButtons && phase === "done" && isDisqualified && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            <button
              onClick={handleSeeFullReport}
              className="flex items-center gap-3 bg-card border-2 border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:bg-primary/5"
            >
              <Award className="w-5 h-5 text-primary" />
              <span className="text-foreground font-semibold">Ver relatório completo</span>
            </button>
            <a
              href="https://www.instagram.com/templumconsultoria/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border-2 border-border hover:border-primary/40 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            >
              <Star className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Seguir Templum no Instagram</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
