

## Diagnóstico

O problema tem **duas causas**:

### 1. Sessões zeradas (causa principal)
O objeto `DAILY_VISITORS` em `src/pages/Analytics.tsx` (linha 36-45) é **hardcoded** e só tem dados até `"2026-02-24": 35`. Não existe entrada para `"2026-02-25"` nem `"2026-02-26"`, então a linha de sessões aparece como 0 nesses dias.

### 2. Bug de timezone nos leads
Na linha 205, o `key` é gerado com `d.toISOString().split("T")[0]`, que retorna a data em **UTC**. Porém, os leads são agrupados (linha 194) usando o mesmo método `toISOString()`, então as datas são consistentes entre si. O problema é que como o usuário está no Brasil (UTC-3), um lead criado às 22h do dia 24/02 BRT aparece como 25/02 UTC, potencialmente deslocando leads entre dias.

### Plano de correção

**`src/pages/Analytics.tsx`**:

1. **Atualizar `DAILY_VISITORS`** com os dados de 25 e 26 de fevereiro (preciso saber os valores ou colocar estimativas temporárias).

2. **Corrigir timezone** na geração de chaves de data: substituir `d.toISOString().split("T")[0]` por uma função que usa a data local em vez de UTC, tanto no agrupamento de leads (linha 194) quanto no preenchimento de dias (linha 205). Isso garante consistência com o horário de Brasília.

```ts
// Antes (UTC):
const key = d.toISOString().split("T")[0];

// Depois (local):
const key = format(d, "yyyy-MM-dd");
```

Isso será aplicado nas linhas 194 e 205.

### Pergunta pendente
Qual o número de visitantes dos dias 25 e 26 de fevereiro para atualizar o `DAILY_VISITORS`? Ou prefere que eu remova essa métrica hardcoded e busque os dados de outra forma?

