# Form: Nova venda personalizada

**Rota (deep-link):** `/vendas/orcamentos?order_modal_type=order&order_modal_mode=new&order_type=sale`
**Tipo:** Modal (form de criação) · acessível pelo FAB → "Nova venda personalizada"
**Screenshots:** `venda-personalizada.png` (form) · `venda-personalizada-detalhe.png` (detalhe pós-salvar)

## Propósito

Venda avulsa: cliente compra um ou mais **procedimentos/produtos** selecionados na hora (sem pacote pré-definido). É a venda "padrão" da clínica.

## Form — campos

### Cabeçalho
| Campo | Tipo | Obrig. | Opções / Notas |
|---|---|---|---|
| **Cliente** | select busca | ✅ | "Pesquise/Selecione"; link **+ Adicionar** cria contato novo inline |
| **Vendedor** | select busca | ✅ | pré-preenchido com o usuário logado (ex.: Lucas Bastos) |
| **Categoria** | select | ✅ | plano de contas; default **Receitas de serviços**. Lista longa (13º salário, Aluguel, Comissões…, todas as categorias financeiras) |
| **Data da venda** | date | ✅ | default hoje; tooltip ⓘ (data de competência) |
| **Descrição** | text | ✅ | default "Venda personalizada"; auto-vira "Venda personalizada para \<Cliente\>" ao selecionar o cliente |

### Opções avançadas (expander "Mostrar opções avançadas")
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| **Observações** | textarea | — | tooltip ⓘ |
| **Anexos** | file (drag&drop / "Escolher arquivos") | — | JPG, JPEG, PNG, WEBP, HEIC, HEIF, JFIF, PDF, TXT, DOC, DOCX, XLS, XLSX, OGG, MP4, MOV — < 20,97 MB |

### Procedimentos/Produtos (repetível) — **obrigatório ≥ 1**
| Coluna | Tipo | Notas |
|---|---|---|
| **Nome** | select busca | grupo "Produtos/Procedimentos" (ex.: Anamnese, Atendimento, Avaliação, Reconsulta). Ao escolher, auto-preenche Valor com o preço cadastrado |
| **Qtd.** | number | default 1 |
| **Valor (R$)** | money | preço unitário (auto do procedimento) |
| **Desconto un.** | money + seletor | valor + toggle **R$ / %** |
| **Total (R$)** | money | calculado (read-only) |
| 🗑 | botão | remove a linha |

**+ Adicionar Procedimentos/Produtos** adiciona nova linha.
> **Validação capturada:** "Selecione ao menos 1 procedimento ou produto." (bloqueia salvar sem item).

### Desconto (seção expansível — default "Sem desconto ou uso de saldo")
| Campo | Tipo | Notas |
|---|---|---|
| **Desconto** | money + seletor **R$ / %** | desconto geral sobre a venda |
| **Saldo (R$)** | money | "uso de saldo" — abate do saldo/crédito pré-pago do paciente |

### Recorrência (expansível — default "Não se repete")
Select: **Não se repete · A cada dia · A cada semana · A cada duas semanas · A cada mês · A cada bimestre · A cada trimestre · A cada quadrimestre · A cada semestre · (A cada ano)**. Gera vendas recorrentes.

### Recebimento (repetível)
| Campo | Tipo | Obrig. | Opções |
|---|---|---|---|
| **Valor** | money | ✅ | auto = total da venda |
| **Método** | select | ✅ | **PIX** (default) · Dinheiro · Boleto · Máquina de cartão · Transferência |
| **Conta** | select | ✅ | conta bancária; default **Banco padrão** |
| **Vencimento** | date | ✅ | default hoje |
| **Parcelamento** | (campo + "Editar parcelas") | ✅ | default **À vista** |
| 🗑 | botão | | remove a forma de pagamento |

- **+ Adicionar forma de pagamento** (múltiplas formas) · **Editar parcelas** (define nº de parcelas/datas).
- **Valor total: R$ X** (rodapé) · botão **Salvar**.

## Fluxo testado — `[DOC-TESTE]`

1. FAB → "Nova venda personalizada".
2. Cliente = **Clara Ribeiro (Paciente de exemplo)**; procedimento **Anamnese** (auto R$ 250,00); Descrição = `[DOC-TESTE] Venda personalizada 001`; recebimento PIX / Banco padrão / À vista (auto R$ 250,00).
3. Tentativa de salvar sem item → validação "Selecione ao menos 1 procedimento ou produto".
4. **Salvou** → drawer "Detalhes da venda" (badge **Personalizada**), `order_id=7374271`, recebimento **Em aberto** R$ 250,00.

**Registro criado:** `[DOC-TESTE] Venda personalizada 001` (order_id 7374271).

## Observações para o Artemise

- Selecionar o procedimento puxa preço automaticamente do catálogo → reduz erro de digitação e padroniza tabela de preços.
- Desconto por linha (un.) **e** desconto geral, ambos em R$ ou %, cobrem promoções item-a-item e no total.
- Recorrência nativa na venda permite contratos/mensalidades sem módulo separado.
- Múltiplas formas de pagamento + parcelamento embutidos: venda mista (parte PIX, parte cartão) num só fluxo.
- A descrição auto-gerada com o nome do cliente é um detalhe de UX que poupa digitação.
