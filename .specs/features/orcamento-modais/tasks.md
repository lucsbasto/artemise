# Tasks: Modais de Orçamento — STATUS: em execução

- **T1 — Mock** ✅ — `itensOrcamento` (catálogo Nome→valor) em `lib/mock.ts`.
- **T2 — Modal** ✅ — `ficha/orcamento-modal.tsx` (client): toggle, dados básicos,
  tabela de itens, desconto, condições, totais, Salvar. Reusa `pacote-calc`. R-ORC-2..8.
- **T3 — Botão** ✅ — `ficha/orcamento-button.tsx` (client) + ligação na `aba-orcamentos.tsx`. R-ORC-1.
- **T4 — Verificação** ⏳ — `npm run build` + `npm run lint` verdes; smoke na rota
  `/pacientes/10318910/orcamentos`.

Gate: build + lint verdes antes do merge.
