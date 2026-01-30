import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { QuizButton } from "../QuizButton";
import { supabase } from "@/integrations/supabase/client";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string | null;
  dealId: number | null;
  isLoading?: boolean;
}

// Temporary calendar links for testing - will be replaced with real Google Calendar links
const SALESPERSON_CALENDARS: Record<string, string> = {
  "Victor": "https://calendar.google.com/calendar/victor-placeholder",
  "Diego": "https://calendar.google.com/calendar/diego-placeholder",
  "Vinicius": "https://calendar.google.com/calendar/vinicius-placeholder",
};

// Map Pipedrive owner names to our salesperson keys
function getSalespersonKey(ownerName: string | null): string | null {
  if (!ownerName) return null;
  
  const lowerName = ownerName.toLowerCase();
  
  if (lowerName.includes("victor")) return "Victor";
  if (lowerName.includes("diego")) return "Diego";
  if (lowerName.includes("vinicius") || lowerName.includes("vinícius")) return "Vinicius";
  
  return null;
}

export const SchedulingModal = ({ isOpen, onClose, ownerName: initialOwnerName, dealId, isLoading: externalLoading }: SchedulingModalProps) => {
  const [ownerName, setOwnerName] = useState<string | null>(initialOwnerName);
  const [isPolling, setIsPolling] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [hasPolled, setHasPolled] = useState(false);
  
  const MAX_POLL_ATTEMPTS = 6; // 6 attempts × 3 seconds = 18 seconds max
  const POLL_INTERVAL = 3000; // 3 seconds
  
  const salespersonKey = getSalespersonKey(ownerName);
  const calendarLink = salespersonKey ? SALESPERSON_CALENDARS[salespersonKey] : null;

  // Function to fetch updated owner from Pipedrive
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

  // Start polling when modal opens and no valid salesperson is found
  useEffect(() => {
    if (!isOpen || !dealId || hasPolled) return;
    
    // If we already have a valid salesperson, no need to poll
    if (getSalespersonKey(initialOwnerName)) {
      setOwnerName(initialOwnerName);
      return;
    }
    
    // Start polling for the reassigned owner
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
          // Found a valid salesperson!
          setOwnerName(newOwnerName);
          setIsPolling(false);
          setHasPolled(true);
          return;
        }
        
        if (attempts < MAX_POLL_ATTEMPTS) {
          // Continue polling
          setTimeout(poll, POLL_INTERVAL);
        } else {
          // Max attempts reached, stop polling
          setIsPolling(false);
          setHasPolled(true);
        }
      };
      
      // Start with first attempt after a short delay to give automation time
      setTimeout(poll, 2000);
    };
    
    pollForOwner();
  }, [isOpen, dealId, initialOwnerName, fetchUpdatedOwner, hasPolled]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasPolled(false);
      setPollAttempts(0);
    }
  }, [isOpen]);

  const handleOpenCalendar = () => {
    if (calendarLink) {
      window.open(calendarLink, "_blank");
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Agende sua Reunião
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escolha o melhor horário para conversar com nosso especialista
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {externalLoading || isPolling ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm text-foreground font-medium">
                  Identificando seu especialista...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pollAttempts > 0 && `Verificando... (${pollAttempts}/${MAX_POLL_ATTEMPTS})`}
                </p>
              </div>
            </div>
          ) : salespersonKey ? (
            <>
              {/* Salesperson Card */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seu especialista</p>
                    <p className="text-lg font-semibold text-foreground">{salespersonKey}</p>
                  </div>
                </div>
              </div>

              {/* Calendar Link Button */}
              <QuizButton onClick={handleOpenCalendar} className="w-full">
                <ExternalLink className="w-5 h-5" />
                Abrir Agenda de {salespersonKey}
              </QuizButton>

              <p className="text-xs text-center text-muted-foreground">
                Você será redirecionado para o Google Calendar para escolher o melhor horário
              </p>
            </>
          ) : (
            <>
              {/* No specific salesperson assigned after polling - show all options */}
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
                {Object.entries(SALESPERSON_CALENDARS).map(([name, link]) => (
                  <button
                    key={name}
                    onClick={() => window.open(link, "_blank")}
                    className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{name}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
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
