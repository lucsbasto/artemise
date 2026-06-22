# Financeiro / Categorias de Contas

| Metadado | Valor |
|---|---|
| **Página** | Categorias de contas (plano de contas) |
| **Rota** | `/financeiro/categorias-de-contas` |
| **URL completa** | `https://app.clinicaexperts.com.br/financeiro/categorias-de-contas` |
| **Módulo** | Financeiro |
| **Breadcrumb** | Financeiro / Categorias de contas |
| **Tela base (doc anterior)** | Tela 37 (`04-telas-31-a-40.md`) |
| **Imagem de referência** | `../../images/Captura de tela 2026-06-22 153509.png` |
| **Idioma** | pt-BR |
| **Tipo de tela** | Cadastro / lista hierárquica (árvore de 2 níveis) |
| **Acesso** | Autenticado (usuário "LB" — Lucas Bastos) |
| **Data da captura** | 22/06/2026 |

![](../../images/Captura de tela 2026-06-22 153509.png)

---

## 1. Identificação

- **Nome da página (título do card):** `Categorias`
- **Nome funcional / breadcrumb:** `Financeiro / Categorias de contas`
- **Rota interna:** `/financeiro/categorias-de-contas`
- **Slug do módulo:** `financeiro`
- **Slug da página:** `categorias-de-contas`
- **Ícone ativo na sidebar:** ícone de cifrão/financeiro (8º ícone, fundo roxo arredondado ativo).
- **Sinônimos no domínio:** "Plano de contas", "Categorias de receitas e despesas", "Plano de categorias".
- **Identificação no print:** aba do navegador na URL `app.clinicaexperts.com.br/financeiro/categorias-de-contas`; breadcrumb roxo `Financeiro / Categorias de contas`; card branco central com título `Categorias`.

---

## 2. Objetivo

Gerenciar o **plano de contas** da clínica — a estrutura de **categorias de receitas e despesas** usada para classificar todos os lançamentos financeiros (movimentações, contas a pagar/receber, relatórios de competência e de categorias).

**Objetivos específicos:**

1. **Organizar categorias em hierarquia de 2 níveis:** categoria-pai (grupo) → subcategorias.
   - Exemplos visíveis: `Aquisições de imobilizados` → `Computadores e Periféricos`, `Edifícios e Construções`, etc.
2. **Classificar lançamentos por natureza** — receita ou despesa (inferido; ver §13). A captura mostra grupos tipicamente de **despesa** (Aquisições de imobilizados, Aquisições de mercadorias, Comissões).
3. **Ativar/desativar** categorias e subcategorias sem excluí-las (toggle de Status), preservando histórico de lançamentos já classificados.
4. **Adicionar subcategorias** dentro de cada grupo (link `+ Adicionar subcategoria`).
5. **Buscar e filtrar** categorias para localização rápida em um plano de contas extenso.
6. Servir de **fonte de dados** para os seletores de categoria em telas como Extrato de movimentação (Tela 31), Relatório de competência (Tela 32) e Relatório de categorias (Tela 35).

**Hierarquia:** Estrutura em **árvore de 2 níveis** (categoria → subcategoria). Não há indício de 3º nível na captura (inferido — limite de profundidade = 2).

---

## 3. Navegação

- **Como chegar:**
  - Sidebar principal → ícone **Financeiro** (cifrão) → submenu Financeiro → **Categorias de contas**.
  - Breadcrumb: clicar em `Financeiro` retorna ao índice/dashboard do módulo financeiro.
  - URL direta: `/financeiro/categorias-de-contas`.
- **Breadcrumb (clicável):** `Financeiro` (link roxo) `/` `Categorias de contas` (texto atual, cinza).
- **Páginas irmãs (módulo Financeiro):** Extrato de movimentação, Relatório de competência, Fluxo de caixa diário, Fluxo de caixa mensal, Relatório de categorias, Contas financeiras, **Categorias de contas (atual)**, Métodos de pagamento.
- **Navegação de saída:**
  - Toggle Status → permanece na página (atualização inline).
  - `+ Adicionar subcategoria` / `+` flutuante / ⋮ → abrem modal (não trocam de rota — inferido).
- **Botão flutuante "+"** (canto inferior direito, roxo): ação rápida — abre modal de nova categoria/subcategoria (inferido).

---

## 4. Layout

Estrutura padrão do app (header + sidebar + área central em card branco sobre fundo cinza claro).

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [☰] clínicaexperts            [WhatsApp][⏱][? Ajuda][🔔][LB]               │ Header
├───┬──────────────────────────────────────────────────────────────────────┤
│ S │ Financeiro / Categorias de contas                                      │ Breadcrumb
│ I │                                                                        │
│ D │   ┌────────────────────────────────────────────────────────────────┐  │
│ E │   │ Categorias                                                     │  │ Título card
│ B │   │ + Adicionar filtro                          [ Buscar        ]  │  │ Filtros
│ A │   │                                                                │  │
│ R │   │ Descrição                              Status        Ações     │  │ Cabeçalho tabela
│   │   │ ───────────────────────────────────────────────────────────── │  │
│ ● │   │ Aquisições de imobilizados              (●─) verde     ⋮       │  │ Categoria-pai
│   │   │   Computadores e Periféricos            (●─) verde     ⋮       │  │ Subcategoria
│   │   │   Edifícios e Construções               (●─) verde     ⋮       │  │
│   │   │   Máquinas e Equipamentos               (●─) verde     ⋮       │  │
│   │   │   Móveis, Utensílios e Instalações      (●─) verde     ⋮       │  │
│   │   │   Terrenos                              (●─) verde     ⋮       │  │
│   │   │   Veículos                              (●─) verde     ⋮       │  │
│   │   │   + Adicionar subcategoria                                     │  │ Link roxo
│   │   │                                                                │  │
│   │   │ Aquisições de mercadorias               (●─) verde     ⋮       │  │
│   │   │   Compras de materiais de atendimento   (●─) verde     ⋮       │  │
│   │   │   Compras de produtos para revenda      (●─) verde     ⋮       │  │
│   │   │   + Adicionar subcategoria                                     │  │
│   │   │                                                                │  │
│   │   │ Comissões                               (●─) verde     ⋮       │  │
│   │   │   Comissões de profissionais            (●─) verde     ⋮       │  │
│   │   │   Comissões de vendedores               (●─) verde     ⋮       │  │
│   │   │   ... (rolagem)                                                │  │
│   │   └────────────────────────────────────────────────────────────────┘  │
│   │                                                              (+)       │ FAB roxo
└───┴──────────────────────────────────────────────────────────────────────┘
```

- **Largura do card:** centralizado, ~largura média (não ocupa toda a área); margens cinza laterais largas.
- **Densidade:** linhas com bastante respiro vertical; subcategorias com **indentação à esquerda** em relação à categoria-pai.
- **Tipografia:** categoria-pai com texto levemente mais escuro/forte; subcategorias em peso normal e indentadas.

---

## 5. Componentes

| # | Componente | Texto exato / descrição | Cor / estilo |
|---|---|---|---|
| 1 | Título do card | `Categorias` | Preto, negrito, ~16px |
| 2 | Link adicionar filtro | `+ Adicionar filtro` (ícone `+` roxo) | Roxo (#7C3AED aprox.) |
| 3 | Campo de busca | placeholder `Buscar` | Borda cinza, cantos arredondados, à direita |
| 4 | Cabeçalho coluna 1 | `Descrição` | Cinza escuro, negrito |
| 5 | Cabeçalho coluna 2 | `Status` | Cinza escuro, negrito |
| 6 | Cabeçalho coluna 3 | `Ações` | Cinza escuro, negrito |
| 7 | Linha categoria-pai | nome da categoria | Texto escuro/forte, sem indentação |
| 8 | Linha subcategoria | nome da subcategoria | Texto normal, **indentado** |
| 9 | Toggle Status | switch on/off | **Ligado = verde** (#22C55E aprox.); desligado = cinza (inferido) |
| 10 | Menu de ações | ícone `⋮` (três pontos verticais) | Cinza |
| 11 | Link adicionar subcategoria | `+ Adicionar subcategoria` (por grupo) | Roxo, ícone `+` |
| 12 | Botão flutuante (FAB) | `+` | Círculo roxo sólido, canto inferior direito |

> **Botão "Nova categoria" — texto exato:** Na captura **não há um botão rotulado "Nova categoria"** no cabeçalho do card. A criação de categoria-pai ocorre pelo **FAB roxo `+`** (canto inferior direito) e a de subcategoria pelo link **`+ Adicionar subcategoria`** de cada grupo. *(inferido: o rótulo "Nova categoria" pode aparecer como título do modal — ver §10.)*

**Badges receita/despesa (cores):** Na captura **não há badges visíveis de "Receita"/"Despesa"** — os grupos exibidos são todos de despesa e a coluna de tipo não está presente nesta tela. *(inferido)* Convenção do app para quando exibidos:
- **Receita:** badge/realce **verde** (consistente com valores de receita em verde nas Telas 31/32/35).
- **Despesa:** badge/realce **vermelho/rosa** (consistente com valores de despesa em vermelho nas Telas 31/32/35).

---

## 6. Tabela / Árvore

Lista **hierárquica de 2 níveis**, renderizada como tabela com agrupamento por categoria-pai.

**Colunas (exatas, conforme captura):**

| Coluna | Conteúdo | Alinhamento | Ordenação |
|---|---|---|---|
| `Descrição` | Nome da categoria/subcategoria (subcategoria indentada) | Esquerda | Visualmente não há seta de ordenação na captura |
| `Status` | Toggle verde (ativo) / cinza (inativo) | Centro/direita | — |
| `Ações` | Menu `⋮` (três pontos) | Direita | — |

> **Observação sobre colunas pedidas (nome, tipo, categoria pai):** A captura expõe **apenas `Descrição`, `Status`, `Ações`**. As noções de **tipo** (receita/despesa) e **categoria pai** estão **implícitas na estrutura da árvore** (a indentação indica o pai) e **não** aparecem como colunas. *(inferido: em uma versão de tabela plana, as colunas seriam `Nome`, `Tipo`, `Categoria pai`, `Status`, `Ações`.)*

**Estrutura visível (dados de exemplo da captura):**

- **Aquisições de imobilizados** — Status: ativo (verde) — ⋮
  - Computadores e Periféricos — ativo — ⋮
  - Edifícios e Construções — ativo — ⋮
  - Máquinas e Equipamentos — ativo — ⋮
  - Móveis, Utensílios e Instalações — ativo — ⋮
  - Terrenos — ativo — ⋮
  - Veículos — ativo — ⋮
  - `+ Adicionar subcategoria`
- **Aquisições de mercadorias** — ativo — ⋮
  - Compras de materiais de atendimento — ativo — ⋮
  - Compras de produtos para revenda — ativo — ⋮
  - `+ Adicionar subcategoria`
- **Comissões** — ativo — ⋮
  - Comissões de profissionais — ativo — ⋮
  - Comissões de vendedores — ativo — ⋮
  - *(continua via rolagem vertical)*

**Comportamento de linha:**
- Cada **grupo** (categoria-pai) é seguido por suas subcategorias indentadas e, ao final, pelo link `+ Adicionar subcategoria`.
- **Ações por linha (menu ⋮):** Editar, Excluir *(inferido)*; possivelmente "Adicionar subcategoria" no ⋮ da categoria-pai *(inferido)*.
- **Toggle Status:** alterna ativo/inativo inline, sem recarregar a página *(inferido)*.

---

## 7. Formulários (Modal)

> Os campos abaixo são **inferidos** — os modais não estão abertos na captura. Baseiam-se no domínio (plano de contas) e nas telas correlatas.

### 7.1 Modal "Nova categoria" / "Editar categoria" (categoria-pai) — (inferido)

| Campo | Label (inferido) | Tipo de controle | Obrigatório | Observações |
|---|---|---|---|---|
| Nome | `Nome` / `Descrição` | Texto (input) | Sim | Nome exibido na coluna Descrição |
| Tipo | `Tipo` | Radio / select: `Receita` \| `Despesa` | Sim | Define a natureza; badge/cor associada |
| Categoria pai | `Categoria pai` | Select (busca) | Não | Vazio = categoria de topo (nível 1); preenchido = subcategoria (nível 2) |
| Cor | `Cor` | Color picker / paleta | Não | Cor de identificação visual em gráficos (Relatório de categorias) *(inferido)* |
| Status | `Ativo` | Toggle | — | Default = ativo |

### 7.2 Modal "Adicionar subcategoria" — (inferido)

- Aberto pelo link `+ Adicionar subcategoria` de um grupo.
- **Categoria pai pré-preenchida** com o grupo de origem (campo travado ou já selecionado).
- Demais campos iguais a 7.1 (Nome, Tipo herdado do pai, Cor, Status).

**Botões do modal (inferido):** `Cancelar` (secundário) e `Salvar` (primário roxo).

---

## 8. Filtros

- **`+ Adicionar filtro`** (link roxo, à esquerda da barra): abre seletor de filtros adicionais *(inferido)*. Filtros prováveis:
  - **Tipo:** `Receita` / `Despesa` *(inferido — pedido na spec)*.
  - **Status:** `Ativo` / `Inativo` *(inferido)*.
  - **Categoria pai** *(inferido)*.
- **Busca textual:** campo `Buscar` (à direita) — filtra por nome/descrição da categoria e subcategoria *(inferido: busca em tempo real)*.

> Na captura **nenhum filtro está aplicado** e o campo de busca está vazio (placeholder `Buscar`).

---

## 9. Estados

| Estado | Descrição | Origem |
|---|---|---|
| **Populado (atual)** | Lista hierárquica com vários grupos e subcategorias, todos com toggle verde (ativos). Rolagem vertical. | Captura |
| **Vazio** | *(inferido)* Ícone ⓘ roxo + texto `Hmm, está vazio por aqui!` + subtexto `Nenhum registro encontrado.` (padrão das Telas 39/40), com CTA para criar a primeira categoria. | Inferido |
| **Carregando** | *(inferido)* skeleton de linhas. | Inferido |
| **Resultado de busca vazio** | *(inferido)* mesmo estado vazio com mensagem de "nenhum resultado para a busca". | Inferido |
| **Categoria inativa** | *(inferido)* toggle cinza; linha possivelmente esmaecida; ações ⋮ podem ficar desabilitadas (comportamento análogo à Tela 38 — Métodos de pagamento). | Inferido |

---

## 10. Modais

| Modal | Gatilho | Conteúdo |
|---|---|---|
| **Nova categoria** *(inferido)* | FAB `+` flutuante | Formulário §7.1; título provável `Nova categoria`. Botões `Cancelar` / `Salvar`. |
| **Adicionar subcategoria** *(inferido)* | Link `+ Adicionar subcategoria` do grupo | Formulário §7.2; categoria pai pré-selecionada. |
| **Editar categoria** *(inferido)* | ⋮ → `Editar` | Mesmo formulário §7.1 com dados preenchidos; título provável `Editar categoria`. |
| **Confirmar exclusão** *(inferido)* | ⋮ → `Excluir` | Diálogo de confirmação; alerta se houver lançamentos vinculados ou subcategorias filhas. Botões `Cancelar` / `Excluir`. |

> Todos os modais acima são **inferidos** — não há modal aberto na captura.

---

## 11. Modelo de dados

**Entidade `Categoria` (plano de contas) — auto-relação pai/filho:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / int | Sim | Identificador único *(inferido)* |
| `descricao` (ou `nome`) | string | Sim | Nome exibido na coluna `Descrição` |
| `tipo` | enum `receita` \| `despesa` | Sim *(inferido)* | Natureza da categoria; determina cor/badge |
| `categoria_pai_id` | UUID / int (nullable, FK → `Categoria.id`) | Não | **Auto-relação**: `null` = categoria de topo (nível 1); preenchido = subcategoria (nível 2) |
| `cor` | string (hex) | Não *(inferido)* | Cor de identificação em gráficos |
| `ativo` (ou `status`) | boolean | Sim | Estado do toggle (`true` = verde/ativo) |
| `ordem` | int | Não *(inferido)* | Ordenação de exibição dentro do grupo |
| `nivel` | int (derivado: 1 ou 2) | — | Profundidade na árvore (computado a partir de `categoria_pai_id`) |
| `created_at` / `updated_at` | datetime | — | Auditoria *(inferido)* |
| `deleted_at` | datetime (nullable) | — | Soft delete *(inferido)* |

**Auto-relação (self-referencing):**

```
Categoria
 ├─ id
 ├─ categoria_pai_id ──► Categoria.id   (nullable; FK para a própria tabela)
 ├─ filhos[] ◄────────── Categoria onde categoria_pai_id = this.id
 └─ ...
```

- `categoria_pai_id = null` → **categoria-pai** (grupo, nível 1).
- `categoria_pai_id = <id>` → **subcategoria** (nível 2), filha do grupo.
- Profundidade máxima = **2 níveis** *(inferido — sem 3º nível na captura)*.

**Exemplo de registros (derivado da captura):**

```json
[
  { "id": 1, "descricao": "Aquisições de imobilizados", "tipo": "despesa", "categoria_pai_id": null, "ativo": true },
  { "id": 2, "descricao": "Computadores e Periféricos", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 3, "descricao": "Edifícios e Construções", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 4, "descricao": "Máquinas e Equipamentos", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 5, "descricao": "Móveis, Utensílios e Instalações", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 6, "descricao": "Terrenos", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 7, "descricao": "Veículos", "tipo": "despesa", "categoria_pai_id": 1, "ativo": true },
  { "id": 8, "descricao": "Aquisições de mercadorias", "tipo": "despesa", "categoria_pai_id": null, "ativo": true },
  { "id": 9, "descricao": "Compras de materiais de atendimento", "tipo": "despesa", "categoria_pai_id": 8, "ativo": true },
  { "id": 10, "descricao": "Compras de produtos para revenda", "tipo": "despesa", "categoria_pai_id": 8, "ativo": true },
  { "id": 11, "descricao": "Comissões", "tipo": "despesa", "categoria_pai_id": null, "ativo": true },
  { "id": 12, "descricao": "Comissões de profissionais", "tipo": "despesa", "categoria_pai_id": 11, "ativo": true },
  { "id": 13, "descricao": "Comissões de vendedores", "tipo": "despesa", "categoria_pai_id": 11, "ativo": true }
]
```

---

## 12. Endpoints API (inferidos)

> Todos **inferidos** (REST convencional). Base provável: `/api/financeiro/categorias`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/categorias` | Lista categorias (suporta `?tipo=`, `?status=`, `?q=` busca, `?parent_id=`). Pode retornar estrutura aninhada (`filhos[]`). |
| `GET` | `/api/financeiro/categorias?tree=true` | Retorna árvore hierárquica completa (pais com filhos aninhados). |
| `GET` | `/api/financeiro/categorias/{id}` | Detalhe de uma categoria. |
| `POST` | `/api/financeiro/categorias` | Cria categoria/subcategoria (`{ descricao, tipo, categoria_pai_id, cor, ativo }`). |
| `PUT` / `PATCH` | `/api/financeiro/categorias/{id}` | Atualiza categoria. |
| `PATCH` | `/api/financeiro/categorias/{id}/status` | Alterna ativo/inativo (toggle de Status). |
| `DELETE` | `/api/financeiro/categorias/{id}` | Exclui (provável soft delete; bloqueia se houver filhos/lançamentos). |

**Parâmetros de query inferidos para `GET`:** `q` (busca textual), `tipo` (`receita`/`despesa`), `status` (`ativo`/`inativo`), `parent_id`, `page`, `per_page`.

---

## 13. Regras (hierarquia)

1. **Dois níveis apenas:** categoria-pai (`categoria_pai_id = null`) → subcategoria (`categoria_pai_id` preenchido). Subcategoria **não pode** ter filhos *(inferido — sem 3º nível na captura)*.
2. **Tipo herdado:** a subcategoria herda o `tipo` (receita/despesa) da categoria-pai *(inferido — uma subcategoria de despesa não pode ser receita)*.
3. **Sem ciclos:** uma categoria não pode ser pai de si mesma nem de um ancestral (regra padrão de árvore) *(inferido)*.
4. **Ativar/desativar (toggle Status):**
   - Desativar uma **categoria-pai** deve desativar/ocultar suas subcategorias para seleção em novos lançamentos *(inferido)*.
   - Categorias inativas **não aparecem** nos seletores de lançamento, mas **permanecem** nos lançamentos históricos já classificados *(inferido)*.
5. **Exclusão protegida:** não excluir categoria com **subcategorias** ou com **lançamentos vinculados**; nesses casos sugerir **desativar** em vez de excluir *(inferido)*.
6. **Unicidade de descrição:** descrição única dentro do mesmo grupo/nível *(inferido)*.
7. **Categorias do sistema:** grupos padrão (Aquisições de imobilizados, Aquisições de mercadorias, Comissões, etc.) podem ser **pré-cadastrados (seed)** e ter edição/exclusão restrita *(inferido)*.
8. **Cor:** usada para identificação visual nos gráficos do Relatório de categorias (Tela 35) *(inferido)*.

---

## 14. Fluxos

**14.1 — Criar categoria-pai (inferido)**
1. Usuário clica no FAB `+` (canto inferior direito).
2. Abre modal `Nova categoria`.
3. Preenche `Nome`, seleciona `Tipo` (Receita/Despesa), deixa `Categoria pai` vazio, escolhe `Cor`.
4. Clica `Salvar` → `POST /api/financeiro/categorias`.
5. Grupo aparece na lista com toggle ativo.

**14.2 — Adicionar subcategoria**
1. Usuário clica em `+ Adicionar subcategoria` no rodapé do grupo desejado.
2. Abre modal com `Categoria pai` já preenchida com o grupo.
3. Preenche `Nome`; `Tipo` herdado do pai.
4. `Salvar` → `POST` com `categoria_pai_id` do grupo.
5. Subcategoria aparece indentada dentro do grupo.

**14.3 — Ativar/desativar (toggle Status)**
1. Usuário clica no toggle da linha.
2. `PATCH /api/financeiro/categorias/{id}/status`.
3. Toggle muda de cor (verde ↔ cinza) inline; se for pai, propaga às subcategorias *(inferido)*.

**14.4 — Editar (inferido)**
1. ⋮ → `Editar` → modal preenchido → `Salvar` → `PUT/PATCH`.

**14.5 — Excluir (inferido)**
1. ⋮ → `Excluir` → diálogo de confirmação.
2. Se houver filhos/lançamentos → bloqueia e sugere desativar.
3. Confirma → `DELETE`.

**14.6 — Buscar/filtrar (inferido)**
1. Digita em `Buscar` ou aplica `+ Adicionar filtro` (Tipo/Status).
2. Lista filtra dinamicamente (`GET` com query params).

---

## 15. Notas de implementação

1. **Renderização da árvore:** carregar via `GET ?tree=true` e renderizar pais com filhos aninhados; indentar subcategorias por `padding-left`. Alternativamente, lista plana ordenada por `(grupo, ordem)` com agrupamento no front.
2. **Link "+ Adicionar subcategoria" por grupo:** renderizar uma linha-âncora ao final de cada grupo, passando o `categoria_pai_id` ao modal.
3. **Toggle otimista:** aplicar a mudança de cor imediatamente e reverter em caso de erro da API.
4. **Cores exatas:** toggle ativo verde (~`#22C55E`); links/ações primárias roxo (~`#7C3AED`); manter consistência com o tema do app.
5. **Coluna de tipo/badge:** embora não exibida nesta tela, persistir `tipo` no modelo para alimentar relatórios (Telas 32/35) e seletores de lançamento — usar verde (receita) / vermelho-rosa (despesa).
6. **Estado vazio:** reutilizar o componente padrão (`Hmm, está vazio por aqui!` / `Nenhum registro encontrado.`) já usado nas Telas 39 e 40.
7. **Busca:** debounce ~300ms; buscar em descrição de pais e filhos, mantendo o pai visível quando um filho casar.
8. **Acessibilidade:** toggles com `aria-label` (ex.: "Ativar categoria X"); menu ⋮ navegável por teclado.
9. **Performance:** plano de contas pode crescer; considerar paginação/virtualização por grupo se necessário (não há paginador visível na captura desta tela).
10. **Integridade referencial:** ao desativar/excluir, validar vínculos com lançamentos antes de confirmar (ver §13.4/§13.5).
11. **Itens marcados "(inferido)"** nesta spec não são confirmados pela captura — validar com backend/design antes de implementar (especialmente: campos do modal, coluna Tipo, badges de cor, filtros, endpoints e regras de hierarquia).

---

> **Resumo de divergências entre captura e spec pedida:** a tela real **não** possui botão "Nova categoria" no cabeçalho, **não** exibe colunas `Tipo`/`Categoria pai` nem **badges receita/despesa** — apresenta apenas `Descrição`, `Status` (toggle) e `Ações` (⋮), com hierarquia por indentação e link `+ Adicionar subcategoria` por grupo. Os elementos pedidos e ausentes foram documentados como **(inferido)**.
