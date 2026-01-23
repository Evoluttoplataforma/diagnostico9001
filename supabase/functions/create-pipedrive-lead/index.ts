import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PillarScore {
  name: string;
  score: number;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  company_size: string;
  score: number;
  diagnosis_level: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  answers: Record<string, string>;
  pillar_scores: PillarScore[];
}

// Question mapping for readable answers
const questionTexts: Record<string, string> = {
  q1: "As atividades principais seguem sempre o mesmo passo a passo?",
  q2: "Se alguém sair, outra pessoa consegue assumir sem caos?",
  q3: "Os processos estão documentados?",
  q4: "Você vive apagando incêndios no dia a dia?",
  q5: "Cada colaborador sabe exatamente o que é sua responsabilidade?",
  q6: "Seu time consegue resolver problemas sem precisar de você?",
  q7: "Você consegue tirar férias sem que a empresa pare?",
  q8: "O treinamento de novos colaboradores é estruturado?",
  q9: "Você mede a satisfação dos clientes?",
  q10: "Já perdeu clientes por falhas internas?",
  q11: "Suas vendas são previsíveis mês a mês?",
  q12: "Você sabe qual o ciclo de vida médio dos seus clientes?",
  q13: "Você acompanha indicadores (vendas, prazos, qualidade)?",
  q14: "As decisões são baseadas em dados?",
  q15: "Você sabe exatamente para onde vai cada real da empresa?",
  q16: "Você tem relatórios financeiros atualizados mensalmente?",
  q17: "Sua estrutura atual aguenta dobrar de tamanho?",
  q18: "Você tem um plano claro de crescimento para os próximos 12 meses?",
  q19: "Você conseguiria contratar 5 pessoas amanhã sem gerar caos?",
  q20: "A empresa tem capital ou crédito disponível para investir em crescimento?",
};

const answerLabels: Record<string, Record<string, string>> = {
  q1: { positive: "Sim, temos processos padronizados", neutral: "Depende de quem está fazendo", negative: "Cada um faz do seu jeito" },
  q2: { positive: "Sim, o conhecimento está documentado", neutral: "Com dificuldade, leva tempo", negative: "Vira um caos quando alguém sai" },
  q3: { positive: "Sim, temos documentação atualizada", neutral: "Alguns estão, outros não", negative: "Só na cabeça das pessoas" },
  q4: { negative: "Sim, é o modo padrão aqui", neutral: "Às vezes, mas não sempre", positive: "Não, temos rotina organizada" },
  q5: { positive: "Sim, funções bem definidas", neutral: "Mais ou menos, há confusão", negative: "Não, todo mundo faz de tudo" },
  q6: { positive: "Sim, têm autonomia para decidir", neutral: "Às vezes, mas me consultam muito", negative: "Não, tudo passa por mim" },
  q7: { positive: "Sim, a operação continua normal", neutral: "Funciona, mas com dificuldades", negative: "Não, preciso estar presente sempre" },
  q8: { positive: "Sim, temos programa de integração", neutral: "É informal, vai aprendendo", negative: "Não, é no improviso total" },
  q9: { positive: "Sim, pesquisamos regularmente", neutral: "Às vezes perguntamos", negative: "Só reagimos quando reclamam" },
  q10: { negative: "Sim, já perdemos vários", neutral: "Aconteceu algumas vezes", positive: "Não, retemos bem nossos clientes" },
  q11: { positive: "Sim, temos previsibilidade", neutral: "Varia bastante, difícil prever", negative: "É uma montanha-russa" },
  q12: { positive: "Sim, acompanhamos esse dado", neutral: "Tenho uma ideia, mas não preciso", negative: "Não, nunca medi isso" },
  q13: { positive: "Sim, acompanhamos regularmente", neutral: "Às vezes, quando dá tempo", negative: "Não medimos indicadores" },
  q14: { positive: "Sim, usamos dados para decidir", neutral: "Misturamos dados e intuição", negative: "Decidimos no feeling" },
  q15: { positive: "Sim, controle financeiro detalhado", neutral: "Tenho uma visão geral apenas", negative: "Não, as finanças são confusas" },
  q16: { positive: "Sim, DRE e fluxo de caixa em dia", neutral: "Às vezes, quando dá tempo", negative: "Não, só olho o saldo bancário" },
  q17: { positive: "Sim, estamos preparados", neutral: "Talvez, com alguns ajustes", negative: "Não, já estamos no limite" },
  q18: { positive: "Sim, com metas e ações definidas", neutral: "Tenho ideias, mas nada formalizado", negative: "Não, vou levando conforme dá" },
  q19: { positive: "Sim, temos estrutura para isso", neutral: "Seria difícil, mas daria", negative: "Não, seria um caos total" },
  q20: { positive: "Sim, temos reservas ou acesso a crédito", neutral: "Pouco, precisaria buscar", negative: "Não, estamos apertados" },
};

const pillarQuestions: Record<string, string[]> = {
  "Processos": ["q1", "q2", "q3", "q4"],
  "Pessoas": ["q5", "q6", "q7", "q8"],
  "Clientes": ["q9", "q10", "q11", "q12"],
  "Controle": ["q13", "q14", "q15", "q16"],
  "Crescimento": ["q17", "q18", "q19", "q20"],
};

function getSalesGuidance(score: number, diagnosisLevel: string, pillarScores: PillarScore[], answers: Record<string, string>): string {
  // Find weakest pillars
  const sortedPillars = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakestPillars = sortedPillars.slice(0, 2);
  const strongestPillar = sortedPillars[sortedPillars.length - 1];

  // Identify critical pain points based on negative answers
  const painPoints: string[] = [];
  Object.entries(answers).forEach(([qId, answer]) => {
    if (answer === "negative") {
      const question = questionTexts[qId];
      if (question) {
        painPoints.push(`❌ ${question}`);
      }
    }
  });

  let urgencyLevel = "";
  let openingStrategy = "";
  let keyArguments = "";
  let objectionHandling = "";
  let closingTips = "";

  if (score <= 30) {
    urgencyLevel = "🔴 URGÊNCIA ALTA - Lead com dor intensa";
    openingStrategy = `
📞 **Abertura sugerida:**
"Olá ${leadData.name?.split(" ")[0] || ""}! Vi que você fez nosso diagnóstico e identifiquei que sua empresa está em um momento crítico de organização. Imagino que você deve estar sentindo que vive apagando incêndios o dia todo, certo?"

💡 **Gatilho mental:** Este lead está sofrendo - use EMPATIA e mostre que você entende a dor dele.`;
    
    keyArguments = `
🎯 **Argumentos-chave para usar:**
1. "Empresas nesse estágio perdem em média 20-30% do faturamento por retrabalho e desorganização"
2. "Você está no estágio onde cada problema vira uma crise - e isso esgota você como líder"
3. "A boa notícia: com 90 dias de trabalho focado, você pode sair do caos para uma operação previsível"
4. "Não precisa de uma mudança radical - começamos pelo que mais dói hoje"`;

    objectionHandling = `
🛡️ **Objeções comuns e respostas:**
- "Não tenho tempo" → "Justamente porque você não tem tempo que precisa de processos. Hoje você É o processo."
- "Não tenho dinheiro" → "Quanto você perde por mês com retrabalho, erros e clientes insatisfeitos? Esse é o custo de não resolver."
- "Preciso pensar" → "Entendo. Mas me diz: há quanto tempo você está pensando em resolver isso?"`;

    closingTips = `
🎯 **Para fechar:**
- Ofereça uma reunião de diagnóstico GRATUITA e presencial se possível
- Mostre casos de empresas similares que saíram do caos
- Crie senso de urgência: "Cada mês que passa, o problema cresce"`;

  } else if (score <= 65) {
    urgencyLevel = "🟡 URGÊNCIA MÉDIA - Lead quer crescer mas está travado";
    openingStrategy = `
📞 **Abertura sugerida:**
"Olá ${leadData.name?.split(" ")[0] || ""}! Vi seu diagnóstico e percebi que sua empresa já funciona bem, mas você sente que poderia estar crescendo mais rápido se tivesse mais organização, certo?"

💡 **Gatilho mental:** Este lead tem ambição - use ASPIRAÇÃO e mostre o potencial não realizado.`;

    keyArguments = `
🎯 **Argumentos-chave para usar:**
1. "Sua empresa tem potencial, mas está vazando eficiência por falta de padronização"
2. "Você provavelmente já tentou organizar sozinho, mas sem método, volta ao caos"
3. "Empresas no seu estágio que se organizam crescem 40% mais rápido no ano seguinte"
4. "A certificação ISO 9001 pode ser um diferencial competitivo para ganhar contratos maiores"`;

    objectionHandling = `
🛡️ **Objeções comuns e respostas:**
- "Já funciona razoável" → "Funcionar não é o mesmo que performar. Quanto você está deixando na mesa?"
- "ISO é burocracia" → "ISO moderna é sobre resultado, não papel. Vou te mostrar como fazemos diferente."
- "Minha equipe não vai aderir" → "A resistência inicial é normal. O segredo é mostrar os benefícios para eles, não só para a empresa."`;

    closingTips = `
🎯 **Para fechar:**
- Mostre o ROI: quanto vai ganhar vs quanto vai investir
- Apresente o roadmap: "Em 6 meses você estará aqui"
- Use prova social: empresas do mesmo segmento que já passaram por isso`;

  } else {
    urgencyLevel = "🟢 LEAD QUALIFICADO - Pronto para escalar";
    openingStrategy = `
📞 **Abertura sugerida:**
"Olá ${leadData.name?.split(" ")[0] || ""}! Parabéns pelo resultado do diagnóstico! Sua empresa está acima da média e pronta para dar o próximo passo. Você já pensou em certificação ISO 9001 ou expansão de mercado?"

💡 **Gatilho mental:** Este lead é maduro - use PARCERIA e posicione-se como especialista.`;

    keyArguments = `
🎯 **Argumentos-chave para usar:**
1. "Sua base está sólida - agora é hora de colher os frutos com uma certificação"
2. "ISO 9001 abre portas para licitações, multinacionais e exportação"
3. "Empresas certificadas têm valuation 15-20% maior em processos de venda ou investimento"
4. "Você já fez o mais difícil - agora é só formalizar o que já funciona"`;

    objectionHandling = `
🛡️ **Objeções comuns e respostas:**
- "Já estou bem" → "Exatamente por isso é o momento ideal. Certificar quando já funciona é muito mais fácil."
- "ISO é cara" → "O investimento se paga em 6-12 meses com os novos contratos que você vai conseguir."
- "Não sei se preciso" → "Você não precisa. Mas seus concorrentes que têm ISO estão pegando os clientes que exigem."`;

    closingTips = `
🎯 **Para fechar:**
- Seja direto: "Vamos agendar uma apresentação do processo de certificação?"
- Ofereça um pré-diagnóstico para ISO gratuito
- Mencione prazos: "Em 8-12 meses você pode estar certificado"`;
  }

  // Build pillar-specific insights
  let pillarInsights = "\n\n📊 **ANÁLISE POR PILAR:**\n";
  pillarScores.forEach((pillar) => {
    const emoji = pillar.score >= 75 ? "✅" : pillar.score >= 50 ? "⚠️" : "❌";
    pillarInsights += `${emoji} **${pillar.name}:** ${pillar.score}%\n`;
  });

  pillarInsights += `\n🎯 **Foco da conversa:** Concentre-se em **${weakestPillars[0]?.name}** e **${weakestPillars[1]?.name}** - são os pontos de maior dor.`;
  pillarInsights += `\n💪 **Ponto forte para elogiar:** ${strongestPillar?.name} (${strongestPillar?.score}%) - reconheça esse mérito para criar rapport.`;

  // Build pain points section
  let painPointsSection = "";
  if (painPoints.length > 0) {
    painPointsSection = `\n\n🔥 **PONTOS DE DOR IDENTIFICADOS (respostas negativas):**\n${painPoints.slice(0, 5).join("\n")}`;
    if (painPoints.length > 5) {
      painPointsSection += `\n... e mais ${painPoints.length - 5} pontos críticos`;
    }
  }

  return `
═══════════════════════════════════════════
🎯 ORIENTAÇÃO DE VENDAS - LEIA ANTES DE LIGAR
═══════════════════════════════════════════

${urgencyLevel}

📈 **Score geral:** ${score}/100
🏷️ **Nível:** ${diagnosisLevel}
${pillarInsights}
${painPointsSection}

═══════════════════════════════════════════
📞 ESTRATÉGIA DE ABORDAGEM
═══════════════════════════════════════════
${openingStrategy}

${keyArguments}

${objectionHandling}

${closingTips}

═══════════════════════════════════════════
⚡ DICA FINAL
═══════════════════════════════════════════
Ligue em até 5 minutos após o lead completar o diagnóstico. 
A taxa de conversão cai 80% após 30 minutos.
O lead está "quente" agora - não deixe esfriar!
`.trim();
}

// Declare leadData at module level for use in getSalesGuidance
let leadData: LeadData;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PIPEDRIVE_API_TOKEN");
    if (!apiToken) {
      throw new Error("PIPEDRIVE_API_TOKEN not configured");
    }

    leadData = await req.json();
    console.log("Received lead data:", leadData);

    // Get pipelines to find "Inbound"
    const pipelinesResponse = await fetch(
      `https://api.pipedrive.com/v1/pipelines?api_token=${apiToken}`
    );
    const pipelinesResult = await pipelinesResponse.json();
    console.log("Pipelines:", pipelinesResult);

    let pipelineId = null;
    let firstStageId = null;

    if (pipelinesResult.success && pipelinesResult.data) {
      const inboundPipeline = pipelinesResult.data.find(
        (p: { name: string }) => p.name.toLowerCase().includes("inbound")
      );
      if (inboundPipeline) {
        pipelineId = inboundPipeline.id;
        console.log("Found Inbound pipeline:", pipelineId);

        // Get stages for this pipeline
        const stagesResponse = await fetch(
          `https://api.pipedrive.com/v1/stages?pipeline_id=${pipelineId}&api_token=${apiToken}`
        );
        const stagesResult = await stagesResponse.json();
        if (stagesResult.success && stagesResult.data && stagesResult.data.length > 0) {
          firstStageId = stagesResult.data[0].id;
          console.log("First stage ID:", firstStageId);
        }
      }
    }

    // First, create a person in Pipedrive
    const personResponse = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadData.name,
          email: [{ value: leadData.email, primary: true }],
          phone: [{ value: leadData.phone, primary: true }],
        }),
      }
    );

    const personResult = await personResponse.json();
    console.log("Person creation result:", personResult);

    if (!personResult.success) {
      throw new Error(`Failed to create person: ${JSON.stringify(personResult)}`);
    }

    const personId = personResult.data.id;

    // Create an organization
    const orgResponse = await fetch(
      `https://api.pipedrive.com/v1/organizations?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadData.company,
        }),
      }
    );

    const orgResult = await orgResponse.json();
    console.log("Organization creation result:", orgResult);

    let orgId = null;
    if (orgResult.success) {
      orgId = orgResult.data.id;

      // Update person with organization
      await fetch(
        `https://api.pipedrive.com/v1/persons/${personId}?api_token=${apiToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            org_id: orgId,
          }),
        }
      );
    }

    // Get deal labels to find "DIAGNÓSTICO"
    const dealFieldsResponse = await fetch(
      `https://api.pipedrive.com/v1/dealFields?api_token=${apiToken}`
    );
    const dealFieldsResult = await dealFieldsResponse.json();
    
    let labelId = null;
    if (dealFieldsResult.success && dealFieldsResult.data) {
      const labelField = dealFieldsResult.data.find(
        (f: { key: string }) => f.key === "label"
      );
      if (labelField && labelField.options) {
        const diagnosticoLabel = labelField.options.find(
          (opt: { label: string }) => opt.label.toUpperCase().includes("DIAGNÓSTICO") || opt.label.toUpperCase().includes("DIAGNOSTICO")
        );
        if (diagnosticoLabel) {
          labelId = diagnosticoLabel.id;
          console.log("Found DIAGNÓSTICO label:", labelId);
        }
      }
    }

    // Create a deal in Pipedrive (in Inbound pipeline with DIAGNÓSTICO label)
    const dealTitle = `Diagnóstico ISO 9001 - ${leadData.name} (${leadData.company})`;
    
    const dealBody: Record<string, unknown> = {
      title: dealTitle,
      person_id: personId,
      org_id: orgId,
    };

    if (pipelineId) {
      dealBody.pipeline_id = pipelineId;
    }
    if (firstStageId) {
      dealBody.stage_id = firstStageId;
    }
    if (labelId) {
      dealBody.label = labelId;
    }

    const dealResponse = await fetch(
      `https://api.pipedrive.com/v1/deals?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealBody),
      }
    );

    const dealResult = await dealResponse.json();
    console.log("Deal creation result:", dealResult);

    if (!dealResult.success) {
      throw new Error(`Failed to create deal: ${JSON.stringify(dealResult)}`);
    }

    // Build UTM section only if any UTM param exists
    const hasUtm = leadData.utm_source || leadData.utm_medium || leadData.utm_campaign || leadData.utm_content || leadData.utm_term;
    const utmSection = hasUtm ? `

🎯 **Origem (UTM)**
${leadData.utm_source ? `- Source: ${leadData.utm_source}` : ""}
${leadData.utm_medium ? `- Medium: ${leadData.utm_medium}` : ""}
${leadData.utm_campaign ? `- Campaign: ${leadData.utm_campaign}` : ""}
${leadData.utm_content ? `- Content: ${leadData.utm_content}` : ""}
${leadData.utm_term ? `- Term: ${leadData.utm_term}` : ""}`.replace(/\n+/g, '\n').trim() : "";

    // Build answers section
    let answersSection = "\n\n📋 **RESPOSTAS DO DIAGNÓSTICO:**\n";
    const pillars = ["Processos", "Pessoas", "Clientes", "Controle", "Crescimento"];
    
    pillars.forEach((pillar) => {
      answersSection += `\n**${pillar}:**\n`;
      const questions = pillarQuestions[pillar];
      questions.forEach((qId) => {
        const answer = leadData.answers?.[qId];
        const questionText = questionTexts[qId];
        const answerText = answer ? answerLabels[qId]?.[answer] || answer : "Não respondeu";
        const emoji = answer === "positive" ? "✅" : answer === "neutral" ? "⚠️" : "❌";
        answersSection += `${emoji} ${questionText}\n   → ${answerText}\n`;
      });
    });

    // Build pillar scores section
    let pillarScoresSection = "\n\n📊 **PONTUAÇÃO POR PILAR:**\n";
    if (leadData.pillar_scores && leadData.pillar_scores.length > 0) {
      leadData.pillar_scores.forEach((pillar) => {
        const emoji = pillar.score >= 75 ? "🟢" : pillar.score >= 50 ? "🟡" : "🔴";
        pillarScoresSection += `${emoji} ${pillar.name}: ${pillar.score}%\n`;
      });
    }

    // Get sales guidance
    const salesGuidance = getSalesGuidance(
      leadData.score,
      leadData.diagnosis_level,
      leadData.pillar_scores || [],
      leadData.answers || {}
    );

    // Add a note to the deal with diagnosis details
    const dealNote = `
📊 **Diagnóstico de Maturidade Empresarial**

👤 **Contato:** ${leadData.name}
🏢 **Empresa:** ${leadData.company}
🏭 **Segmento:** ${leadData.segment || "Não informado"}
👥 **Porte:** ${leadData.company_size || "Não informado"}
📧 **Email:** ${leadData.email}
📱 **Telefone:** ${leadData.phone}

📈 **Score:** ${leadData.score}/100
🏷️ **Nível:** ${leadData.diagnosis_level}
${pillarScoresSection}
${utmSection}
${answersSection}
    `.trim();

    const noteResponse = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: dealNote,
          deal_id: dealResult.data.id,
        }),
      }
    );

    const noteResult = await noteResponse.json();
    console.log("Note creation result:", noteResult);

    // Add a second note with sales guidance
    const salesNoteResponse = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: salesGuidance,
          deal_id: dealResult.data.id,
        }),
      }
    );

    const salesNoteResult = await salesNoteResponse.json();
    console.log("Sales guidance note creation result:", salesNoteResult);

    return new Response(
      JSON.stringify({
        success: true,
        deal_id: dealResult.data.id,
        person_id: personId,
        org_id: orgId,
        pipeline_id: pipelineId,
        label_id: labelId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Pipedrive deal:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
