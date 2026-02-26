

## Plano: Adicionar colunas UTM na tabela de leads recentes

Atualmente a tabela "Últimos 10 Leads" mostra apenas "UTM Source". Vamos adicionar as demais UTMs que tiverem valor.

**Arquivo:** `src/pages/Analytics.tsx`

**Alterações na tabela (linhas ~746-811):**

1. Adicionar colunas no `<thead>`: UTM Medium, UTM Campaign, UTM Content, UTM Term (após UTM Source)
2. Adicionar as células correspondentes no `<tbody>` para cada lead, exibindo `l.utm_medium || "—"`, `l.utm_campaign || "—"`, `l.utm_content || "—"`, `l.utm_term || "—"`

Todas as novas colunas seguem o mesmo padrão visual da coluna UTM Source existente (text-xs, text-muted-foreground, whitespace-nowrap).

