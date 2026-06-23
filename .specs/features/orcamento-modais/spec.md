# Spec: Modais de Orçamento (Lote 5)

Fonte: `docs/paginas/09-paciente-orcamento-modais.md`. Tela complexa anexa à
ficha do paciente → aba **Orçamentos** → botão **+ Adicionar novo orçamento**.

## Escopo
Um único modal de criação com toggle interno **Tipo de orçamento** (`Personalizado | Pacote`)
que troca título, presença do campo Pacote e comportamento da tabela de itens.

## Requisitos
- **R-ORC-1** — Botão "+ Adicionar novo orçamento" na aba Orçamentos abre o modal.
- **R-ORC-2** — Toggle Personalizado|Pacote troca título (`Novo orçamento personalizado`
  ↔ `Novo orçamento de pacote`) sem fechar; preserva Cliente/Vendedor; reseta itens.
- **R-ORC-3** — Dados básicos: Cliente* (pré = paciente da ficha), Vendedor* (pré = usuário logado),
  Pacote* (só modo pacote), disclosure "Mostrar opções avançadas".
- **R-ORC-4** — Tabela Procedimentos/Produtos: colunas Nome, Qtd., Valor (R$), Desconto un. (R$/%),
  Total (R$) somente-leitura, lixeira. Selecionar Nome preenche Valor. Link "+ Adicionar Procedimentos/Produtos".
- **R-ORC-5** — Desconto do orçamento: dropdown "Sem desconto ou uso de saldo" / R$ / %.
- **R-ORC-6** — Condições de pagamento: link "+ Adicionar condição" (método + valor).
- **R-ORC-7** — Totais: Subtotal + "Valor total" recalculados em tempo real (reusa `pacote-calc`).
- **R-ORC-8** — Rodapé com botão **Salvar** (roxo). Fechar por × / Esc / overlay.

## Decisões
- Reuso de `lib/pacote-calc.ts` (fórmulas §9 idênticas: itemTotal/subtotal/valorTotal).
- Reuso de `ui/modal`, `ui/field` (Field/Input/Select).
- Mock novo: `itensOrcamento` (catálogo Nome→valor de tabela).
- Sem persistência (mock estático, D2): Salvar apenas fecha o modal.

## Não-escopo (inferidos da spec, fora desta fatia)
- Autocomplete real com debounce (selects estáticos bastam no mock).
- Converter em venda / PDF / enviar.
- Sincronização de estado por query string (`sale_quote_*`).
