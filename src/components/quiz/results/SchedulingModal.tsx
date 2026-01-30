import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, ExternalLink, Loader2, RefreshCw, MessageCircle, Mail, Phone } from "lucide-react";
import { QuizButton } from "../QuizButton";
import { supabase } from "@/integrations/supabase/client";
import { SALESPERSON_DATA, getSalespersonKey, SalespersonInfo } from "./salespersonData";
import victorPhoto from "@/assets/victor-photo.png";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string | null;
  dealId: number | null;
  isLoading?: boolean;
}

// Photo mapping for dynamic imports
const PHOTO_MAP: Record<string, string> = {
  Victor: victorPhoto,
};

export const SchedulingModal = ({ isOpen, onClose, ownerName: initialOwnerName, dealId, isLoading: externalLoading }: SchedulingModalProps) => {
  const [ownerName, setOwnerName] = useState<string | null>(initialOwnerName);
  const [isPolling, setIsPolling] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [hasPolled, setHasPolled] = useState(false);
  
  const MAX_POLL_ATTEMPTS = 6;
  const POLL_INTERVAL = 3000;
  
  const salespersonKey = getSalespersonKey(ownerName);
  const salesperson = salespersonKey ? SALESPERSON_DATA[salespersonKey] : null;
  const photo = salespersonKey ? PHOTO_MAP[salespersonKey] : null;

  const fetchUpdatedOwner = useCallback(async () => {
    if (!dealId) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke("get-deal-owner", {
        body: { deal_id: dealId },
      });
      
      if (error) {
        console.error("Error fetching deal owner:", error);
        return null;
      }
      
      return data?.owner_name || null;
    } catch (err) {
      console.error("Failed to fetch deal owner:", err);
      return null;
    }
  }, [dealId]);

  useEffect(() => {
    if (!isOpen || !dealId || hasPolled) return;
    
    if (getSalespersonKey(initialOwnerName)) {
      setOwnerName(initialOwnerName);
      return;
    }
    
    setIsPolling(true);
    setPollAttempts(0);
    
    const pollForOwner = async () => {
      let attempts = 0;
      
      const poll = async () => {
        attempts++;
        setPollAttempts(attempts);
        
        const newOwnerName = await fetchUpdatedOwner();
        const newSalesperson = getSalespersonKey(newOwnerName);
        
        if (newSalesperson) {
          setOwnerName(newOwnerName);
          setIsPolling(false);
          setHasPolled(true);
          return;
        }
        
        if (attempts < MAX_POLL_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          setIsPolling(false);
          setHasPolled(true);
        }
      };
      
      setTimeout(poll, 2000);
    };
    
    pollForOwner();
  }, [isOpen, dealId, initialOwnerName, fetchUpdatedOwner, hasPolled]);

  useEffect(() => {
    if (!isOpen) {
      setHasPolled(false);
      setPollAttempts(0);
    }
  }, [isOpen]);

  const handleOpenCalendar = () => {
    if (salesperson?.calendarLink) {
      window.open(salesperson.calendarLink, "_blank");
    }
  };

  const handleWhatsApp = () => {
    if (salesperson?.whatsapp) {
      const message = encodeURIComponent("Olá! Acabei de fazer o diagnóstico ISO 9001 e gostaria de agendar uma conversa.");
      window.open(`https://wa.me/${salesperson.whatsapp}?text=${message}`, "_blank");
    }
  };

  const handleEmail = () => {
    if (salesperson?.email) {
      const subject = encodeURIComponent("Diagnóstico ISO 9001 - Agendamento de Reunião");
      const body = encodeURIComponent("Olá!\n\nAcabei de fazer o diagnóstico ISO 9001 e gostaria de agendar uma conversa para discutir os próximos passos.\n\nAguardo seu retorno!");
      window.location.href = `mailto:${salesperson.email}?subject=${subject}&body=${body}`;
    }
  };

  const handleRetryPolling = async () => {
    setIsPolling(true);
    setPollAttempts(0);
    setHasPolled(false);
    
    const newOwnerName = await fetchUpdatedOwner();
    const newSalesperson = getSalespersonKey(newOwnerName);
    
    if (newSalesperson) {
      setOwnerName(newOwnerName);
    }
    
    setIsPolling(false);
    setHasPolled(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-card via-card to-primary/5 border-border overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <div className="p-2 rounded-xl bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            Agende sua Reunião
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Converse com nosso especialista sobre sua jornada ISO 9001
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {externalLoading || isPolling ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
                <Loader2 className="w-8 h-8 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="text-sm text-foreground font-medium">
                  Identificando seu especialista...
                </p>
                {pollAttempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Verificando... ({pollAttempts}/{MAX_POLL_ATTEMPTS})
                  </p>
                )}
              </div>
            </div>
          ) : salesperson ? (
            <div className="space-y-5">
              {/* Premium Salesperson Card */}
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative flex items-center gap-4">
                  {/* Photo */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-card shadow-xl">
                      {photo ? (
                        <img 
                          src={photo} 
                          alt={salesperson.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {salesperson.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                      Seu Especialista
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {salesperson.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {salesperson.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary: Calendar */}
                <QuizButton onClick={handleOpenCalendar} className="w-full group">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Agendar no Calendário
                  <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                </QuizButton>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {salesperson.whatsapp && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl text-[#25D366] font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </button>
                  )}
                  
                  {salesperson.email && (
                    <button
                      onClick={handleEmail}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-primary font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Mail className="w-5 h-5" />
                      E-mail
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <>
              {/* Fallback: Show all salespeople */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Escolha um de nossos especialistas:
                </p>
                {dealId && (
                  <button
                    onClick={handleRetryPolling}
                    className="mt-2 text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Tentar identificar novamente
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {Object.entries(SALESPERSON_DATA).map(([key, person]) => (
                  <button
                    key={key}
                    onClick={() => window.open(person.calendarLink, "_blank")}
                    className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
                      {PHOTO_MAP[key] ? (
                        <img 
                          src={PHOTO_MAP[key]} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {person.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-foreground block">{person.name}</span>
                      <span className="text-xs text-muted-foreground">{person.role}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
