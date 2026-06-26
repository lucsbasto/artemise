# Form: Nova venda de crédito (modal "Nova venda de saldo")

**Rota (deep-link):** `/vendas/orcamentos?order_modal_type=order&order_modal_mode=new&order_type=credit`
**Tipo:** Modal (form de criação) · FAB → "Nova venda de crédito" (título do modal: **"Nova venda de saldo"**)
**Screenshots:** `venda-credito.png` (form) · `venda-credito-detalhe.png` (detalhe pós-salvar)

## Propósito

Vende **saldo/crédito pré-pago** para o paciente. Não há itens (procedimentos): o paciente paga um valor que vira saldo na conta dele, abatido depois em vendas futuras (campo "Uso de saldo"/"Saldo (R$)" nas outras vendas). Diferença-chave: **sem seção Procedimentos/Produtos**; em vez disso, um campo **Valor** no topo define o crédito vendido.

## Form — campos

### Cabeçalho
| Campo | Tipo | Obrig. | Opções / Notas |
|---|---|---|---|
| **Valor** | money | ✅ | valor do crédito a vender (canto sup. esquerdo; default R$ 0,00). Alimenta automaticamente o Recebimento |
| **Cliente** | select busca | ✅ | "Pesquise/Selecione"; **+ Adicionar** cria contato inline |
| **Vendedor** | select busca | ✅ | default usuário logado |
| **Categoria** | select | ✅ | default **Receitas de serviços** (mesma lista do plano de contas) |
| **Data da venda** | date | ✅ | default hoje; tooltip ⓘ |
| **Descrição** | text | ✅ | default "Venda de crédito" |

### Opções avançadas (expander)
- **Observações** (textarea) · **Anexos** (file — mesmos tipos/limite da venda personalizada: JPG/PNG/WEBP/HEIC/PDF/DOC/XLS/MP4/MOV…, < 20,97 MB).

### Desconto (expansível — "Sem desconto ou uso de saldo")
- **Desconto** (money + toggle R$ / %) · **Saldo (R$)** (uso de saldo).

### Recorrência (expansível — "Não se repete")
- Mesmas opções: Não se repete · A cada dia/semana/duas semanas/mês/bimestre/trimestre/quadrimestre/semestre/ano.

### Recebimento (repetível)
| Campo | Tipo | Obrig. | Opções |
|---|---|---|---|
| **Valor** | money | ✅ | auto = Valor do crédito |
| **Método** | select | ✅ | PIX (default) · Dinheiro · Boleto · Máquina de cartão · Transferência |
| **Conta** | select | ✅ | default Banco padrão |
| **Vencimento** | date | ✅ | default hoje |
| **Parcelamento** | campo + "Editar parcelas" | ✅ | default À vista |

- **+ Adicionar forma de pagamento** · **Editar parcelas** · **Valor total: R$ X** · **Salvar**.

## Fluxo testado — `[DOC-TESTE]`

1. FAB → "Nova venda de crédito" (modal "Nova venda de saldo").
2. **Valor** = R$ 150,00 (auto-preencheu Recebimento R$ 150,00); Cliente = **Clara Ribeiro (Paciente de exemplo)**; Descrição = `[DOC-TESTE] Venda de credito 001`; PIX / Banco padrão / À vista.
3. **Salvou** → drawer "Detalhes da venda" (badge **Crédito**), `order_id=7374311`. Sem tabela de procedimentos; só Recebimento (Em aberto R$ 150,00) + breakdown Uso de saldo / Desconto / Juros / Multa / Tarifas.

**Registro criado:** `[DOC-TESTE] Venda de credito 001` (order_id 7374311).

## Observações para o Artemise

- Modelo **pré-pago/carteira**: cliente compra saldo e gasta depois. Fideliza e antecipa caixa. O saldo é consumido via "Uso de saldo" nas demais vendas.
- Reaproveita 100% do mesmo modal/engine das outras vendas, só troca `order_type` e oculta a seção de itens → arquitetura de form única parametrizada por tipo (bom padrão para o Artemise replicar).
- Sem itens, mas mantém categoria/recebimento/parcelamento → o saldo entra no financeiro como receita normal.
