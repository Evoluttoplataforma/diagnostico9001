export interface Question {
  id: string;
  block: number;
  blockTitle: string;
  text: string;
  answers: Answer[];
}

export interface Answer {
  value: "positive" | "neutral" | "negative";
  label: string;
  points: number;
}

export type AnswerValue = "positive" | "neutral" | "negative";

export const questions: Question[] = [
  // BLOCO 1 — DIREÇÃO E CONTROLE
  {
    id: "q1",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Sua empresa tem metas claras para este ano?",
    answers: [
      { value: "positive", label: "Sim, metas definidas e comunicadas", points: 1 },
      { value: "neutral", label: "Temos algumas, mas não são claras", points: 0 },
      { value: "negative", label: "Não temos metas definidas", points: 0 },
    ],
  },
  {
    id: "q2",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Seu time sabe quais são as prioridades do negócio?",
    answers: [
      { value: "positive", label: "Sim, todos sabem as prioridades", points: 1 },
      { value: "neutral", label: "Alguns sabem, outros não", points: 0 },
      { value: "negative", label: "Cada um faz o que acha certo", points: 0 },
    ],
  },
  {
    id: "q3",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Você acompanha indicadores (vendas, prazos, qualidade)?",
    answers: [
      { value: "positive", label: "Sim, acompanhamos regularmente", points: 1 },
      { value: "neutral", label: "Às vezes, quando dá tempo", points: 0 },
      { value: "negative", label: "Não medimos indicadores", points: 0 },
    ],
  },
  {
    id: "q4",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "As decisões são baseadas em dados?",
    answers: [
      { value: "positive", label: "Sim, usamos dados para decidir", points: 1 },
      { value: "neutral", label: "Misturamos dados e intuição", points: 0 },
      { value: "negative", label: "Decidimos no feeling", points: 0 },
    ],
  },

  // BLOCO 2 — PROCESSOS OPERACIONAIS
  {
    id: "q5",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "As atividades principais seguem sempre o mesmo passo a passo?",
    answers: [
      { value: "positive", label: "Sim, temos processos padronizados", points: 1 },
      { value: "neutral", label: "Depende de quem está fazendo", points: 0 },
      { value: "negative", label: "Cada um faz do seu jeito", points: 0 },
    ],
  },
  {
    id: "q6",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Se alguém sair, outra pessoa consegue assumir sem caos?",
    answers: [
      { value: "positive", label: "Sim, o conhecimento está documentado", points: 1 },
      { value: "neutral", label: "Com dificuldade, leva tempo", points: 0 },
      { value: "negative", label: "Vira um caos quando alguém sai", points: 0 },
    ],
  },
  {
    id: "q7",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Os processos estão documentados?",
    answers: [
      { value: "positive", label: "Sim, temos documentação atualizada", points: 1 },
      { value: "neutral", label: "Alguns estão, outros não", points: 0 },
      { value: "negative", label: "Só na cabeça das pessoas", points: 0 },
    ],
  },
  {
    id: "q8",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Os erros se repetem com frequência?",
    answers: [
      { value: "negative", label: "Sim, os mesmos erros sempre voltam", points: 0 },
      { value: "neutral", label: "Às vezes acontece", points: 0 },
      { value: "positive", label: "Não, aprendemos com os erros", points: 1 },
    ],
  },

  // BLOCO 3 — PESSOAS E RESPONSABILIDADES
  {
    id: "q9",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "Cada colaborador sabe exatamente o que é sua responsabilidade?",
    answers: [
      { value: "positive", label: "Sim, funções bem definidas", points: 1 },
      { value: "neutral", label: "Mais ou menos, há confusão", points: 0 },
      { value: "negative", label: "Não, todo mundo faz de tudo", points: 0 },
    ],
  },
  {
    id: "q10",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "Existem conflitos por falta de clareza de quem faz o quê?",
    answers: [
      { value: "negative", label: "Sim, conflitos frequentes", points: 0 },
      { value: "neutral", label: "Às vezes acontece", points: 0 },
      { value: "positive", label: "Não, está tudo claro", points: 1 },
    ],
  },
  {
    id: "q11",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "O treinamento de novos colaboradores é estruturado?",
    answers: [
      { value: "positive", label: "Sim, temos programa de integração", points: 1 },
      { value: "neutral", label: "É informal, vai aprendendo", points: 0 },
      { value: "negative", label: "Não, é no improviso total", points: 0 },
    ],
  },
  {
    id: "q12",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "O desempenho das pessoas é medido de forma objetiva?",
    answers: [
      { value: "positive", label: "Sim, com critérios claros", points: 1 },
      { value: "neutral", label: "Avaliamos, mas sem critérios fixos", points: 0 },
      { value: "negative", label: "Não medimos desempenho", points: 0 },
    ],
  },

  // BLOCO 4 — CLIENTE E QUALIDADE
  {
    id: "q13",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "As reclamações dos clientes são registradas?",
    answers: [
      { value: "positive", label: "Sim, temos sistema de registro", points: 1 },
      { value: "neutral", label: "Algumas sim, outras não", points: 0 },
      { value: "negative", label: "Não registramos reclamações", points: 0 },
    ],
  },
  {
    id: "q14",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Existe um padrão de atendimento ao cliente?",
    answers: [
      { value: "positive", label: "Sim, atendimento padronizado", points: 1 },
      { value: "neutral", label: "Depende de quem atende", points: 0 },
      { value: "negative", label: "Cada um atende do seu jeito", points: 0 },
    ],
  },
  {
    id: "q15",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Você mede a satisfação dos clientes?",
    answers: [
      { value: "positive", label: "Sim, pesquisamos regularmente", points: 1 },
      { value: "neutral", label: "Às vezes perguntamos", points: 0 },
      { value: "negative", label: "Só reagimos quando reclamam", points: 0 },
    ],
  },
  {
    id: "q16",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Já perdeu clientes por falhas internas?",
    answers: [
      { value: "negative", label: "Sim, já perdemos vários", points: 0 },
      { value: "neutral", label: "Aconteceu algumas vezes", points: 0 },
      { value: "positive", label: "Não, retemos bem nossos clientes", points: 1 },
    ],
  },

  // BLOCO 5 — CONTROLE E MELHORIA
  {
    id: "q17",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "Os problemas são analisados na causa raiz?",
    answers: [
      { value: "positive", label: "Sim, investigamos a fundo", points: 1 },
      { value: "neutral", label: "Às vezes, quando é grave", points: 0 },
      { value: "negative", label: "Só apagamos incêndios", points: 0 },
    ],
  },
  {
    id: "q18",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "A empresa aprende com os erros?",
    answers: [
      { value: "positive", label: "Sim, implementamos melhorias", points: 1 },
      { value: "neutral", label: "Tentamos, mas nem sempre", points: 0 },
      { value: "negative", label: "Repetimos os mesmos erros", points: 0 },
    ],
  },
  {
    id: "q19",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "Existe alguma rotina de melhoria contínua?",
    answers: [
      { value: "positive", label: "Sim, reuniões e ações regulares", points: 1 },
      { value: "neutral", label: "Melhoramos quando dá", points: 0 },
      { value: "negative", label: "Não temos rotina de melhoria", points: 0 },
    ],
  },
  {
    id: "q20",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "As decisões importantes são registradas?",
    answers: [
      { value: "positive", label: "Sim, documentamos tudo", points: 1 },
      { value: "neutral", label: "Algumas sim, outras não", points: 0 },
      { value: "negative", label: "Só ficam na memória", points: 0 },
    ],
  },
];

export const getScore = (answers: Record<string, AnswerValue>): number => {
  const rawScore = questions.reduce((total, question) => {
    const answer = answers[question.id];
    if (!answer) return total;
    const answerData = question.answers.find((a) => a.value === answer);
    return total + (answerData?.points || 0);
  }, 0);
  
  // Convert to percentage (max 20 points = 100%)
  const maxPoints = 20;
  return Math.round((rawScore / maxPoints) * 100);
};

export const getDiagnosis = (score: number) => {
  // Score is now 0-100 percentage
  if (score <= 30) {
    return {
      level: "low" as const,
      emoji: "🔴",
      title: "Empresa dependente de pessoas",
      description:
        "Sua empresa ainda opera no improviso, sem processos definidos. Isso significa alto risco, dependência do dono e dificuldade de crescimento sustentável.",
      recommendation:
        "Você precisa urgentemente estruturar seus processos básicos para reduzir riscos e ganhar previsibilidade.",
    };
  } else if (score <= 65) {
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
