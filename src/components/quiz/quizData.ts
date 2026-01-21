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
  // BLOCO 1 — PROCESSOS
  // "Suas operações são organizadas e replicáveis? Ou você depende de apagar incêndios todo dia?"
  {
    id: "q1",
    block: 1,
    blockTitle: "Processos",
    text: "As atividades principais seguem sempre o mesmo passo a passo?",
    answers: [
      { value: "positive", label: "Sim, temos processos padronizados", points: 1 },
      { value: "neutral", label: "Depende de quem está fazendo", points: 0 },
      { value: "negative", label: "Cada um faz do seu jeito", points: 0 },
    ],
  },
  {
    id: "q2",
    block: 1,
    blockTitle: "Processos",
    text: "Se alguém sair, outra pessoa consegue assumir sem caos?",
    answers: [
      { value: "positive", label: "Sim, o conhecimento está documentado", points: 1 },
      { value: "neutral", label: "Com dificuldade, leva tempo", points: 0 },
      { value: "negative", label: "Vira um caos quando alguém sai", points: 0 },
    ],
  },
  {
    id: "q3",
    block: 1,
    blockTitle: "Processos",
    text: "Os processos estão documentados?",
    answers: [
      { value: "positive", label: "Sim, temos documentação atualizada", points: 1 },
      { value: "neutral", label: "Alguns estão, outros não", points: 0 },
      { value: "negative", label: "Só na cabeça das pessoas", points: 0 },
    ],
  },
  {
    id: "q4",
    block: 1,
    blockTitle: "Processos",
    text: "Você vive apagando incêndios no dia a dia?",
    answers: [
      { value: "negative", label: "Sim, é o modo padrão aqui", points: 0 },
      { value: "neutral", label: "Às vezes, mas não sempre", points: 0 },
      { value: "positive", label: "Não, temos rotina organizada", points: 1 },
    ],
  },

  // BLOCO 2 — PESSOAS
  // "Seu time entrega resultado sem depender de você? Ou você é o gargalo de tudo que acontece?"
  {
    id: "q5",
    block: 2,
    blockTitle: "Pessoas",
    text: "Cada colaborador sabe exatamente o que é sua responsabilidade?",
    answers: [
      { value: "positive", label: "Sim, funções bem definidas", points: 1 },
      { value: "neutral", label: "Mais ou menos, há confusão", points: 0 },
      { value: "negative", label: "Não, todo mundo faz de tudo", points: 0 },
    ],
  },
  {
    id: "q6",
    block: 2,
    blockTitle: "Pessoas",
    text: "Seu time consegue resolver problemas sem precisar de você?",
    answers: [
      { value: "positive", label: "Sim, têm autonomia para decidir", points: 1 },
      { value: "neutral", label: "Às vezes, mas me consultam muito", points: 0 },
      { value: "negative", label: "Não, tudo passa por mim", points: 0 },
    ],
  },
  {
    id: "q7",
    block: 2,
    blockTitle: "Pessoas",
    text: "Você consegue tirar férias sem que a empresa pare?",
    answers: [
      { value: "positive", label: "Sim, a operação continua normal", points: 1 },
      { value: "neutral", label: "Funciona, mas com dificuldades", points: 0 },
      { value: "negative", label: "Não, preciso estar presente sempre", points: 0 },
    ],
  },
  {
    id: "q8",
    block: 2,
    blockTitle: "Pessoas",
    text: "O treinamento de novos colaboradores é estruturado?",
    answers: [
      { value: "positive", label: "Sim, temos programa de integração", points: 1 },
      { value: "neutral", label: "É informal, vai aprendendo", points: 0 },
      { value: "negative", label: "Não, é no improviso total", points: 0 },
    ],
  },

  // BLOCO 3 — CLIENTES
  // "Você retém clientes e cresce com previsibilidade? Ou vive na montanha-russa de vendas?"
  {
    id: "q9",
    block: 3,
    blockTitle: "Clientes",
    text: "Você mede a satisfação dos clientes?",
    answers: [
      { value: "positive", label: "Sim, pesquisamos regularmente", points: 1 },
      { value: "neutral", label: "Às vezes perguntamos", points: 0 },
      { value: "negative", label: "Só reagimos quando reclamam", points: 0 },
    ],
  },
  {
    id: "q10",
    block: 3,
    blockTitle: "Clientes",
    text: "Já perdeu clientes por falhas internas?",
    answers: [
      { value: "negative", label: "Sim, já perdemos vários", points: 0 },
      { value: "neutral", label: "Aconteceu algumas vezes", points: 0 },
      { value: "positive", label: "Não, retemos bem nossos clientes", points: 1 },
    ],
  },
  {
    id: "q11",
    block: 3,
    blockTitle: "Clientes",
    text: "Suas vendas são previsíveis mês a mês?",
    answers: [
      { value: "positive", label: "Sim, temos previsibilidade", points: 1 },
      { value: "neutral", label: "Varia bastante, difícil prever", points: 0 },
      { value: "negative", label: "É uma montanha-russa", points: 0 },
    ],
  },
  {
    id: "q12",
    block: 3,
    blockTitle: "Clientes",
    text: "Você sabe qual o ciclo de vida médio dos seus clientes?",
    answers: [
      { value: "positive", label: "Sim, acompanhamos esse dado", points: 1 },
      { value: "neutral", label: "Tenho uma ideia, mas não preciso", points: 0 },
      { value: "negative", label: "Não, nunca medi isso", points: 0 },
    ],
  },

  // BLOCO 4 — CONTROLE
  // "Você decide com dados ou no feeling? Sabe exatamente para onde vai cada real?"
  {
    id: "q13",
    block: 4,
    blockTitle: "Controle",
    text: "Você acompanha indicadores (vendas, prazos, qualidade)?",
    answers: [
      { value: "positive", label: "Sim, acompanhamos regularmente", points: 1 },
      { value: "neutral", label: "Às vezes, quando dá tempo", points: 0 },
      { value: "negative", label: "Não medimos indicadores", points: 0 },
    ],
  },
  {
    id: "q14",
    block: 4,
    blockTitle: "Controle",
    text: "As decisões são baseadas em dados?",
    answers: [
      { value: "positive", label: "Sim, usamos dados para decidir", points: 1 },
      { value: "neutral", label: "Misturamos dados e intuição", points: 0 },
      { value: "negative", label: "Decidimos no feeling", points: 0 },
    ],
  },
  {
    id: "q15",
    block: 4,
    blockTitle: "Controle",
    text: "Você sabe exatamente para onde vai cada real da empresa?",
    answers: [
      { value: "positive", label: "Sim, controle financeiro detalhado", points: 1 },
      { value: "neutral", label: "Tenho uma visão geral apenas", points: 0 },
      { value: "negative", label: "Não, as finanças são confusas", points: 0 },
    ],
  },
  {
    id: "q16",
    block: 4,
    blockTitle: "Controle",
    text: "Você tem relatórios financeiros atualizados mensalmente?",
    answers: [
      { value: "positive", label: "Sim, DRE e fluxo de caixa em dia", points: 1 },
      { value: "neutral", label: "Às vezes, quando dá tempo", points: 0 },
      { value: "negative", label: "Não, só olho o saldo bancário", points: 0 },
    ],
  },

  // BLOCO 5 — CRESCIMENTO
  // "Sua estrutura aguenta dobrar de tamanho? Ou você sente que está no limite?"
  {
    id: "q17",
    block: 5,
    blockTitle: "Crescimento",
    text: "Sua estrutura atual aguenta dobrar de tamanho?",
    answers: [
      { value: "positive", label: "Sim, estamos preparados", points: 1 },
      { value: "neutral", label: "Talvez, com alguns ajustes", points: 0 },
      { value: "negative", label: "Não, já estamos no limite", points: 0 },
    ],
  },
  {
    id: "q18",
    block: 5,
    blockTitle: "Crescimento",
    text: "Você tem um plano claro de crescimento para os próximos 12 meses?",
    answers: [
      { value: "positive", label: "Sim, com metas e ações definidas", points: 1 },
      { value: "neutral", label: "Tenho ideias, mas nada formalizado", points: 0 },
      { value: "negative", label: "Não, vou levando conforme dá", points: 0 },
    ],
  },
  {
    id: "q19",
    block: 5,
    blockTitle: "Crescimento",
    text: "Você conseguiria contratar 5 pessoas amanhã sem gerar caos?",
    answers: [
      { value: "positive", label: "Sim, temos estrutura para isso", points: 1 },
      { value: "neutral", label: "Seria difícil, mas daria", points: 0 },
      { value: "negative", label: "Não, seria um caos total", points: 0 },
    ],
  },
  {
    id: "q20",
    block: 5,
    blockTitle: "Crescimento",
    text: "A empresa tem capital ou crédito disponível para investir em crescimento?",
    answers: [
      { value: "positive", label: "Sim, temos reservas ou acesso a crédito", points: 1 },
      { value: "neutral", label: "Pouco, precisaria buscar", points: 0 },
      { value: "negative", label: "Não, estamos apertados", points: 0 },
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
