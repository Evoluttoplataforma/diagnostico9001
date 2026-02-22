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

async function callAI(systemPrompt: string, userPrompt: string, apiKey: string): Promise<any> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    if (response.status === 429) {
      throw { status: 429, message: "Rate limit exceeded. Please try again later." };
    }
    if (response.status === 402) {
      throw { status: 402, message: "Payment required." };
    }
    throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content;
  const finishReason = aiResponse.choices?.[0]?.finish_reason;

  console.log("AI finish_reason:", finishReason, "content length:", content?.length ?? 0);

  if (!content) {
    throw new Error(`No content in AI response. finish_reason: ${finishReason}`);
  }

  return content;
}

function parseQuestionsJSON(content: string): any {
  // Try to extract JSON from markdown code blocks first
  const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  let cleanContent = codeBlockMatch ? codeBlockMatch[1].trim() : content.trim();

  // Remove trailing commas before } or ]
  cleanContent = cleanContent.replace(/,(\s*[}\]])/g, "$1");

  const parsed = JSON.parse(cleanContent);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Response missing 'questions' array");
  }

  if (parsed.questions.length !== 20) {
    console.warn(`Expected 20 questions, got ${parsed.questions.length}`);
    // Accept if we got at least 15 questions (close enough)
    if (parsed.questions.length < 15) {
      throw new Error(`Only ${parsed.questions.length} questions generated, need at least 15`);
    }
  }

  // Validate each question has required fields
  for (const q of parsed.questions) {
    if (!q.id || !q.text || !q.answers || !Array.isArray(q.answers)) {
      throw new Error(`Invalid question structure: missing id, text, or answers`);
    }
  }

  return parsed;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { segment, companySize, revenue, jobTitle } = await req.json() as GenerateQuestionsRequest;

    console.log("Generating questions for:", { segment: segment?.substring(0, 30), companySize, revenue, jobTitle: jobTitle?.substring(0, 20) });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const hasSegment = segment && segment.trim().length > 0;

    const systemPrompt = `Você é um consultor especialista em ISO 9001 e gestão empresarial.
Sua tarefa é gerar 20 perguntas de diagnóstico empresarial ULTRA PERSONALIZADAS.

REGRAS CRÍTICAS:
- Responda APENAS com JSON válido, sem markdown, sem texto adicional
- Cada pergunta deve ter exatamente 5 opções de resposta numa escala de maturidade (1=pior, 5=melhor)
${hasSegment
  ? `- As perguntas devem ser específicas para o segmento, porte e realidade do cargo informado
- Use linguagem direta, prática, que o gestor se identifique
- As opções devem refletir níveis reais de maturidade, do caos total à excelência
- NÃO use perguntas genéricas — cada pergunta deve mencionar situações reais do segmento`
  : `- Como o segmento NÃO foi identificado, gere perguntas GERAIS sobre gestão da qualidade e ISO 9001
- As perguntas devem ser aplicáveis a qualquer tipo de empresa
- Foque em boas práticas universais de gestão: processos, pessoas, clientes, controle e crescimento
- Use linguagem direta e prática, adaptada ao porte da empresa informado
- As opções devem refletir níveis reais de maturidade, do caos total à excelência`}`;

    const segmentLabel = hasSegment ? segment : "Não identificado (usar perguntas gerais de gestão/ISO 9001)";

    const userPrompt = `DADOS DO LEAD:
- Cargo: ${jobTitle}
- Segmento: ${segmentLabel}
- Número de funcionários: ${companySize}
- Faturamento mensal: ${revenue}

CONTEXTO: Este lead chegou por um criativo oferecendo ISO 9001. As perguntas devem avaliar a maturidade de gestão da empresa nos 5 pilares abaixo.
${!hasSegment ? "\nIMPORTANTE: O segmento NÃO foi identificado. Gere perguntas GERAIS sobre gestão da qualidade e ISO 9001, aplicáveis a qualquer empresa. NÃO mencione um segmento específico nas perguntas.\n" : ""}
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
1. Processos (q1-q4): Padronização, documentação, fluxos operacionais${hasSegment ? ` específicos de ${segment}` : " gerais"}
2. Pessoas (q5-q8): Estrutura de equipe, autonomia, treinamento — considerando porte de ${companySize} funcionários
3. Clientes (q9-q12): Satisfação, retenção, previsibilidade comercial${hasSegment ? ` no segmento ${segment}` : ""}
4. Controle (q13-q16): Indicadores, gestão financeira, dados — adequado ao faturamento de ${revenue}
5. Crescimento (q17-q20): Escalabilidade, planejamento estratégico, capacidade de investimento

IMPORTANTE:
- Perguntas q1-q4 DEVEM ter block=1 e blockTitle="Processos"
- Perguntas q5-q8 DEVEM ter block=2 e blockTitle="Pessoas"
- Perguntas q9-q12 DEVEM ter block=3 e blockTitle="Clientes"
- Perguntas q13-q16 DEVEM ter block=4 e blockTitle="Controle"
- Perguntas q17-q20 DEVEM ter block=5 e blockTitle="Crescimento"
- Cada answer DEVE ter value de 1 a 5 (inteiro)
- Labels devem ser curtos (máx 8 palavras)${hasSegment ? ` e específicos para ${segment}` : ""}

Responda APENAS com o JSON.`;

    // Retry logic: up to 3 attempts
    const MAX_RETRIES = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${MAX_RETRIES}`);
        const content = await callAI(systemPrompt, userPrompt, LOVABLE_API_KEY);
        const parsed = parseQuestionsJSON(content);

        console.log(`Success on attempt ${attempt}: ${parsed.questions.length} questions generated`);

        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        lastError = err;
        console.error(`Attempt ${attempt} failed:`, err.message || err);

        // Don't retry on rate limit or payment errors
        if (err.status === 429 || err.status === 402) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: err.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Wait before retrying (exponential backoff)
        if (attempt < MAX_RETRIES) {
          const waitMs = attempt * 2000;
          console.log(`Waiting ${waitMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
      }
    }

    // All retries failed
    console.error("All retries exhausted. Last error:", lastError);
    return new Response(
      JSON.stringify({
        error: lastError instanceof Error ? lastError.message : "Failed to generate questions after multiple attempts",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
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
