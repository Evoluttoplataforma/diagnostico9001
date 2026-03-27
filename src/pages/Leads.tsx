import { useState } from "react";
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, Download, Search, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/components/leads/DateFilter";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadDetailPanel } from "@/components/leads/LeadDetailPanel";
import { PillarScore } from "@/components/quiz/quizData";

interface Lead {
  id: string;
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
}

const diagnosisColors: Record<string, string> = {
  crítico: "bg-red-100 text-red-800",
  básico: "bg-orange-100 text-orange-800",
  intermediário: "bg-yellow-100 text-yellow-800",
  avançado: "bg-green-100 text-green-800",
};

type SortKey = "name" | "score" | "diagnosis_level" | "created_at";

const sortLabels: Record<SortKey, string> = {
  name: "Nome",
  score: "Score",
  diagnosis_level: "Nível",
  created_at: "Data",
};

type SortDir = "asc" | "desc";

// Helper to detect issues with a lead
function getLeadIssueCount(lead: Lead): number {
  let count = 0;
  const answers = lead.answers || {};
  const totalAnswered = Object.keys(answers).length;
  if (totalAnswered === 0) count++;
  else if (totalAnswered < 20) count++;
  if (!lead.ai_diagnosis?.summary) count++;
  if (!lead.pillar_scores?.length) count++;
  if (totalAnswered > 0 && Object.values(answers).every(v => v === 0)) count++;
  return count;
}

export default function Leads() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [datePreset, setDatePreset] = useState<string>("");
  const isMobile = useIsMobile();

  const applyPreset = (preset: string) => {
    const now = new Date();
    setDatePreset(preset);
    switch (preset) {
      case "today":
        setDateFrom(startOfDay(now));
        setDateTo(endOfDay(now));
        break;
      case "yesterday":
        setDateFrom(startOfDay(subDays(now, 1)));
        setDateTo(endOfDay(subDays(now, 1)));
        break;
      case "7d":
        setDateFrom(startOfDay(subDays(now, 6)));
        setDateTo(endOfDay(now));
        break;
      case "30d":
        setDateFrom(startOfDay(subDays(now, 29)));
        setDateTo(endOfDay(now));
        break;
      case "month":
        setDateFrom(startOfMonth(now));
        setDateTo(endOfMonth(now));
        break;
      case "last_month":
        setDateFrom(startOfMonth(subMonths(now, 1)));
        setDateTo(endOfMonth(subMonths(now, 1)));
        break;
      case "all":
        setDateFrom(undefined);
        setDateTo(undefined);
        break;
    }
  };

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setDatePreset("");
  };

  const dateFilterLabel = () => {
    if (!dateFrom && !dateTo) return null;
    if (datePreset === "today") return "Hoje";
    if (datePreset === "yesterday") return "Ontem";
    if (datePreset === "7d") return "Últimos 7 dias";
    if (datePreset === "30d") return "Últimos 30 dias";
    if (datePreset === "month") return "Este mês";
    if (datePreset === "last_month") return "Mês passado";
    const from = dateFrom ? format(dateFrom, "dd/MM", { locale: ptBR }) : "";
    const to = dateTo ? format(dateTo, "dd/MM", { locale: ptBR }) : "";
    return `${from} – ${to}`;
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await supabase.functions.invoke("list-leads", {
        body: { password },
      });
      if (data?.success) {
        setLeads(data.data);
        setAuthenticated(true);
      } else {
        setError(data?.error || "Erro ao autenticar");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const isTestLead = (l: Lead) => {
    const fields = [l.name, l.email, l.company, l.segment || ""].map(f => f.toLowerCase());
    return fields.some(f => f.includes("test") || f.includes("teste"));
  };

  const filtered = leads
    .filter((l) => {
      if (isTestLead(l)) return false;
      const q = search.toLowerCase();
      const matchesSearch =
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        (l.segment || "").toLowerCase().includes(q);
      if (!matchesSearch) return false;
      const d = new Date(l.created_at);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const cmp =
        typeof valA === "number" && typeof valB === "number"
          ? valA - valB
          : String(valA).localeCompare(String(valB), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });

  const exportCSV = () => {
    const header = "Nome,Email,Telefone,Empresa,Segmento,Score,Nível,Data\n";
    const rows = filtered
      .map((l) =>
        [
          l.name, l.email, l.phone, l.company, l.segment || "",
          l.score,
          l.diagnosis_level,
          new Date(l.created_at).toLocaleDateString("pt-BR") + " " +
            new Date(l.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        ]
          .map((v) => `"${v}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Lock className="w-10 h-10 mx-auto text-muted-foreground" />
          <h1 className="text-lg font-bold text-foreground">Área Restrita</h1>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
          </Button>
        </div>
      </div>
    );
  }

  // ── Mobile layout ──
  if (isMobile) {
    return (
      <div className="h-dvh flex flex-col bg-background overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-card shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-foreground">Leads</h1>
            <span className="text-xs text-muted-foreground">({filtered.length})</span>
          </div>
          <div className="flex items-center gap-1">
            <DateFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              datePreset={datePreset}
              onPreset={applyPreset}
              onFromChange={(d) => { setDateFrom(d); setDatePreset(""); }}
              onToChange={(d) => { setDateTo(d); setDatePreset(""); }}
              onClear={clearDateFilter}
              label={dateFilterLabel()}
              compact
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(!showSearch)}>
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportCSV}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="px-3 py-2 border-b bg-card shrink-0">
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-sm" autoFocus />
          </div>
        )}

        {/* Sort chips */}
        <div className="flex gap-1.5 px-3 py-1.5 border-b bg-card shrink-0 overflow-x-auto">
          {(Object.keys(sortLabels) as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                sortKey === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {sortLabels[key]}
              {sortKey === key && <span className="text-[9px]">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </button>
          ))}
        </div>

        {/* Lead cards */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Nenhum lead encontrado</div>
          ) : (
            <div className="divide-y">
              {filtered.map((l) => {
                const issueCount = getLeadIssueCount(l);
                return (
                  <Sheet key={l.id}>
                    <SheetTrigger asChild>
                      <button
                        className="w-full text-left px-3 py-2.5 flex items-center gap-3 active:bg-muted/50 transition-colors"
                        onClick={() => setSelectedLead(l)}
                      >
                        <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center relative">
                          <span className="text-xs font-bold text-foreground">{l.score}%</span>
                          {issueCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                              {issueCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground truncate">{l.name}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${diagnosisColors[l.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"}`}>
                              {l.diagnosis_level}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{l.company}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(l.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh]">
                      <SheetHeader>
                        <SheetTitle className="text-left">{l.name}</SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="mt-4 max-h-[70dvh] pr-3">
                        <LeadDetailPanel lead={l} />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Desktop layout ──
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} registros</p>
          </div>
          <div className="flex gap-2 items-center">
            <DateFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              datePreset={datePreset}
              onPreset={applyPreset}
              onFromChange={(d) => { setDateFrom(d); setDatePreset(""); }}
              onToChange={(d) => { setDateTo(d); setDatePreset(""); }}
              onClear={clearDateFilter}
              label={dateFilterLabel()}
            />
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" size="icon" onClick={exportCSV} title="Exportar CSV">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["name", "email", "company", "segment", "score", "diagnosis_level", "created_at"].map((key) => {
                  const labels: Record<string, string> = {
                    name: "Nome", email: "Email", company: "Empresa",
                    segment: "Segmento", score: "Score", diagnosis_level: "Nível", created_at: "Data / Hora",
                  };
                  return (
                    <TableHead
                      key={key}
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort(key as SortKey)}
                    >
                      <span className="flex items-center gap-1">
                        {labels[key]}
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      </span>
                    </TableHead>
                  );
                })}
                <TableHead>Respostas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => {
                const answersCount = Object.keys(l.answers || {}).length;
                const issueCount = getLeadIssueCount(l);
                return (
                  <TableRow
                    key={l.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedLead(l)}
                  >
                    <TableCell className="font-medium whitespace-nowrap">{l.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{l.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{l.company}</TableCell>
                    <TableCell className="whitespace-nowrap">{l.segment || "—"}</TableCell>
                    <TableCell>{l.score}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${diagnosisColors[l.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"}`}>
                        {l.diagnosis_level}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(l.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${answersCount === 20 ? "text-green-600" : answersCount > 0 ? "text-yellow-600" : "text-red-500"}`}>
                          {answersCount}/20
                        </span>
                        {issueCount > 0 && (
                          <span className="w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                            {issueCount}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum lead encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Desktop detail dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-3">
            {selectedLead && <LeadDetailPanel lead={selectedLead} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
