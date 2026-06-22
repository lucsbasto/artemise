# Estoque / Contagem de Estoque

| Metadado | Valor |
| --- | --- |
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Domínio** | app.clinicaexperts.com.br |
| **Módulo** | Estoque |
| **Página** | Contagem de estoque |
| **Rota** | `/estoque/contagem-estoque` |
| **Modal principal** | `?stock_modal_type=stock_counts&stock_modal_mode=new&model_uuid` |
| **Breadcrumb** | Estoque / Contagem de estoque |
| **Ícone sidebar** | Cubo (Estoque) — destacado em roxo |
| **Idioma** | pt-BR |
| **Permissões** | Acesso ao módulo Estoque (inferido) |
| **Telas-fonte** | Telas 42, 45 e 46 de `docs/05-telas-41-a-50.md` |
| **Capturas** | `153602` (lista), `153641` (modal parcial), `153647` (modal geral) |
| **Data da captura** | 22/06/2026 |
| **Status do doc** | Spec de desenvolvimento — máximo detalhe |

---

## 1. Visão geral e propósito

A página **Contagem de estoque** é o ponto de partida do recurso de **inventário** do módulo Estoque. Ela permite ao usuário (gestor/operador da clínica) registrar **contagens físicas do estoque** e confrontá-las com o **saldo registrado no sistema**, apontando **divergências** e, a partir delas, **ajustar os saldos**.

Funcionalmente cobre dois cenários:

- **Contagem parcial** — o usuário escolhe **itens avulsos** (um a um) e informa a quantidade física contada de cada um. Útil para auditorias pontuais (ex.: conferir um lote, um produto crítico).
- **Contagem geral** — carrega **todos os itens cadastrados** numa tabela paginada para um **inventário completo** do estoque.

A listagem (rota base) exibe o histórico de contagens já realizadas; a criação acontece via **modal "Nova contagem de estoque"**, que alterna entre as duas variantes acima por meio de um segmented control.

> Observação de captura: as três telas foram obtidas com a base de dados **vazia** (nenhuma contagem cadastrada, nenhum item de estoque correspondente ao filtro). Por isso, toda a estrutura da **tabela populada** e do **detalhe de contagem** é marcada como **(inferido)**.

---

## 2. Layout geral

### 2.1 Chrome global (comum a todo o app)

- **Header (faixa branca fixa no topo):**
  - Esquerda: ícone hambúrguer (recolher/expandir sidebar) + logotipo **clínicaexperts** (símbolo circular roxo "CX" + wordmark "clínica" peso normal / "experts" negrito).
  - Direita: ícone WhatsApp (badge rosa/vermelho), ícone de busca/atalho, link **"Ajuda"** (ícone de interrogação), ícone de sino (notificações), avatar circular **"LB"** (usuário logado — Lucas Bastos).
- **Sidebar global (coluna estreita de ícones, fundo branco):** módulos verticais; o **cubo (Estoque)** aparece destacado em roxo nesta página. Rodapé com seta `›`/`‹` para expandir/recolher.
- **Breadcrumb (abaixo do header):** **Estoque** (roxo, clicável) **/ Contagem de estoque** (cinza, página atual).
- **Área principal:** fundo cinza-claro (`#f5f5f7` aprox.); conteúdo centralizado num **card branco** de cantos arredondados com leve sombra.
- **FAB:** botão circular roxo com **"+"** no canto inferior direito (criação rápida — inferido).
- **Widget de onboarding/upsell (canto inferior direito):** faixa laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** + card **"Seu progresso"** com **"0%"**.

### 2.2 Estrutura da página (rota base)

`![](../../images/Captura de tela 2026-06-22 153602.png)`

Card branco central contendo, de cima para baixo:

1. **Cabeçalho do card:** título **"Contagem de estoque"** (esquerda) + botão **"Exportar"** com chevron `▾` (direita, aparência desabilitada/cinza enquanto não há dados).
2. **Barra de filtros:** link **"+ Adicionar filtro"** (roxo). *Não há campo de busca visível nesta listagem* (diverge da maioria das outras telas de estoque).
3. **Corpo:** tabela de contagens **ou** estado vazio (ver §5 e §6).
4. **Rodapé do card:** seletor **"25 por página"** (dropdown) à esquerda; paginação **« ‹ › »** à direita.

---

## 3. Modal "Nova contagem de estoque"

O modal abre via:
- Botão **"+ Criar nova contagem de estoque"** do estado vazio (ou botão equivalente no cabeçalho/FAB quando houver dados — inferido).
- URL com query: `?stock_modal_type=stock_counts&stock_modal_mode=new&model_uuid`.

Estrutura: card branco centralizado, **mais largo e alto** que os demais modais de estoque, sobre overlay escurecido. Cabeçalho + segmented control + corpo (varia conforme variante) + rodapé.

### 3.1 Cabeçalho do modal

| Elemento | Texto exato | Tipo | Ação |
| --- | --- | --- | --- |
| Título | **Nova contagem de estoque** | Texto | — |
| Fechar | **×** | Ícone-botão (canto sup. direito) | Fecha o modal sem salvar; remove a query da URL (inferido) |

### 3.2 Segmented control (toggle de variante)

Logo abaixo do título, controle segmentado com **duas opções** + ícone de ajuda:

| Opção | Texto exato | Estado padrão | Aparência |
| --- | --- | --- | --- |
| Aba 1 | **Contagem parcial** | Selecionada por padrão | Pílula roxo sólido quando ativa; texto cinza quando inativa |
| Aba 2 | **Contagem geral** | Inativa por padrão | Pílula roxo sólido quando ativa; texto cinza quando inativa |
| Ajuda | **(?)** (ícone de interrogação) | — | À direita das abas; exibe tooltip explicando a diferença entre os modos (texto do tooltip não capturado — **inferido**) |

> A troca de aba **reaproveita o mesmo modal**, substituindo apenas o **corpo**. Comportamento inferido: ao alternar, itens já adicionados na "Contagem parcial" devem ser preservados ou confirmados via aviso (não observado — validar na implementação).

### 3.3 Rodapé do modal (comum às duas variantes)

| Elemento | Texto exato | Tipo | Estado | Ação |
| --- | --- | --- | --- | --- |
| Salvar | **Salvar** | Botão (centralizado) | **Desabilitado** (cinza) enquanto não há itens contados | Persiste a contagem |
| Split | `▾` (chevron roxo anexo ao botão Salvar) | Dropdown anexo | — | Abre opções adicionais de salvamento, ex.: "Salvar e finalizar" / "Salvar e ajustar saldo" (**inferido** — itens do dropdown não capturados) |

---

## 4. Modal — Variante A: Contagem parcial

`![](../../images/Captura de tela 2026-06-22 153641.png)`

Aba **"Contagem parcial"** selecionada (roxo sólido). O corpo apresenta uma **linha de adição de item** seguida da **lista de itens já adicionados** (estado vazio na captura).

### 4.1 Linha de adição de item

Layout em grid horizontal: **Item** (esquerda, largo) | **Contado (itens)** (meio) | botão de adicionar (direita).

| # | Rótulo exato | Tipo de controle | Obrigatório | Placeholder / valor | Opções |
| --- | --- | --- | --- | --- | --- |
| 1 | **Item*** | Dropdown de busca (select com chevron `▾`) | **Sim** | **"Pesquise/Selecione"** | Lista de itens de estoque cadastrados (busca por digitação) |
| 2 | **Contado (itens)*** | Campo numérico | **Sim** | **"0"** | Inteiro ≥ 0 (inferido); representa a quantidade física contada |
| 3 | (ação) | Botão | — | **"+ Adicionar à contagem"** | Roxo-claro/outline; adiciona o par (item, contado) à lista |

**Regras da linha de adição (inferido):**
- Botão **"+ Adicionar à contagem"** habilita somente quando **Item** está selecionado e **Contado (itens)** é válido.
- Ao adicionar, o item entra na lista abaixo e os campos são limpos para nova entrada.
- Item já adicionado não deve poder ser readicionado (deduplicação — validar).

### 4.2 Lista de itens adicionados (estado vazio na captura)

- **Vazio:** ícone **(i)** em círculo roxo-claro + título **"Hmm, está vazio por aqui!"** + subtexto **"Nenhum registro encontrado."**
- **Populada (inferido):** tabela com uma linha por item adicionado. Colunas prováveis:

| Coluna (inferida) | Descrição |
| --- | --- |
| Item | Nome do item |
| Saldo no sistema | Quantidade atual registrada (somente leitura) |
| Contado (itens) | Quantidade física informada (editável) |
| Diferença | `contado − sistema` (calculado, somente leitura; sinal indica falta/sobra) |
| Ações | Editar contado / Remover item da contagem |

### 4.3 Botões e textos exatos (variante A)

- **"+ Adicionar à contagem"**
- **"Salvar"** (+ dropdown `▾`)
- **"×"** (fechar)

---

## 5. Modal — Variante B: Contagem geral

`![](../../images/Captura de tela 2026-06-22 153647.png)`

Aba **"Contagem geral"** selecionada (roxo sólido). O corpo troca a linha de adição por uma **barra de filtros + tabela paginada de todos os itens**.

### 5.1 Barra de filtros do modal

| Elemento | Texto exato | Tipo | Ação |
| --- | --- | --- | --- |
| Adicionar filtro | **+ Adicionar filtro** | Link (roxo) | Adiciona critérios de filtragem (ex.: categoria, local de estoque — inferido) |
| Buscar | **Buscar** | Campo de busca (placeholder) | Filtra a tabela de itens por texto |

### 5.2 Tabela de itens (estado vazio na captura)

- **Vazio (sem correspondência de filtro):** ícone de **lupa** em círculo roxo-claro + título **"Oops, nada foi encontrado!"** + subtexto **"Os filtros selecionados não correspondem a nenhum registro."** + botão **"Limpar filtros"**.
- **Populada (inferido):** uma linha por item de estoque, com campo editável **Contado (itens)** por linha. Colunas prováveis: Item | Saldo no sistema | Contado (itens) | Diferença.

### 5.3 Rodapé interno do modal (paginação da listagem de itens)

| Elemento | Texto exato | Tipo |
| --- | --- | --- |
| Page size | **25 por página** | Dropdown |
| Paginação | **« ‹ › »** | Botões (desabilitados sem dados) |
| Contador | **Mostrando 0 a 0 de 0** | Texto |

### 5.4 Botões e textos exatos (variante B)

- **+ Adicionar filtro**
- **Buscar** (placeholder)
- **Limpar filtros**
- **Salvar** (+ dropdown `▾`)
- **×** (fechar)

---

## 6. Tabela da listagem (rota base)

A captura mostra a listagem **vazia**. A estrutura abaixo da **tabela populada** é **(inferida)** a partir do propósito da página e das colunas pedidas.

### 6.1 Colunas (inferido)

| Coluna | Conteúdo | Observações |
| --- | --- | --- |
| **Data** | Data (e hora) de criação/realização da contagem | Formato `DD/MM/AAAA` |
| **Tipo** | "Parcial" ou "Geral" | Badge/tag |
| **Responsável** | Usuário que registrou a contagem | Nome / avatar |
| **Status** | Estado da contagem | Ex.: Rascunho / Em andamento / Finalizada / Ajustada (inferido) |
| **Itens** | Quantidade de itens contados na contagem | Numérico |
| **Ações** | Ver detalhe / Editar / Excluir / Exportar / Aplicar ajuste | Menu por linha (inferido) |

### 6.2 Cabeçalho e rodapé da listagem

- **Título:** "Contagem de estoque"
- **Exportar** (`▾`) — exporta o histórico de contagens (CSV/Excel/PDF — inferido).
- **+ Adicionar filtro** — filtros prováveis: período, tipo, status, responsável (inferido).
- Rodapé: **25 por página** + paginação **« ‹ › »**.

---

## 7. Estados da interface

### 7.1 Listagem — estado vazio (observado)

`![](../../images/Captura de tela 2026-06-22 153602.png)`

- Ícone **(i)** em círculo roxo-claro.
- Título: **"Hmm, está vazio por aqui!"**
- Subtexto: **"Nenhum registro encontrado."**
- Botão (roxo sólido): **"+ Criar nova contagem de estoque"** → abre o modal.

### 7.2 Modal "Contagem parcial" — lista vazia (observado)

- Ícone **(i)** + **"Hmm, está vazio por aqui!"** + **"Nenhum registro encontrado."**
- Salvar **desabilitado**.

### 7.3 Modal "Contagem geral" — sem correspondência de filtro (observado)

- Ícone **lupa** + **"Oops, nada foi encontrado!"** + **"Os filtros selecionados não correspondem a nenhum registro."** + **"Limpar filtros"**.
- Contador **"Mostrando 0 a 0 de 0"**; Salvar **desabilitado**.

### 7.4 Estados inferidos (não capturados)

- **Listagem populada:** tabela conforme §6.
- **Carregando:** skeleton/spinner (inferido).
- **Erro de carregamento/salvamento:** toast de erro (inferido).
- **Salvando:** Salvar em estado de loading (inferido).
- **Salvar habilitado:** quando há ≥ 1 item contado (parcial) ou ≥ 1 item com valor informado (geral).

---

## 8. Modelo de dados (inferido)

### 8.1 `ContagemEstoque`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `uuid` | UUID | Identificador (`model_uuid` na URL ao editar) |
| `tipo` | enum: `parcial` \| `geral` | Variante da contagem |
| `status` | enum | `rascunho` \| `em_andamento` \| `finalizada` \| `ajustada` (inferido) |
| `data` | datetime | Data/hora da contagem |
| `responsavel_id` | FK Usuário | Quem registrou |
| `clinica_id` | FK Clínica | Tenant (multi-clínica) |
| `local_estoque_id` | FK (opcional) | Local/depósito, se houver (inferido) |
| `observacao` | text (opcional) | Notas (inferido) |
| `itens` | `ItemContagem[]` | Linhas da contagem |
| `total_itens` | int (derivado) | Coluna "Itens" da listagem |
| `ajuste_aplicado` | bool | Se a diferença já gerou ajuste de saldo |
| `created_at` / `updated_at` | datetime | Auditoria |

### 8.2 `ItemContagem`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `uuid` | UUID | Identificador da linha |
| `contagem_id` | FK ContagemEstoque | Contagem-pai |
| `item_id` | FK ItemEstoque | Item contado |
| `saldo_sistema` | decimal | Saldo registrado no sistema no momento da contagem (snapshot) |
| `contado` | decimal | Quantidade física informada (campo "Contado (itens)") |
| `diferenca` | decimal (derivado) | `contado − saldo_sistema` |
| `ajuste_gerado_id` | FK Movimentação (opcional) | Movimentação de ajuste resultante, se aplicada |

> **Nota de snapshot:** `saldo_sistema` deve ser **congelado** no momento em que o item é adicionado/salvo, para que a `diferenca` reflita o estado contra o qual a contagem foi feita, mesmo que o saldo mude depois.

---

## 9. Endpoints de API (inferido)

> Padrões inferidos a partir das convenções REST do app; confirmar nomes reais.

| Método | Rota (inferida) | Descrição |
| --- | --- | --- |
| `GET` | `/api/estoque/contagem-estoque` | Lista contagens (paginação `per_page`, filtros) |
| `POST` | `/api/estoque/contagem-estoque` | Cria contagem (`tipo`, `itens[]`) |
| `GET` | `/api/estoque/contagem-estoque/{uuid}` | Detalhe de uma contagem |
| `PUT/PATCH` | `/api/estoque/contagem-estoque/{uuid}` | Atualiza contagem (rascunho) |
| `DELETE` | `/api/estoque/contagem-estoque/{uuid}` | Exclui contagem |
| `POST` | `/api/estoque/contagem-estoque/{uuid}/finalizar` | Finaliza e aplica ajuste de saldo |
| `GET` | `/api/estoque/itens?search=&per_page=&page=` | Lista itens para a "Contagem geral" e para o select da "parcial" |
| `GET` | `/api/estoque/itens/{id}/saldo` | Saldo atual do item (para `saldo_sistema`) |
| `GET` | `/api/estoque/contagem-estoque/export?formato=` | Exportação |

**Payload de criação (inferido):**

```json
{
  "tipo": "parcial",
  "itens": [
    { "item_id": "uuid-item", "contado": 12 }
  ]
}
```

---

## 10. Regras de negócio e cálculos

| Regra | Definição |
| --- | --- |
| **Diferença** | `diferenca = contado − saldo_sistema`. Positivo = **sobra física** (entrada de ajuste); negativo = **falta física** (saída de ajuste); zero = sem divergência. |
| **Snapshot de saldo** | `saldo_sistema` é capturado no momento da adição/salvamento do item, não na exibição. |
| **Ajuste de saldo** | Ao finalizar a contagem (Salvar / opção do dropdown), para cada item com `diferenca ≠ 0` gera-se uma **movimentação de ajuste** que leva o saldo do sistema ao valor `contado`. Entrada de ajuste quando positivo, saída quando negativo. (inferido) |
| **Habilitação do "Salvar"** | Requer ≥ 1 item contado (parcial) ou ≥ 1 item com valor informado (geral). |
| **Deduplicação (parcial)** | Um mesmo item não deve ser adicionado duas vezes na mesma contagem (inferido). |
| **Contado mínimo** | `contado ≥ 0`; vazio inválido (campo obrigatório). |
| **Contagem geral** | Itens não recontados assumem `contado = saldo_sistema` (diferença 0) ou ficam pendentes — **validar regra** (inferido). |
| **Reversibilidade** | Uma contagem **finalizada/ajustada** não deve ser editável (apenas visualizada); rascunhos sim (inferido). |

---

## 11. Fluxos de uso

### 11.1 Criar contagem parcial

1. Listagem vazia → clicar **"+ Criar nova contagem de estoque"**.
2. Modal abre na aba **"Contagem parcial"**.
3. Selecionar **Item*** → informar **Contado (itens)*** → clicar **"+ Adicionar à contagem"**.
4. Repetir para mais itens; cada um exibe `saldo_sistema`, `contado` e `diferenca` (inferido).
5. Clicar **"Salvar"** (habilitado) → persiste a contagem; opção no `▾` para finalizar/ajustar (inferido).
6. Modal fecha; listagem passa a exibir a nova contagem (inferido).

### 11.2 Criar contagem geral

1. Abrir modal → alternar para **"Contagem geral"**.
2. Tabela de **todos os itens** carrega (paginada). Usar **Buscar** / **+ Adicionar filtro** para localizar.
3. Informar **Contado (itens)** por linha.
4. **"Salvar"** → registra a contagem completa; ajuste conforme §10.
5. **"Limpar filtros"** repõe a tabela completa quando filtro não retorna nada.

### 11.3 Alternância de variante

- Trocar entre as abas reaproveita o modal, trocando o corpo. Preservação dos dados já inseridos: **validar** (inferido).

### 11.4 Cancelar

- **"×"** fecha o modal sem salvar e limpa a query da URL (inferido).

---

## 12. Filtros e busca

| Local | Controle | Texto |
| --- | --- | --- |
| Listagem (rota base) | Link **+ Adicionar filtro** | Filtros prováveis: período, tipo, status, responsável (inferido) |
| Modal "Contagem geral" | **+ Adicionar filtro** + **Buscar** | Filtra/busca os itens carregados |
| Modal "Contagem parcial" | Select **Item*** (busca embutida) | Placeholder **"Pesquise/Selecione"** |

---

## 13. Exportação e paginação

- **Exportar** (`▾`) na listagem — desabilitado sem dados; formatos prováveis CSV/Excel/PDF (inferido).
- Paginação: seletor **"25 por página"** + **« ‹ › »** na listagem e no modal "geral" (este último com **"Mostrando 0 a 0 de 0"**).

---

## 14. Textos exatos (referência rápida)

**Listagem:**
- "Contagem de estoque" · "Exportar" · "+ Adicionar filtro"
- "Hmm, está vazio por aqui!" · "Nenhum registro encontrado." · "+ Criar nova contagem de estoque"
- "25 por página"

**Modal (comum):**
- "Nova contagem de estoque" · "×"
- "Contagem parcial" · "Contagem geral" · "(?)"
- "Salvar" + `▾`

**Modal — Contagem parcial:**
- "Item*" · "Pesquise/Selecione" · "Contado (itens)*" · "0" · "+ Adicionar à contagem"
- "Hmm, está vazio por aqui!" · "Nenhum registro encontrado."

**Modal — Contagem geral:**
- "+ Adicionar filtro" · "Buscar"
- "Oops, nada foi encontrado!" · "Os filtros selecionados não correspondem a nenhum registro." · "Limpar filtros"
- "25 por página" · "Mostrando 0 a 0 de 0"

---

## 15. Notas de implementação

1. **Controle do modal via URL:** estado em query params (`stock_modal_type=stock_counts`, `stock_modal_mode=new`, `model_uuid`). Para **editar**, presumivelmente `stock_modal_mode=edit` + `model_uuid` preenchido (inferido). Garantir deep-link e fechamento limpando a query.
2. **Snapshot de `saldo_sistema`** no momento da adição/salvamento — crítico para a fiabilidade da `diferenca`.
3. **Cálculo de diferença em tempo real** na UI: recalcular `contado − saldo_sistema` a cada edição, com destaque visual de sinal (vermelho para falta, verde/azul para sobra — inferido).
4. **Habilitação do "Salvar"** condicionada a haver itens válidos; tratar o **split button** (`▾`) com ações de finalização/ajuste.
5. **Performance da "Contagem geral":** tabela de todos os itens deve ser **paginada server-side** (já há paginação no modal). Busca/filtro também server-side.
6. **Ausência de busca na listagem base** é intencional na captura — confirmar se é definitivo ou se deve ser adicionada por consistência com outras telas de Estoque.
7. **Multi-tenant:** todas as queries filtram por `clinica_id`.
8. **Ajuste de estoque transacional:** finalização que gera movimentações de ajuste deve ser atômica (tudo ou nada) e idempotente (evitar duplo ajuste se "Salvar" for reenviado).
9. **Tooltip do `(?)`:** definir o copy explicando parcial vs geral (não capturado).
10. **Acessibilidade:** segmented control navegável por teclado; foco inicial no select **Item*** ao abrir a aba parcial.
11. **i18n:** todos os textos em pt-BR; `*` denota obrigatoriedade.
12. **Reaproveitamento de componentes:** estado vazio "(i) Hmm, está vazio por aqui!" e o vazio-de-filtro "lupa / Oops, nada foi encontrado!" são componentes globais reutilizados em todo o app.

---

*Documento gerado a partir das capturas de 22/06/2026 e do cruzamento com `docs/05-telas-41-a-50.md` (Telas 42, 45, 46). Itens marcados "(inferido)" exigem validação contra a implementação real.*
