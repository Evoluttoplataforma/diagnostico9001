import { PillarScore } from "@/components/quiz/quizData";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, XCircle, MinusCircle, HelpCircle } from "lucide-react";

interface LeadDetailPanelProps {
  lead: {
    name: string;
    email: string;
    phone: string;
    company: string;
    company_size: string | null;
    segment: string | null;
    score: number;
    diagnosis_level: string;
    created_at: string;
    answers: Record<string, number> | null;
    pillar_scores: PillarScore[] | null;
    ai_diagnosis: {
      summary?: { paragraph1?: string; paragraph2?: string };
      checklist?: Record<string, string[]>;
    } | null;
  };
}

const pillarQuestionIds: Record<string, string[]> = {
  Processos: ["q1", "q2", "q3", "q4"],
  Pessoas: ["q5", "q6", "q7", "q8"],
  Clientes: ["q9", "q10", "q11", "q12"],
  Controle: ["q13", "q14", "q15", "q16"],
  Crescimento: ["q17", "q18", "q19", "q20"],
};

const scoreIcon = (value: number) => {
  if (value >= 4) return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
  if (value === 3) return <MinusCircle className="w-4 h-4 text-yellow-500 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
};

const scoreBg = (value: number) => {
  if (value >= 4) return "bg-green-500/10";
  if (value === 3) return "bg-yellow-500/10";
  return "bg-red-500/10";
};

export function LeadDetailPanel({ lead }: LeadDetailPanelProps) {
  const answers = lead.answers || {};
  const pillarScores = lead.pillar_scores || [];
  const aiDiagnosis = lead.ai_diagnosis;

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = 20;
  const hasIncompleteAnswers = totalAnswered < totalQuestions;
  const hasNoDiagnosis = !aiDiagnosis || !aiDiagnosis.summary;

  // Detect issues
  const issues: string[] = [];
  if (totalAnswered === 0) issues.push("Lead não respondeu nenhuma pergunta do diagnóstico");
  else if (hasIncompleteAnswers) issues.push(`Lead respondeu apenas ${totalAnswered} de ${totalQuestions} perguntas`);
  if (hasNoDiagnosis) issues.push("Diagnóstico por IA não foi gerado (possível erro na geração)");
  if (pillarScores.length === 0) issues.push("Pontuação por pilar não disponível");
  
  // Check for all-zero answers (possible bug)
  const allZero = totalAnswered > 0 && Object.values(answers).every(v => v === 0);
  if (allZero) issues.push("Todas as respostas com valor 0 — possível erro na captura");

  return (
    <div className="space-y-5 text-sm">
      {/* Issues/Warnings */}
      {issues.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-destructive font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Problemas Detectados
          </div>
          {issues.map((issue, i) => (
            <p key={i} className="text-destructive/80 text-xs flex items-start gap-1.5">
              <span className="mt-0.5">•</span> {issue}
            </p>
          ))}
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">Contato</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoCell label="Email" value={lead.email} />
          <InfoCell label="Telefone" value={lead.phone} />
          <InfoCell label="Empresa" value={lead.company} />
          <InfoCell label="Segmento" value={lead.segment || "—"} />
          <InfoCell label="Porte" value={lead.company_size ? `${lead.company_size} func.` : "—"} />
          <InfoCell label="Data" value={formatDate(lead.created_at)} />
        </div>
      </div>

      <Separator />

      {/* Pillar Scores */}
      {pillarScores.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Score por Pilar ({lead.score}% geral)
          </h4>
          <div className="space-y-1.5">
            {pillarScores.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-xs w-24 text-muted-foreground">{p.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      p.score >= 75 ? "bg-green-500" : p.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-10 text-right">{p.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Answers by Pillar */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          Respostas ({totalAnswered}/{totalQuestions})
        </h4>
        {Object.entries(pillarQuestionIds).map(([pillar, qIds]) => {
          const pillarAnswers = qIds.map(id => ({ id, value: answers[id] }));
          const hasAnyAnswer = pillarAnswers.some(a => a.value !== undefined);
          
          return (
            <div key={pillar} className="space-y-1">
              <p className="text-xs font-medium text-foreground">{pillar}</p>
              <div className="grid grid-cols-4 gap-1">
                {pillarAnswers.map((a) => {
                  const val = a.value;
                  const answered = val !== undefined && val !== null;
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs ${
                        answered ? scoreBg(val) : "bg-muted"
                      }`}
                    >
                      {answered ? (
                        <>
                          {scoreIcon(val)}
                          <span className="font-medium">{val}/5</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">—</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Diagnosis */}
      {aiDiagnosis?.summary && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Diagnóstico IA</h4>
            {aiDiagnosis.summary.paragraph1 && (
              <p className="text-xs text-muted-foreground leading-relaxed">{aiDiagnosis.summary.paragraph1}</p>
            )}
            {aiDiagnosis.summary.paragraph2 && (
              <p className="text-xs text-muted-foreground leading-relaxed">{aiDiagnosis.summary.paragraph2}</p>
            )}
          </div>
        </>
      )}

      {/* Checklist */}
      {aiDiagnosis?.checklist && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Plano de Ação</h4>
            {Object.entries(aiDiagnosis.checklist).map(([pillar, items]) => (
              <div key={pillar} className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">{pillar}</p>
                {(items as (string | { action: string })[]).map((item, i) => {
                  const text = typeof item === "string" ? item : item.action;
                  return (
                    <p key={i} className="text-xs text-muted-foreground pl-3 flex items-start gap-1">
                      <span>•</span> {text}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <p className="font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
