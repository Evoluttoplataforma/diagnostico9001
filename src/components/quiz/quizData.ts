export interface Question {
  id: string;
  block: number;
  blockTitle: string;
  text: string;
}

export const questions: Question[] = [
  // BLOCO 1 — DIREÇÃO E CONTROLE
  { id: "q1", block: 1, blockTitle: "Direção e Controle", text: "Sua empresa tem metas claras para este ano?" },
  { id: "q2", block: 1, blockTitle: "Direção e Controle", text: "Seu time sabe quais são as prioridades do negócio?" },
  { id: "q3", block: 1, blockTitle: "Direção e Controle", text: "Você acompanha indicadores (vendas, prazos, qualidade, retrabalho)?" },
  { id: "q4", block: 1, blockTitle: "Direção e Controle", text: "As decisões são baseadas em dados, não só em feeling?" },
  
  // BLOCO 2 — PROCESSOS OPERACIONAIS
  { id: "q5", block: 2, blockTitle: "Processos Operacionais", text: "As atividades principais seguem sempre o mesmo passo a passo?" },
  { id: "q6", block: 2, blockTitle: "Processos Operacionais", text: "Se alguém sair, outra pessoa consegue assumir sem caos?" },
  { id: "q7", block: 2, blockTitle: "Processos Operacionais", text: "Os processos estão documentados ou só 'na cabeça das pessoas'?" },
  { id: "q8", block: 2, blockTitle: "Processos Operacionais", text: "Os erros se repetem com frequência?" },
  
  // BLOCO 3 — PESSOAS E RESPONSABILIDADES
  { id: "q9", block: 3, blockTitle: "Pessoas e Responsabilidades", text: "Cada colaborador sabe exatamente o que é sua responsabilidade?" },
  { id: "q10", block: 3, blockTitle: "Pessoas e Responsabilidades", text: "Existem conflitos por falta de clareza de quem faz o quê?" },
  { id: "q11", block: 3, blockTitle: "Pessoas e Responsabilidades", text: "O treinamento é estruturado ou acontece 'no improviso'?" },
  { id: "q12", block: 3, blockTitle: "Pessoas e Responsabilidades", text: "O desempenho das pessoas é medido de forma objetiva?" },
  
  // BLOCO 4 — CLIENTE E QUALIDADE
  { id: "q13", block: 4, blockTitle: "Cliente e Qualidade", text: "As reclamações dos clientes são registradas?" },
  { id: "q14", block: 4, blockTitle: "Cliente e Qualidade", text: "Existe um padrão de atendimento?" },
  { id: "q15", block: 4, blockTitle: "Cliente e Qualidade", text: "Você mede satisfação ou só reage quando dá problema?" },
  { id: "q16", block: 4, blockTitle: "Cliente e Qualidade", text: "Já perdeu clientes por falhas internas?" },
  
  // BLOCO 5 — CONTROLE E MELHORIA
  { id: "q17", block: 5, blockTitle: "Controle e Melhoria", text: "Os problemas são analisados na causa raiz?" },
  { id: "q18", block: 5, blockTitle: "Controle e Melhoria", text: "A empresa aprende com os erros?" },
  { id: "q19", block: 5, blockTitle: "Controle e Melhoria", text: "Existe alguma rotina de melhoria?" },
  { id: "q20", block: 5, blockTitle: "Controle e Melhoria", text: "As decisões importantes são registradas?" },
];

export type AnswerValue = "yes" | "sometimes" | "no";

export const answerOptions = [
  { value: "yes" as AnswerValue, label: "Sim, acontece sempre", emoji: "✅", points: 1 },
  { value: "sometimes" as AnswerValue, label: "Às vezes / informal", emoji: "⚠️", points: 0 },
  { value: "no" as AnswerValue, label: "Não acontece", emoji: "❌", points: 0 },
];

export const getScore = (answers: Record<string, AnswerValue>): number => {
  return Object.values(answers).filter(a => a === "yes").length;
};

export const getDiagnosis = (score: number) => {
  if (score <= 6) {
    return {
      level: "low" as const,
      emoji: "🔴",
      title: "Empresa dependente de pessoas",
      description: "Sua empresa funciona mais como uma lanchonete improvisada do que como um McDonald's. Isso significa alto risco, dependência do dono e dificuldade de crescimento.",
      recommendation: "Você precisa urgentemente estruturar seus processos básicos para reduzir riscos e ganhar previsibilidade.",
    };
  } else if (score <= 13) {
    return {
      level: "medium" as const,
      emoji: "🟡",
      title: "Empresa funciona, mas cresce com caos",
      description: "Sua empresa já funciona, mas está perdendo eficiência e dinheiro por falta de padrão. O crescimento traz mais problemas do que soluções.",
      recommendation: "Chegou a hora de padronizar para escalar sem dor de cabeça.",
    };
  } else {
    return {
      level: "high" as const,
      emoji: "🟢",
      title: "Empresa pronta para escalar",
      description: "Sua empresa está pronta para crescer, padronizar e buscar excelência. Você já tem uma base sólida para a certificação ISO 9001.",
      recommendation: "A certificação ISO 9001 vai consolidar sua gestão e abrir portas para novos mercados.",
    };
  }
};
