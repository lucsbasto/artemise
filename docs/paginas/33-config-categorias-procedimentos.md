# Configurações / Categorias de Procedimentos

| Metadado | Valor |
|---|---|
| **Página** | Categorias de procedimentos (lista vazia + modal "Nova categoria") |
| **Rota** | `/configuracoes/categorias-de-procedimentos` |
| **URL completa** | `https://app.clinicaexperts.com.br/configuracoes/categorias-de-procedimentos` |
| **URL com modal aberto** | `https://app.clinicaexperts.com.br/configuracoes/categorias-de-procedimentos?settings_modal_type=consultation_type_category&settings_modal_mode=new` *(o sufixo `&settings_modal_...` está truncado na captura; `mode=new` inferido)* |
| **Módulo** | Configurações |
| **Breadcrumb** | Configurações / Categorias de procedimentos |
| **Tela base (doc anterior)** | Tela 54 (`06-telas-51-a-58.md`) |
| **Imagem de referência** | `../../images/Captura de tela 2026-06-22 153911.png` |
| **Idioma** | pt-BR |
| **Tipo de tela** | Cadastro / listagem simples + modal de criação |
| **Acesso** | Autenticado (usuário "LB" — Lucas Bastos) |
| **Data da captura** | 22/06/2026 |
| **Estado capturado** | Lista **vazia** (empty state) com modal **"Nova categoria"** aberto |

![](../../images/Captura de tela 2026-06-22 153911.png)

---

## 1. Identificação

- **Nome da página (título do card):** `Categorias de procedimentos`
- **Nome funcional / breadcrumb:** `Configurações / Categorias de procedimentos`
  - Segmento `Configurações` em roxo (link clicável); segmento `Categorias de procedimentos` em cinza (página atual).
- **Rota interna:** `/configuracoes/categorias-de-procedimentos`
- **Slug do módulo:** `configuracoes`
- **Slug da página:** `categorias-de-procedimentos`
- **Identificador de domínio (backend):** `consultation_type_category` *(extraído do parâmetro de URL `settings_modal_type=consultation_type_category`)* — indica que, internamente, "categoria de procedimento" é modelada como **categoria de tipo de consulta/atendimento** (`consultation_type`).
- **Ícone ativo na sidebar:** ícone de **engrenagem** (Configurações), na base da sidebar, com fundo roxo arredondado (estado ativo).
- **Sinônimos no domínio:** "Categorias de serviços", "Categorias de procedimentos/serviços", "Classificação de procedimentos".
- **Identificação no print:** aba do navegador na URL acima; breadcrumb roxo `Configurações / Categorias de procedimentos`; card branco central com título `Categorias de procedimentos`; modal central `Nova categoria` sobre overlay escurecido.

---

## 2. Objetivo

Gerenciar as **categorias usadas para classificar os procedimentos/serviços** da clínica. Cada procedimento (ver Tela 52/53 — `/configuracoes/procedimentos`) pode ser associado a uma categoria desta lista por meio do campo **"Categoria"** do formulário de procedimento. As categorias servem para **organizar, filtrar, agrupar e relatar** os procedimentos.

**Objetivos específicos:**

1. **Cadastrar** novas categorias (nome + status ativo) via modal "Nova categoria".
2. **Listar** as categorias existentes em tabela paginada.
3. **Ativar/desativar** categorias sem excluí-las (toggle "Ativo").
4. **Editar/excluir** categorias existentes (ações por linha — inferido, lista vazia na captura).
5. **Alimentar o dropdown "Categoria"** do cadastro de procedimentos (Tela 53), inclusive via atalho "+ Adicionar" inline naquela tela.
6. **Exportar** e executar **ações em lote** sobre múltiplos registros.

---

## 3. Layout geral

Estrutura de cima para baixo, dentro da área principal (fundo cinza muito claro):

1. **Breadcrumb:** `Configurações / Categorias de procedimentos`.
2. **Card branco centralizado** (largura ~830 px, centralizado horizontalmente) contendo:
   - **Cabeçalho do card:** título `Categorias de procedimentos` à esquerda; à direita, botões `Ações em lote ▾` e `Exportar ▾`.
   - **Barra de filtros:** link `+ Adicionar filtro` à esquerda; campo `Buscar` à direita.
   - **Corpo:** área da tabela/lista — na captura, exibindo o **empty state** (ícone, título, subtítulo e botão de criação).
   - **Rodapé do card:** seletor `25 por página` à esquerda; controles de paginação `«  ‹  ›  »` à direita.
3. **Modal "Nova categoria"** centralizado sobre overlay semitransparente (estado capturado).
4. **FAB roxo `+`** no canto inferior direito (criar nova categoria).
5. **Widgets fixos** (canto inferior direito): balão laranja de gamificação ("Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😅") e card "Seu progresso" com "0%".

> Header superior e sidebar seguem o padrão comum descrito em `06-telas-51-a-58.md` (seção "Elementos comuns").

---

## 4. Cabeçalho do card e ações de topo

| Elemento | Texto exato | Tipo | Comportamento (inferido salvo indicação) |
|---|---|---|---|
| Título do card | `Categorias de procedimentos` | Texto (negrito) | Estático. Em listas populadas, normalmente acompanha contador `N registros` (não visível por estar vazia). |
| Botão | `Ações em lote` + seta `▾` | Botão dropdown | Abre menu de operações em massa sobre os itens selecionados (ex.: ativar, desativar, excluir). Atenuado pelo overlay na captura. |
| Botão | `Exportar` + seta `▾` | Botão dropdown | Abre menu de exportação (ex.: CSV/Excel). Atenuado pelo overlay na captura. |

---

## 5. Barra de filtros e busca

| Elemento | Texto exato | Tipo | Comportamento (inferido) |
|---|---|---|---|
| Adicionar filtro | `+ Adicionar filtro` | Link/botão (roxo) | Abre construtor de filtros por colunas (ex.: nome, ativo). |
| Campo de busca | placeholder `Buscar` | Input de texto | Busca textual por nome de categoria (provável debounce; filtra a tabela). |

---

## 6. Estado vazio (empty state) — TEXTOS EXATOS

Exibido no corpo do card quando não há nenhum registro:

- **Ícone:** círculo com símbolo de informação (ⓘ), em roxo.
- **Título (negrito):** `Hmm, está vazio por aqui!`
- **Subtítulo (cinza):** `Nenhum registro encontrado.`
- **Botão de ação primária (roxo):** `+ Adicionar nova categoria de procedimento`
  - *(Na captura, parcialmente coberto pelo modal; o texto completo é confirmado pela Tela 54 do doc base.)*
  - Ação: abre o modal **"Nova categoria"** (mesma ação do FAB `+`).

---

## 7. Tabela / lista (estrutura quando populada)

> Na captura a lista está **vazia**, portanto as colunas abaixo são **inferidas** a partir do padrão das demais listagens de Configurações (Telas 52/57) e do modelo de dados.

| Coluna | Origem | Ordenável | Observações |
|---|---|---|---|
| `Nome` | `CategoriaProcedimento.nome` | Sim (ícone `⇅`) | Nome da categoria. **(confirmado pelo modal)** |
| `Cor` | `CategoriaProcedimento.cor` | — | **(inferido)** Exibiria um *swatch* de cor + rótulo. **ATENÇÃO:** a cor **não existe** no modal de criação capturado (ver §13); coluna provavelmente **não presente** nesta tela. Mantida apenas porque o briefing pediu — marcada como **não confirmada / provavelmente inexistente**. |
| `Qtd. procedimentos` | contagem de procedimentos vinculados | — | **(inferido)** Número de procedimentos associados à categoria. Não há evidência na UI capturada; pode não existir nesta listagem. |
| `Ativo` | `CategoriaProcedimento.ativo` | — | **(inferido, alto grau)** Toggle/switch verde por linha, no padrão das Telas 52/57. Reflete e altera o status `ativo`. |
| `Ações` | — | — | **(inferido)** Menu de três pontos verticais `⋮` por linha → Editar / Excluir (padrão das Telas 52/57). |

- **Configuração de colunas:** ícone de engrenagem `⚙` no cabeçalho da tabela (padrão das Telas 52/57) — permite mostrar/ocultar colunas. **(inferido)**

> **Observação de honestidade técnica:** a UI real capturada **só evidencia o campo `Nome` e o status `Ativo`**. As colunas `Cor` e `Qtd. procedimentos` solicitadas no briefing **não têm respaldo na captura** e estão marcadas como inferência/possível inexistência. Recomenda-se confirmar com uma captura da lista populada antes de implementar.

---

## 8. Paginação (rodapé do card)

| Elemento | Texto exato | Tipo | Comportamento |
|---|---|---|---|
| Itens por página | `25 por página` | Dropdown | Seleciona o tamanho da página (ex.: 10/25/50/100). |
| Primeira página | `«` | Botão | Vai à primeira página (desabilitado com lista vazia). |
| Página anterior | `‹` | Botão | Página anterior (desabilitado). |
| Próxima página | `›` | Botão | Próxima página (desabilitado). |
| Última página | `»` | Botão | Última página (desabilitado). |

> Com a lista vazia, os controles de paginação aparecem **desabilitados** e sem indicador de número de página.

---

## 9. FAB (botão flutuante de ação)

- **Elemento:** botão circular roxo com `+`, canto inferior direito.
- **Ação:** abre o modal **"Nova categoria"** (mesma ação do botão do empty state).

---

## 10. MODAL "Nova categoria" — estrutura

**Disparadores de abertura:**
- Botão do empty state `+ Adicionar nova categoria de procedimento`.
- FAB `+`.
- *(Inferido)* atalho `+ Adicionar` ao lado do dropdown "Categoria" no modal de procedimento (Tela 53).

**Sincronização com a URL:** ao abrir, a URL recebe `?settings_modal_type=consultation_type_category&settings_modal_mode=new` *(parâmetro `mode=new` inferido — o sufixo está truncado na captura)*. Isso permite *deep-linking* e reabertura do modal por URL.

### 10.1. Cabeçalho do modal

| Elemento | Texto exato | Tipo | Comportamento |
|---|---|---|---|
| Título | `Nova categoria` | Texto (negrito) | Estático. Em edição, provavelmente `Editar categoria` (inferido). |
| Fechar | `X` (canto superior direito) | Botão ícone | Fecha o modal sem salvar; limpa os parâmetros de modal da URL. |

### 10.2. Campos do modal — TEXTOS EXATOS

| # | Rótulo (texto exato) | Obrigatório | Tipo de controle | Placeholder / valor | Observações |
|---|---|---|---|---|---|
| 1 | `Nome*` | **Sim** (asterisco) | Input de texto (linha única) | placeholder `Digite` | Largura ~2/3 da linha (coluna esquerda). Nome da categoria. |
| 2 | `Ativo` + ícone de ajuda `ⓘ` | Não (tem default) | Toggle / switch | **Ligado (verde)** por padrão | Coluna direita, alinhado ao topo do campo Nome. Define o status inicial da categoria. O `ⓘ` exibe tooltip explicativo (inferido). |

> **NÃO HÁ campo de cor no modal capturado.** O briefing solicita um campo "Cor (rótulo, tipo, obrigatório)", porém **a captura não contém nenhum seletor de cor** — apenas `Nome*` e o toggle `Ativo`. Documentado como **ausente na implementação atual**. (Para comparação: o campo `Cor*` com swatch existe no modal de **Procedimento**, Tela 53, não no de **Categoria**.)

### 10.3. Rodapé do modal — botões (TEXTOS EXATOS)

| Elemento | Texto exato | Tipo | Comportamento |
|---|---|---|---|
| Confirmar | `Cadastrar` | Botão primário (roxo, centralizado) | Valida e cria a categoria; ao sucesso fecha o modal e atualiza a lista. Em modo edição, o rótulo seria provavelmente `Salvar` (inferido). |
| Cancelar | — (apenas o `X` do cabeçalho) | — | Não há botão "Cancelar" textual; o fechamento se dá pelo `X`, por clique fora do modal (overlay) ou `Esc` (inferido). |

---

## 11. Modelo de dados — `CategoriaProcedimento`

Modelo inferido a partir da UI, da nomenclatura de backend `consultation_type_category` e dos padrões das demais entidades de Configurações.

| Campo | Tipo | Origem na UI | Obrigatório | Default | Observações |
|---|---|---|---|---|---|
| `id` | `string` / `uuid` ou `int` | — (interno) | sim (gerado) | — | Identificador único. |
| `nome` | `string` | campo `Nome*` | **sim** | — | Nome da categoria. Validar não-vazio; provável `maxLength` (inferido ~100). |
| `ativo` | `boolean` | toggle `Ativo` | sim | `true` | Status de ativação. |
| `cor` | `string` (hex) ou enum | **(inferido / ausente na UI capturada)** | não | — | **Não presente** no modal de criação; incluído apenas para rastrear o pedido do briefing. Provavelmente **não faz parte** deste modelo (a cor pertence ao Procedimento). |
| `qtd_procedimentos` / `procedimentos_count` | `int` (derivado) | **(inferido)** coluna lista | não | `0` | Contagem agregada de procedimentos vinculados; campo **derivado**, não armazenado. |
| `clinica_id` / `tenant_id` | `string` / `uuid` | — (contexto) | sim | — | Multi-tenant: vincula a categoria à clínica logada (inferido). |
| `created_at` | `datetime` | — (interno) | sim (gerado) | — | Inferido. |
| `updated_at` | `datetime` | — (interno) | sim (gerado) | — | Inferido. |
| `deleted_at` | `datetime` (nullable) | — (interno) | não | `null` | Soft delete (inferido, comum no produto). |

**Relacionamentos:**
- `CategoriaProcedimento` 1—N `Procedimento` (um procedimento referencia no máximo uma categoria, via `categoria_id`; ver Tela 53).
- Internamente associada ao conceito `consultation_type` (tipo de consulta/atendimento).

**Exemplo de payload (JSON, inferido):**
```json
{
  "id": "a1b2c3d4",
  "nome": "Estética Facial",
  "ativo": true,
  "procedimentos_count": 3,
  "created_at": "2026-06-22T18:39:00Z",
  "updated_at": "2026-06-22T18:39:00Z"
}
```

---

## 12. Endpoints de API (inferidos)

> Nenhum endpoint é visível na captura; todos abaixo são **inferidos** a partir das rotas REST convencionais e do identificador de backend `consultation_type_category`. Os caminhos reais podem usar `consultation-type-categories` (modelo de backend) em vez de `categorias-de-procedimentos` (slug de UI).

| Ação | Método | Endpoint (inferido) | Corpo / Query | Resposta |
|---|---|---|---|---|
| Listar categorias | `GET` | `/api/consultation-type-categories` | `?search=&page=&per_page=25&sort=nome&active=` | Lista paginada de `CategoriaProcedimento`. |
| Obter uma categoria | `GET` | `/api/consultation-type-categories/{id}` | — | `CategoriaProcedimento`. |
| Criar categoria | `POST` | `/api/consultation-type-categories` | `{ "nome": "...", "ativo": true }` | Categoria criada (201). **Disparada pelo botão `Cadastrar`.** |
| Atualizar categoria | `PUT`/`PATCH` | `/api/consultation-type-categories/{id}` | `{ "nome": "...", "ativo": false }` | Categoria atualizada. |
| Alternar ativo (inline) | `PATCH` | `/api/consultation-type-categories/{id}` | `{ "ativo": false }` | Status atualizado (toggle da linha). |
| Excluir categoria | `DELETE` | `/api/consultation-type-categories/{id}` | — | 204 / soft delete. |
| Ações em lote | `POST` | `/api/consultation-type-categories/bulk` | `{ "ids": [...], "action": "activate|deactivate|delete" }` | Resultado da operação. |
| Exportar | `GET` | `/api/consultation-type-categories/export` | `?format=csv|xlsx&...filtros` | Arquivo. |

---

## 13. Regras de negócio e validações

1. **`Nome` obrigatório:** botão `Cadastrar` deve bloquear/exibir erro se vazio (campo marcado com `*`).
2. **`Nome` único por clínica (inferido):** evitar categorias duplicadas no mesmo tenant; exibir erro de duplicidade.
3. **`Ativo` padrão `true`:** toda nova categoria nasce ativa (toggle ligado por padrão).
4. **Ativação/desativação não exclui:** desativar uma categoria apenas a oculta da seleção de novos procedimentos (inferido); procedimentos já vinculados permanecem.
5. **Exclusão x vínculo:** ao excluir uma categoria vinculada a procedimentos, o sistema deve (a) bloquear com aviso ou (b) desvincular os procedimentos (passando a `Categoria = -`, como visto na Tela 52). Comportamento exato a confirmar (inferido).
6. **Escopo multi-tenant:** categorias pertencem à clínica logada; não compartilhadas entre clínicas (inferido).
7. **Ausência de cor:** **não** existe atributo de cor nesta entidade na implementação capturada — não implementar campo/coluna de cor sem confirmação (a cor é atributo do **Procedimento**, não da Categoria).
8. **Sincronização de URL:** abertura/fechamento do modal deve refletir nos parâmetros `settings_modal_type` / `settings_modal_mode`.

---

## 14. Fluxos

### 14.1. Criar primeira categoria (a partir do empty state)
1. Usuário acessa `/configuracoes/categorias-de-procedimentos` → vê o empty state (`Hmm, está vazio por aqui!`).
2. Clica em `+ Adicionar nova categoria de procedimento` (ou no FAB `+`).
3. Modal `Nova categoria` abre; URL ganha `?settings_modal_type=consultation_type_category&settings_modal_mode=new`.
4. Usuário digita o `Nome*` (placeholder `Digite`) e ajusta o toggle `Ativo` (já ligado por padrão).
5. Clica em `Cadastrar` → `POST` cria a categoria.
6. Sucesso: modal fecha, URL limpa os parâmetros, lista recarrega exibindo a nova categoria; empty state desaparece.

### 14.2. Validação de erro
1. Usuário clica `Cadastrar` com `Nome` vazio → erro inline no campo (ex.: "Campo obrigatório") e bloqueio do submit (inferido).
2. Nome duplicado → mensagem de duplicidade (inferido).

### 14.3. Fechar sem salvar
1. Usuário clica no `X` (ou fora do modal / `Esc`) → modal fecha sem persistir; parâmetros de modal removidos da URL.

### 14.4. Editar/desativar (lista populada — inferido)
1. Na linha, toggle `Ativo` desliga a categoria (PATCH inline).
2. Menu `⋮` → `Editar` reabre o modal pré-preenchido (rótulo `Salvar`); `Excluir` remove (com confirmação).

### 14.5. Origem cruzada (Tela 53 — Procedimento)
1. No modal de Procedimento, o atalho `+ Adicionar` ao lado do dropdown `Categoria` abre este mesmo fluxo de criação inline; ao salvar, a nova categoria fica selecionada no procedimento (inferido).

---

## 15. Notas de implementação

1. **Nomenclatura backend vs UI:** o slug de UI é `categorias-de-procedimentos`, mas o backend identifica a entidade como `consultation_type_category` (categoria de tipo de consulta). Manter o mapeamento explícito na camada de API/serviço.
2. **Modal controlado por URL:** implementar o modal como rota/estado sincronizado com query params (`settings_modal_type`, `settings_modal_mode`) para suportar deep-link, voltar/avançar do navegador e recarregamento de página com modal aberto.
3. **Reuso de componente de lista:** a tela compartilha o "chrome" de listagem das Telas 52/57 (cabeçalho com `Ações em lote`/`Exportar`, `+ Adicionar filtro`, `Buscar`, paginação `25 por página`, `⚙` de colunas, menu `⋮` por linha). Reutilizar o mesmo componente de DataTable.
4. **Empty state reutilizável:** o bloco `Hmm, está vazio por aqui!` / `Nenhum registro encontrado.` + botão primário é um componente padrão do app; passar o rótulo do botão como prop (`+ Adicionar nova categoria de procedimento`).
5. **Default do toggle:** garantir que o `Ativo` inicie ligado no modal de criação.
6. **NÃO implementar campo de cor** nesta entidade sem confirmação de produto — a captura mostra apenas `Nome*` + `Ativo`. (O briefing pediu, mas a UI real não tem.)
7. **Colunas `Cor` e `Qtd. procedimentos`:** não há evidência na captura; tratar como hipóteses a validar com uma captura da lista populada antes de codar.
8. **Acessibilidade:** o `X` precisa de `aria-label` ("Fechar"); o toggle `Ativo` precisa de rótulo associado; o `ⓘ` deve expor tooltip acessível.
9. **Internacionalização:** todos os textos em pt-BR; centralizar as strings (`Nova categoria`, `Nome`, `Ativo`, `Cadastrar`, `Hmm, está vazio por aqui!`, `Nenhum registro encontrado.`, `+ Adicionar nova categoria de procedimento`).
10. **Pós-criação:** após `Cadastrar`, invalidar/recarregar o cache da lista e, quando o fluxo vier do cadastro de Procedimento, selecionar automaticamente a categoria recém-criada no dropdown de origem.

---

> **Avisos de fidelidade:** Itens marcados **(inferido)** não são visíveis na captura. Em especial: o **campo/coluna de Cor** e a **coluna de Qtd. procedimentos** solicitados no briefing **não aparecem** na implementação capturada — o modal real contém somente `Nome*` e o toggle `Ativo`, e o botão de confirmação é `Cadastrar`. Recomenda-se capturar a lista populada e o modal de edição para confirmar colunas e ações.
