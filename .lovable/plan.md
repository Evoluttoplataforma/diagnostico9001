

## Plano: Adicionar evento `form_submit_success` no dataLayer

### Alteração

**`src/pages/Obrigado.tsx`** — Adicionar o push do evento `form_submit_success` no `useEffect` existente, junto ao `tally_form_submit`:

```ts
useEffect(() => {
  if (state) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "tally_form_submit" });
    (window as any).dataLayer.push({ event: "form_submit_success" });
  }
}, []);
```

Isso garante que ambos os eventos sejam disparados na página de resultado, após navegação SPA completa, permitindo captura pelo GTM.

