

## O que falta no Lovable comparado com a sua página HTML

### 1. Session ID via sessionStorage
**Faltando.** Criar um hook/utilitário que gera um `sessionId` único via `sessionStorage` (chave `lp_session_id`) e disponibiliza para os eventos.

### 2. Dados do lead no dataLayer.push do `form_submit_success`
**Faltando.** Atualmente o push (linha 43 do Quiz.tsx e linha equivalente no VendorQuizFlow.tsx) envia apenas `{ event: "form_submit_success" }`. Precisa incluir:
- `session_id`
- `lead_name`
- `lead_email`
- `lead_phone`
- `lead_first_name` (primeiro nome)
- `lead_last_name` (sobrenome)
- `time_on_page_at_submit` (segundos desde o carregamento da página)

### 3. Tracking de tempo na página (`time_on_page_at_submit`)
**Faltando.** Registrar `Date.now()` ao carregar a página e calcular a diferença no momento do submit.

### 4. Evento `thank_you_page_view` na página de obrigado
**Faltando.** Na `Obrigado.tsx`, o evento atual é `tally_form_submit`. Precisa adicionar (ou substituir por) `thank_you_page_view` com `page_url` e `page_path`.

### Alterações

**Novo arquivo `src/lib/session.ts`:**
- Função `getSessionId()` que lê/cria o ID no `sessionStorage` com chave `lp_session_id`

**`src/components/quiz/Quiz.tsx`:**
- Importar `getSessionId`
- Registrar `pageStartTime = Date.now()` via `useRef` no início do componente
- No `handleWelcomeNext`, enriquecer o `dataLayer.push` com: `session_id`, `lead_name`, `lead_email`, `lead_phone`, `lead_first_name`, `lead_last_name`, `time_on_page_at_submit`

**`src/components/quiz/VendorQuizFlow.tsx`:**
- Mesmas alterações: importar `getSessionId`, registrar `pageStartTime`, enriquecer o `dataLayer.push` no `handleContactNext`

**`src/pages/Obrigado.tsx`:**
- Adicionar evento `thank_you_page_view` com `page_url: window.location.href` e `page_path: window.location.pathname` (mantendo o `tally_form_submit` existente ou substituindo — confirmo abaixo)

### Pergunta pendente
O evento `tally_form_submit` na página de obrigado deve ser **mantido junto** com o novo `thank_you_page_view`, ou **substituído** por ele?

