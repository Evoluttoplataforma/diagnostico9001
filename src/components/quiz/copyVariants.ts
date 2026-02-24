export interface CopyVariant {
  id: string;
  headline: string;
  highlightedPart: string;
  description: string;
}

export const COPY_VARIANTS: CopyVariant[] = [
  {
    id: "A",
    headline: "ISO 9001 NÃO É BUROCRACIA. É",
    highlightedPart: "UMA MÁQUINA DE CRESCIMENTO PARA SUA EMPRESA.",
    description:
      "Empresas que estruturam processos faturam mais, reduzem retrabalho e ganham competitividade no mercado. Responda ao diagnóstico gratuito e descubra onde estão os gargalos que estão travando seus resultados.",
  },
  {
    id: "B",
    headline: "SEM PROCESSO, SUA EMPRESA",
    highlightedPart: "PERDE OPORTUNIDADES TODOS OS DIAS.",
    description:
      "A ISO 9001 não é só um certificado — é o que permite participar de grandes contratos, atender exigências de clientes e crescer com segurança. Faça o diagnóstico gratuito e veja o que falta para sua empresa avançar.",
  },
  {
    id: "C",
    headline: "ENQUANTO SEUS CONCORRENTES IMPROVISAM,",
    highlightedPart: "EMPRESAS CERTIFICADAS DOMINAM O MERCADO.",
    description:
      "A ISO 9001 cria padrão, eficiência e confiança — três fatores que aumentam vendas e margens. Descubra gratuitamente seu nível de maturidade em gestão e os próximos passos para evoluir.",
  },
  {
    id: "D",
    headline: "PROBLEMAS REPETIDOS, ERROS E RETRABALHO NÃO SÃO NORMAIS.",
    highlightedPart: "SÃO FALTA DE PROCESSO.",
    description:
      "A ISO 9001 organiza sua operação, melhora resultados e prepara sua empresa para crescer sem caos. Responda ao diagnóstico gratuito e identifique seus principais pontos de melhoria.",
  },
  {
    id: "E",
    headline: "EMPRESAS ORGANIZADAS LUCRAM MAIS.",
    highlightedPart: "EMPRESAS CERTIFICADAS LUCRAM MUITO MAIS.",
    description:
      "A ISO 9001 reduz desperdícios, aumenta produtividade e abre portas para novos clientes. Faça agora o diagnóstico gratuito e descubra quanto sua empresa pode evoluir.",
  },
];

/**
 * Get or assign a copy variant for the current session.
 * Persists in sessionStorage so the user sees the same variant throughout.
 */
export function getSessionVariant(): CopyVariant {
  const KEY = "hero_copy_variant";
  const stored = sessionStorage.getItem(KEY);
  if (stored) {
    const variant = COPY_VARIANTS.find((v) => v.id === stored);
    if (variant) return variant;
  }
  const variant = COPY_VARIANTS[Math.floor(Math.random() * COPY_VARIANTS.length)];
  sessionStorage.setItem(KEY, variant.id);
  return variant;
}
