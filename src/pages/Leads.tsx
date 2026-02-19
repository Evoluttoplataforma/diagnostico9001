import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Lock, Loader2, Download, Search, ArrowUp, ArrowDown, ArrowUpDown, GripVertical } from "lucide-react";

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
}

const diagnosisColors: Record<string, string> = {
  crítico: "bg-red-100 text-red-800",
  básico: "bg-orange-100 text-orange-800",
  intermediário: "bg-yellow-100 text-yellow-800",
  avançado: "bg-green-100 text-green-800",
};

type ColumnKey = "name" | "email" | "phone" | "company" | "segment" | "score" | "diagnosis_level" | "created_at";

interface ColumnDef {
  key: ColumnKey;
  label: string;
  sortable: boolean;
}

const defaultColumns: ColumnDef[] = [
  { key: "name", label: "Nome", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Telefone", sortable: false },
  { key: "company", label: "Empresa", sortable: true },
  { key: "segment", label: "Segmento", sortable: true },
  { key: "score", label: "Score", sortable: true },
  { key: "diagnosis_level", label: "Nível", sortable: true },
  { key: "created_at", label: "Data / Hora", sortable: true },
];

type SortKey = ColumnKey;
type SortDir = "asc" | "desc";

export default function Leads() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [columns, setColumns] = useState<ColumnDef[]>(defaultColumns);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 ml-1 inline" />
      : <ArrowDown className="w-3 h-3 ml-1 inline" />;
  };

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setColumns((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

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

  const filtered = leads
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        (l.segment || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const cmp = typeof valA === "number" && typeof valB === "number"
        ? valA - valB
        : String(valA).localeCompare(String(valB), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });

  const renderCellValue = (lead: Lead, key: ColumnKey) => {
    switch (key) {
      case "name":
        return <span className="font-medium whitespace-nowrap">{lead.name}</span>;
      case "email":
        return <span className="whitespace-nowrap">{lead.email}</span>;
      case "phone":
        return <span className="whitespace-nowrap">{lead.phone}</span>;
      case "company":
        return <span className="whitespace-nowrap">{lead.company}</span>;
      case "segment":
        return <span className="whitespace-nowrap">{lead.segment || "—"}</span>;
      case "score":
        return <span>{lead.score}%</span>;
      case "diagnosis_level":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${diagnosisColors[lead.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"}`}>
            {lead.diagnosis_level}
          </span>
        );
      case "created_at":
        return (
          <span className="whitespace-nowrap">
            {new Date(lead.created_at).toLocaleDateString("pt-BR")}{" "}
            {new Date(lead.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        );
      default:
        return null;
    }
  };

  const exportCSV = () => {
    const header = columns.map((c) => c.label).join(",") + "\n";
    const rows = filtered
      .map((l) =>
        columns
          .map((c) => {
            const v = c.key === "created_at"
              ? new Date(l.created_at).toLocaleDateString("pt-BR") + " " + new Date(l.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              : (l[c.key] ?? "");
            return `"${v}"`;
          })
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

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground">Área Restrita</h1>
          <p className="text-sm text-muted-foreground">Digite a senha para acessar os leads.</p>
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} registros — arraste os cabeçalhos para reordenar</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
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
                {columns.map((col, i) => (
                  <TableHead
                    key={col.key}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-grab select-none transition-all ${
                      dragIndex === i ? "opacity-50" : ""
                    } ${dragOverIndex === i && dragIndex !== i ? "border-l-2 border-primary" : ""}`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      <GripVertical className="w-3 h-3 opacity-30 flex-shrink-0" />
                      <span>{col.label}</span>
                      {col.sortable && <SortIcon col={col.key} />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{renderCellValue(l, col.key)}</TableCell>
                  ))}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    Nenhum lead encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
