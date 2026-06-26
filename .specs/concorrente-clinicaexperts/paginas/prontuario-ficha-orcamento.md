# Prontuário — Ficha Orçamento

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Orçamento**)
**Tipo:** Formulário de atendimento (montador de orçamento/proposta com cálculo em tempo real)
**Screenshots:**
`prontuario-orcamento-02-aberto.png` (estrutura vazia) ·
`prontuario-orcamento-03-busca-item.png` (busca de procedimento) ·
`prontuario-orcamento-04-item-add.png` (item adicionado + linha extra) ·
`prontuario-orcamento-05-calculo.png` (qtd × valor) ·
`prontuario-orcamento-06-desconto-pct.png` (toggle R$/%) ·
`prontuario-orcamento-07-condicao-pgto.png` (modal condição) ·
`prontuario-orcamento-08-metodo.png` (modal método) ·
`prontuario-orcamento-09-validacao-cond.png` (validação) ·
`prontuario-orcamento-10-completo.png` (orçamento finalizado)

## Propósito

Montar um orçamento de procedimentos/produtos **dentro do próprio atendimento**, com pacotes, descontos (por item e global, em R$ ou %) e condições/formas de pagamento. Calcula **Subtotal / Desconto / Total** automaticamente em tempo real. O orçamento fica embutido no atendimento (persiste junto, sem botão "Salvar" próprio).

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.
> A ficha é uma seção do atendimento. Navegação entre fichas pelos botões **Voltar / Próximo** (rodapé). Rodapé global: **Cancelar** · **Finalizar atendimento** (não acionados — ver "Ações").

## Estrutura (4 blocos)

```
Pacote        → select (aplica pacote pré-montado de procedimentos)
Itens         → tabela repetível (Nome | Qtd | Valor unit. | Desc. unit. | Total | 🗑)
Desconto      → desconto global (R$ ou %)
Condições de pagamento → 1..N condições (modal); métodos + parcelamento
Valor total   → resumo read-only (Subtotal / Desconto / Total)
```

## Bloco 1 — Pacote

- **Pacote** — vue-multiselect ("Selecione"). Aplica um **pacote pré-montado** de procedimentos (preenche os itens automaticamente).
- ⚠️ **Verificado:** vazio nesta conta ("Nenhuma opção") — nenhum pacote cadastrado. Depende de catálogo de pacotes em Configurações.

## Bloco 2 — Itens (tabela repetível)

Botão **+ Adicionar procedimento/produto** acrescenta linha. **Ao selecionar um item, uma nova linha vazia é anexada automaticamente** (sempre há uma linha em branco ao final).

| Coluna | Tipo | Obrig. | Cálculo / Notas |
|---|---|---|---|
| **Nome** | vue-multiselect de busca ("Pesquise/Selecione") | sim | Catálogo agrupado em **"Produtos/Procedimentos"**. Opções carregam **async ao digitar** (vazio até teclar; "Nada foi encontrado…" sem termo). Itens vistos: Anamnese, Atendimento, **Avaliação**, Reconsulta. |
| **Quantidade** | number (`eui-input-number`) | sim | default **1** |
| **Valor unit.** | money R$ (máscara R$) | sim | Auto-preenche com o **preço de catálogo** do item (Avaliação veio R$ 0,00 → editável). |
| **Desc. unit.** | money/percent (`v-money`) + toggle **R$ / %** | não | Desconto **por unidade**. Toggle ao lado define R$ ou %. |
| **Total** | money R$ (read-only) | — | `Quantidade × (Valor unit. − Desc. unit.)` (Desc. em R$). |
| (ação) | ícone 🗑 | — | remove a linha |

### Cálculo de linha — verificado
- `Qtd 2 × Valor R$ 200,00` → **Total R$ 400,00**
- com `Desc. unit. R$ 50,00` → `2 × (200 − 50)` → **Total R$ 300,00**

## Bloco 3 — Desconto (global)

- **Desconto** — campo `v-money` + toggle **R$ / %** (dropdown com as duas opções).
- Aplicado sobre o **Subtotal** (que já é líquido dos descontos por item).

### Regra de desconto/total — verificado
| Desconto global | Subtotal | Desconto (R$) | **Total** |
|---|---|---|---|
| R$ 30,00 | R$ 300,00 | R$ 30,00 | **R$ 270,00** |
| 20 % | R$ 300,00 | R$ 60,00 (20% de 300) | **R$ 240,00** |

Ao alternar R$→% o campo reseta para um default (10,00 = 10%). `%` incide sobre o Subtotal.

## Bloco 4 — Condições de pagamento

Botão **+ Adicionar condição** abre o **modal "Adicionar condição de pagamento"**.

### Modal — campos
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| **Desconto** | `v-money` + toggle R$ / % | não | desconto **da condição** (além do global) |
| **Valor*** | money R$ | **sim** | **pré-preenchido com o Total** do orçamento (R$ 240,00). Soma dos métodos deve casar com o total. |
| **Método*** | select | **sim** | ver opções abaixo (default **PIX**, com ícone) |
| **Parcelamento*** | select | **sim** | default **À vista** |
| 🗑 | ação | — | remove a linha de método |
| **+ Adicionar método de pagamento** | botão | — | divide a condição em **vários métodos** (split de pagamento) |
| **Valor total** | read-only | — | total do orçamento que a condição deve cobrir (R$ 240,00) |
| **Aplicar** | botão | — | confirma; condição vira um "chip" na lista |

**Métodos (verificado):** PIX · Boleto · Cartão de crédito · Cartão de débito · Dinheiro · Depósito · Transferência · Máquina de cartão · Outras bandeiras · Mais métodos.
**Parcelamento (verificado):** À vista · 2x · 3x · … · 12x.

**Resultado aplicado:** a condição aparece na lista como chip **"R$ 240,00 em PIX"** (ícone + texto + 🗑 para remover). Múltiplas condições podem coexistir.

### Validação capturada
Aplicar com **Valor = R$ 0,00** em um método → erro (banner vermelho):
> **"Não é permitido aplicar uma condição com valor zero em algum método de pagamento"**

(Não há "Salvar sem item" testável na ficha — a ficha não tem botão Salvar próprio; ver "Ações".)

## Bloco 5 — Valor total (resumo read-only)

- **Subtotal:** soma dos `Total` de cada linha (líquido do Desc. unit.) — R$ 300,00
- **Desconto:** desconto global em R$ (mesmo quando informado em %) — R$ 60,00
- **Total:** `Subtotal − Desconto` — R$ 240,00

### Ordem de cálculo (modelo verificado)
```
Total_linha   = Qtd × (ValorUnit − DescUnit)          # desconto por item
Subtotal      = Σ Total_linha
DescontoGlobal= valor R$  OU  Subtotal × (%/100)       # incide no Subtotal
Total         = Subtotal − DescontoGlobal
Condições de pagamento: Σ Valor(métodos) deve = Total
```

## Ações (documentadas, não acionadas)

- A ficha Orçamento **não tem botões próprios** de "Gerar venda", "Gerar cobrança", "Imprimir" nem status "Aberto/Aprovado". Os únicos controles inline são **Adicionar procedimento/produto** e **Adicionar condição**.
- **Não há botão "Salvar"** na ficha — o orçamento persiste embutido no atendimento (autosave por campo).
- A conversão em venda/cobrança ocorre via **Finalizar atendimento** (rodapé global) ou no módulo **Vendas** — **não acionados** (instrução de segurança: não gerar NF/cobrança real nem finalizar).
- **Voltar / Próximo** (rodapé) navegam entre fichas do atendimento.

## Teste [DOC-TESTE] criado (atendimento `1043a6a9-7355-4136-a749-2d993dfe133e`, paciente Clara Ribeiro)

- **Item:** Avaliação — Qtd **2**, Valor unit. **R$ 200,00**, Desc. unit. **R$ 50,00** → Total **R$ 300,00**
- **Desconto global:** **20%** → R$ 60,00
- **Condição de pagamento:** **R$ 240,00 em PIX** (À vista)
- **Total do orçamento: R$ 240,00**

> Não finalizado e nenhuma venda/cobrança gerada. Dados ficam no atendimento como rascunho.

## Observações para o Artemise

- **Orçamento dentro do atendimento** encurta o funil: avalia → orça → fecha na mesma tela (não precisa abrir módulo de Vendas para propor).
- **Dois níveis de desconto** (por item *e* global), cada um em **R$ ou %**, cobrem negociação real de balcão. Há ainda um **3º nível** opcional (desconto por condição de pagamento no modal) — útil p/ "à vista no PIX = 5% off".
- **Split de pagamento** (vários métodos por condição, cada um com parcelamento próprio) é flexível e a soma é validada contra o Total — bom modelo a copiar.
- **Total calculado em tempo real** reduz erro e acelera o fechamento.
- **Catálogo agrupado** (Produtos/Procedimentos) com preço pré-cadastrado por item garante consistência comercial; **pacotes** habilitam upsell (vazio nesta conta, mas o slot existe).

### Modelo de dados sugerido
```
orcamento (1:1 atendimento, ou avulso)
  ├─ pacote_id?            (FK pacote pré-montado)
  ├─ desconto_valor + desconto_tipo (RS|PCT)    # global, incide no subtotal
  ├─ subtotal, desconto_total, total            (derivados, read-only)
  ├─ itens[]  : { produto_id, nome, quantidade,
  │              valor_unit, desc_unit, desc_unit_tipo (RS|PCT),
  │              total_linha (derivado) }
  └─ condicoes_pagamento[] : {
        desconto_valor + desconto_tipo,          # desconto da condição
        metodos[] : { valor, metodo (enum), parcelamento (à vista|2x..12x) }
     }
  status sugerido: rascunho | aberto | aprovado | recusado | convertido_em_venda
```
**Melhoria sobre o concorrente:** a CE **não** expõe status do orçamento (aberto/aprovado) nem botão direto de "gerar venda/imprimir" na ficha — adicionar **estado explícito + ação de conversão/impressão/envio (PDF/WhatsApp)** seria diferencial. Validar também a soma das condições == total no **backend** (eles só validam no front).
