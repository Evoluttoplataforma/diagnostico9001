// === Types for AI-generated dynamic questions ===

export interface DynamicAnswer {
  value: number; // 1-5 scale
  label: string;
}

export interface DynamicQuestion {
  id: string;
  block: number;
  blockTitle: string;
  text: string;
  answers: DynamicAnswer[];
}

export interface PillarScore {
  name: string;
  score: number;
}

// Legacy types kept for backward compatibility with existing results page
export type AnswerValue = number;

export const pillars = [
  { name: "Processos", questions: ["q1", "q2", "q3", "q4"] },
  { name: "Pessoas", questions: ["q5", "q6", "q7", "q8"] },
  { name: "Clientes", questions: ["q9", "q10", "q11", "q12"] },
  { name: "Controle", questions: ["q13", "q14", "q15", "q16"] },
  { name: "Crescimento", questions: ["q17", "q18", "q19", "q20"] },
];

export const calculatePillarScores = (
  answers: Record<string, number>,
  dynamicQuestions: DynamicQuestion[]
): PillarScore[] => {
  return pillars.map((pillar) => {
    const points = pillar.questions.reduce((sum, qId) => {
      const answer = answers[qId];
      return sum + (answer || 0);
    }, 0);
    // Each pillar has 4 questions, max 20 points (4 × 5) = 100%
    return {
      name: pillar.name,
      score: Math.round((points / 20) * 100),
    };
  });
};

export const getScore = (answers: Record<string, number>): number => {
  const totalPoints = Object.values(answers).reduce((sum, val) => sum + (val || 0), 0);
  // 20 questions × 5 max = 100 max points
  const maxPoints = 100;
  return Math.round((totalPoints / maxPoints) * 100);
};

export const getDiagnosis = (score: number) => {
  if (score <= 40) {
    return {
      level: "low" as const,
      emoji: "🔴",
      title: "Empresa dependente de pessoas",
      description:
        "Sua empresa ainda opera no improviso, sem processos definidos. Isso significa alto risco, dependência do dono e dificuldade de crescimento sustentável.",
      recommendation:
        "Você precisa urgentemente estruturar seus processos básicos para reduzir riscos e ganhar previsibilidade.",
    };
  } else if (score <= 70) {
    return {
      level: "medium" as const,
      emoji: "🟡",
      title: "Empresa funciona, mas cresce com caos",
      description:
        "Sua empresa já funciona, mas está perdendo eficiência e dinheiro por falta de padrão. O crescimento traz mais problemas do que soluções.",
      recommendation:
        "Chegou a hora de padronizar para escalar sem dor de cabeça.",
    };
  } else {
    return {
      level: "high" as const,
      emoji: "🟢",
      title: "Empresa pronta para escalar",
      description:
        "Sua empresa está pronta para crescer, padronizar e buscar excelência. Você já tem uma base sólida para a certificação ISO 9001.",
      recommendation:
        "A certificação ISO 9001 vai consolidar sua gestão e abrir portas para novos mercados.",
    };
  }
};

// Fallback checklist when AI fails
export const getFallbackChecklist = (score: number): Record<string, string[]> => {
  const isHighPerformer = score > 70;

  if (isHighPerformer) {
    return {
      Processos: [
        "Implementar ciclos de melhoria contínua (PDCA) em todos os processos críticos",
        "Preparar documentação para auditoria interna ISO 9001",
      ],
      Pessoas: [
        "Criar programa de desenvolvimento de lideranças",
        "Implementar gestão por competências com plano de carreira",
      ],
      Clientes: [
        "Implementar NPS e programa de voz do cliente",
        "Criar comitê de análise crítica de satisfação do cliente",
      ],
      Controle: [
        "Adotar metodologia OKRs para gestão de indicadores",
        "Implementar dashboard de gestão com indicadores em tempo real",
      ],
      Crescimento: [
        "Elaborar plano estratégico de 3-5 anos com metas SMART",
        "Buscar certificação ISO 9001 para ampliar mercado",
      ],
    };
  }

  return {
    Processos: [
      "Mapear e documentar os 5 processos mais críticos da operação",
      "Criar checklist padrão para atividades repetitivas",
    ],
    Pessoas: [
      "Definir descrição de cargo para cada função",
      "Criar manual de integração para novos colaboradores",
    ],
    Clientes: [
      "Implementar pesquisa de satisfação simples após cada entrega",
      "Criar rotina semanal de follow-up com clientes ativos",
    ],
    Controle: [
      "Implementar controle financeiro básico (entradas/saídas/DRE)",
      "Definir 3 indicadores-chave para acompanhar semanalmente",
    ],
    Crescimento: [
      "Definir meta de crescimento para os próximos 6 meses",
      "Identificar os 3 principais gargalos que impedem o crescimento",
    ],
  };
};
