

## Diagnóstico

O código está correto e funcionando. Testei no preview: o `console.log("[GTM] Evento disparado: form_submit_success")` aparece no console imediatamente após o submit do modal.

### Ações necessárias (não são mudanças de código):

1. **Publicar o app** — Clicar em Publish > Update para que as alterações do código cheguem ao site publicado (onde o GTM Preview está rodando).

2. **Verificar configuração do GTM** — No GTM, o trigger precisa ser:
   - Tipo: **Custom Event**
   - Nome do evento: `form_submit_success`
   - (Não usar "Form Submission" que monitora submits de `<form>` HTML)

Nenhuma alteração de código é necessária.

