import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, ExternalLink } from "lucide-react";
import { QuizButton } from "../QuizButton";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string | null;
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

export const SchedulingModal = ({ isOpen, onClose, ownerName, isLoading }: SchedulingModalProps) => {
  const salespersonKey = getSalespersonKey(ownerName);
  const calendarLink = salespersonKey ? SALESPERSON_CALENDARS[salespersonKey] : null;

  const handleOpenCalendar = () => {
    if (calendarLink) {
      window.open(calendarLink, "_blank");
    }
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              {/* No specific salesperson assigned - show all options */}
              <p className="text-sm text-muted-foreground text-center mb-4">
                Escolha um de nossos especialistas:
              </p>

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
