export interface Question {
  id: string;
  block: number;
  blockTitle: string;
  text: string;
  answers: Answer[];
  invertedScore?: boolean; // Para perguntas onde "Sim" é negativo
}

export interface Answer {
  value: "yes" | "sometimes" | "no";
  label: string;
  emoji: string;
  points: number;
}

export type AnswerValue = "yes" | "sometimes" | "no";

export const questions: Question[] = [
  // BLOCO 1 — DIREÇÃO E CONTROLE
  {
    id: "q1",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Sua empresa tem metas claras para este ano?",
    answers: [
      { value: "yes", label: "Sim, metas definidas e comunicadas", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Temos algumas, mas não são claras", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não temos metas definidas", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q2",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Seu time sabe quais são as prioridades do negócio?",
    answers: [
      { value: "yes", label: "Sim, todos sabem as prioridades", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Alguns sabem, outros não", emoji: "⚠️", points: 0 },
      { value: "no", label: "Cada um faz o que acha certo", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q3",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "Você acompanha indicadores (vendas, prazos, qualidade, retrabalho)?",
    answers: [
      { value: "yes", label: "Sim, acompanhamos regularmente", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Às vezes, quando dá tempo", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não medimos indicadores", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q4",
    block: 1,
    blockTitle: "Direção e Controle",
    text: "As decisões são baseadas em dados, não só em feeling?",
    answers: [
      { value: "yes", label: "Sim, usamos dados para decidir", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Misturamos dados e intuição", emoji: "⚠️", points: 0 },
      { value: "no", label: "Decidimos no feeling mesmo", emoji: "❌", points: 0 },
    ],
  },

  // BLOCO 2 — PROCESSOS OPERACIONAIS
  {
    id: "q5",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "As atividades principais seguem sempre o mesmo passo a passo?",
    answers: [
      { value: "yes", label: "Sim, temos processos padronizados", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Depende de quem está fazendo", emoji: "⚠️", points: 0 },
      { value: "no", label: "Cada um faz do seu jeito", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q6",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Se alguém sair, outra pessoa consegue assumir sem caos?",
    answers: [
      { value: "yes", label: "Sim, o conhecimento está documentado", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Com dificuldade, leva tempo", emoji: "⚠️", points: 0 },
      { value: "no", label: "Vira um caos quando alguém sai", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q7",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Os processos estão documentados?",
    answers: [
      { value: "yes", label: "Sim, temos documentação atualizada", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Alguns estão, outros não", emoji: "⚠️", points: 0 },
      { value: "no", label: "Só na cabeça das pessoas", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q8",
    block: 2,
    blockTitle: "Processos Operacionais",
    text: "Os erros se repetem com frequência?",
    invertedScore: true,
    answers: [
      { value: "yes", label: "Sim, os mesmos erros sempre voltam", emoji: "❌", points: 0 },
      { value: "sometimes", label: "Às vezes acontece", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não, aprendemos com os erros", emoji: "✅", points: 1 },
    ],
  },

  // BLOCO 3 — PESSOAS E RESPONSABILIDADES
  {
    id: "q9",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "Cada colaborador sabe exatamente o que é sua responsabilidade?",
    answers: [
      { value: "yes", label: "Sim, funções bem definidas", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Mais ou menos, há confusão", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não, todo mundo faz de tudo", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q10",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "Existem conflitos por falta de clareza de quem faz o quê?",
    invertedScore: true,
    answers: [
      { value: "yes", label: "Sim, conflitos frequentes", emoji: "❌", points: 0 },
      { value: "sometimes", label: "Às vezes acontece", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não, está tudo claro", emoji: "✅", points: 1 },
    ],
  },
  {
    id: "q11",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "O treinamento de novos colaboradores é estruturado?",
    answers: [
      { value: "yes", label: "Sim, temos programa de integração", emoji: "✅", points: 1 },
      { value: "sometimes", label: "É informal, vai aprendendo", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não, é no improviso total", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q12",
    block: 3,
    blockTitle: "Pessoas e Responsabilidades",
    text: "O desempenho das pessoas é medido de forma objetiva?",
    answers: [
      { value: "yes", label: "Sim, com critérios claros", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Avaliamos, mas sem critérios fixos", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não medimos desempenho", emoji: "❌", points: 0 },
    ],
  },

  // BLOCO 4 — CLIENTE E QUALIDADE
  {
    id: "q13",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "As reclamações dos clientes são registradas?",
    answers: [
      { value: "yes", label: "Sim, temos sistema de registro", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Algumas sim, outras não", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não registramos reclamações", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q14",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Existe um padrão de atendimento ao cliente?",
    answers: [
      { value: "yes", label: "Sim, atendimento padronizado", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Depende de quem atende", emoji: "⚠️", points: 0 },
      { value: "no", label: "Cada um atende do seu jeito", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q15",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Você mede a satisfação dos clientes?",
    answers: [
      { value: "yes", label: "Sim, pesquisamos regularmente", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Às vezes perguntamos", emoji: "⚠️", points: 0 },
      { value: "no", label: "Só reagimos quando reclamam", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q16",
    block: 4,
    blockTitle: "Cliente e Qualidade",
    text: "Já perdeu clientes por falhas internas?",
    invertedScore: true,
    answers: [
      { value: "yes", label: "Sim, já perdemos vários", emoji: "❌", points: 0 },
      { value: "sometimes", label: "Aconteceu algumas vezes", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não, retemos bem nossos clientes", emoji: "✅", points: 1 },
    ],
  },

  // BLOCO 5 — CONTROLE E MELHORIA
  {
    id: "q17",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "Os problemas são analisados na causa raiz?",
    answers: [
      { value: "yes", label: "Sim, investigamos a fundo", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Às vezes, quando é grave", emoji: "⚠️", points: 0 },
      { value: "no", label: "Só apagamos incêndios", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q18",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "A empresa aprende com os erros?",
    answers: [
      { value: "yes", label: "Sim, implementamos melhorias", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Tentamos, mas nem sempre", emoji: "⚠️", points: 0 },
      { value: "no", label: "Repetimos os mesmos erros", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q19",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "Existe alguma rotina de melhoria contínua?",
    answers: [
      { value: "yes", label: "Sim, reuniões e ações regulares", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Melhoramos quando dá", emoji: "⚠️", points: 0 },
      { value: "no", label: "Não temos rotina de melhoria", emoji: "❌", points: 0 },
    ],
  },
  {
    id: "q20",
    block: 5,
    blockTitle: "Controle e Melhoria",
    text: "As decisões importantes são registradas?",
    answers: [
      { value: "yes", label: "Sim, documentamos tudo", emoji: "✅", points: 1 },
      { value: "sometimes", label: "Algumas sim, outras não", emoji: "⚠️", points: 0 },
      { value: "no", label: "Só ficam na memória", emoji: "❌", points: 0 },
    ],
  },
];

export const getScore = (answers: Record<string, AnswerValue>): number => {
  return questions.reduce((total, question) => {
    const answer = answers[question.id];
    if (!answer) return total;
    const answerData = question.answers.find((a) => a.value === answer);
    return total + (answerData?.points || 0);
  }, 0);
};

export const getDiagnosis = (score: number) => {
  if (score <= 6) {
    return {
      level: "low" as const,
      emoji: "🔴",
      title: "Empresa dependente de pessoas",
      description:
        "Sua empresa funciona mais como uma lanchonete improvisada do que como um McDonald's. Isso significa alto risco, dependência do dono e dificuldade de crescimento.",
      recommendation:
        "Você precisa urgentemente estruturar seus processos básicos para reduzir riscos e ganhar previsibilidade.",
    };
  } else if (score <= 13) {
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
