# Financeiro — Contas financeiras

**Rota:** `/financeiro/contas/`
**Tipo:** Listagem (cards) + form/modal de criação
**Screenshot:** `financeiro-contas.png` · form: `financeiro-nova-conta.png`

## Propósito
Cadastro das contas financeiras da clínica (bancos, caixa, cofre, investimento) com saldo atual e saldo total consolidado. É o "plano de contas financeiras" usado nas formas de pagamento de receitas/despesas.

## Listagem
- Título **Contas financeiras**. Grid de **cards**, um por conta:
  - Ícone (banco/caixa) · **Nome** (ex.: "Banco padrão") · subtítulo do tipo (ex.: "Conta Corrente", "Caixa") · menu **⋮** (editar/excluir/etc).
  - **Saldo Atual** (ex.: R$ 2.431,00).
- Card de rodapé: **Saldo total** (soma de todas as contas).
- **FAB (+)** inferior direito → 3 opções de criação.

## FAB — tipos de criação
`Novo cofre` · `Novo caixa` · `Nova conta`
Cada um abre o **mesmo modal** variando o tipo: deep-link `?financial_account_modal_type=<safe|cashier|account>&financial_account_modal_mode=new`.

## Form: Nova conta / Novo caixa / Novo cofre
| Campo | Tipo | Obrig. | Opções / Notas |
|---|---|---|---|
| Tipo de conta | select | ✅ | `Cofre` · `Caixa` · `Conta corrente` · `Conta de recebimento` · `Conta poupança` · `Investimento` |
| Descrição | text | ✅ | nome da conta |
| Ativo | checkbox/toggle | — | default ligado |
| Saldo inicial (R$) | tel (moeda) | ✅ | valor de abertura |
| Data do saldo inicial | date | ✅ | default hoje |

Botão **Salvar**.

## Fluxos / teste
**[DOC-TESTE] Conta 001** criada: Tipo **Conta corrente** · Saldo inicial R$ 10,00 · data hoje. Salvou e retornou à listagem (novo card).

## Observações para o Artemise
- Tipagem de conta (corrente / recebimento / poupança / investimento / caixa / cofre) permite relatórios por natureza e separar caixa físico de conta bancária.
- **Saldo inicial + data** = ponto de partida para reconciliação; o saldo atual é saldo inicial ± lançamentos liquidados.
- Contas alimentam o select **Conta** nas formas de pagamento de receitas/despesas e o widget "Contas financeiras" do dashboard.
- Não há conciliação bancária / importação de extrato (OFX) nesta versão — oportunidade de diferenciação.
