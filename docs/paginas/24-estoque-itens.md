# Estoque / Itens

| Metadado | Valor |
|---|---|
| **Página** | Estoque / Itens (Controle de estoque) |
| **Rota** | `/estoque/items` (`app.clinicaexperts.com.br/estoque/items`) |
| **Módulo** | Estoque |
| **Submenu ativo** | Controle de estoque |
| **Tipo de tela** | Listagem (tabela) + cadastro via modal |
| **Estado no print** | Vazio (0 itens) |
| **Produto** | Clínica Experts (SaaS gestão de clínicas) |
| **Idioma** | pt-BR |
| **Cruzamento** | `04-telas-31-a-40.md` → Tela 40 |
| **Data de captura** | 22/06/2026 |

![](../../images/Captura de tela 2026-06-22 153546.png)

---

## 1. Identificação

- **Nome da tela:** Controle de estoque (título exato do card: **"Controle de estoque"**).
- **Rota/URL:** `app.clinicaexperts.com.br/estoque/items`.
- **Módulo:** Estoque (ícone de cubo na sidebar principal, destacado com fundo roxo arredondado).
- **Submenu lateral secundário:** "Estoque", com o item **"Controle de estoque"** ativo (fundo roxo).
- **Breadcrumb:** não há breadcrumb superior visível nesta tela (diferente das telas do módulo Financeiro); a navegação é feita pelo submenu lateral. *(inferido)*
- **Usuário logado:** Lucas Bastos (avatar "LB", borda verde).
- **Identificação técnica do recurso:** entidade de itens de estoque, chamada na URL de `items` (em inglês), sugerindo recurso de API `/estoque/items` ou `/stock/items`. *(inferido)*

---

## 2. Objetivo

Tela principal do módulo Estoque, destinada ao **cadastro de produtos/itens controlados e à visualização do saldo de estoque** de cada um. Permite:

- Cadastrar itens de estoque (produtos para revenda, materiais de atendimento/insumos).
- Acompanhar o **saldo atual** de cada item e compará-lo com o **estoque mínimo** definido.
- Identificar rapidamente itens com **estoque baixo** (abaixo do mínimo) e **estoque alto**, via indicadores no topo.
- Calcular a **valorização do estoque** (saldo × custo) por item e consolidada. *(inferido)*
- Disparar ações de gestão: novo item, edição, exclusão, ações em lote e exportação.

O objetivo de negócio é manter o controle de insumos/produtos da clínica, evitando ruptura (falta) e excesso, e fornecer base para os relatórios de Giro e Contagem de estoque.

---

## 3. Navegação (submenu Estoque)

O painel lateral secundário (à esquerda da área de conteúdo, à direita da sidebar de ícones) tem o título **"Estoque"** e os itens, na ordem exata do print:

| Ordem | Item | Estado no print | Rota inferida |
|---|---|---|---|
| 1 | **Controle de estoque** | Ativo (fundo roxo) | `/estoque/items` |
| 2 | **Giro de estoque** | Inativo | `/estoque/giro` *(inferido)* |
| 3 | **Contagem de estoque** | Inativo | `/estoque/contagem` *(inferido)* |
| 4 | **Itens abertos** | Inativo | `/estoque/itens-abertos` *(inferido)* |
| 5 | **Compras** | Inativo | `/estoque/compras` *(inferido)* |
| 6 | **Marcas** | Inativo | `/estoque/marcas` *(inferido)* |

Observações:
- O enunciado da tarefa cita o submenu como "itens, giro, contagem, itens abertos"; no print real, "Controle de estoque" é o rótulo do primeiro item (equivalente a "itens"), e há ainda **Compras** e **Marcas** abaixo de "Itens abertos".
- O item ativo recebe fundo roxo preenchido com texto branco; os demais têm texto cinza-escuro sobre fundo branco.
- A sidebar principal (ícones) tem o ícone de **cubo (Estoque)** destacado.

**Header e elementos globais** (comuns a todas as telas — ver doc base, seção "Elementos comuns"): logo "clínicaexperts", menu hambúrguer, ícones de WhatsApp/busca/Ajuda/sino, avatar "LB", botão flutuante roxo "+" e widget de progresso/onboarding ("Ei, Lucas Bastos! Tô aqui guardando o seu desconto!", "0% Seu progresso").

---

## 4. Layout

Estrutura da esquerda para a direita / de cima para baixo:

1. **Sidebar de ícones** (extrema esquerda, estreita, fundo branco) — navegação entre módulos; ícone de cubo (Estoque) ativo.
2. **Submenu "Estoque"** (coluna estreita seguinte, fundo branco) — itens da seção 3.
3. **Área principal** (fundo cinza claro), contendo um único **card branco** centralizado, com cantos arredondados e sombra leve. Dentro do card, de cima para baixo:
   - **Cabeçalho do card:** título **"Controle de estoque"** à esquerda; à direita os botões **"Ações em lote"** e **"Exportar"** (ambos esmaecidos/desabilitados).
   - **Barra de filtros:** link **"+ Adicionar filtro"** (roxo) à esquerda; campo de busca **"Buscar"** à direita.
   - **Faixa de indicadores:** 3 cards de resumo (Estoque baixo / Estoque alto / Todos).
   - **Corpo:** no estado atual, **estado vazio** centralizado (ícone, textos e CTA). Quando populado, exibe a **tabela de itens**.
   - **Rodapé:** seletor "25 por página" à esquerda; controles de paginação à direita.

Larguras: o card principal ocupa a faixa central da área de conteúdo, com margens laterais cinza.

---

## 5. Componentes

**Cabeçalho do card:**
- Título: **"Controle de estoque"** (texto exato, à esquerda).
- Botão **"Ações em lote"** — com ícone de seta para baixo (dropdown). No print está **esmaecido/desabilitado** (não há itens selecionáveis).
- Botão **"Exportar"** — com ícone de seta para baixo (dropdown). Também **esmaecido/desabilitado** no estado vazio.

**Barra de filtros:**
- Link **"+ Adicionar filtro"** (texto exato, roxo, com ícone "+" à esquerda).
- Campo de busca: input com placeholder **"Buscar"** (texto exato), à direita, com borda arredondada. *(busca textual por nome/SKU — inferido)*

**Faixa de indicadores (3 cards, cada um com bolinha colorida + ícone de ajuda "?"):**
- **"Estoque baixo"** — bolinha **vermelha** — valor **0**. *(badge/contador de itens com saldo abaixo do mínimo)*
- **"Estoque alto"** — bolinha **amarela** — valor **0**. *(itens com saldo acima de um limite alto — inferido)*
- **"Todos"** — bolinha **azul** — valor **0** — card **ativo/destacado** com linha azul inferior.

Cada card funciona como **filtro rápido clicável**: ao clicar, filtra a tabela para o respectivo nível de estoque (o card ativo recebe a linha azul). *(inferido)*

**CTA do estado vazio:**
- Botão roxo **"+ Adicionar novo item"** (texto exato), centralizado.

**Botão flutuante global:** "+" roxo no canto inferior direito (ação rápida de adicionar). *(provável atalho para novo item neste contexto — inferido)*

**Badges de estoque baixo (na tabela, quando houver itens):** indicador visual (cor vermelha/realce) em itens cujo **saldo atual ≤ estoque mínimo**. *(inferido — não visível no print por ausência de dados)*

---

## 6. Tabela (estado populado — inferido)

No print a tabela está vazia (estado da seção 9). A estrutura abaixo é inferida a partir do propósito da tela, do padrão de tabelas do sistema (Telas 31–38) e dos indicadores presentes.

**Colunas inferidas (da esquerda para a direita):**

| Coluna | Descrição | Tipo de dado | Ordenável |
|---|---|---|---|
| (checkbox) | Seleção da linha (habilita "Ações em lote") | boolean | — |
| **Nome / Produto** | Nome do item/produto | texto | Sim ↕ *(inferido)* |
| **SKU / Código** | Código identificador do item | texto | Sim ↕ *(inferido)* |
| **Categoria** | Categoria do item (ex.: material de atendimento, revenda) | texto | Sim ↕ *(inferido)* |
| **Unidade** | Unidade de medida (un, ml, g, cx, etc.) | texto | Sim ↕ *(inferido)* |
| **Saldo atual** | Quantidade em estoque | número | Sim ↕ *(inferido)* |
| **Estoque mínimo** | Quantidade mínima de alerta | número | Sim ↕ *(inferido)* |
| **Custo** | Custo unitário (R$) | moeda | Sim ↕ *(inferido)* |
| **Valor** | Valorização = saldo atual × custo (R$) | moeda | Sim ↕ *(inferido)* |
| **Ações** | Menu **⋮** (três pontos): **Editar** / **Excluir** | — | — |

**Ações por linha:**
- **Editar** — abre o modal de edição do item (campos da seção 7/10). *(inferido)*
- **Excluir** — remove o item, com modal de confirmação. *(inferido)*

**Ordenação:** cada cabeçalho exibe seta de ordenação (↕), alternando asc/desc ao clicar — padrão das demais tabelas do sistema. Há também ícone de **engrenagem** para configurar colunas visíveis (padrão das Telas 31/32). *(inferido)*

**Paginação (rodapé, presente no print):**
- Seletor **"25 por página"** (dropdown) à esquerda.
- Controles à direita: **«** (primeira), **‹** (anterior), **›** (próxima), **»** (última) — desabilitados quando há 0 itens.
- Texto de contagem "Mostrando X a Y de Z" provável quando populado (padrão da Tela 39). *(inferido)*

---

## 7. Formulários (modal "Novo item")

Modal aberto pelo botão **"+ Adicionar novo item"** (ou pelo "+" flutuante). Campos inferidos a partir do enunciado e das colunas da tabela:

| Campo | Rótulo (inferido) | Tipo de input | Obrigatório | Observação |
|---|---|---|---|---|
| Nome | **Nome** | texto | Sim | Nome do produto/item |
| Categoria | **Categoria** | select | Não | Lista de categorias de estoque *(inferido)* |
| Unidade | **Unidade** | select/texto | Sim *(inferido)* | un, ml, g, cx, etc. |
| Estoque mínimo | **Estoque mínimo** | número | Não | Dispara alerta de "Estoque baixo" |
| Custo | **Custo** | moeda (R$) | Não | Custo unitário; base da valorização |

Campos adicionais prováveis (não citados no enunciado, mas comuns ao domínio):
- **SKU / Código** *(inferido)* — identificador único; pode ser autogerado.
- **Marca / Fornecedor** *(inferido)* — relação com cadastro de Marcas/Fornecedores (submenu "Marcas").
- **Saldo inicial** *(inferido)* — quantidade inicial em estoque ao cadastrar.
- **Estoque máximo / alto** *(inferido)* — limite que alimenta o indicador "Estoque alto".

**Botões do modal:** **Salvar** (primário, roxo) e **Cancelar** (secundário). *(inferido — padrão do sistema)*

---

## 8. Filtros

- **Busca textual:** campo **"Buscar"** (placeholder exato) — por nome/SKU. *(inferido)*
- **Adicionar filtro:** link **"+ Adicionar filtro"** (texto exato) — abre seletor de filtros avançados; opções prováveis:
  - **Categoria** — filtra itens por categoria. *(inferido)*
  - **Estoque baixo** — filtra itens com saldo ≤ mínimo. *(inferido)*
  - **Marca / Fornecedor**, **Unidade** *(inferido)*.
- **Filtros rápidos por indicador (cards clicáveis):**
  - **"Estoque baixo"** (vermelho) → apenas itens abaixo do mínimo.
  - **"Estoque alto"** (amarelo) → apenas itens acima do limite alto.
  - **"Todos"** (azul, ativo por padrão) → todos os itens.

---

## 9. Estados

**Estado vazio (atual no print):**
- Indicadores zerados: Estoque baixo **0**, Estoque alto **0**, Todos **0**.
- Botões **"Ações em lote"** e **"Exportar"** esmaecidos/desabilitados.
- Área central com ícone circular de informação (**ⓘ**) roxo, título **"Hmm, está vazio por aqui!"** (texto exato) e subtítulo **"Nenhum registro encontrado."** (texto exato).
- CTA roxo **"+ Adicionar novo item"** (texto exato).
- Paginação desabilitada (**«** **‹** **›** **»**).

**Estado populado (inferido):** tabela renderizada (seção 6); indicadores com contagens reais; botões "Ações em lote" (ao selecionar linhas) e "Exportar" habilitados.

**Estado de carregamento (inferido):** skeleton/spinner na área da tabela.

**Estado de erro (inferido):** mensagem de falha ao carregar, com opção de tentar novamente.

---

## 10. Modais

**Modal "Novo item" / "Editar item":** mesmos campos (seção 7). No modo edição, os campos vêm pré-preenchidos com os dados do item e o saldo atual pode ser somente leitura (alterado por movimentações, não por edição direta). *(inferido)*

- **Campos:** Nome, Categoria, Unidade, Estoque mínimo, Custo (+ SKU, Marca/Fornecedor, Saldo inicial — inferidos).
- **Ações:** Salvar / Cancelar.

**Modal de confirmação de exclusão (inferido):** título do tipo "Excluir item?", texto de confirmação, botões **Excluir** (vermelho/destrutivo) e **Cancelar**.

**Modal de ações em lote (inferido):** acionado pelo botão "Ações em lote" após seleção; opções prováveis: excluir selecionados, alterar categoria, exportar selecionados.

---

## 11. Modelo de dados

**Entidade `ItemEstoque`** *(nomes de campos inferidos)*:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID / int | Identificador único |
| `nome` | string | Nome do produto/item |
| `sku` | string | Código/SKU (único) *(inferido)* |
| `categoria_id` | FK → Categoria | Categoria do item *(inferido)* |
| `unidade` | string / enum | Unidade de medida (un, ml, g, cx…) |
| `saldo_atual` | decimal | Quantidade atual em estoque (derivada das movimentações) |
| `estoque_minimo` | decimal | Quantidade mínima para alerta |
| `estoque_maximo` | decimal | Limite alto (indicador "Estoque alto") *(inferido)* |
| `custo` | decimal (R$) | Custo unitário |
| `valor` | decimal (R$) | Valorização = `saldo_atual` × `custo` (calculado) *(inferido)* |
| `fornecedor_id` | FK → Fornecedor | Fornecedor/marca *(inferido)* |
| `ativo` | boolean | Item ativo/inativo *(inferido)* |
| `created_at` / `updated_at` | datetime | Auditoria *(inferido)* |

**Relações inferidas:**
- `ItemEstoque` **N:1** `Fornecedor` (ou `Marca` — submenu "Marcas"): cada item pertence a um fornecedor/marca; um fornecedor tem vários itens.
- `ItemEstoque` **1:N** `Movimentacao`: cada item possui várias movimentações (entradas/saídas) que compõem o `saldo_atual`. As Compras (submenu) geram entradas; vendas/consumo geram saídas; a Contagem ajusta o saldo.
- `ItemEstoque` **N:1** `Categoria`.

**Entidade `Movimentacao` (relacionada — inferida):** `id`, `item_id` (FK), `tipo` (entrada/saída/ajuste), `quantidade`, `custo_unitario`, `data`, `origem` (compra/venda/contagem), `usuario_id`.

---

## 12. Endpoints API inferidos

Todos *(inferidos)* a partir da rota `/estoque/items`:

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/estoque/items?page=&per_page=25&search=&categoria=&nivel=baixo\|alto\|todos` | Lista paginada de itens com filtros |
| `GET` | `/api/estoque/items/{id}` | Detalhe de um item |
| `POST` | `/api/estoque/items` | Cria novo item (modal "Novo item") |
| `PUT` / `PATCH` | `/api/estoque/items/{id}` | Edita item |
| `DELETE` | `/api/estoque/items/{id}` | Exclui item |
| `GET` | `/api/estoque/items/summary` | Contadores: estoque baixo / alto / todos |
| `POST` | `/api/estoque/items/export` | Exportar (PDF/Excel/CSV) |
| `POST` | `/api/estoque/items/batch` | Ações em lote sobre itens selecionados |
| `GET` | `/api/estoque/categorias` | Lista de categorias para o select |
| `GET` | `/api/estoque/fornecedores` ou `/api/estoque/marcas` | Lista de marcas/fornecedores |
| `GET` | `/api/estoque/items/{id}/movimentacoes` | Movimentações do item |

---

## 13. Regras de negócio

- **Alerta de estoque mínimo:** quando `saldo_atual ≤ estoque_minimo`, o item entra no contador **"Estoque baixo"** (bolinha vermelha) e recebe realce/badge vermelho na tabela. *(inferido)*
- **Estoque alto:** quando `saldo_atual ≥ estoque_maximo` (ou outro limite alto), o item entra no contador **"Estoque alto"** (amarelo). *(inferido)*
- **"Todos":** contador total de itens cadastrados; é o filtro padrão (ativo).
- **Valorização do estoque:** `valor = saldo_atual × custo`. O total da coluna **Valor** representa o valor total do estoque (custo × quantidade). *(inferido)*
- **Saldo derivado:** o `saldo_atual` não é editado diretamente; resulta das **movimentações** (compras = entrada, vendas/consumo = saída, contagem = ajuste). *(inferido)*
- **Ações em lote / Exportar** só ficam habilitadas quando há itens (e, no caso das ações em lote, seleção ativa). *(observado no print: ambos esmaecidos com 0 itens)*
- **Exclusão:** provavelmente bloqueada ou com aviso quando o item possui movimentações/saldo > 0, para preservar histórico. *(inferido)*

---

## 14. Fluxos

**Fluxo 1 — Cadastrar primeiro item (estado vazio):**
1. Usuário acessa `/estoque/items` → vê estado vazio.
2. Clica em **"+ Adicionar novo item"** (ou no "+" flutuante).
3. Abre modal "Novo item"; preenche Nome, Categoria, Unidade, Estoque mínimo, Custo (e saldo inicial).
4. Clica em **Salvar** → item criado; tabela passa a exibir a linha; contador "Todos" incrementa.

**Fluxo 2 — Editar item:**
1. Na linha do item, abre menu **⋮** → **Editar**.
2. Modal pré-preenchido; ajusta campos; **Salvar**.

**Fluxo 3 — Excluir item:**
1. Menu **⋮** → **Excluir** → modal de confirmação → **Excluir**.

**Fluxo 4 — Filtrar por nível de estoque:**
1. Clica no card **"Estoque baixo"** → tabela mostra apenas itens abaixo do mínimo (linha azul muda para o card ativo).

**Fluxo 5 — Buscar:** digita no campo **"Buscar"** → tabela filtra por nome/SKU.

**Fluxo 6 — Ações em lote / Exportar:** seleciona linhas (checkbox) → "Ações em lote" habilita; ou clica em "Exportar" → escolhe formato.

---

## 15. Notas de implementação

- O título do card no app é **"Controle de estoque"**, embora a rota seja `/estoque/items` (recurso em inglês). Manter o rótulo pt-BR na UI e `items` na API.
- Botões **"Ações em lote"** e **"Exportar"** devem iniciar **desabilitados** quando a lista está vazia (estado observado no print).
- O **card "Todos"** é o filtro/visão padrão (linha azul inferior ativa); os cards "Estoque baixo"/"Estoque alto" são filtros rápidos clicáveis.
- Os textos do estado vazio são exatos e reutilizados em outras telas do sistema: **"Hmm, está vazio por aqui!"** + **"Nenhum registro encontrado."** — usar componente compartilhado.
- Seletor de paginação inicia em **"25 por página"**.
- A coluna **Valor** é calculada (saldo × custo) e não deve ser editável diretamente; o **Saldo atual** depende de movimentações — manter consistência com os submenus **Giro**, **Contagem**, **Compras**.
- Garantir relação com **Marcas/Fornecedores** (submenu "Marcas") no cadastro.
- Ícone de ajuda "?" em cada indicador deve abrir tooltip explicando o critério (baixo/alto/todos).
- Acessibilidade: cards-indicadores clicáveis precisam de papel `button`/`tab` e estado ativo perceptível além da cor (linha azul).
- A maior parte das colunas, campos de modal e endpoints está marcada como **(inferido)** porque o print mostra a tela **vazia**; validar contra a UI populada e contra as telas de Giro/Contagem/Compras antes de implementar.
