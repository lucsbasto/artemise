# Configurações — Pacotes (Combos)

**Rota:** `/configuracoes/pacotes` · form deep-link: `?order_modal_type=combo&order_modal_mode=new`  ·  **Tipo:** Listagem + form modal  ·  **Screenshots:** `config-pacotes.png`, `config-pacotes-form.png`

## Propósito

Combos de **procedimentos + produtos** vendidos como um único pacote, com preço/desconto agregado e validade. Modelo de "combo" (internamente `order_modal_type=combo`) — pacote de sessões/itens com preço fechado.

## Listagem

- Cabeçalho: **Pacotes** + contador.
- **Adicionar filtro** + **Buscar**.
- Estado vazio: "Hmm, está vazio por aqui!" + CTA **"Novo pacote"**.
- Colunas (provável): Descrição · Validade · Valor · Ativo + menu de linha.
- Paginação "25 por página". **FAB (+)** → novo pacote.

## Form: Novo pacote

> Deep-link: `?order_modal_type=combo&order_modal_mode=new`.

### Cabeçalho
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Descrição | text | ✅ | nome do pacote |
| Validade | select | ✅ | default **Ilimitado** (provável: Ilimitado / período em dias) |
| Ativo | toggle | — | default ligado (tooltip ?) |
| Observações | textarea | — | tooltip (?) |

### Procedimentos/Produtos (itens — repetível)
Linha de item com colunas: **Nome** (search/select de procedimento ou produto) · **Qtd.** (default 1) · **Valor (R$)** · **Desconto un.** (valor + select R$/%) · **Total (R$)** (calculado) · ícone lixeira (remover).
- Botão **+ Adicionar Procedimentos/Produtos** (adiciona nova linha).

### Rodapé
- **Desconto** (global do pacote): select **"Sem desconto"** (provável: Sem desconto / valor R$ / percentual %).
- **Valor total**: R$ calculado (soma dos itens − descontos). Read-only.

**Botão Salvar.** ⚠️ Teste **[DOC-TESTE] Pacote 001** preenchido (Descrição), mas **NÃO salvou**: o pacote exige ≥1 item em Procedimentos/Produtos, e o seletor de itens retornou "Nenhuma opção encontrada" ao buscar (provavelmente busca apenas produtos do estoque, que está vazio; procedimentos não apareceram na busca). Form documentado por screenshot. Sem bloqueio destrutivo — apenas catálogo vazio.

## Observações para o Artemise

- **Pacote = combo de itens** (procedimentos + produtos) com preço fechado, desconto por item E desconto global, validade e total calculado. Padrão forte para venda de "pacotes de sessões" (muito comum em estética/odonto).
- Internamente é um `order` do tipo `combo` (mesma engine de pedidos/vendas) — reúso de modelo de pedido para pacote. Insight de arquitetura: pacote não é entidade isolada, é um template de venda.
- Desconto em dois níveis (unitário + global) dá flexibilidade comercial. Modelar `desconto` com tipo (R$/%) tanto no item quanto no agregado.
- Validade controla expiração do pacote vendido (sessões válidas por N dias) — alimenta cobrança/uso de saldo de sessões.
- Dependência de catálogo: pacote só é útil com procedimentos/produtos cadastrados; UX poderia permitir criar item inline (hoje exige catálogo pré-existente e a busca não trouxe procedimentos — possível fricção/bug a explorar).
