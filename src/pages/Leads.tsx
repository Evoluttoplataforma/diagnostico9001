import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Lock, Loader2, Download, Search } from "lucide-react";

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

export default function Leads() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      (l.segment || "").toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const header = "Nome,Email,Telefone,Empresa,Tamanho,Segmento,Score,Nível,Data\n";
    const rows = filtered
      .map((l) =>
        [
          l.name, l.email, l.phone, l.company, l.company_size || "",
          l.segment || "", l.score, l.diagnosis_level,
          new Date(l.created_at).toLocaleDateString("pt-BR"),
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
            <p className="text-sm text-muted-foreground">{filtered.length} registros</p>
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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium whitespace-nowrap">{l.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{l.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{l.phone}</TableCell>
                  <TableCell className="whitespace-nowrap">{l.company}</TableCell>
                  <TableCell className="whitespace-nowrap">{l.segment || "—"}</TableCell>
                  <TableCell>{l.score}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${diagnosisColors[l.diagnosis_level.toLowerCase()] || "bg-muted text-muted-foreground"}`}>
                      {l.diagnosis_level}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
