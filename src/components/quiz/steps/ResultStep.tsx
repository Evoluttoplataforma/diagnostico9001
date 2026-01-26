import { useState, useEffect } from "react";
import { QuizButton } from "../QuizButton";
import templumLogo from "@/assets/templum-logo.png";
import { getDiagnosis, AnswerValue, PillarScore, getFallbackChecklist } from "../quizData";
import { MessageCircle, Trophy, Target } from "lucide-react";
import { RadarChart } from "../results/RadarChart";
import { PillarChecklist } from "../results/PillarChecklist";
import { DiagnosisSummary } from "../results/DiagnosisSummary";
import { DiagnosisLoading } from "../results/DiagnosisLoading";
import { DownloadPDFButton } from "../results/DownloadPDFButton";
import { supabase } from "@/integrations/supabase/client";

interface ResultStepProps {
  name: string;
  score: number;
  answers: Record<string, AnswerValue>;
  segment: string;
  companySize: string;
  pillarScores: PillarScore[];
  company?: string;
}

interface DiagnosisData {
  summary: {
    paragraph1: string;
    paragraph2: string;
  };
  checklist: Record<string, string[]>;
}

export const ResultStep = ({
  name,
  score,
  answers,
  segment,
  companySize,
  pillarScores,
  company,
}: ResultStepProps) => {
  const firstName = name.split(" ")[0];
  const diagnosis = getDiagnosis(score);
  const isHighPerformer = score > 70;

  const [aiDiagnosis, setAiDiagnosis] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  // Minimum loading time to show all 3 confidence cards (3 cards × 2.5s = 7.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isLoading || !minLoadingComplete;

  useEffect(() => {
    const fetchAIDiagnosis = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-diagnosis", {
          body: {
            answers,
            segment,
            companySize,
            pillarScores,
            score,
            name,
          },
        });

        let diagnosisResult: DiagnosisData;

        if (error) {
          console.error("AI diagnosis error:", error);
          // Use fallback
          diagnosisResult = {
            summary: {
              paragraph1: `${firstName}, sua empresa demonstra ${score <= 30 ? "oportunidades significativas de estruturação" : score <= 65 ? "uma base operacional que pode ser aprimorada" : "maturidade de gestão admirável"}. ${[...pillarScores].sort((a, b) => b.score - a.score)[0].name} é seu ponto mais forte, enquanto ${[...pillarScores].sort((a, b) => a.score - b.score)[0].name} precisa de atenção.`,
              paragraph2: `Para uma empresa de ${companySize} no segmento de ${segment}, recomendamos focar em ${score > 80 ? "governança e certificações" : "estruturar processos fundamentais"}. Isso vai trazer mais previsibilidade e preparar a empresa para o próximo nível.`,
            },
            checklist: getFallbackChecklist(score),
          };
        } else {
          diagnosisResult = data;
        }

        setAiDiagnosis(diagnosisResult);

        // Save AI diagnosis and pillar scores to database
        try {
          const { error: updateError } = await supabase
            .from("quiz_leads")
            .update({
              pillar_scores: JSON.parse(JSON.stringify(pillarScores)),
              ai_diagnosis: JSON.parse(JSON.stringify(diagnosisResult)),
            })
            .eq("name", name)
            .eq("score", score)
            .order("created_at", { ascending: false })
            .limit(1);

          if (updateError) {
            console.error("Error saving AI diagnosis:", updateError);
          }
        } catch (saveErr) {
          console.error("Failed to save AI diagnosis:", saveErr);
        }
      } catch (err) {
        console.error("Failed to fetch AI diagnosis:", err);
        // Use fallback checklist
        const fallbackDiagnosis = {
          summary: {
            paragraph1: `${firstName}, sua empresa demonstra ${score <= 30 ? "oportunidades significativas de estruturação" : score <= 65 ? "uma base operacional que pode ser aprimorada" : "maturidade de gestão admirável"}. ${[...pillarScores].sort((a, b) => b.score - a.score)[0].name} é seu ponto mais forte.`,
            paragraph2: `Para continuar evoluindo, foque em fortalecer as áreas com menor pontuação. Pequenas melhorias consistentes geram grandes resultados.`,
          },
          checklist: getFallbackChecklist(score),
        };
        setAiDiagnosis(fallbackDiagnosis);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIDiagnosis();
  }, [answers, segment, companySize, pillarScores, score, name, firstName]);

  const levelColors = {
    low: "text-red-400",
    medium: "text-yellow-400",
    high: "text-green-400",
  };

  const levelBgColors = {
    low: "bg-red-500/10 border-red-500/20",
    medium: "bg-yellow-500/10 border-yellow-500/20",
    high: "bg-green-500/10 border-green-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={templumLogo} alt="Templum" className="h-6" />
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            RESULTADO
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-lg mx-auto space-y-8 pb-32">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            {isHighPerformer ? (
              <Trophy className="w-8 h-8 text-primary" />
            ) : (
              <Target className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isHighPerformer ? "Excelente trabalho" : "Parabéns"}, {firstName}! 🎉
          </h1>
          <p className="text-muted-foreground">
            Seu diagnóstico de maturidade está pronto
          </p>
        </section>

        {/* Score Card */}
        <section
          className={`rounded-2xl p-6 border ${levelBgColors[diagnosis.level]} text-center`}
        >
          <div className="text-5xl mb-2">{diagnosis.emoji}</div>
          <div className={`text-5xl font-bold ${levelColors[diagnosis.level]} mb-1`}>
            {score}%
          </div>
          <div className="text-sm text-muted-foreground mb-3">de maturidade</div>
          <h2 className="text-lg font-bold text-foreground">{diagnosis.title}</h2>
        </section>

        {/* Radar Chart */}
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
            Pontuação por Pilar
          </h3>
          <RadarChart pillarScores={pillarScores} />
        </section>

        {/* AI Diagnosis */}
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          {showLoading ? (
            <DiagnosisLoading />
          ) : (
            aiDiagnosis && (
              <DiagnosisSummary
                paragraph1={aiDiagnosis.summary.paragraph1}
                paragraph2={aiDiagnosis.summary.paragraph2}
              />
            )
          )}
        </section>

        {/* Checklist by Pillar */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>✅</span> Plano de Ação
          </h3>
          {showLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <PillarChecklist
              pillarScores={pillarScores}
              checklist={aiDiagnosis?.checklist || getFallbackChecklist(score)}
            />
          )}
        </section>

        {/* Download PDF Button */}
        {!showLoading && aiDiagnosis && (
          <section>
            <DownloadPDFButton
              name={name}
              company={company}
              score={score}
              pillarScores={pillarScores}
              diagnosisSummary={aiDiagnosis.summary}
              checklist={aiDiagnosis.checklist}
              diagnosisTitle={diagnosis.title}
            />
          </section>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-2xl font-bold text-primary">+2.000</div>
            <div className="text-xs text-muted-foreground">Empresas certificadas</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-2xl font-bold text-primary">30+</div>
            <div className="text-xs text-muted-foreground">Anos de experiência</div>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto space-y-2">
          <QuizButton
            onClick={() =>
              window.open(
                "https://wa.me/5519993521270?text=Diagn%C3%B3stico",
                "_blank"
              )
            }
          >
            <MessageCircle className="w-5 h-5" />
            Agende agora com um especialista
          </QuizButton>
          <p className="text-center text-sm font-medium text-foreground">
            Vamos te mostrar <span className="text-primary font-bold">COMO</span> aumentar sua pontuação através da <span className="text-primary font-bold">ISO 9001</span>!
          </p>
        </div>
      </div>
    </div>
  );
};
