# Estoque / Itens Abertos

| Metadado | Valor |
|---|---|
| **Página** | Estoque / Itens abertos |
| **Rota (lista)** | `/estoque/itens-aberto` |
| **Rota (modal)** | `/estoque/itens-aberto?stock_modal_type=open_stock_items` |
| **URL completa** | `app.clinicaexperts.com.br/estoque/itens-aberto` |
| **Módulo** | Estoque (ícone cubo, destacado em roxo na sidebar) |
| **Breadcrumb** | **Estoque** / Itens abertos |
| **Modal principal** | "Abrir item" (`stock_modal_type=open_stock_items`) |
| **Telas-fonte cruzadas** | 05-telas-41-a-50.md — Telas 43 (lista), 44 (modal), 47 (modal variante) |
| **Capturas** | `Captura de tela 2026-06-22 153610.png`, `...153631.png`, `...153702.png` |
| **Idioma** | pt-BR |
| **Permissões (inferido)** | Acesso ao módulo Estoque; permissão de escrita para abrir item |
| **Data de referência da captura** | 22/06/2026, 15:36 |

---

## 1. Visão geral e propósito

A página **Itens abertos** controla produtos/insumos de estoque que foram **fracionados ou "abertos" para uso parcial** — frascos, ampolas, kits, soluções, cosméticos e demais itens cujo conteúdo é consumido em múltiplas aplicações ao longo do tempo, e não dado baixa integralmente de uma só vez.

Diferença em relação a uma saída comum de estoque:

- Uma **saída/venda** comum baixa a unidade inteira do saldo.
- Um **item aberto** representa uma unidade que foi iniciada (aberta) e da qual se registra o **consumo fracionado** (quantidade utilizada por evento) e cujo prazo de validade muda a partir da abertura (**validade após aberto**, geralmente menor que a validade do lacre).

A página lista os itens atualmente abertos/em uso, permite registrar novos itens abertos (modal **"Abrir item"**), acompanhar o saldo restante e a validade pós-abertura, e exportar o relatório.

> Estado capturado: a lista está **vazia** ("Nenhum registro encontrado"), portanto a estrutura da tabela de listagem (seção 5) é **(inferida)** a partir do domínio, do modal e das telas análogas do módulo (Giro de estoque, Contagem de estoque). O **modal "Abrir item"** está documentado a partir de captura real, com textos exatos.

---

## 2. Layout geral

![](../../images/Captura de tela 2026-06-22 153610.png)

Estrutura herdada do chrome global do app (ver `05-telas-41-a-50.md`, seção "Elementos globais comuns"):

- **Header** (faixa branca fixa): hambúrguer + logo **clínicaexperts**; à direita, WhatsApp (badge rosa), busca, **Ajuda** (ícone "?"), sino de notificações, avatar **"LB"**.
- **Sidebar global** (coluna de ícones à esquerda): ícone **cubo (Estoque)** destacado em roxo.
- **Breadcrumb** (abaixo do header): **Estoque** (roxo, clicável) / **Itens abertos** (cinza, página atual).
- **Área principal** (fundo cinza-claro `#f5f5f7` aprox.): um único **card branco centralizado**, cantos arredondados, leve sombra, contendo:
  1. Cabeçalho do card (título + Exportar).
  2. Barra de filtros + busca.
  3. Corpo: tabela de itens abertos **ou** estado vazio.
  4. Rodapé: seletor de página + paginação.
- **FAB**: botão circular roxo "+" no canto inferior direito (atalho de criação rápida).
- **Widgets de onboarding** (canto inferior direito): faixa laranja "Ei, Lucas Bastos! Tô aqui guardando o seu desconto!" + card "Seu progresso" 0%. (Ignorar para fins funcionais da página.)

---

## 3. Cabeçalho do card e barra de filtros

### 3.1 Cabeçalho do card

| Elemento | Texto exato / comportamento |
|---|---|
| Título | **"Itens abertos"** (canto superior esquerdo, negrito) |
| Botão Exportar | **"Exportar"** com chevron `▾` (canto superior direito). Dropdown. Aparência **desabilitada/cinza** quando não há registros. Ao abrir (com dados), oferece formatos de exportação (CSV/Excel/PDF) **(inferido)** |

### 3.2 Barra de filtros

| Elemento | Texto exato / comportamento |
|---|---|
| Adicionar filtro | Link roxo **"+ Adicionar filtro"** (abre seletor de filtros: por item, por status, por validade, por período de abertura — **inferido**) |
| Busca | Campo à direita com placeholder **"Buscar"** (busca textual por nome do item / observações — **inferido**) |

Chips de filtro aplicados aparecem entre o link "Adicionar filtro" e o resultado, no formato `Rótulo: valor ✕` (padrão observado em outras telas do app, ex.: "Status: Ativo ✕"). **(inferido)**

---

## 4. Estado vazio

![](../../images/Captura de tela 2026-06-22 153610.png)

Exibido quando não há itens abertos (estado atual da captura):

| Elemento | Texto exato |
|---|---|
| Ícone | Informação **(i)** em círculo roxo-claro (centralizado) |
| Título | **"Hmm, está vazio por aqui!"** |
| Subtítulo | **"Nenhum registro encontrado."** |
| Botão de ação | Botão roxo sólido com ícone "+": **"Abrir um item"** |

Clicar em **"Abrir um item"** abre o modal **"Abrir item"** (seção 6) — equivale a navegar para `?stock_modal_type=open_stock_items`.

> Estado vazio por **filtro** (inferido, padrão do app — ver Tela 41/46): quando há registros mas os filtros não retornam nada, o app troca para ícone de **lupa**, título **"Oops, nada foi encontrado!"**, subtítulo **"Os filtros selecionados não correspondem a nenhum registro."** e botão **"Limpar filtros"**.

---

## 5. Tabela da listagem (inferida)

> A captura mostra a lista vazia; a estrutura abaixo é **(inferida)** a partir do modelo de dados, do modal "Abrir item" e dos padrões de tabela do módulo Estoque.

### 5.1 Colunas

| Coluna | Conteúdo | Tipo/Formato | Observações |
|---|---|---|---|
| **Item** | Nome do produto/insumo aberto | texto | Pode exibir lote/SKU como subtexto (inferido) |
| **Data de abertura** | Data + hora em que o item foi aberto | `DD/MM/AAAA HH:mm` | Origem: campos Data + Hora do modal |
| **Qtd. inicial** | Quantidade/volume total do item ao ser aberto | número + unidade (ex.: `50 mL`) | Capacidade da unidade aberta (inferido) |
| **Qtd. restante** | Saldo ainda disponível do item aberto | número + unidade | = Qtd. inicial − Σ(quantidade utilizada) |
| **Validade** | Validade após aberto | `DD/MM/AAAA` | Calculada/registrada na abertura (ver seção 9) |
| **Status** | Situação do item aberto | badge | Valores: **Aberto / Em uso**, **Esgotado**, **Vencido** (inferido) |
| **Ações** | Operações por linha | botões/ícones | ver 5.2 |

### 5.2 Ações por linha (inferidas)

| Ação | Descrição |
|---|---|
| **Registrar uso / Dar baixa** | Abate quantidade do saldo restante do item aberto |
| **Editar** | Edita dados da abertura (data, validade, observações) |
| **Visualizar** | Histórico de consumo do item aberto |
| **Excluir** | Remove o registro de abertura (estorna saldo, se aplicável) |

### 5.3 Badges de status (inferidos)

| Status | Cor sugerida | Critério |
|---|---|---|
| Aberto / Em uso | verde | saldo restante > 0 e validade pós-abertura não vencida |
| Próximo do vencimento | amarelo/laranja | validade pós-abertura dentro da janela de alerta (ex.: ≤ N dias) |
| Vencido | vermelho | data atual > validade após aberto |
| Esgotado | cinza | saldo restante = 0 |

---

## 6. Modal "Abrir item"

![](../../images/Captura de tela 2026-06-22 153631.png)

- **Rota:** `/estoque/itens-aberto?stock_modal_type=open_stock_items`
- **Gatilhos de abertura:** botão **"Abrir um item"** (estado vazio) / botão equivalente no cabeçalho quando há lista / FAB **(inferido)**.
- **Comportamento:** modal centralizado (card branco, cantos arredondados) sobre **overlay escurecido**; o conteúdo da página fica desfocado/atenuado atrás.

### 6.1 Cabeçalho do modal

| Elemento | Texto exato / comportamento |
|---|---|
| Título | **"Abrir item"** (esquerda, negrito) |
| Fechar | Botão **"×"** (direita). Fecha sem salvar; remove o parâmetro `stock_modal_type` da URL |

### 6.2 Corpo — formulário (grid de 2 colunas)

Layout: duas colunas; **Observações** ocupa largura total na última linha. `*` indica campo obrigatório (conforme rótulos reais da captura).

| # | Rótulo (texto exato) | Coluna | Tipo de controle | Valor/placeholder na captura | Obrigatório |
|---|---|---|---|---|---|
| 1 | **"Item*"** | Esquerda | Select de busca (dropdown com chevron `▾`) | placeholder **"Pesquise/Selecione"** | Sim |
| 2 | **"Data*"** | Direita | Date picker (campo + ícone de calendário) | **"22/06/2026"** | Sim |
| 3 | **"Hora"** | Esquerda | Time picker (campo + ícone de relógio) | **"15:36"** | Não |
| 4 | **"Quantidade utilizada*"** | Direita | Campo numérico | **"0"** | Sim |
| 5 | **"Observações"** | Largura total | Campo de texto | placeholder **"Digite"** | Não |

#### Detalhamento por campo

- **Item*** — combobox com busca server-side (placeholder **"Pesquise/Selecione"**). Lista os produtos/insumos do estoque elegíveis para abertura. Ao selecionar, espera-se que o sistema carregue a unidade de medida, validade do produto e regra de validade pós-abertura associadas ao item **(inferido)**. Sem item selecionado, **Confirmar** deve bloquear/validar.
- **Data*** — data da abertura/uso. Default = data atual (**"22/06/2026"** na captura). Ícone de calendário abre o date picker. Formato `DD/MM/AAAA`.
- **Hora** — hora da abertura/uso. Default = hora atual (**"15:36"**). Ícone de relógio abre o time picker. Formato `HH:mm`. Opcional (sem `*`).
- **Quantidade utilizada*** — quantidade fracionada consumida nesta abertura/registro, na unidade do item. Default **"0"**. É o valor que será **abatido do saldo**. Validação esperada: maior que 0 e ≤ saldo disponível **(inferido)**.
- **Observações** — texto livre (placeholder **"Digite"**). Notas sobre a abertura/uso (lote, motivo, paciente/procedimento associado etc.).

> **Campos do enunciado não presentes na captura** (volume/unidade explícito, "validade após aberto" e "responsável" como campos de formulário): **não aparecem** no modal capturado. São tratados como **(inferido)** — provavelmente derivados automaticamente: a **unidade/volume** vem do cadastro do item; a **validade após aberto** é calculada pela regra do produto a partir da Data; o **responsável** é o **usuário logado** (Lucas Bastos / "LB"), gravado pelo backend sem campo visível. Caso o produto careça da regra de validade pós-abertura, o sistema pode exibir um campo adicional de "Validade após aberto" **(inferido)**.

### 6.3 Rodapé do modal

| Elemento | Texto exato / comportamento |
|---|---|
| Confirmar | Botão roxo sólido **"Confirmar"** (centralizado). Submete o formulário; valida obrigatórios (Item, Data, Quantidade utilizada); ao salvar, fecha o modal e atualiza a lista |

### 6.4 Variante da captura

![](../../images/Captura de tela 2026-06-22 153702.png)

Segunda captura do **mesmo** modal "Abrir item" (Tela 47). **Sem diferenças funcionais ou de conteúdo** em relação à 6.1–6.3 — mesmos campos, mesmos textos, mesmo botão **"Confirmar"**. Confirma a consistência do modal entre aberturas.

---

## 7. Rodapé / paginação

| Elemento | Texto exato / comportamento |
|---|---|
| Seletor de tamanho de página | **"25 por página"** (dropdown). Outros valores prováveis: 10/25/50/100 **(inferido)** |
| Primeira página | Botão **«** (desabilitado sem dados) |
| Anterior | Botão **‹** (desabilitado sem dados) |
| Próxima | Botão **›** (desabilitado sem dados) |
| Última | Botão **»** (desabilitado sem dados) |
| Contador | **"Mostrando X a Y de Z"** (padrão do app; não visível nesta tela vazia, presente em telas análogas) **(inferido)** |

---

## 8. Modelo de dados — `ItemAberto`

> Campos derivados do modal (reais) + inferência do domínio. Marcados **(inferido)** quando não comprovados pela captura.

| Campo | Tipo | Origem | Descrição |
|---|---|---|---|
| `id` / `uuid` | string (UUID) | backend | Identificador do registro de item aberto **(inferido)** |
| `item_id` | string (UUID) / FK | campo **Item*** | Referência ao produto/insumo de estoque |
| `item_nome` | string | derivado de `item_id` | Nome exibido na listagem **(inferido)** |
| `unidade` | string (enum) | cadastro do item | Unidade de medida (mL, g, un, etc.) **(inferido)** |
| `data_abertura` | date | campo **Data*** | Data da abertura/registro |
| `hora_abertura` | time | campo **Hora** | Hora da abertura (opcional) |
| `data_hora_abertura` | datetime | Data + Hora | Timestamp combinado **(inferido)** |
| `quantidade_inicial` | decimal | cadastro/saldo do item | Volume/quantidade total da unidade aberta **(inferido)** |
| `quantidade_utilizada` | decimal | campo **Quantidade utilizada*** | Quantidade consumida neste registro |
| `quantidade_restante` | decimal | calculado | Saldo = inicial − Σ utilizada **(inferido)** |
| `validade_apos_aberto` | date | regra do produto / cálculo | Validade que passa a valer após a abertura **(inferido)** |
| `responsavel_id` | string (UUID) / FK | usuário logado | Quem registrou a abertura (LB) **(inferido)** |
| `observacoes` | string (text) | campo **Observações** | Notas livres |
| `status` | string (enum) | calculado | `aberto` / `esgotado` / `vencido` **(inferido)** |
| `clinic_id` / `tenant_id` | string (UUID) | contexto | Multi-tenant **(inferido)** |
| `created_at` | datetime | backend | Auditoria **(inferido)** |
| `updated_at` | datetime | backend | Auditoria **(inferido)** |

### Enum `status` (inferido)
`aberto` · `proximo_vencimento` · `vencido` · `esgotado`

---

## 9. Regras de negócio

### 9.1 Validade pós-abertura (controle de validade)
- Ao abrir um item, a **validade após aberto** passa a reger o prazo de uso, normalmente **menor** que a validade do produto lacrado.
- Cálculo esperado **(inferido)**: `validade_apos_aberto = data_abertura + prazo_pos_abertura_do_produto` (ex.: "28 dias após aberto"), definido no cadastro do item. Se o produto não tiver prazo, o sistema solicita/permite informar a validade manualmente **(inferido)**.
- Itens abertos cuja `validade_apos_aberto < data_atual` recebem status **Vencido** e não devem permitir novos registros de uso (ou exibir alerta) **(inferido)**.
- Janela de alerta de proximidade de vencimento (ex.: ≤ N dias) destaca o item **(inferido)**.

### 9.2 Baixa de saldo
- Cada registro de uso (campo **Quantidade utilizada**) **abate** o valor de `quantidade_restante` do item aberto **(inferido)**.
- Regra: `quantidade_restante = quantidade_inicial − Σ(quantidade_utilizada)`; quando chega a 0 → status **Esgotado** **(inferido)**.
- Validação esperada: `quantidade_utilizada > 0` e `≤ quantidade_restante` (não permite consumir mais que o saldo) **(inferido)**.
- A abertura gera uma **movimentação de estoque** (saída/consumo) que se reflete no **Giro de estoque** (Tela 41) **(inferido)**.

### 9.3 Obrigatoriedade
- Campos obrigatórios para **Confirmar**: **Item**, **Data**, **Quantidade utilizada** (marcados com `*`).
- **Hora** e **Observações** são opcionais.

### 9.4 Responsável / auditoria
- O **responsável** pela abertura é o usuário autenticado (não há campo no modal); gravado pelo backend (`responsavel_id`) **(inferido)**.

---

## 10. Endpoints de API (inferidos)

> Não verificáveis na captura; padrão REST inferido a partir da rota e do domínio. Prefixo base presumido `/api/v1` ou similar, com escopo de clínica (tenant).

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/estoque/open-stock-items` | Lista paginada de itens abertos (suporta `page`, `per_page`, `search`, filtros) |
| `POST` | `/estoque/open-stock-items` | Cria registro de item aberto (submit do modal "Abrir item") |
| `GET` | `/estoque/open-stock-items/{id}` | Detalhe / histórico de consumo |
| `PUT` / `PATCH` | `/estoque/open-stock-items/{id}` | Edita registro |
| `DELETE` | `/estoque/open-stock-items/{id}` | Exclui/estorna registro |
| `POST` | `/estoque/open-stock-items/{id}/consumo` | Registra novo uso/baixa de saldo **(inferido)** |
| `GET` | `/estoque/items?search=` | Autocomplete do campo **Item*** (combobox "Pesquise/Selecione") |
| `GET` | `/estoque/open-stock-items/export?format=` | Exportação (CSV/Excel/PDF) — botão "Exportar" |

### Payload `POST` (inferido)
```json
{
  "item_id": "uuid",
  "data": "2026-06-22",
  "hora": "15:36",
  "quantidade_utilizada": 0,
  "observacoes": "string|null"
}
```

### Query params da listagem (inferidos)
`?page=1&per_page=25&search=&status=&validade_until=&interval=` (padrão `interval=AAAA-MM-DD&interval=AAAA-MM-DD` observado em Giro de estoque).

---

## 11. Fluxos

### 11.1 Abrir um item (caminho feliz)
1. Usuário acessa **Estoque / Itens abertos** (`/estoque/itens-aberto`).
2. Clica em **"Abrir um item"** (estado vazio) ou botão equivalente → URL recebe `?stock_modal_type=open_stock_items` e o modal **"Abrir item"** abre.
3. Seleciona o **Item** (busca "Pesquise/Selecione").
4. Ajusta **Data** (default hoje) e, opcionalmente, **Hora** (default agora).
5. Informa **Quantidade utilizada** (> 0).
6. (Opcional) preenche **Observações**.
7. Clica **"Confirmar"** → `POST` → backend grava, calcula validade pós-abertura e abate saldo.
8. Modal fecha, lista é atualizada, novo item aparece na tabela com status **Aberto**.

### 11.2 Cancelar
- Clicar **"×"** fecha o modal sem salvar; remove `stock_modal_type` da URL; permanece na lista.

### 11.3 Registrar consumo posterior (inferido)
- Em um item já aberto, ação **"Registrar uso / Dar baixa"** → abate mais saldo; ao zerar, status vira **Esgotado**.

### 11.4 Exportar
- **"Exportar"** (habilitado com dados) → escolhe formato → download do relatório de itens abertos.

### 11.5 Filtrar/buscar
- **"+ Adicionar filtro"** / campo **"Buscar"** → recarrega a tabela; sem correspondência → estado vazio de filtro ("Oops, nada foi encontrado!" + "Limpar filtros").

---

## 12. Estados da página

| Estado | Gatilho | UI |
|---|---|---|
| **Vazio (sem dados)** | Nenhum item aberto cadastrado | Ícone (i) + "Hmm, está vazio por aqui!" + "Nenhum registro encontrado." + botão **"Abrir um item"** (captura atual) |
| **Vazio (por filtro)** | Filtros sem correspondência | Ícone lupa + "Oops, nada foi encontrado!" + "Os filtros selecionados não correspondem a nenhum registro." + **"Limpar filtros"** **(inferido)** |
| **Com dados** | ≥1 item aberto | Tabela (seção 5) + paginação ativa + Exportar habilitado **(inferido)** |
| **Carregando** | Requisição em andamento | Skeleton/spinner no corpo do card **(inferido)** |
| **Erro** | Falha na requisição | Mensagem de erro + retry **(inferido)** |
| **Modal aberto** | `?stock_modal_type=open_stock_items` | Overlay escurecido + modal "Abrir item" |

---

## 13. Validações (modal "Abrir item")

| Campo | Regra | Mensagem esperada (inferida) |
|---|---|---|
| Item | Obrigatório | "Selecione um item" |
| Data | Obrigatória; formato válido | "Informe uma data válida" |
| Hora | Opcional; formato `HH:mm` | — |
| Quantidade utilizada | Obrigatória; > 0; ≤ saldo disponível | "Informe uma quantidade válida" / "Quantidade maior que o saldo" |
| Observações | Opcional; texto livre | — |

Botão **"Confirmar"** deve permanecer inativo / disparar validação enquanto os obrigatórios não estiverem preenchidos **(inferido)**.

---

## 14. Notas de implementação

- **Roteamento por query param:** o modal é controlado por `?stock_modal_type=open_stock_items` na própria rota da lista — abrir/fechar o modal apenas adiciona/remove o param (deep-link possível: acessar a URL com o param já abre o modal).
- **Defaults dinâmicos:** **Data** e **Hora** são pré-preenchidas com data/hora atuais do cliente no momento da abertura do modal (na captura, 22/06/2026 15:36).
- **Combobox de Item:** busca assíncrona (server-side) com placeholder **"Pesquise/Selecione"**; ao selecionar, hidratar unidade/validade/regra do produto.
- **Unidade/volume e validade pós-abertura** não são campos do modal capturado — derivar do cadastro do item; expor campo extra apenas se o produto não tiver regra de validade pós-abertura.
- **Responsável** = usuário autenticado, gravado no backend; não há campo de UI.
- **Integração com Giro de estoque:** registrar a movimentação de consumo para refletir em relatórios (Tela 41).
- **Exportar** e **paginação** seguem o padrão do módulo Estoque (25 por página default; « ‹ › » ; "Mostrando X a Y de Z").
- **Estados vazios** reutilizam os dois padrões do app: vazio-sem-dados (ícone "i", botão de ação) vs. vazio-por-filtro (ícone lupa, "Limpar filtros").
- **i18n:** todos os textos em pt-BR; manter os literais exatos: "Itens abertos", "Abrir um item", "Abrir item", "Pesquise/Selecione", "Quantidade utilizada", "Observações", "Digite", "Confirmar", "Exportar", "Adicionar filtro", "Buscar", "Hmm, está vazio por aqui!", "Nenhum registro encontrado.".
- **Acessibilidade (inferido):** modal com foco preso (focus trap), `Esc` fecha, `aria-label` no botão "×", rótulos associados aos campos via `for`/`id`.

---

## 15. Textos exatos (referência rápida)

**Lista**
- Título: `Itens abertos`
- Botão exportação: `Exportar`
- Filtro: `+ Adicionar filtro`
- Busca (placeholder): `Buscar`
- Estado vazio — título: `Hmm, está vazio por aqui!`
- Estado vazio — subtítulo: `Nenhum registro encontrado.`
- Botão estado vazio: `Abrir um item`
- Tamanho de página: `25 por página`

**Modal "Abrir item"**
- Título: `Abrir item`
- Campo: `Item*` — placeholder `Pesquise/Selecione`
- Campo: `Data*` — valor `22/06/2026`
- Campo: `Hora` — valor `15:36`
- Campo: `Quantidade utilizada*` — valor `0`
- Campo: `Observações` — placeholder `Digite`
- Botão de submit: `Confirmar`

---

*Documento de spec de desenvolvimento — Página Estoque / Itens abertos + modal "Abrir item". Itens marcados **(inferido)** não são comprovados pelas capturas (lista vazia); o modal é documentado a partir de captura real.*
