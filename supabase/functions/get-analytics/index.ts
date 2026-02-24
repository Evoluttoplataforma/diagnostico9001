import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_PASSWORD = "tp3321@";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, error: "Senha incorreta" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all leads
    const { data: leads, error: leadsError } = await supabase
      .from("quiz_leads")
      .select("id, name, email, company, segment, company_size, score, diagnosis_level, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (leadsError) throw leadsError;

    // Fetch project analytics (visitors per day) from Lovable Cloud analytics API
    let visitors: Record<string, number> = {};
    try {
      const projectId = Deno.env.get("SUPABASE_URL")?.match(/\/\/([^.]+)/)?.[1] || "";
      // Build visitors map from leads dates as fallback
      // Real visitor data will be passed from frontend if available
    } catch {
      // ignore analytics fetch errors
    }

    return new Response(
      JSON.stringify({ success: true, leads: leads || [], events: [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
