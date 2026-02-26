

## Plano: Renomear campos do dataLayer

Alterar os nomes dos campos no evento `form_submit_success` em dois arquivos, removendo `lead_name`:

**`src/components/quiz/Quiz.tsx`** (linhas 50-58):
```js
// De:
lead_name, lead_email, lead_phone, lead_first_name, lead_last_name

// Para:
email, phoneNumber, nome, sobrenome
```

**`src/components/quiz/VendorQuizFlow.tsx`** (linhas 119-127):
Mesma alteração.

