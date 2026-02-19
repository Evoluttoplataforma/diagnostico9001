import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VendorQuizFlow } from "@/components/quiz/VendorQuizFlow";
import templumLogo from "@/assets/templum-logo.png";
import { Loader2, AlertCircle } from "lucide-react";

interface PipedriveData {
  deal_id: number;
  deal_title: string;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  company: string;
  company_size: string;
  segment: string;
  revenue: string;
  owner_name: string | null;
}

export default function VendorQuiz() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipedriveData, setPipedriveData] = useState<PipedriveData | null>(null);

  useEffect(() => {
    const fetchDealData = async () => {
      if (!dealId) {
        setError("ID do deal não fornecido");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("get-pipedrive-deal", {
          body: { deal_id: parseInt(dealId, 10) },
        });

        if (fnError) {
          console.error("Error fetching deal:", fnError);
          setError("Não foi possível carregar os dados. Verifique se o link está correto.");
          setLoading(false);
          return;
        }

        if (!data.success) {
          setError(data.error || "Deal não encontrado no Pipedrive.");
          setLoading(false);
          return;
        }

        setPipedriveData(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Erro ao carregar dados. Tente novamente.");
        setLoading(false);
      }
    };

    fetchDealData();
  }, [dealId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <img src={templumLogo} alt="Templum" className="h-8 mb-8" />
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando seus dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <img src={templumLogo} alt="Templum" className="h-8 mb-8" />
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Link Inválido</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!pipedriveData) {
    return null;
  }

  return (
    <VendorQuizFlow
      dealId={parseInt(dealId!, 10)}
      initialData={{
        name: pipedriveData.name,
        email: pipedriveData.email,
        phone: pipedriveData.phone,
        jobTitle: pipedriveData.job_title,
        company: pipedriveData.company,
        companySize: pipedriveData.company_size,
        segment: pipedriveData.segment,
        revenue: pipedriveData.revenue,
      }}
      ownerName={pipedriveData.owner_name}
    />
  );
}
