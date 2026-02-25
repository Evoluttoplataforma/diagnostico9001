import { useState, useMemo, useRef, useCallback } from "react";
import { format, subDays, startOfDay, endOfDay, startOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { COPY_VARIANTS } from "@/components/quiz/copyVariants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Lock, Loader2, TrendingUp, Users, Target, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, FlaskConical, GripVertical, CalendarIcon, ChevronDown, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  segment: string | null;
  company_size: string | null;
  score: number;
  diagnosis_level: string;
  created_at: string;
  copy_variant: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

// Hardcoded visitor data from project analytics (updated periodically)
const DAILY_VISITORS: Record<string, number> = {
  "2026-01-25": 28, "2026-01-26": 31, "2026-01-27": 50, "2026-01-28": 39,
  "2026-01-29": 43, "2026-01-30": 43, "2026-01-31": 17, "2026-02-01": 24,
  "2026-02-02": 319, "2026-02-03": 327, "2026-02-04": 101, "2026-02-05": 20,
  "2026-02-06": 23, "2026-02-07": 13, "2026-02-08": 61, "2026-02-09": 116,
  "2026-02-10": 60, "2026-02-11": 67, "2026-02-12": 76, "2026-02-13": 23,
  "2026-02-14": 11, "2026-02-15": 7, "2026-02-16": 5, "2026-02-17": 7,
  "2026-02-18": 8, "2026-02-19": 85, "2026-02-20": 70, "2026-02-21": 41,
  "2026-02-22": 43, "2026-02-23": 40, "2026-02-24": 35,
};
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

type PeriodPreset = "today" | "yesterday" | "7d" | "30d" | "this-month" | "last-month" | "90d" | "all" | "custom";

const PERIOD_PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: "today", label: "Hoje" },
  { id: "yesterday", label: "Ontem" },
  { id: "7d", label: "Últimos 7 dias" },
  { id: "30d", label: "Últimos 30 dias" },
  { id: "this-month", label: "Este mês" },
  { id: "last-month", label: "Mês passado" },
  { id: "90d", label: "Últimos 90 dias" },
  { id: "all", label: "Todo o período" },
  { id: "custom", label: "Personalizado" },
];

function getPresetRange(preset: PeriodPreset): { from: Date; to: Date } {
  const now = new Date();
  const today = startOfDay(now);
  switch (preset) {
    case "today": return { from: today, to: endOfDay(now) };
    case "yesterday": return { from: startOfDay(subDays(now, 1)), to: endOfDay(subDays(now, 1)) };
    case "7d": return { from: subDays(today, 6), to: endOfDay(now) };
    case "30d": return { from: subDays(today, 29), to: endOfDay(now) };
    case "this-month": return { from: startOfMonth(now), to: endOfDay(now) };
    case "last-month": { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfDay(new Date(lm.getFullYear(), lm.getMonth() + 1, 0)) }; }
    case "90d": return { from: subDays(today, 89), to: endOfDay(now) };
    case "all": return { from: new Date("2020-01-01"), to: endOfDay(now) };
    case "custom": return { from: subDays(today, 29), to: endOfDay(now) };
  }
}

export default function Analytics() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pipedriveData, setPipedriveData] = useState<Record<string, { status: string; owner: string; stage: string; lost_reason?: string; deal_id?: number | null } | null>>({});
  const [pipedriveLoading, setPipedriveLoading] = useState(false);
  const [variantSort, setVariantSort] = useState<"leads" | "score">("leads");
  const [copyOrder, setCopyOrder] = useState<string[] | null>(null);
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("30d");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [periodOpen, setPeriodOpen] = useState(false);
  const defaultSections = ["stats", "daily", "utm-analytics", "pie-charts", "seg-size", "ab-test", "copys-ref", "recent-leads"];
  const [sectionOrder, setSectionOrder] = useState<string[]>(defaultSections);
  const passwordRef = useRef("");
  const dragSection = useRef<number | null>(null);
  const dragOverSection = useRef<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const isMobile = useIsMobile();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await supabase.functions.invoke("get-analytics", {
        body: { password },
      });
      if (data?.success) {
        const isTestLead = (l: Lead) => {
          const t = [l.name, l.email, l.company, l.segment || ""].map(s => s.toLowerCase());
          return t.some(s => s.includes("test") || s.includes("teste"));
        };
        const cleanLeads = (data.leads as Lead[]).filter(l => !isTestLead(l));
        setLeads(cleanLeads);
        passwordRef.current = password;
        // Load saved dashboard settings
        if (data.settings) {
          if (Array.isArray(data.settings.section_order)) setSectionOrder(data.settings.section_order);
          if (Array.isArray(data.settings.copy_order)) setCopyOrder(data.settings.copy_order);
        }
        setAuthenticated(true);
        // Enrich recent leads with Pipedrive data
        const recentEmails = data.leads.slice(0, 10).map((l: Lead) => l.email);
        setPipedriveLoading(true);
        supabase.functions.invoke("enrich-leads-pipedrive", {
          body: { emails: recentEmails, password },
        }).then(({ data: enrichData }) => {
          if (enrichData?.success && enrichData.results) {
            setPipedriveData(enrichData.results);
          }
        }).finally(() => setPipedriveLoading(false));
      } else {
        setError(data?.error || "Erro ao autenticar");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSectionOrder?: string[], newCopyOrder?: string[] | null) => {
    const body: Record<string, unknown> = { password: passwordRef.current };
    if (newSectionOrder !== undefined) body.section_order = newSectionOrder;
    if (newCopyOrder !== undefined) body.copy_order = newCopyOrder;
    supabase.functions.invoke("save-dashboard-settings", { body });
  };

  // ── Period range ──
  const dateRange = useMemo(() => {
    if (periodPreset === "custom" && customFrom && customTo) {
      return { from: startOfDay(customFrom), to: endOfDay(customTo) };
    }
    return getPresetRange(periodPreset);
  }, [periodPreset, customFrom, customTo]);

  const periodLabel = useMemo(() => {
    if (periodPreset === "custom" && customFrom && customTo) {
      return `${format(customFrom, "dd/MM/yyyy")} - ${format(customTo, "dd/MM/yyyy")}`;
    }
    return PERIOD_PRESETS.find(p => p.id === periodPreset)?.label || "Período";
  }, [periodPreset, customFrom, customTo]);

  // ── Computed metrics ──
  const metrics = useMemo(() => {
    if (!leads.length) return null;

    const { from: rangeFrom, to: rangeTo } = dateRange;
    const rangeDays = Math.max(1, Math.round((rangeTo.getTime() - rangeFrom.getTime()) / (24 * 60 * 60 * 1000)));

    // Filter leads in range
    const filteredLeads = leads.filter((l) => {
      const d = new Date(l.created_at);
      return d >= rangeFrom && d <= rangeTo;
    });

    // Previous period for comparison
    const prevFrom = new Date(rangeFrom.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    const prevTo = new Date(rangeFrom.getTime() - 1);
    const prevLeads = leads.filter((l) => {
      const d = new Date(l.created_at);
      return d >= prevFrom && d <= prevTo;
    });

    const growthRate = prevLeads.length > 0 ? ((filteredLeads.length - prevLeads.length) / prevLeads.length) * 100 : 0;

    const avgScore = filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((s, l) => s + l.score, 0) / filteredLeads.length) : 0;

    // Leads by day with variant breakdown
    const byDay: Record<string, number> = {};
    const byDayVariant: Record<string, Record<string, number>> = {};
    filteredLeads.forEach((l) => {
      const day = new Date(l.created_at).toISOString().split("T")[0];
      byDay[day] = (byDay[day] || 0) + 1;
      if (!byDayVariant[day]) byDayVariant[day] = {};
      const v = l.copy_variant || "?";
      byDayVariant[day][v] = (byDayVariant[day][v] || 0) + 1;
    });

    // Fill days in range
    const dailyData: { date: string; leads: number; sessoes: number; variants: Record<string, number> }[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(rangeTo.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyData.push({
        date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        leads: byDay[key] || 0,
        sessoes: DAILY_VISITORS[key] || 0,
        variants: byDayVariant[key] || {},
      });
    }

    // By diagnosis level
    const byLevel: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      const level = l.diagnosis_level.toLowerCase();
      byLevel[level] = (byLevel[level] || 0) + 1;
    });
    const levelData = Object.entries(byLevel).map(([name, value]) => ({ name, value }));

    // By segment
    const bySegment: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      const seg = l.segment || "Não informado";
      bySegment[seg] = (bySegment[seg] || 0) + 1;
    });
    const segmentData = Object.entries(bySegment)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, value }));

    // Score distribution
    const scoreRanges = [
      { range: "0-20%", min: 0, max: 20 },
      { range: "21-40%", min: 21, max: 40 },
      { range: "41-60%", min: 41, max: 60 },
      { range: "61-80%", min: 61, max: 80 },
      { range: "81-100%", min: 81, max: 100 },
    ];
    const scoreData = scoreRanges.map((r) => ({
      range: r.range,
      count: filteredLeads.filter((l) => l.score >= r.min && l.score <= r.max).length,
    }));

    // By company size
    const bySize: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      const size = l.company_size || "Não informado";
      bySize[size] = (bySize[size] || 0) + 1;
    });
    const sizeData = Object.entries(bySize)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // A/B Copy Variant performance (only A-E, exclude null/unknown)
    const validVariants = ["A", "B", "C", "D", "E"];
    const variantMap: Record<string, { count: number; label: string; totalScore: number }> = {};
    let variantTotal = 0;
    filteredLeads.forEach((l) => {
      const v = l.copy_variant;
      if (!v || !validVariants.includes(v)) return;
      if (!variantMap[v]) variantMap[v] = { count: 0, label: `Copy ${v}`, totalScore: 0 };
      variantMap[v].count++;
      variantMap[v].totalScore += l.score;
      variantTotal++;
    });
    const variantData = Object.entries(variantMap)
      .map(([id, { count, label, totalScore }]) => ({
        name: label,
        leads: count,
        pct: variantTotal > 0 ? Math.round((count / variantTotal) * 100) : 0,
        avgScore: Math.round(totalScore / count),
      }))
      .sort((a, b) => b.leads - a.leads);

    // UTM analytics with avg score
    type UtmEntry = { name: string; leads: number; avgScore: number; pct: number };
    const buildUtmData = (getter: (l: Lead) => string, fallback: string): UtmEntry[] => {
      const map: Record<string, { count: number; totalScore: number }> = {};
      filteredLeads.forEach((l) => {
        const key = getter(l) || fallback;
        if (!map[key]) map[key] = { count: 0, totalScore: 0 };
        map[key].count++;
        map[key].totalScore += l.score;
      });
      const total = filteredLeads.length || 1;
      return Object.entries(map)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, { count, totalScore }]) => ({
          name: name.length > 30 ? name.slice(0, 30) + "…" : name,
          leads: count,
          avgScore: Math.round(totalScore / count),
          pct: Math.round((count / total) * 100),
        }));
    };
    const utmSourceData = buildUtmData((l) => l.utm_source || "", "(direto)");
    const utmMediumData = buildUtmData((l) => l.utm_medium || "", "(nenhum)");
    const utmCampaignData = buildUtmData((l) => l.utm_campaign || "", "(nenhuma)");
    const utmContentData = buildUtmData((l) => l.utm_content || "", "(nenhum)");

    return {
      total: filteredLeads.length,
      totalAll: leads.length,
      growthRate,
      avgScore,
      dailyData,
      levelData,
      segmentData,
      scoreData,
      sizeData,
      variantData,
      utmSourceData,
      utmMediumData,
      utmCampaignData,
      utmContentData,
    };
  }, [leads, dateRange]);

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Lock className="w-10 h-10 mx-auto text-muted-foreground" />
          <h1 className="text-lg font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
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

  if (!metrics) return null;

  const StatCard = ({
    icon: Icon,
    label,
    value,
    sub,
    trend,
  }: {
    icon: any;
    label: string;
    value: string | number;
    sub?: string;
    trend?: number;
  }) => (
    <div className="rounded-xl border bg-card p-4 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend !== undefined && (
          <span
            className={`flex items-center text-xs font-medium ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">📊 Dashboard de Analytics</h1>
            <p className="text-sm text-muted-foreground">Diagnóstico ISO 9001 — Templum Consultoria</p>
          </div>

          {/* Period Selector */}
          <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{periodLabel}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex flex-col sm:flex-row">
                {/* Presets */}
                <div className="border-b sm:border-b-0 sm:border-r border-border p-2 min-w-[160px]">
                  {PERIOD_PRESETS.filter(p => p.id !== "custom").map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPeriodPreset(p.id);
                        if (p.id !== "custom") setPeriodOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                        periodPreset === p.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => setPeriodPreset("custom")}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                        periodPreset === "custom"
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      Personalizado
                    </button>
                  </div>
                </div>

                {/* Custom date pickers */}
                {periodPreset === "custom" && (
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>De</span>
                      <Input
                        type="date"
                        value={customFrom ? format(customFrom, "yyyy-MM-dd") : ""}
                        onChange={(e) => setCustomFrom(e.target.value ? new Date(e.target.value + "T00:00:00") : undefined)}
                        className="h-8 text-xs w-[140px]"
                      />
                      <span>até</span>
                      <Input
                        type="date"
                        value={customTo ? format(customTo, "yyyy-MM-dd") : ""}
                        onChange={(e) => setCustomTo(e.target.value ? new Date(e.target.value + "T00:00:00") : undefined)}
                        className="h-8 text-xs w-[140px]"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!customFrom || !customTo}
                      onClick={() => setPeriodOpen(false)}
                    >
                      Aplicar
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {(() => {
          const handleSectionDragStart = (idx: number) => { dragSection.current = idx; };
          const handleSectionDragEnter = (idx: number) => { dragOverSection.current = idx; };
          const handleSectionDragEnd = () => {
            if (dragSection.current === null || dragOverSection.current === null) return;
            const newOrder = [...sectionOrder];
            const [removed] = newOrder.splice(dragSection.current, 1);
            newOrder.splice(dragOverSection.current, 0, removed);
            setSectionOrder(newOrder);
            saveSettings(newOrder, undefined);
            dragSection.current = null;
            dragOverSection.current = null;
          };

          const DragHandle = () => (
            <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab active:cursor-grabbing" />
          );

          const sections: Record<string, React.ReactNode> = {
            "stats": (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={Users} label="Leads no Período" value={metrics.total} sub={`${metrics.totalAll} no total`} />
                <StatCard icon={TrendingUp} label="Variação" value={`${metrics.growthRate >= 0 ? "+" : ""}${metrics.growthRate.toFixed(0)}%`} trend={metrics.growthRate} sub="vs período anterior" />
                <StatCard icon={Target} label="Score Médio" value={`${metrics.avgScore}%`} />
                <StatCard icon={Calendar} label="Período" value={periodLabel} />
              </div>
            ),
            "daily": (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DragHandle />
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Leads & Tráfego por Dia</h2>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Leads</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: "#8b5cf6" }} /> Sessões</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={isMobile ? 6 : 2} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const item = payload.find((p: any) => p.dataKey === "leads");
                          const sessItem = payload.find((p: any) => p.dataKey === "sessoes");
                          const variants: Record<string, number> = (item?.payload as any)?.variants || {};
                          const variantEntries = Object.entries(variants).sort((a, b) => a[0].localeCompare(b[0]));
                          return (
                            <div style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", padding: "8px 12px" }}>
                              <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
                              {sessItem && <p style={{ color: "#8b5cf6" }}>Sessões: {sessItem.value}</p>}
                              {item && <p style={{ color: "hsl(var(--primary))" }}>Leads: {item.value}</p>}
                              {variantEntries.length > 0 && (
                                <div style={{ marginTop: 4, borderTop: "1px solid hsl(var(--border))", paddingTop: 4 }}>
                                  {variantEntries.map(([v, count]) => (
                                    <p key={v} style={{ color: "hsl(var(--muted-foreground))" }}>Copy {v}: {count}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                      <Line type="monotone" dataKey="sessoes" name="Sessões" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="leads" name="Leads" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ),
            "pie-charts": (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2"><DragHandle /><h2 className="text-sm font-semibold text-foreground">Nível de Diagnóstico</h2></div>
                  <div className="h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={metrics.levelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {metrics.levelData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2"><DragHandle /><h2 className="text-sm font-semibold text-foreground">Distribuição de Score</h2></div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.scoreData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ),
            "seg-size": (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2"><DragHandle /><h2 className="text-sm font-semibold text-foreground">Top Segmentos</h2></div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.segmentData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={isMobile ? 80 : 150} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2"><DragHandle /><h2 className="text-sm font-semibold text-foreground">Porte da Empresa</h2></div>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={metrics.sizeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {metrics.sizeData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ),
            "ab-test": metrics.variantData.length > 1 ? (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DragHandle />
                  <FlaskConical className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">A/B Test — Performance por Copy do Hero</h2>
                </div>
                <div className="grid md:grid-cols-[1fr_auto] gap-6">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.variantData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                        <Bar dataKey="leads" name="Leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 min-w-[220px]">
                    {metrics.variantData.map((v) => (
                      <div key={v.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-foreground">{v.name}</span>
                        <span className="text-muted-foreground text-xs">{v.leads} leads ({v.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null,
            "copys-ref": (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DragHandle />
                  <FlaskConical className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Copys em Rotação (A/B Test)</h2>
                </div>
                <div className="grid gap-3">
                  {(() => {
                    const variantLeadCount: Record<string, number> = {};
                    leads.forEach((l) => {
                      if (l.copy_variant && ["A","B","C","D","E"].includes(l.copy_variant)) {
                        variantLeadCount[l.copy_variant] = (variantLeadCount[l.copy_variant] || 0) + 1;
                      }
                    });
                    const defaultSorted = [...COPY_VARIANTS].sort((a, b) => (variantLeadCount[b.id] || 0) - (variantLeadCount[a.id] || 0));
                    const orderedIds = copyOrder || defaultSorted.map(v => v.id);
                    const ordered = orderedIds.map(id => COPY_VARIANTS.find(v => v.id === id)!).filter(Boolean);
                    const handleCopyDragStart = (idx: number) => { dragItem.current = idx; };
                    const handleCopyDragEnter = (idx: number) => { dragOverItem.current = idx; };
                    const handleCopyDragEnd = () => {
                      if (dragItem.current === null || dragOverItem.current === null) return;
                      const newOrder = [...orderedIds];
                      const [removed] = newOrder.splice(dragItem.current, 1);
                      newOrder.splice(dragOverItem.current, 0, removed);
                      setCopyOrder(newOrder);
                      saveSettings(undefined, newOrder);
                      dragItem.current = null;
                      dragOverItem.current = null;
                    };
                    const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
                    const medalLabels = ["🥇", "🥈", "🥉"];
                    return ordered.map((v, idx) => {
                      const count = variantLeadCount[v.id] || 0;
                      const medalBorder = idx < 3 ? medalColors[idx] : undefined;
                      return (
                        <div key={v.id} draggable onDragStart={(e) => { e.stopPropagation(); handleCopyDragStart(idx); }} onDragEnter={(e) => { e.stopPropagation(); handleCopyDragEnter(idx); }} onDragEnd={(e) => { e.stopPropagation(); handleCopyDragEnd(); }} onDragOver={(e) => e.preventDefault()} className="rounded-lg border p-3 space-y-1 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md" style={{ borderColor: medalBorder || "hsl(var(--border))", borderWidth: idx < 3 ? 2 : 1, backgroundColor: idx < 3 ? `${medalColors[idx]}08` : "hsl(var(--muted) / 0.3)" }}>
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                            {idx < 3 && <span className="text-base">{medalLabels[idx]}</span>}
                            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">Copy {v.id}</span>
                            <span className="text-xs font-semibold text-foreground">{count} leads</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground leading-snug">{v.headline} <span className="text-primary">{v.highlightedPart}</span></p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ),
             "utm-analytics": (
              <div className="rounded-xl border bg-card p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <DragHandle />
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">UTM — Origem dos Leads</h2>
                </div>
                {[
                  { title: "Source (Origem)", data: metrics.utmSourceData, color: "#3b82f6" },
                  { title: "Medium (Meio)", data: metrics.utmMediumData, color: "#8b5cf6" },
                  { title: "Campaign (Campanha)", data: metrics.utmCampaignData, color: "#22c55e" },
                  { title: "Content (Criativo)", data: metrics.utmContentData, color: "#f97316" },
                ].map(({ title, data: utmData, color }) => (
                  utmData.length > 0 && utmData[0].name !== "(direto)" && utmData[0].name !== "(nenhum)" && utmData[0].name !== "(nenhuma)" ? (
                    <div key={title} className="space-y-2">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {utmData.map((item, i) => (
                          <div
                            key={item.name}
                            className="rounded-lg border p-3 space-y-1 transition-shadow hover:shadow-md"
                            style={{ borderLeftWidth: 3, borderLeftColor: color }}
                          >
                            <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                              {i === 0 && "🥇 "}{i === 1 && "🥈 "}{i === 2 && "🥉 "}
                              {item.name}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-foreground">{item.leads}</span>
                              <span className="text-[10px] text-muted-foreground">leads ({item.pct}%)</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Score médio: <span className="font-medium text-foreground">{item.avgScore}%</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div key={title} className="space-y-2">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                      <p className="text-xs text-muted-foreground italic">Sem dados de UTM ainda — leads futuros com UTMs aparecerão aqui.</p>
                    </div>
                  )
                ))}
              </div>
            ),
            "recent-leads": (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DragHandle />
                  <h2 className="text-sm font-semibold text-foreground">Últimos 10 Leads</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Nome</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Empresa</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Score</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Nível</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Proprietário</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Etapa</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Motivo Perda</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Pipedrive</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">UTM Source</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 10).map((l) => {
                        const pd = pipedriveData[l.email.trim().toLowerCase()];
                        return (
                        <tr key={l.id} className="border-b border-border/50">
                          <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">{l.name}</td>
                          <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{l.company}</td>
                          <td className="py-2 px-2 text-foreground">{l.score}%</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${{ crítico: "bg-red-100 text-red-800", básico: "bg-orange-100 text-orange-800", intermediário: "bg-yellow-100 text-yellow-800", avançado: "bg-green-100 text-green-800" }[l.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"}`}>
                              {l.diagnosis_level}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-xs whitespace-nowrap">
                            {pipedriveLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : pd ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pd.status === "Aberto" ? "bg-blue-100 text-blue-800" : pd.status === "Ganho" ? "bg-green-100 text-green-800" : pd.status === "Perdido" ? "bg-red-100 text-red-800" : pd.status === "Sem negócio" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"}`}>
                                {pd.status}
                              </span>
                            ) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                            {pipedriveLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : pd?.owner || "—"}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                            {pipedriveLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : pd?.stage || "—"}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                            {pipedriveLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : pd?.lost_reason || "—"}
                          </td>
                          <td className="py-2 px-2 text-xs whitespace-nowrap">
                            {pipedriveLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : pd?.deal_id ? (
                              <a
                                href={`https://app.pipedrive.com/deal/${pd.deal_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Abrir
                              </a>
                            ) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                            {l.utm_source || "—"}
                          </td>
                          <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString("pt-BR")}</td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          };

          return sectionOrder.map((key, idx) => {
            const content = sections[key];
            if (!content) return null;
            return (
              <div
                key={key}
                draggable
                onDragStart={() => handleSectionDragStart(idx)}
                onDragEnter={() => handleSectionDragEnter(idx)}
                onDragEnd={handleSectionDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="transition-shadow"
              >
                {content}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
