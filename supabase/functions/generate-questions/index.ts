import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateQuestionsRequest {
  segment: string;
  companySize: string;
  revenue: string;
  jobTitle: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { segment, companySize, revenue, jobTitle } = await req.json() as GenerateQuestionsRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um consultor especialista em ISO 9001 e gestão empresarial.
Sua tarefa é gerar 20 perguntas de diagnóstico empresarial ULTRA PERSONALIZADAS.

REGRAS CRÍTICAS:
- Responda APENAS com JSON válido, sem markdown, sem texto adicional
- Cada pergunta deve ter exatamente 5 opções de resposta numa escala de maturidade (1=pior, 5=melhor)
- As perguntas devem ser específicas para o segmento, porte e realidade do cargo informado
- Use linguagem direta, prática, que o gestor se identifique
- As opções devem refletir níveis reais de maturidade, do caos total à excelência
- NÃO use perguntas genéricas — cada pergunta deve mencionar situações reais do segmento`;

    const userPrompt = `DADOS DO LEAD:
- Cargo: ${jobTitle}
- Segmento: ${segment}
- Número de funcionários: ${companySize}
- Faturamento mensal: ${revenue}

CONTEXTO: Este lead chegou por um criativo oferecendo ISO 9001. As perguntas devem avaliar a maturidade de gestão da empresa nos 5 pilares abaixo.

GERE 20 perguntas (4 por pilar) no seguinte formato JSON:

{
  "questions": [
    {
      "id": "q1",
      "block": 1,
      "blockTitle": "Processos",
      "text": "pergunta personalizada aqui",
      "answers": [
        { "value": 1, "label": "texto nível 1 - caótico" },
        { "value": 2, "label": "texto nível 2 - informal" },
        { "value": 3, "label": "texto nível 3 - parcial" },
        { "value": 4, "label": "texto nível 4 - estruturado" },
        { "value": 5, "label": "texto nível 5 - excelência" }
      ]
    }
  ]
}

PILARES (4 perguntas cada):
1. Processos (q1-q4): Padronização, documentação, fluxos operacionais específicos de ${segment}
2. Pessoas (q5-q8): Estrutura de equipe, autonomia, treinamento — considerando porte de ${companySize} funcionários
3. Clientes (q9-q12): Satisfação, retenção, previsibilidade comercial no segmento ${segment}
4. Controle (q13-q16): Indicadores, gestão financeira, dados — adequado ao faturamento de ${revenue}
5. Crescimento (q17-q20): Escalabilidade, planejamento estratégico, capacidade de investimento

IMPORTANTE:
- Perguntas q1-q4 DEVEM ter block=1 e blockTitle="Processos"
- Perguntas q5-q8 DEVEM ter block=2 e blockTitle="Pessoas"
- Perguntas q9-q12 DEVEM ter block=3 e blockTitle="Clientes"
- Perguntas q13-q16 DEVEM ter block=4 e blockTitle="Controle"
- Perguntas q17-q20 DEVEM ter block=5 e blockTitle="Crescimento"
- Cada answer DEVE ter value de 1 a 5 (inteiro)
- Labels devem ser curtos (máx 8 palavras) e específicos para ${segment}

Responda APENAS com o JSON.`;

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
        max_tokens: 4096,
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
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      throw new Error("No content in AI response");
    }

    // Parse JSON from AI response
    let parsed;
    try {
      let cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      cleanContent = cleanContent.replace(/,(\s*[}\]])/g, "$1");
      parsed = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length !== 20) {
      console.error("Invalid question count:", parsed.questions?.length);
      throw new Error("AI did not generate exactly 20 questions");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-questions:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
