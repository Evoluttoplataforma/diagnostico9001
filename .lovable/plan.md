
## Adicionar evento GTM `tally_form_submit` após submissão do formulário

### Contexto

Existem dois fluxos de quiz com pontos de submissão final distintos:

1. **Fluxo principal** (`src/components/quiz/Quiz.tsx`) — função `handleSubmit`, linha ~228, logo antes do `navigate("/obrigado-diagnostico", ...)`
2. **Fluxo de vendedor** (`src/components/quiz/VendorQuizFlow.tsx`) — função `handleCompanySubmit`, linha ~180, logo antes do `navigate("/obrigado-diagnostico", ...)`

### O que será feito

Adicionar um push ao `window.dataLayer` imediatamente após o sucesso do salvamento e antes do redirecionamento, em ambos os fluxos:

```ts
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: "tally_form_submit" });
```

O evento será disparado **somente em caso de sucesso** (após salvar no banco e atualizar o Pipedrive), garantindo que o GTM só registre conversões reais.

### Arquivos a editar

| Arquivo | Onde |
|---|---|
| `src/components/quiz/Quiz.tsx` | Dentro de `handleSubmit`, antes do `navigate(...)` (linha ~228) |
| `src/components/quiz/VendorQuizFlow.tsx` | Dentro de `handleCompanySubmit`, antes do `navigate(...)` (linha ~175) |

### Detalhe técnico

Como o projeto usa TypeScript, será necessário declarar o tipo de `window.dataLayer` para evitar erros de compilação. Isso pode ser feito inline com um cast simples:

```ts
(window as any).dataLayer = (window as any).dataLayer || [];
(window as any).dataLayer.push({ event: "tally_form_submit" });
```

Nenhuma dependência nova será instalada — o GTM já está carregado no `index.html`.
