export interface CopyVariant {
  id: string;
  headline: string;
  highlightedPart: string;
  description: string;
}

export const COPY_VARIANTS: CopyVariant[] = [
  {
    id: "A",
    headline: "ISO 9001 NÃO É APENAS UM CERTIFICADO NA PAREDE. É",
    highlightedPart: "30% A MAIS DE FATURAMENTO NO SEU CAIXA!",
    description:
      "Empresas certificadas crescem mais, lucram mais e fecham contratos maiores. Responda ao diagnóstico gratuito e veja exatamente onde está o gargalo que trava o seu crescimento.",
  },
  {
    id: "B",
    headline: "SUA EMPRESA ESTÁ PERDENDO CONTRATOS POR NÃO TER",
    highlightedPart: "A CERTIFICAÇÃO QUE O MERCADO EXIGE!",
    description:
      "Licitações, grandes clientes e novos mercados exigem ISO 9001. Descubra em 5 minutos o que falta para sua empresa conquistar a certificação.",
  },
  {
    id: "C",
    headline: "ENQUANTO VOCÊ APAGA INCÊNDIOS, SEUS CONCORRENTES",
    highlightedPart: "JÁ ESTÃO CERTIFICADOS E FECHANDO SEUS CONTRATOS!",
    description:
      "Processos desorganizados custam caro. Faça o diagnóstico gratuito e descubra como a ISO 9001 pode transformar sua operação em uma máquina de resultados.",
  },
  {
    id: "D",
    headline: "MAIS DE 2.000 EMPRESAS JÁ SE CERTIFICARAM COM A TEMPLUM.",
    highlightedPart: "A SUA PODE SER A PRÓXIMA!",
    description:
      "Com garantia 200% e nota 4,9 no Google, somos a consultoria líder em ISO 9001 no Brasil. Faça o diagnóstico gratuito e veja o caminho até sua certificação.",
  },
  {
    id: "E",
    headline: "RETRABALHO, PRAZOS PERDIDOS E CLIENTES INSATISFEITOS?",
    highlightedPart: "A ISO 9001 RESOLVE ISSO EM MESES, NÃO ANOS!",
    description:
      "Nossa metodologia acelera a certificação em 4 a 8 meses. Responda o diagnóstico gratuito e receba um plano de ação personalizado para sua empresa.",
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
