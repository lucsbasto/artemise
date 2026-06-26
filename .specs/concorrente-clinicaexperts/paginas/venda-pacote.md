# Form: Nova venda de pacote

**Rota (deep-link):** `/vendas/orcamentos?order_modal_type=order&order_modal_mode=new&order_type=combo`
**Tipo:** Modal (form de criação) · FAB → "Nova venda de pacote"
**Screenshot:** `venda-pacote.png`

## Propósito

Vende um **pacote/combo** pré-cadastrado (conjunto de procedimentos/produtos agrupados com preço fechado). Estrutura igual à venda personalizada, acrescida de um seletor **Pacote** e **Data de validade**; ao escolher o pacote, as linhas de Nome/Qtd/Valor são preenchidas a partir dos itens do pacote.

## Form — campos

### Cabeçalho (idêntico à venda personalizada)
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| **Cliente** | select busca | ✅ | + Adicionar inline |
| **Vendedor** | select busca | ✅ | default usuário logado |
| **Categoria** | select | ✅ | default Receitas de serviços |
| **Data da venda** | date | ✅ | default hoje |
| **Descrição** | text | ✅ | default "Venda de pacote" |

### Opções avançadas
- **Observações** (textarea) · **Anexos** (file, mesmos tipos/limite).

### Procedimentos/Produtos
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| **Pacote** | select busca | ✅ | "Pesquise/Selecione o pacote". Define os itens do combo |
| **Data de validade** | date | — | validade do pacote para o paciente |
| **Nome / Qtd. / Valor (R$) / Desconto un. (R$/%) / Total (R$)** | linhas | — | preenchidas pelo pacote selecionado; 🗑 remove · **+ Adicionar Procedimentos/Produtos** |

### Desconto / Recorrência / Recebimento
Idênticos à venda personalizada:
- **Desconto:** Desconto (R$/%) + Saldo (R$) uso de saldo.
- **Recorrência:** Não se repete · A cada dia/semana/duas semanas/mês/bimestre/trimestre/quadrimestre/semestre/ano.
- **Recebimento:** Valor* · Método* (PIX/Dinheiro/Boleto/Máquina de cartão/Transferência) · Conta* (Banco padrão) · Vencimento* · Parcelamento* (À vista) · + Adicionar forma de pagamento · Editar parcelas · Salvar.

## Fluxo testado — ⚠️ BLOQUEADO

Não foi possível criar `[DOC-TESTE]` de pacote: o seletor **Pacote\*** retornou **"Nenhuma opção encontrada"** — a conta de teste não tinha pacotes cadastrados no momento do teste. Pacote é obrigatório, então o save não pôde ser concluído.

> Pacotes são cadastrados em **Configurações → Pacotes** (ver `config-pacotes.md` / `config-pacotes-form.png`). Para testar a venda de pacote é preciso criar um pacote antes. Os demais campos (cliente, recebimento etc.) funcionam igual aos das outras vendas já testadas.

## Observações para o Artemise

- Pacote = catálogo de combos reutilizável: vendedor escolhe 1 item e o sistema explode nos procedimentos com preço fechado → venda rápida e padronizada de protocolos (ex.: "10 sessões de X").
- **Data de validade** por venda controla expiração do pacote para o paciente (sessões a vencer) — base para alertas de uso/renovação.
- Itens do pacote ficam editáveis após explodir (Qtd/Valor/Desconto) → permite ajuste pontual sem sair do combo.
- Dependência: exige cadastro prévio de Pacotes (Configurações). Vale prever no Artemise um onboarding que crie pacotes-modelo, senão o tipo de venda fica inutilizável (como ocorreu no teste).
