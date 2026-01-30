import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PillarScore {
  name: string;
  score: number;
}

interface DiagnosisRequest {
  answers: Record<string, string>;
  segment: string;
  companySize: string;
  pillarScores: PillarScore[];
  score: number;
  name: string;
}

interface DiagnosisResponse {
  summary: {
    paragraph1: string;
    paragraph2: string;
  };
  checklist: {
    Processos: string[];
    Pessoas: string[];
    Clientes: string[];
    Controle: string[];
    Crescimento: string[];
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, segment, companySize, pillarScores, score, name } = await req.json() as DiagnosisRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const firstName = name.split(" ")[0];

    // Build pillar scores text
    const pillarScoresText = pillarScores
      .map((p) => `- ${p.name}: ${p.score}%`)
      .join("\n");

    // Determine recommendation focus based on score
    const isHighPerformer = score > 80;
    const focusGuidance = isHighPerformer
      ? "A empresa tem maturidade avançada. Foque em: governança corporativa, melhoria contínua (PDCA/Kaizen), preparação para certificação ISO 9001, indicadores avançados (OKRs, BSC), auditoria interna, expansão de mercado."
      : "A empresa precisa estruturar fundamentos. Foque em: organização básica, documentação de processos, definição de papéis, controle financeiro básico, retenção de clientes.";

    const systemPrompt = `Você é um consultor de gestão empresarial especializado em ISO 9001 e melhoria de processos.
Responda APENAS com JSON válido, sem markdown, sem texto adicional.

IMPORTANTE:
- Seja específico para o segmento informado
- Use linguagem prática e direta
- Cada ação do checklist deve ser concreta e implementável em 30 dias
- ${focusGuidance}`;

    const userPrompt = `CONTEXTO DA EMPRESA:
- Nome do gestor: ${firstName}
- Segmento: ${segment}
- Porte: ${companySize}
- Pontuação geral: ${score}%

PONTUAÇÃO POR PILAR:
${pillarScoresText}

TAREFA:
Gere um diagnóstico personalizado com:

1. "summary": objeto com dois campos:
   - "paragraph1": Diagnóstico atual da empresa (máx 60 palavras). Mencione o nome ${firstName}. Destaque pontos fortes e fracos baseado nos pilares.
   - "paragraph2": Oportunidades de melhoria específicas para o segmento ${segment} (máx 60 palavras).

2. "checklist": objeto com 5 arrays (um por pilar), cada um com 2 ações práticas:
   - "Processos": 2 ações específicas para ${segment}
   - "Pessoas": 2 ações específicas  
   - "Clientes": 2 ações específicas
   - "Controle": 2 ações específicas
   - "Crescimento": 2 ações específicas

Responda APENAS com o JSON, nada mais.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received:", JSON.stringify(aiResponse).substring(0, 500));
    
    const content = aiResponse.choices?.[0]?.message?.content;
    const finishReason = aiResponse.choices?.[0]?.finish_reason;

    if (!content) {
      console.error("No content in AI response. Finish reason:", finishReason);
      console.error("Full response:", JSON.stringify(aiResponse));
      throw new Error("No content in AI response");
    }

    // Parse the JSON from AI response
    let diagnosis: DiagnosisResponse;
    try {
      // Remove any markdown code blocks if present
      let cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      
      // Fix trailing commas in JSON (common AI mistake)
      cleanContent = cleanContent.replace(/,(\s*[}\]])/g, "$1");
      
      diagnosis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-diagnosis:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        fallback: true 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
