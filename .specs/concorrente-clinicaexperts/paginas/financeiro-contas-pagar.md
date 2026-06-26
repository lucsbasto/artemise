# Financeiro — Contas a pagar

**Rota:** `/financeiro/contas-a-pagar?interval=<ini>&interval=<fim>`
**Tipo:** Listagem (tabela) + form/modal de criação
**Screenshot:** `financeiro-contas-pagar.png` · form: `financeiro-nova-despesa.png`

## Propósito
Gestão de títulos a pagar (despesas). Espelho de Contas a receber, com seção **Pagamento** no lugar de Recebimento e situação de pagamento.

## Listagem
- Cabeçalho: **Contas a pagar** + contador · **Ações em lote ▾** · **Exportar ▾**.
- Filtros: **Período de liquidação** · **Adicionar filtro** (+) · **Buscar**.
- KPIs (clicáveis, `status`): **Vencidos** · **Vencem hoje** · **A vencer** · **Pagos** · **Total do período**.
- Colunas: checkbox · **Vencimento** · **Pagamento** · **Descrição** · **Categoria** · **Método** (ícone) · **Situação** (`Pago` verde · `Em atraso` vermelho) · **Valor líquido (R$)** · **⋮** · engrenagem. Colunas ordenáveis. Barra vermelha à esquerda = em atraso.
- Paginação 25/pág + `« ‹ › »`. **FAB (+)** → **Nova despesa**.

## Form: Nova despesa
> Deep-link: `?fin_modal_type=bill&fin_modal_mode=new&type_title=outflow` (mesmo modal de receita, `type_title=outflow`)
> Detalhe/edição: `&fin_modal_mode=info&title_id=<id>`

Estrutura **idêntica** ao Nova receita (ver `financeiro-contas-receber.md` para opções de Categoria, Recorrência, Método, Parcelamento), com diferenças:

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Valor | tel (moeda) | ✅ | mín R$ 0,01 (mascarado) |
| Data de competência | date | ✅ | default hoje |
| Contato | select busca | ✅ **obrigatório de fato** | fornecedor/contato; validação "**Campo obrigatório**" se vazio (≠ receita) |
| Categoria | select busca | ✅ | default **Selecione** (sem default, ≠ receita) |
| Descrição | text | ✅ | ph "Título a pagar" |
| Observações | textarea | — | sob "Mostrar mais opções" |
| Anexos | file multi | — | mesmos formatos / 20,97 MB |

- Seções colapsáveis: **Mostrar mais opções** (Observações/Anexos/Desconto) · **Recorrência** ("Não se repete").
- Seção **Pagamento** (repetível): **Valor*** · **Método*** (default PIX) · **Conta*** (default Banco padrão) · **Vencimento*** (hoje) · **Parcelamento*** (À vista / 2x…12x) · lixeira. Links **+ Adicionar forma de pagamento** · **Editar parcelas**. Rodapé **Valor total** + **Salvar**.
- Obs.: o Valor do Pagamento **auto-sincroniza** com o Valor do título ao digitar (cuidado ao editar via script — limpar antes).

## Fluxos / teste
**[DOC-TESTE] Despesa 001** criado (title_id `12666256`): Valor R$ 250,00 · Categoria Aluguel · Contato Clara Ribeiro · Método PIX · Conta Banco padrão · À vista. Validação capturada: "**Campo obrigatório**" no Contato (despesa exige fornecedor/contato).

## Observações para o Artemise
- Despesa **exige contato (fornecedor)** e **categoria explícita** — força melhor classificação contábil que a receita (que tem defaults). Pode ser fricção; avaliar default de categoria por tipo de despesa.
- Reuso total do modal de título (`fin_modal_type=bill`) variando só `type_title=inflow|outflow` = um componente, duas funções → consistência de UX e menos código.
