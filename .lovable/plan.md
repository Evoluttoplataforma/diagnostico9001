
## Problema

O evento `tally_form_submit` é disparado via `dataLayer.push` imediatamente antes do `navigate("/obrigado-diagnostico")`. O React Router faz uma navegação SPA (sem reload de página), então o GTM Preview Mode pode não capturar o evento disparado fora do ciclo de vida da página de destino.

## Solução

Mover o disparo do evento para a página `Obrigado.tsx`, usando um `useEffect` que roda uma única vez quando o componente monta. Isso garante que o evento seja disparado no contexto correto, após a navegação ter ocorrido.

Além disso, remover os pushes duplicados de `Quiz.tsx` e `VendorQuizFlow.tsx` para evitar duplo disparo.

## Arquivos a editar

### 1. `src/pages/Obrigado.tsx`
Adicionar `useEffect` que dispara o evento ao montar o componente (somente quando há `state` válido, ou seja, é uma submissão real):

```ts
useEffect(() => {
  if (state) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "tally_form_submit" });
  }
}, []);
```

### 2. `src/components/quiz/Quiz.tsx`
Remover as duas linhas de `dataLayer.push` antes do `navigate(...)`.

### 3. `src/components/quiz/VendorQuizFlow.tsx`
Remover as duas linhas de `dataLayer.push` antes do `navigate(...)`.

## Por que isso resolve

- O `useEffect` no `Obrigado.tsx` roda **após** a renderização da página de destino
- O GTM tem tempo de processar o evento porque ele ocorre num componente já montado
- Evita disparo duplo
- O evento só é disparado se `state` existir (ou seja, veio de uma submissão real, não de acesso direto à URL)
