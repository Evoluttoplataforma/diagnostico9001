

## Diagnóstico do problema

O código em `Obrigado.tsx` está correto — o `dataLayer.push({ event: "form_submit_success" })` foi adicionado. Porém, há um problema de **timing com o React e o guard clause**.

### Causa raiz

Na linha 23-29, o `useEffect` roda **antes** do guard clause na linha 31-39 ser avaliado durante a renderização. Porém, o problema real é que o `useEffect` depende de `state` existir, mas em React, quando o componente renderiza pela primeira vez via SPA navigation, o `useEffect` com `[]` (array vazio) executa corretamente.

O problema mais provável é que o **GTM não está capturando o evento porque ele é disparado durante uma navegação SPA** (o GTM precisa de um History Change trigger ou um Custom Event trigger configurado para `form_submit_success`). Mas como o `tally_form_submit` já funciona com a mesma abordagem, o código está correto.

**Possível causa alternativa**: O `state` pode estar `null` em algum cenário, fazendo com que o `if (state)` falhe e o evento não dispare. Isso aconteceria se o usuário recarregar a página `/obrigado-diagnostico` (o state de navegação se perde).

### Plano de correção

Adicionar um `console.log` de debug para confirmar o disparo, e também garantir que o evento é disparado independentemente via um fallback mais robusto:

**`src/pages/Obrigado.tsx`** — Melhorar o `useEffect` para logar o disparo e garantir que funciona:

```ts
useEffect(() => {
  if (state) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "tally_form_submit" });
    (window as any).dataLayer.push({ event: "form_submit_success" });
    console.log("[GTM] Eventos disparados: tally_form_submit, form_submit_success");
  } else {
    console.warn("[GTM] State não encontrado — eventos NÃO disparados");
  }
}, []);
```

Isso vai nos permitir ver nos logs do console se o problema é:
1. O `state` está null (usuário recarregou a página)
2. O evento está sendo disparado mas o GTM não está capturando

### Verificação no GTM

No GTM, o trigger para `form_submit_success` precisa ser um **Custom Event** com o nome exato `form_submit_success`. Se estiver configurado como outro tipo de trigger (ex: Form Submission), não vai funcionar.

