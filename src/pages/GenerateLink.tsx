import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import templumLogo from "@/assets/templum-logo.png";
import { Search, Copy, Check, Loader2, Link2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Deal {
  id: number;
  title: string;
  status: string;
  org_name: string;
  add_time: string;
}

export default function GenerateLink() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError("Digite o email do lead");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    setError(null);
    setDeals([]);
    setPersonName(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("find-deal-by-email", {
        body: { email: email.trim() },
      });

      if (fnError) {
        console.error("Error:", fnError);
        setError("Erro ao buscar. Tente novamente.");
        setLoading(false);
        return;
      }

      if (!data.success) {
        setError(data.error || "Lead não encontrado.");
        setLoading(false);
        return;
      }

      setPersonName(data.person_name);
      setDeals(data.deals);
    } catch (err) {
      console.error("Error:", err);
      setError("Erro ao buscar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSearch();
    }
  };

  const copyLink = async (dealId: number) => {
    const link = `${window.location.origin}/d/${dealId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(dealId);
      toast.success("Link copiado!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Erro ao copiar");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={templumLogo} alt="Templum" className="h-6" />
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            ÁREA DO VENDEDOR
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-8">
        <div className="max-w-lg mx-auto space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Link2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Gerar Link do Diagnóstico
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite o email do lead para gerar o link personalizado
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyPress}
              placeholder="email@empresa.com"
              className="w-full h-12 pl-4 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !email.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {personName && deals.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Lead encontrado: <span className="font-semibold text-foreground">{personName}</span>
              </p>
            </div>

            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-card rounded-xl p-4 border border-border shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {deal.title}
                      </h3>
                      {deal.org_name && (
                        <p className="text-sm text-muted-foreground truncate">
                          {deal.org_name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Criado em {formatDate(deal.add_time)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        deal.status === "open"
                          ? "bg-green-500/10 text-green-600"
                          : deal.status === "won"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {deal.status === "open" ? "Aberto" : deal.status === "won" ? "Ganho" : "Perdido"}
                    </span>
                  </div>

                  {/* Link Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyLink(deal.id)}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
                    >
                      {copiedId === deal.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar Link
                        </>
                      )}
                    </button>
                    <a
                      href={`/d/${deal.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-muted transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>

                  {/* Show Link */}
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground break-all font-mono">
                      {window.location.origin}/d/{deal.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Como funciona:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Digite o email do lead que já está no Pipedrive</li>
            <li>Copie o link gerado para o deal</li>
            <li>Envie o link para o lead por WhatsApp ou email</li>
            <li>O lead responde o diagnóstico e os dados são atualizados no Pipedrive</li>
          </ol>
        </div>
        </div>
      </main>
    </div>
  );
}
