import { QuizButton } from "../QuizButton";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">
            Diagnóstico de Maturidade de Gestão – ISO 9001
          </h1>

          <p className="text-lg md:text-xl text-primary font-semibold mb-4">
            Descubra se sua empresa está pronta para crescer sem perder o controle
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Responda algumas perguntas rápidas e veja como sua empresa se compara ao padrão usado por empresas organizadas, escaláveis e certificadas.
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-foreground mb-4">Você vai receber:</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Um <strong className="text-foreground">score de maturidade</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Um <strong className="text-foreground">mapa dos seus principais gargalos</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Uma <strong className="text-foreground">leitura estratégica gratuita</strong> com um especialista</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
            Tudo baseado no modelo de gestão da <strong className="text-foreground">ISO 9001</strong> — o padrão mundial de empresas que crescem com previsibilidade.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-foreground mb-4 text-center">Por que isso importa?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-destructive/10 rounded-xl p-5">
              <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Empresas sem processos:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Dependem demais do dono</li>
                <li>• Perdem dinheiro em retrabalho</li>
                <li>• Vivem apagando incêndio</li>
                <li>• Travaram o crescimento</li>
              </ul>
            </div>
            <div className="bg-primary/10 rounded-xl p-5">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Empresas com modelo:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Escalam com consistência</li>
                <li>• Mantêm qualidade</li>
                <li>• Atraem clientes maiores</li>
                <li>• Têm controle total</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <strong className="text-foreground">A ISO 9001 é esse modelo.</strong>
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-foreground mb-4">O que este diagnóstico avalia?</h2>
          <p className="text-muted-foreground mb-4">Ele mede como sua empresa está em 5 pilares críticos:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Processos", "Pessoas", "Clientes", "Controle", "Capacidade de crescimento"].map((pilar) => (
              <span key={pilar} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {pilar}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Em menos de <strong className="text-foreground">5 minutos</strong> você saberá exatamente onde sua empresa está hoje e o que precisa mudar para evoluir.
          </p>
        </div>

        <div className="text-center">
          <QuizButton onClick={onNext}>Começar Diagnóstico Gratuito</QuizButton>
          <p className="text-xs text-muted-foreground mt-4">
            +2.000 empresas já conquistaram a certificação com a Templum
          </p>
        </div>
      </div>
    </div>
  );
};
