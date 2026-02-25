import { useState, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COPY_VARIANTS } from "@/components/quiz/copyVariants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, TrendingUp, Users, Target, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, FlaskConical, GripVertical } from "lucide-react";
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

export default function Analytics() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [variantSort, setVariantSort] = useState<"leads" | "score">("leads");
  const [copyOrder, setCopyOrder] = useState<string[] | null>(null);
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
        setLeads(data.leads);
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

  // ── Computed metrics ──
  const metrics = useMemo(() => {
    if (!leads.length) return null;

    const now = new Date();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30d = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const leadsLast7d = leads.filter((l) => new Date(l.created_at) >= last7d).length;
    const leadsLast30d = leads.filter((l) => new Date(l.created_at) >= last30d).length;
    const leadsPrev30d = leads.filter((l) => {
      const d = new Date(l.created_at);
      return d >= prev30d && d < last30d;
    }).length;

    const growthRate = leadsPrev30d > 0 ? ((leadsLast30d - leadsPrev30d) / leadsPrev30d) * 100 : 0;

    const avgScore = Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length);

    // Leads by day (last 30d) with variant breakdown
    const byDay: Record<string, number> = {};
    const byDayVariant: Record<string, Record<string, number>> = {};
    leads
      .filter((l) => new Date(l.created_at) >= last30d)
      .forEach((l) => {
        const day = new Date(l.created_at).toISOString().split("T")[0];
        byDay[day] = (byDay[day] || 0) + 1;
        if (!byDayVariant[day]) byDayVariant[day] = {};
        const v = l.copy_variant || "?";
        byDayVariant[day][v] = (byDayVariant[day][v] || 0) + 1;
      });

    // Fill missing days
    const dailyData: { date: string; leads: number; sessoes: number; variants: Record<string, number> }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
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
    leads.forEach((l) => {
      const level = l.diagnosis_level.toLowerCase();
      byLevel[level] = (byLevel[level] || 0) + 1;
    });
    const levelData = Object.entries(byLevel).map(([name, value]) => ({ name, value }));

    // By segment
    const bySegment: Record<string, number> = {};
    leads.forEach((l) => {
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
      count: leads.filter((l) => l.score >= r.min && l.score <= r.max).length,
    }));

    // By company size
    const bySize: Record<string, number> = {};
    leads.forEach((l) => {
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
    leads.forEach((l) => {
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

    return {
      total: leads.length,
      leadsLast7d,
      leadsLast30d,
      growthRate,
      avgScore,
      dailyData,
      levelData,
      segmentData,
      scoreData,
      sizeData,
      variantData,
    };
  }, [leads]);

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
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">📊 Dashboard de Analytics</h1>
          <p className="text-sm text-muted-foreground">Diagnóstico ISO 9001 — Templum Consultoria</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total de Leads" value={metrics.total} sub="Desde o início" />
          <StatCard icon={Calendar} label="Últimos 7 dias" value={metrics.leadsLast7d} />
          <StatCard
            icon={TrendingUp}
            label="Últimos 30 dias"
            value={metrics.leadsLast30d}
            trend={metrics.growthRate}
            sub="vs 30 dias anteriores"
          />
          <StatCard icon={Target} label="Score Médio" value={`${metrics.avgScore}%`} />
        </div>

        {/* Leads por dia (line chart) */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Leads & Tráfego por Dia (últimos 30 dias)</h2>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Leads</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: "#8b5cf6" }} /> Sessões</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  interval={isMobile ? 6 : 2}
                />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload.find((p: any) => p.dataKey === "leads");
                    const sessItem = payload.find((p: any) => p.dataKey === "sessoes");
                    const variants: Record<string, number> = (item?.payload as any)?.variants || {};
                    const variantEntries = Object.entries(variants).sort((a, b) => a[0].localeCompare(b[0]));
                    return (
                      <div style={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
                        {sessItem && <p style={{ color: "#8b5cf6" }}>Sessões: {sessItem.value}</p>}
                        {item && <p style={{ color: "hsl(var(--primary))" }}>Leads: {item.value}</p>}
                        {variantEntries.length > 0 && (
                          <div style={{ marginTop: 4, borderTop: "1px solid hsl(var(--border))", paddingTop: 4 }}>
                            {variantEntries.map(([v, count]) => (
                              <p key={v} style={{ color: "hsl(var(--muted-foreground))" }}>
                                Copy {v}: {count}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessoes"
                  name="Sessões"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row: Pie charts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nível de Diagnóstico */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Nível de Diagnóstico</h2>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.levelData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição de Score */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Distribuição de Score</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row: Segment & Size */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Top Segmentos */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Top Segmentos</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.segmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    width={isMobile ? 80 : 150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Porte da Empresa */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Porte da Empresa</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.sizeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.sizeData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* A/B Copy Variant Performance */}
        {metrics.variantData.length > 1 && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
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
        )}

        {/* Referência das Copys */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
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

              // Use custom order if set, otherwise sort by leads
              const defaultSorted = [...COPY_VARIANTS].sort((a, b) => (variantLeadCount[b.id] || 0) - (variantLeadCount[a.id] || 0));
              const orderedIds = copyOrder || defaultSorted.map(v => v.id);
              const ordered = orderedIds.map(id => COPY_VARIANTS.find(v => v.id === id)!).filter(Boolean);

              const handleDragStart = (idx: number) => { dragItem.current = idx; };
              const handleDragEnter = (idx: number) => { dragOverItem.current = idx; };
              const handleDragEnd = () => {
                if (dragItem.current === null || dragOverItem.current === null) return;
                const newOrder = [...orderedIds];
                const [removed] = newOrder.splice(dragItem.current, 1);
                newOrder.splice(dragOverItem.current, 0, removed);
                setCopyOrder(newOrder);
                dragItem.current = null;
                dragOverItem.current = null;
              };

              const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
              const medalLabels = ["🥇", "🥈", "🥉"];

              return ordered.map((v, idx) => {
                const count = variantLeadCount[v.id] || 0;
                const medalBorder = idx < 3 ? medalColors[idx] : undefined;
                return (
                  <div
                    key={v.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragEnter={() => handleDragEnter(idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className="rounded-lg border p-3 space-y-1 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                    style={{
                      borderColor: medalBorder || "hsl(var(--border))",
                      borderWidth: idx < 3 ? 2 : 1,
                      backgroundColor: idx < 3 ? `${medalColors[idx]}08` : "hsl(var(--muted) / 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                      {idx < 3 && <span className="text-base">{medalLabels[idx]}</span>}
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        Copy {v.id}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{count} leads</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {v.headline} <span className="text-primary">{v.highlightedPart}</span>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Recent leads table */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Últimos 10 Leads</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Nome</th>
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Empresa</th>
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Copy</th>
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Nível</th>
                  <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((l) => (
                  <tr key={l.id} className="border-b border-border/50">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">{l.name}</td>
                    <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{l.company}</td>
                    <td className="py-2 px-2 text-foreground">{l.score}%</td>
                    <td className="py-2 px-2 text-muted-foreground text-xs">{l.copy_variant || "—"}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          {
                            crítico: "bg-red-100 text-red-800",
                            básico: "bg-orange-100 text-orange-800",
                            intermediário: "bg-yellow-100 text-yellow-800",
                            avançado: "bg-green-100 text-green-800",
                          }[l.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {l.diagnosis_level}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
