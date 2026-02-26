

## Plano: Disparar `form_submit_success` no primeiro formulário

### Problema
O evento `form_submit_success` está sendo disparado apenas na página `/obrigado-diagnostico` (fim do diagnóstico). O usuário quer que dispare no momento em que o lead preenche o primeiro modal (nome, email, celular, empresa).

### Alteração

**`src/components/quiz/Quiz.tsx`** — Adicionar o `dataLayer.push` no início do `handleWelcomeNext`, antes de qualquer chamada assíncrona:

```ts
const handleWelcomeNext = async (welcomeFormData: WelcomeFormData) => {
  // Disparar evento GTM imediatamente após submissão do formulário
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: "form_submit_success" });
  console.log("[GTM] Evento disparado: form_submit_success");

  setData((prev) => ({ ...prev, welcomeData: welcomeFormData }));
  setCurrentStep("chat");
  // ... resto do código existente
```

**`src/components/quiz/VendorQuizFlow.tsx`** — Mesmo tratamento no fluxo de vendor. Adicionar no `handleCompanySubmit` (que é onde o formulário do vendor é efetivamente submetido) ou no ponto equivalente de captura inicial. Como o vendor já tem dados pré-preenchidos, o disparo deve acontecer no `handleContactNext`:

```ts
const handleContactNext = (contactData: VendorContactData) => {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: "form_submit_success" });
  console.log("[GTM] Evento disparado: form_submit_success (vendor)");

  setData((prev) => ({ ...prev, contact: contactData }));
  setCurrentStep("company");
};
```

**`src/pages/Obrigado.tsx`** — Manter o evento `tally_form_submit` existente, mas remover o `form_submit_success` duplicado para evitar contagem dupla.

