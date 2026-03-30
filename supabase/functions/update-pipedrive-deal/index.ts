import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DynamicAnswer {
  value: number;
  label: string;
}

interface DynamicQuestion {
  id: string;
  block: number;
  blockTitle: string;
  text: string;
  answers: DynamicAnswer[];
}

interface PillarScore {
  name: string;
  score: number;
}

interface UpdateData {
  deal_id: number;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  company: string;
  segment: string;
  company_size: string;
  revenue: string;
  score: number;
  diagnosis_level: string;
  answers: Record<string, number>;
  pillar_scores: PillarScore[];
  questions?: DynamicQuestion[];
}

// Revenue range labels for display
const revenueLabels: Record<string, string> = {
  "abaixo_100k": "Abaixo de R$ 100 mil/mês",
  "acima_100k": "Acima de R$ 100 mil/mês",
};

// Fallback question texts (used only if dynamic questions not provided)
const fallbackQuestionTexts: Record<string, string> = {
  q1: "Processos - Pergunta 1",
  q2: "Processos - Pergunta 2",
  q3: "Processos - Pergunta 3",
  q4: "Processos - Pergunta 4",
  q5: "Pessoas - Pergunta 5",
  q6: "Pessoas - Pergunta 6",
  q7: "Pessoas - Pergunta 7",
  q8: "Pessoas - Pergunta 8",
  q9: "Clientes - Pergunta 9",
  q10: "Clientes - Pergunta 10",
  q11: "Clientes - Pergunta 11",
  q12: "Clientes - Pergunta 12",
  q13: "Controle - Pergunta 13",
  q14: "Controle - Pergunta 14",
  q15: "Controle - Pergunta 15",
  q16: "Controle - Pergunta 16",
  q17: "Crescimento - Pergunta 17",
  q18: "Crescimento - Pergunta 18",
  q19: "Crescimento - Pergunta 19",
  q20: "Crescimento - Pergunta 20",
};

const pillarQuestions: Record<string, string[]> = {
  "Processos": ["q1", "q2", "q3", "q4"],
  "Pessoas": ["q5", "q6", "q7", "q8"],
  "Clientes": ["q9", "q10", "q11", "q12"],
  "Controle": ["q13", "q14", "q15", "q16"],
  "Crescimento": ["q17", "q18", "q19", "q20"],
};

function getSalesGuidance(score: number, diagnosisLevel: string, pillarScores: PillarScore[], answers: Record<string, number>, leadName: string, questions?: DynamicQuestion[]): string {
  const sortedPillars = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakestPillars = sortedPillars.slice(0, 2);
  const strongestPillar = sortedPillars[sortedPillars.length - 1];

  // Build question lookup from dynamic questions
  const questionMap: Record<string, DynamicQuestion> = {};
  if (questions) {
    questions.forEach((q) => { questionMap[q.id] = q; });
  }

  const painPoints: string[] = [];
  Object.entries(answers).forEach(([qId, answerValue]) => {
    if (typeof answerValue === 'number' && answerValue <= 2) {
      const q = questionMap[qId];
      const questionText = q?.text || fallbackQuestionTexts[qId] || qId;
      const answerLabel = q?.answers?.find((a) => a.value === answerValue)?.label || `Nota ${answerValue}/5`;
      painPoints.push(`❌ ${questionText}\n   → ${answerLabel}`);
    }
  });

  let urgencyLevel = "";
  let openingStrategy = "";
  let keyArguments = "";
  let objectionHandling = "";
  let closingTips = "";
  const firstName = leadName?.split(" ")[0] || "";

  if (score <= 30) {
    urgencyLevel = "🔴 URGÊNCIA ALTA - Lead com dor intensa";
    openingStrategy = `📞 **Abertura sugerida:**
"Olá ${firstName}! Vi que você fez nosso diagnóstico e identifiquei que sua empresa está em um momento crítico de organização."

💡 **Gatilho mental:** Este lead está sofrendo - use EMPATIA.`;
    keyArguments = `🎯 **Argumentos-chave:**
1. "Empresas nesse estágio perdem 20-30% do faturamento por retrabalho"
2. "Você está no estágio onde cada problema vira crise"
3. "Com 90 dias focados, você sai do caos para operação previsível"`;
    objectionHandling = `🛡️ **Objeções:**
- "Não tenho tempo" → "Justamente por isso precisa de processos"
- "Não tenho dinheiro" → "Quanto perde por mês com retrabalho?"`;
    closingTips = `🎯 **Para fechar:** Reunião gratuita + casos similares`;
  } else if (score <= 65) {
    urgencyLevel = "🟡 URGÊNCIA MÉDIA - Lead quer crescer mas está travado";
    openingStrategy = `📞 **Abertura sugerida:**
"Olá ${firstName}! Vi seu diagnóstico e percebi que sua empresa já funciona bem, mas poderia crescer mais rápido."

💡 **Gatilho mental:** Use ASPIRAÇÃO.`;
    keyArguments = `🎯 **Argumentos-chave:**
1. "Sua empresa tem potencial vazando eficiência"
2. "Empresas que se organizam crescem 40% mais rápido"
3. "A ISO 9001 pode ser diferencial competitivo"`;
    objectionHandling = `🛡️ **Objeções:**
- "Já funciona razoável" → "Funcionar não é performar"
- "ISO é burocracia" → "ISO moderna é sobre resultado"`;
    closingTips = `🎯 **Para fechar:** Mostre ROI + roadmap de 6 meses`;
  } else {
    urgencyLevel = "🟢 LEAD QUALIFICADO - Pronto para escalar";
    openingStrategy = `📞 **Abertura sugerida:**
"Olá ${firstName}! Parabéns pelo resultado! Sua empresa está pronta para certificação ISO 9001."

💡 **Gatilho mental:** Use PARCERIA.`;
    keyArguments = `🎯 **Argumentos-chave:**
1. "Sua base está sólida - hora de colher frutos"
2. "ISO abre portas para licitações e multinacionais"
3. "Empresas certificadas têm valuation 15-20% maior"`;
    objectionHandling = `🛡️ **Objeções:**
- "Já estou bem" → "Por isso é o momento ideal"
- "ISO é cara" → "Investimento se paga em 6-12 meses"`;
    closingTips = `🎯 **Para fechar:** Seja direto + pré-diagnóstico ISO gratuito`;
  }

  let pillarInsights = "\n📊 **ANÁLISE POR PILAR:**\n";
  pillarScores.forEach((pillar) => {
    const emoji = pillar.score >= 75 ? "✅" : pillar.score >= 50 ? "⚠️" : "❌";
    pillarInsights += `${emoji} **${pillar.name}:** ${pillar.score}%\n`;
  });
  pillarInsights += `\n🎯 **Foco:** ${weakestPillars[0]?.name} e ${weakestPillars[1]?.name}`;
  pillarInsights += `\n💪 **Elogiar:** ${strongestPillar?.name} (${strongestPillar?.score}%)`;

  let painPointsSection = "";
  if (painPoints.length > 0) {
    painPointsSection = `\n🔥 **PONTOS DE DOR:**\n${painPoints.slice(0, 5).join("\n")}`;
  }

  return `
═══════════════════════════════════════════
🎯 ORIENTAÇÃO DE VENDAS (ATUALIZAÇÃO VIA LINK)
═══════════════════════════════════════════

${urgencyLevel}

📈 **Score:** ${score}/100 | 🏷️ **Nível:** ${diagnosisLevel}
${pillarInsights}
${painPointsSection}

═══════════════════════════════════════════
📞 ESTRATÉGIA
═══════════════════════════════════════════
${openingStrategy}

${keyArguments}

${objectionHandling}

${closingTips}
`.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PIPEDRIVE_API_TOKEN");
    if (!apiToken) {
      throw new Error("PIPEDRIVE_API_TOKEN not configured");
    }

    const updateData: UpdateData = await req.json();
    console.log("Updating deal:", updateData.deal_id);

    // Get deal to find person and org IDs
    const dealResponse = await fetch(
      `https://api.pipedrive.com/v1/deals/${updateData.deal_id}?api_token=${apiToken}`
    );
    const dealResult = await dealResponse.json();

    if (!dealResult.success) {
      throw new Error(`Deal not found: ${updateData.deal_id}`);
    }

    const deal = dealResult.data;
    const personId = typeof deal.person_id === 'object' ? deal.person_id.value : deal.person_id;
    const orgId = typeof deal.org_id === 'object' ? deal.org_id.value : deal.org_id;
    const wasLost = deal.status === 'lost';

    // If deal is lost, reopen it
    if (wasLost) {
      console.log("Deal is lost, reopening...");
      const reopenResponse = await fetch(
        `https://api.pipedrive.com/v1/deals/${updateData.deal_id}?api_token=${apiToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "open" }),
        }
      );
      const reopenResult = await reopenResponse.json();
      console.log("Reopen response:", JSON.stringify(reopenResult));
      if (!reopenResult.success) {
        console.error("Failed to reopen deal:", JSON.stringify(reopenResult));
      } else {
        console.log("Deal reopened successfully, new status:", reopenResult.data?.status);
      }
    }

    // Update person with new data
    if (personId) {
      const personBody: Record<string, unknown> = {
        name: updateData.name,
        email: [{ value: updateData.email, primary: true }],
        phone: [{ value: updateData.phone, primary: true }],
      };
      if (updateData.job_title) {
        personBody.job_title = updateData.job_title;
      }

      await fetch(
        `https://api.pipedrive.com/v1/persons/${personId}?api_token=${apiToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(personBody),
        }
      );
      console.log("Person updated:", personId);
    }

    // Update organization with company size
    if (orgId && updateData.company_size) {
      const orgCompanySizeFieldKey = "07a8ced33cfb9c1c11441fb7957adedaa7212676";
      const orgBody: Record<string, unknown> = {
        name: updateData.company,
        [orgCompanySizeFieldKey]: updateData.company_size,
      };

      await fetch(
        `https://api.pipedrive.com/v1/organizations/${orgId}?api_token=${apiToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orgBody),
        }
      );
      console.log("Organization updated:", orgId);
    }

    // Get deal fields for custom fields mapping
    const dealFieldsResponse = await fetch(
      `https://api.pipedrive.com/v1/dealFields?api_token=${apiToken}`
    );
    const dealFieldsResult = await dealFieldsResponse.json();

    let labelId = null;
    let disqualifiedLabelId = null;
    let priorityLabelId = null;
    let segmentFieldKey: string | null = null;
    let revenueFieldKey: string | null = null;

    if (dealFieldsResult.success && dealFieldsResult.data) {
      const labelField = dealFieldsResult.data.find(
        (f: { key: string }) => f.key === "label"
      );
      if (labelField && labelField.options) {
        const diagnosticoLabel = labelField.options.find(
          (opt: { label: string }) => opt.label.toUpperCase() === "DIAGNÓSTICO" || opt.label.toUpperCase() === "DIAGNOSTICO"
        );
        if (diagnosticoLabel) {
          labelId = diagnosticoLabel.id;
        }

        const desqualificadoLabel = labelField.options.find(
          (opt: { label: string }) => opt.label.toUpperCase().includes("DESQUALIFICADO_DIAGNÓSTICO")
        );
        if (desqualificadoLabel) {
          disqualifiedLabelId = desqualificadoLabel.id;
        }

        // Find PRIORIDADE label
        const priorityLabel = labelField.options.find(
          (opt: { label: string }) => opt.label.toUpperCase() === "PRIORIDADE"
        );
        if (priorityLabel) {
          priorityLabelId = priorityLabel.id;
        }
      }

      for (const field of dealFieldsResult.data) {
        const fieldName = (field.name || "").toLowerCase();
        if (fieldName.includes("ramo de atividade") || fieldName === "ramo_de_atividade") {
          segmentFieldKey = field.key;
        }
        if (fieldName.includes("faturamento") || fieldName === "faturamento") {
          revenueFieldKey = field.key;
        }
      }
    }

    // Check qualification
    const employeeCount = parseInt(updateData.company_size, 10) || 0;
    const isDisqualified = employeeCount < 10 && updateData.revenue === "abaixo_100k";
    const isPriority = employeeCount > 40;

    // Update deal with diagnosis info
    const dealBody: Record<string, unknown> = {
      title: `Diagnóstico ISO 9001 - ${updateData.name} (${updateData.company})`,
    };

    // Label priority: DESQUALIFICADO > PRIORIDADE > DIAGNÓSTICO
    if (isDisqualified && disqualifiedLabelId) {
      dealBody.label = disqualifiedLabelId;
    } else if (isPriority && priorityLabelId) {
      dealBody.label = priorityLabelId;
    } else if (labelId) {
      dealBody.label = labelId;
    }

    if (segmentFieldKey && updateData.segment) {
      dealBody[segmentFieldKey] = updateData.segment;
    }
    if (revenueFieldKey && updateData.revenue) {
      dealBody[revenueFieldKey] = revenueLabels[updateData.revenue] || updateData.revenue;
    }

    const dealUpdateResponse = await fetch(
      `https://api.pipedrive.com/v1/deals/${updateData.deal_id}?api_token=${apiToken}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealBody),
      }
    );
    const dealUpdateResult = await dealUpdateResponse.json();
    console.log("Deal update response:", dealUpdateResult.success, "status:", dealUpdateResult.data?.status);

    // Only add notes when we have actual answers (score > 0), skip mid-flow updates
    const hasAnswers = updateData.score > 0 && Object.keys(updateData.answers || {}).length > 0;

    if (hasAnswers) {
      // Build question lookup from dynamic questions
      const questionMap: Record<string, DynamicQuestion> = {};
      if (updateData.questions) {
        updateData.questions.forEach((q) => { questionMap[q.id] = q; });
      }

      // Build and add notes
      const revenueDisplay = updateData.revenue ? (revenueLabels[updateData.revenue] || updateData.revenue) : "Não informado";

      let answersSection = "\n\n📋 **RESPOSTAS DO DIAGNÓSTICO PERSONALIZADO:**\n";
      const pillars = ["Processos", "Pessoas", "Clientes", "Controle", "Crescimento"];
      
      pillars.forEach((pillar) => {
        answersSection += `\n**${pillar}:**\n`;
        const qIds = pillarQuestions[pillar];
        qIds.forEach((qId) => {
          const answerValue = updateData.answers?.[qId];
          const q = questionMap[qId];
          const questionText = q?.text || fallbackQuestionTexts[qId] || qId;
          
          let answerText = "Não respondeu";
          let emoji = "⬜";
          if (typeof answerValue === 'number') {
            answerText = q?.answers?.find((a) => a.value === answerValue)?.label || `Nota ${answerValue}/5`;
            emoji = answerValue >= 4 ? "✅" : answerValue === 3 ? "⚠️" : "❌";
          }
          answersSection += `${emoji} ${questionText}\n   → ${answerText} (${answerValue || 0}/5)\n`;
        });
      });

      let pillarScoresSection = "\n\n📊 **PONTUAÇÃO POR PILAR:**\n";
      if (updateData.pillar_scores && updateData.pillar_scores.length > 0) {
        updateData.pillar_scores.forEach((pillar) => {
          const emoji = pillar.score >= 75 ? "🟢" : pillar.score >= 50 ? "🟡" : "🔴";
          pillarScoresSection += `${emoji} ${pillar.name}: ${pillar.score}%\n`;
        });
      }

      const dealNote = `
📊 **Diagnóstico de Maturidade Empresarial**

👤 **Contato:** ${updateData.name}
💼 **Cargo:** ${updateData.job_title || "Não informado"}
🏢 **Empresa:** ${updateData.company}
🏭 **Segmento:** ${updateData.segment || "Não informado"}
👥 **Porte:** ${updateData.company_size || "Não informado"} funcionários
💰 **Faturamento:** ${revenueDisplay}
📧 **Email:** ${updateData.email}
📱 **Telefone:** ${updateData.phone}

📈 **Score:** ${updateData.score}/100
🏷️ **Nível:** ${updateData.diagnosis_level}
${pillarScoresSection}
${answersSection}
      `.trim();

      // Add diagnosis note
      await fetch(
        `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: dealNote,
            deal_id: updateData.deal_id,
          }),
        }
      );

      // Add sales guidance note
      const salesGuidance = getSalesGuidance(
        updateData.score,
        updateData.diagnosis_level,
        updateData.pillar_scores || [],
        updateData.answers || {},
        updateData.name,
        updateData.questions
      );

      await fetch(
        `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: salesGuidance,
            deal_id: updateData.deal_id,
          }),
        }
      );
    } else {
      console.log("Skipping notes — mid-flow update with no answers yet");
    }

    // If deal was lost, create a phone call activity
    if (wasLost) {
      console.log("Creating phone call activity for reopened deal...");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = tomorrow.toISOString().split("T")[0];

      const activityBody: Record<string, unknown> = {
        subject: `📞 Retorno - Lead reaberto via diagnóstico (${updateData.name})`,
        type: "call",
        deal_id: updateData.deal_id,
        due_date: dueDate,
        due_time: "09:00",
        duration: "00:30",
        note: `Lead ${updateData.name} (${updateData.company}) respondeu o diagnóstico novamente através do link personalizado.\n\nScore: ${updateData.score}/100 - ${updateData.diagnosis_level}\n\nO deal estava como PERDIDO e foi reaberto automaticamente.`,
        done: 0,
      };

      if (personId) activityBody.person_id = personId;
      if (orgId) activityBody.org_id = orgId;

      const activityResponse = await fetch(
        `https://api.pipedrive.com/v1/activities?api_token=${apiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityBody),
        }
      );
      const activityResult = await activityResponse.json();
      console.log("Phone call activity response:", JSON.stringify(activityResult));
    }

    // Get owner info
    let ownerName = null;
    if (deal.user_id) {
      const ownerId = typeof deal.user_id === 'object' ? deal.user_id.id : deal.user_id;
      ownerName = typeof deal.user_id === 'object' ? deal.user_id.name : null;
      
      if (ownerId && !ownerName) {
        try {
          const userResponse = await fetch(
            `https://api.pipedrive.com/v1/users/${ownerId}?api_token=${apiToken}`
          );
          const userResult = await userResponse.json();
          if (userResult.success && userResult.data) {
            ownerName = userResult.data.name;
          }
        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        deal_id: updateData.deal_id,
        owner_name: ownerName,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating Pipedrive deal:", errorMessage);
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
