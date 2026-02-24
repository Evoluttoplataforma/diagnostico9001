import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import normaPhoto from "@/assets/norma-photo.png";

export interface ChatStepData {
  jobTitle: string;
  segment: string;
  companySize: string;
  revenue: string;
}

interface ChatStepProps {
  userName: string;
  onComplete: (data: ChatStepData) => Promise<void>;
  onBack: () => void;
}

type FieldKey = keyof ChatStepData;

interface ChatField {
  key: FieldKey;
  question: string;
  placeholder: string;
  type?: "text" | "number" | "select";
  options?: { value: string; label: string }[];
}

const CHAT_FIELDS: ChatField[] = [
  {
    key: "jobTitle",
    question: "Qual é o seu cargo na empresa?",
    placeholder: "Ex: Diretor, Gerente, Sócio...",
  },
  {
    key: "segment",
    question: "O que sua empresa faz? Descreva brevemente o ramo de atividade.",
    placeholder: "Ex: Fabricação de peças automotivas...",
  },
  {
    key: "companySize",
    question: "Quantos funcionários sua empresa possui?",
    placeholder: "Ex: 25",
    type: "number",
  },
  {
    key: "revenue",
    question: "Qual a faixa de faturamento mensal da empresa?",
    placeholder: "",
    type: "select",
    options: [
      { value: "abaixo_100k", label: "Abaixo de R$ 100 mil/mês" },
      { value: "acima_100k", label: "Acima de R$ 100 mil/mês" },
    ],
  },
];

interface BubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  animate?: boolean;
}

const ChatBubble = ({ children, isUser = false, animate = true }: BubbleProps) => (
  <div
    className={cn(
      "flex gap-2.5 mb-3",
      isUser ? "justify-end" : "justify-start",
      animate && "animate-fade-in"
    )}
  >
    {!isUser && (
      <img
        src={normaPhoto}
        alt="Norma"
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
      />
    )}
    <div
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed",
        isUser
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-muted text-foreground rounded-bl-md"
      )}
    >
      {children}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-2.5 mb-3 animate-fade-in">
      <img
        src={normaPhoto}
        alt="Norma"
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
    />
    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

export const ChatStep = ({ userName, onComplete, onBack }: ChatStepProps) => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(-1); // -1 = intro
  const [collectedData, setCollectedData] = useState<Partial<ChatStepData>>({});
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = userName.split(" ")[0];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Show intro messages
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        { text: `Olá ${firstName}, que bom que você chegou até aqui para fazer seu **diagnóstico de gestão ISO 9001**.`, isUser: false },
      ]);
      setIsTyping(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Preciso de algumas informações para personalizar seu diagnóstico. Vamos lá?", isUser: false },
      ]);
      setIsTyping(false);
      setCurrentFieldIndex(-1);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [firstName]);

  // When user confirms "Vamos lá", show first question
  const handleStartChat = () => {
    setMessages((prev) => [...prev, { text: "Vamos lá! 🚀", isUser: true }]);
    setIsTyping(true);
    setTimeout(() => {
      setCurrentFieldIndex(0);
      setMessages((prev) => [...prev, { text: CHAT_FIELDS[0].question, isUser: false }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 1200);
  };

  const handleSendAnswer = async () => {
    const field = CHAT_FIELDS[currentFieldIndex];
    if (!field) return;

    const value = inputValue.trim();
    if (!value) return;

    // Add user message
    setMessages((prev) => [...prev, { text: value, isUser: true }]);
    setInputValue("");

    const newData = { ...collectedData, [field.key]: value };
    setCollectedData(newData);

    // Check if last field
    if (currentFieldIndex >= CHAT_FIELDS.length - 1) {
      setIsTyping(true);
      setTimeout(async () => {
        setMessages((prev) => [
          ...prev,
          { text: "Perfeito! Já tenho tudo que preciso. Vou preparar suas perguntas personalizadas agora... ✨", isUser: false },
        ]);
        setIsTyping(false);
        setIsLoading(true);
        await onComplete(newData as ChatStepData);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Next question
    setIsTyping(true);
    setTimeout(() => {
      const nextIndex = currentFieldIndex + 1;
      setCurrentFieldIndex(nextIndex);
      setMessages((prev) => [...prev, { text: CHAT_FIELDS[nextIndex].question, isUser: false }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 1200);
  };

  const handleSelectOption = async (value: string, label: string) => {
    const field = CHAT_FIELDS[currentFieldIndex];
    if (!field) return;

    setMessages((prev) => [...prev, { text: label, isUser: true }]);

    const newData = { ...collectedData, [field.key]: value };
    setCollectedData(newData);

    if (currentFieldIndex >= CHAT_FIELDS.length - 1) {
      setIsTyping(true);
      setTimeout(async () => {
        setMessages((prev) => [
          ...prev,
          { text: "Perfeito! Já tenho tudo que preciso. Vou preparar suas perguntas personalizadas agora... ✨", isUser: false },
        ]);
        setIsTyping(false);
        setIsLoading(true);
        await onComplete(newData as ChatStepData);
        setIsLoading(false);
      }, 1000);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const nextIndex = currentFieldIndex + 1;
      setCurrentFieldIndex(nextIndex);
      setMessages((prev) => [...prev, { text: CHAT_FIELDS[nextIndex].question, isUser: false }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  const currentField = currentFieldIndex >= 0 ? CHAT_FIELDS[currentFieldIndex] : null;
  const showInput = currentField && !isTyping && !isLoading && currentField.type !== "select";
  const showOptions = currentField?.type === "select" && !isTyping && !isLoading;
  const showStartButton = currentFieldIndex === -1 && !isTyping;

  const renderText = (text: string) => {
    // Simple bold markdown support
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <img src={normaPhoto} alt="Norma" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-foreground text-sm">Norma</p>
          <p className="text-xs text-muted-foreground">Diagnóstico ISO 9001</p>
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

        {/* Start button */}
        {showStartButton && (
          <div className="flex justify-end mb-3 animate-fade-in">
            <button
              onClick={handleStartChat}
              className="relative bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Vamos lá?
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
              </span>
            </button>
          </div>
        )}

        {/* Select options */}
        {showOptions && currentField?.options && (
          <div className="flex flex-col gap-2 ml-12 mb-3 animate-fade-in">
            {currentField.options.map((opt) => {
              const isRevenue = currentField.key === "revenue";
              const isRed = opt.value === "abaixo_100k";
              const Icon = isRed ? TrendingDown : TrendingUp;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value, opt.label)}
                  className={cn(
                    "text-left bg-card border-2 border-border hover:border-primary px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md flex items-center gap-3",
                    isRevenue && isRed && "hover:border-destructive hover:bg-destructive/5",
                    isRevenue && !isRed && "hover:border-blue-500 hover:bg-blue-500/5"
                  )}
                >
                  {isRevenue && (
                    <>
                      <span className={cn("w-3 h-3 rounded-full flex-shrink-0", isRed ? "bg-destructive" : "bg-blue-500")} />
                      <Icon className={cn("w-5 h-5 flex-shrink-0", isRed ? "text-destructive" : "text-blue-500")} />
                    </>
                  )}
                  <span className={cn(isRevenue && (isRed ? "text-destructive" : "text-blue-600"))}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      {showInput && (
        <div className="px-4 py-3 border-t border-border bg-card animate-fade-in">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type={currentField?.type === "number" ? "number" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentField?.placeholder}
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              autoFocus
              min={currentField?.type === "number" ? 0 : undefined}
            />
            <button
              onClick={handleSendAnswer}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Preparando seu diagnóstico...
          </div>
        </div>
      )}
    </div>
  );
};
