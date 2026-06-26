# Estoque — Controle de estoque

**Rota:** `/estoque/items`  ·  **Tipo:** Listagem + modais de CRUD/movimentação  ·  **Screenshot:** `estoque.png`, `estoque-novo-item.png`, `estoque-item-detalhe.png`, `estoque-movimentar.png`, `estoque-filtro.png`

## Propósito

Controle de estoque de produtos/insumos da clínica. Módulo de **rota única** (`/estoque/items`) — não há sub-rotas reais (categorias, fornecedores e movimentações vivem dentro de modais/painéis, não em páginas separadas). Cada item carrega preço, custos, saldo e configurações de venda/uso em atendimento. Movimentações alimentam um histórico (kardex) por item.

## Listagem (Controle de estoque)

- Cabeçalho: título **Controle de estoque** + contador (`N registros`), **Ações em lote ▾** (desabilitado até selecionar linhas), **Exportar ▾**.
- **Adicionar filtro** (+) e campo **Buscar**.
- **Cartões-resumo / abas de status** (contadores clicáveis que filtram a lista):
  - **Estoque baixo** (vermelho) · **Estoque alto** (amarelo) · **Todos** (azul, selecionado por padrão).
- Tabela — colunas: checkbox seleção · **Item** (nome + sub-rótulo `[SKU` + miniatura/ícone) · **Categoria** (badge, ex.: "Padrão") · **Disponível** · **Custo médio** (com tooltip ?) · **Preço** (com tooltip ?) · **Ativo** (toggle on/off) · menu ⋮ por linha · engrenagem (config de colunas).
- Paginação: seletor "25 por página" (10/25/50/100) + navegação `« ‹ 1 › »`.
- Estado vazio: "Hmm, está vazio por aqui! / Nenhum registro encontrado." + botão **Adicionar novo item**.
- **FAB (+)** inferior direito: única opção **"Cadastrar item padrão"**.

### Exportar
- **CSV** · **Excel**.

### Ações em lote
- Habilitam ao marcar linhas (não exploradas — exigem seleção).

## Filtros (Adicionar filtro)

Painel lateral com categorias de filtro (esquerda) + valores (direita) + **Limpar**:
- **Tipos** — valores: `Item padrão` · `Composição/Kit` · `Materiais de Expediente` · `Patrimônio`.  *(São os 4 tipos/categorias de item do sistema.)*
- **Status**
- **Venda** (habilitado p/ venda ou não)
- **Material de atendimento** (habilitado p/ uso em atendimento ou não)

## Form: Cadastrar item padrão

> Deep-link: `?stock_modal_type=stock_items&stock_modal_mode=new&modal_form=%7B%22type%22%3A%22default%22%7D`
> Modal "Cadastrar item padrão". Apenas **Nome** e **Código SKU** são sempre obrigatórios; campos extras viram obrigatórios condicionalmente ao ativar a seção correspondente.

### Identificação
| Campo | Tipo | Obrig. | Opções/Validação/Notas |
|---|---|---|---|
| Imagem | file (JPG/PNG) | — | Botão "Escolher imagem" |
| Nome | text | ✅ | ph "Digite" (`data-cy=input-product-name`) |
| Marca | select busca | — | "Pesquise/Selecione"; link **+ Adicionar** cria marca inline |
| Código SKU | text | ✅ | ph "Digite" (`data-cy=input-sku-code`); tem tooltip ? |
| Código de barras | text | — | `data-cy=input-barcode` |
| Ativo | toggle | — | **Ligado por padrão** (tooltip ?) |

### Seção "Vendas"
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Habilitar para venda | toggle | — | Desligado por padrão |
| **Preço de venda** | money (tel) | ✅* | **Só aparece e é obrigatório quando "Habilitar para venda" está ligado** (`data-cy=input-sale-price`) |

### Seção "Material de atendimento"
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Habilitar para uso em atendimentos | toggle | — | Desligado por padrão (tooltip ?) |
| **Tamanho da embalagem** | number (tel) | ✅* | **Só aparece/obrigatório quando "uso em atendimentos" ligado** (`data-cy=input-recipient-size`). Define unidades por embalagem p/ consumo por atendimento |

### Seção "Estoque"
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Estoque mínimo | number (money mask) | — | `data-cy=input-minimum-balance`; alimenta alerta "Estoque baixo" |
| Estoque máximo | number (money mask) | — | `data-cy=input-maximum-balance`; alimenta alerta "Estoque alto" |

- Botão **Cadastrar** (split-button com seta — provável "cadastrar e adicionar outro").

## Painel: Detalhes do item

> Abre como slide-over após salvar (`?stock_modal_type=stock_item_details&model_uuid=<uuid>`).

- Cabeçalho com nome + tipo ("Item padrão").
- Métricas: **Código SKU** · **Estoque atual** (em vermelho quando 0/baixo, "N itens") · **Lote atual** (ex.: "Padrão") · **Preço de venda** · **Custo médio de compra** · **Conteúdo da embalagem** (ex.: "10un").
- **Histórico de movimentações** (kardex) — lista paginada; vazio inicialmente.
- Rodapé: **Excluir** · **Editar** · **Movimentar item**.

## Form: Cadastrar movimentação

> Deep-link a partir do item: `?stock_modal_type=stock_operations&stock_modal_mode=new&modal_form={"stockItemUuid":"<uuid>"}`
> Modal "Cadastrar movimentação".

| Campo | Tipo | Obrig. | Opções/Notas |
|---|---|---|---|
| Tipo de movimentação | select | ✅ | **Reposição** (default) · **Entrada** · **Devolução** · **Venda** · **Uso** · **Descarte** · **Amostra grátis** · **Manutenção** · **Quebra (+)** · **Quebra (-)** |
| Data | date | ✅ | default hoje |
| Hora | time | — | default agora |
| Custo unitário | money | — | tooltip ? (afeta custo médio) |
| Quantidade | number (tel, max 11 díg.) | ✅ | |
| Observações | text | — | |

- **Pré-visualização ao vivo** no rodapé do modal: **Estoque atual (itens)** · **Movimentação (itens)** · **Estoque final (itens)** — recalcula conforme tipo/quantidade.
- Botão **Cadastrar** → retorna ao painel de detalhes; atualiza saldo e adiciona linha ao histórico.

## Fluxos testados ([DOC-TESTE])

1. **Item criado** — `[DOC-TESTE] Item 001`, SKU `DOC-TESTE-001`, Preço de venda R$ 150,00, Tamanho embalagem 10, Estoque mín. 5 (venda + uso em atendimento habilitados). Salvou; abriu painel de detalhes (uuid `7776b7c8-7e64-430e-beb8-5c3ec1d34088`); estoque inicial 0 → marcou "Estoque baixo".
2. **Movimentação criada** — tipo **Entrada**, quantidade 100, obs `[DOC-TESTE] Entrada inicial`. Salvou; **Estoque atual passou a 100 itens** e o histórico de movimentações registrou a entrada.

## Observações para o Artemise

- **Tipos de item** (Item padrão / Composição-Kit / Materiais de Expediente / Patrimônio) cobrem cenários distintos: produto vendável, kit composto, material de escritório e bens patrimoniais — modelar como `tipo` no item, não tabelas separadas.
- Toggles **"Habilitar para venda"** e **"Habilitar para uso em atendimentos"** revelam campos condicionais (Preço de venda / Tamanho da embalagem). Bom padrão: 1 cadastro de item serve à venda (PDV) e ao consumo clínico (baixa automática por procedimento).
- **Tamanho da embalagem** + **Conteúdo da embalagem** permitem baixa fracionada por atendimento (ex.: caixa com 10 → consumir 1).
- Alertas **Estoque baixo / alto** derivados de mín./máx. dão dashboards de reposição prontos.
- **Movimentação tipada** (10 tipos, incluindo Quebra ±, Descarte, Amostra grátis, Manutenção) com preview de saldo final ao vivo = kardex auditável e UX clara.
- **Custo médio** recalculado a cada entrada (custo unitário) → relatórios de margem reais.
- Marca criável inline (+ Adicionar) reduz fricção; SKU + código de barras prontos para leitor/PDV.
- Exportação CSV/Excel nativa em toda listagem.
