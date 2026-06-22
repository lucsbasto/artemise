# Contatos / Fornecedores

| Metadado | Valor |
|---|---|
| **Título da página** | Fornecedores |
| **Módulo** | Contatos |
| **Rota** | `/clinica/contatos/listagem-fornecedores` |
| **URL completa** | `app.clinicaexperts.com.br/clinica/contatos/listagem-fornecedores` |
| **Breadcrumb** | `Contatos / Fornecedores` |
| **Tipo de tela** | Listagem (tabela) |
| **Referência cruzada** | `docs/03-telas-21-a-30.md` — Tela 26 |
| **Captura** | `Captura de tela 2026-06-22 153308.png` (2026-06-22) |
| **Idioma** | pt-BR |
| **Autenticação** | Requer login (área `/clinica`) |
| **Tela irmã** | Profissionais (`/clinica/contatos/listagem-profissionais`, Tela 25) — estrutura idêntica |

![](../../images/Captura de tela 2026-06-22 153308.png)

---

## 1. Identificação

- **Nome da página:** Fornecedores
- **Rota:** `/clinica/contatos/listagem-fornecedores`
- **URL completa:** `app.clinicaexperts.com.br/clinica/contatos/listagem-fornecedores`
- **Breadcrumb (texto exato):** `Contatos / Fornecedores` (o segmento `Contatos` é link roxo; `Fornecedores` é o nó atual, em cinza)
- **Módulo:** Contatos (ícone "pessoas" na sidebar, destacado em roxo)
- **Título do card (texto exato):** **Fornecedores**
- **Contador ao lado do título (texto exato):** **1 registro** (cinza, em fonte menor; pluraliza para "N registros" — *inferido*)

A página é estruturalmente idêntica à listagem de **Profissionais** (Tela 25), reaproveitando o mesmo componente de listagem de contatos com o tipo `fornecedor`.

---

## 2. Objetivo

Listar, buscar, filtrar e gerenciar os **fornecedores** cadastrados na clínica (parceiros de insumos, produtos cosméticos, materiais, serviços terceirizados etc.), permitindo:

- Visualizar todos os fornecedores em formato tabular com status ativo/inativo.
- Ativar/desativar cada fornecedor via toggle inline.
- Buscar por nome/razão social.
- Aplicar filtros (etiquetas, status, identificador — *inferido*).
- Executar ações em lote sobre múltiplos registros selecionados.
- Exportar a listagem.
- Criar um novo fornecedor (botão flutuante "+").

O cadastro de fornecedores serve de base para vinculação a **Contas a pagar** (Tela 30) e a movimentações de **Estoque/Compras** (*inferido* — ver §11).

---

## 3. Navegação

### 3.1 Como chegar
- **Sidebar:** ícone "pessoas" (Contatos) → submenu/abas de Contatos → **Fornecedores**.
- **Breadcrumb:** clicar em `Contatos` retorna ao índice do módulo.
- **URL direta:** `/clinica/contatos/listagem-fornecedores`.

### 3.2 Navegação interna do módulo Contatos (*inferido*)
Conjunto de listagens irmãs sob `/clinica/contatos/`:
- Pacientes/Clientes — `/clinica/contatos/listagem` (*inferido*)
- Profissionais — `/clinica/contatos/listagem-profissionais` (Tela 25)
- **Fornecedores — `/clinica/contatos/listagem-fornecedores`** (esta tela)

### 3.3 Saídas a partir desta tela
- Clicar na linha / no nome do fornecedor → abre o **perfil/detalhe do fornecedor** (*inferido*, análogo à página de paciente).
- Botão flutuante **"+"** → abre o **modal/formulário "Novo fornecedor"** (§10).
- Menu **⋮** da linha → ações por registro (editar, excluir, ativar/desativar — §6.3).
- **Exportar ▾** → gera arquivo da listagem (CSV/XLSX — *inferido*).

---

## 4. Layout

Estrutura de cima para baixo, esquerda para direita:

1. **Header (topo, fixo)** — padrão do sistema:
   - À esquerda: botão hambúrguer (☰) para colapsar a sidebar + logo **clínicaexperts**.
   - À direita: ícone **WhatsApp** (fundo rosa), ícone de **busca/atalhos** (lupa "+"), link **Ajuda** (ícone "?"), **sino** de notificações, **avatar** do usuário (**LB**, círculo verde).
2. **Sidebar esquerda (ícones verticais)** — módulos; ícone "pessoas" (Contatos) destacado em roxo. Seta ">" no rodapé expande os rótulos.
3. **Breadcrumb** (abaixo do header): `Contatos / Fornecedores`.
4. **Área principal — card branco centralizado** com sombra suave, contendo:
   - **Cabeçalho do card:** título **Fornecedores** + contador **1 registro** (esquerda); botões **Ações em lote ▾** e **Exportar ▾** (direita).
   - **Barra de filtros:** **+ Adicionar filtro** (esquerda) e campo **Buscar** (direita).
   - **Tabela** de fornecedores (cabeçalho + linhas).
   - **Rodapé do card:** seletor **25 por página** (esquerda) e controles de paginação `« ‹ [1] › »` (direita).
5. **Botão flutuante "+"** (círculo roxo, canto inferior direito) — criar fornecedor.
6. **Widgets de onboarding/gamificação** (canto inferior direito): banner laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** e card **"Seu progresso 0%"** (com seta de recolher). Elementos globais, não pertencem à página.

---

## 5. Componentes

### 5.1 Botão "Novo fornecedor" (FAB)
- **Elemento:** botão flutuante circular roxo com ícone **"+"**, ancorado no canto inferior direito (acima dos widgets de onboarding).
- **Texto:** *sem rótulo textual* — apenas o ícone "+". (Tooltip/rótulo "Novo fornecedor" — *inferido*.)
- **Ação:** abre o formulário de criação de fornecedor (§10).
- **Observação:** diferente de outras telas (ex.: Orçamentos com botão **"+ Adicionar novo orçamento"** textual), esta listagem usa o FAB global "+" para criação, sem botão textual dedicado no card.

### 5.2 Botão "Ações em lote ▾"
- **Texto exato:** **Ações em lote** (com chevron ▾).
- **Estado inicial:** **desabilitado/cinza** (enquanto nenhum checkbox de linha está marcado).
- **Habilitação:** torna-se clicável ao selecionar ≥ 1 linha. Abre dropdown com ações em massa: ativar, desativar, excluir, adicionar etiquetas, exportar selecionados (*inferido* — §14.3).

### 5.3 Botão "Exportar ▾"
- **Texto exato:** **Exportar** (com chevron ▾).
- **Estado:** habilitado.
- **Ação:** dropdown de formatos de exportação (CSV, XLSX, PDF — *inferido*).

### 5.4 Link "+ Adicionar filtro"
- **Texto exato:** **+ Adicionar filtro** (roxo).
- **Ação:** abre seletor/painel de filtros (§8).

### 5.5 Campo "Buscar"
- **Texto do placeholder (exato):** **Buscar**.
- **Posição:** canto direito da barra de filtros.
- **Comportamento (*inferido*):** busca por nome/razão social do fornecedor; debounce; filtra a tabela server-side (parâmetro `q` ou `search`).

### 5.6 Engrenagem (configurar colunas)
- **Elemento:** ícone de **engrenagem (⚙)** no canto direito do cabeçalho da tabela.
- **Ação (*inferido*):** abre painel para exibir/ocultar/reordenar colunas da tabela.

---

## 6. Tabela

### 6.1 Colunas (cabeçalho — textos exatos, esquerda → direita)

| # | Coluna | Conteúdo | Ordenável | Observações |
|---|--------|----------|-----------|-------------|
| 1 | *(checkbox)* | Caixa de seleção da linha; no cabeçalho, **select-all** | Não | Seleciona linha(s) para Ações em lote |
| 2 | **Nome** | Avatar (iniciais) + **nome/razão social** + **subtítulo de tipo** | **Sim** (ícone ◆ ao lado do rótulo) | Coluna principal |
| 3 | **Etiquetas** | Tags/labels do fornecedor | Não (*inferido*) | Vazia na captura |
| 4 | **Identificador** | Documento/telefone identificador (ex.: CNPJ ou WhatsApp) | Não (*inferido*) | Exibe **—** quando ausente |
| 5 | **Ativo** | **Toggle** ativo/inativo | Não | Verde = ativo |
| 6 | *(engrenagem ⚙)* | — | Não | Configurar colunas |
| — | **⋮** (ações) | Menu de ações da linha | Não | Coluna mais à direita, sem rótulo |

> **Nota sobre as colunas pedidas (razão social, CNPJ, contato, categoria):** Na captura, a listagem **não** exibe colunas separadas para CNPJ, contato ou categoria. O modelo de listagem de contatos da Clínica Experts consolida essas informações em:
> - **Nome** → razão social / nome fantasia (texto principal) + tipo (subtítulo).
> - **Identificador** → documento ou telefone (CNPJ/CPF/WhatsApp), exibido **—** quando vazio.
> - **Etiquetas** → equivalente funcional a "categoria/segmentação".
>
> Colunas dedicadas de **CNPJ**, **Contato** e **Categoria** seriam *inferidas* e dependem da configuração de colunas (engrenagem) — não estão visíveis no estado capturado.

### 6.2 Linha de dados (exemplo capturado — textos exatos)

| Campo | Valor |
|---|---|
| Checkbox | desmarcado |
| Avatar | **FE** (iniciais, círculo rosa/lilás) |
| Nome (texto principal) | **Fornecedor (Fornecedor de exemplo)** |
| Subtítulo (tipo) | **Fornecedor** |
| Etiquetas | *(vazio)* |
| Identificador | **—** |
| Ativo | **toggle ligado (verde)** |
| Ações | **⋮** |

### 6.3 Ações por linha (menu ⋮ — *inferido*)
- **Editar** fornecedor (abre formulário §7/§10).
- **Ativar/Desativar** (espelha o toggle da coluna Ativo).
- **Excluir** fornecedor.
- **Ver detalhes/perfil**.
- *(Possível)* **Adicionar etiqueta**.

### 6.4 Ordenação
- Coluna **Nome** é ordenável (ícone **◆** ao lado do rótulo) — alterna A→Z / Z→A.
- Demais colunas: ordenação não confirmada na captura (*inferido* como não-ordenáveis).

### 6.5 Paginação
- **Seletor de tamanho de página (texto exato):** **25 por página** (dropdown). Opções típicas: 10, 25, 50, 100 (*inferido*).
- **Controles:** `«` (primeira página) · `‹` (anterior) · **[1]** (página atual, destacada em roxo) · `›` (próxima) · `»` (última).
- Na captura, com 1 registro, controles de avanço/recuo aparecem **desabilitados** (cinza).

---

## 7. Formulários

A criação/edição de fornecedor ocorre via **modal "Novo fornecedor"** (§10). Não há formulário inline na listagem. Campos *inferidos* do formulário detalhados em §10.

Validação e máscaras: ver §13 (regras de CNPJ).

---

## 8. Filtros

### 8.1 Busca rápida
- Campo **Buscar** (placeholder exato **Buscar**) — busca textual por nome/razão social/identificador (*inferido*).

### 8.2 Filtros avançados ("+ Adicionar filtro")
Link **+ Adicionar filtro** abre seletor de critérios. Filtros *inferidos*:
- **Status / Ativo:** Ativo | Inativo | Todos.
- **Etiquetas:** seleção de uma ou mais tags.
- **Identificador / Documento:** por CNPJ/CPF.
- **Data de cadastro:** intervalo (*inferido*).

> Quando filtros não retornam registros, o sistema exibe o empty state padrão (§9.2), com botão **Limpar filtros** (observado na Tela 22).

---

## 9. Estados

### 9.1 Estado padrão (com dados)
Tabela renderizada com 1+ linhas; contador **1 registro**; paginação ativa. (Estado da captura.)

### 9.2 Estado vazio por filtro (empty state — padrão do sistema, ver Tela 22)
- Ícone de **lupa** em círculo roxo claro.
- Título: **Oops, nada foi encontrado!**
- Texto: **Os filtros selecionados não correspondem a nenhum registro.**
- Botões: **Limpar filtros** (contorno roxo) e **+ Adicionar novo [registro]** (roxo preenchido) — *inferido* "+ Adicionar novo fornecedor".

### 9.3 Estado vazio inicial (sem nenhum cadastro) — *inferido*
- Mensagem incentivando o primeiro cadastro + CTA para criar fornecedor.

### 9.4 Estado de carregamento — *inferido*
- Skeleton/spinner enquanto a tabela carrega.

### 9.5 Estados de toggle "Ativo"
- **Ligado (verde):** fornecedor ativo (estado da captura).
- **Desligado (cinza):** fornecedor inativo.
- Alternar dispara atualização imediata (PATCH — §12) com feedback (toast — *inferido*).

---

## 10. Modais

### 10.1 Modal "Novo fornecedor" (*inferido*)
Acionado pelo FAB **"+"**. Estrutura *inferida* a partir do padrão de modais do sistema (Telas 23/24) e da natureza do cadastro de fornecedor.

- **Cabeçalho:** título **Novo fornecedor** + botão **×** (fechar).
- **Campos (todos *inferidos*):**

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| **Razão social** | texto | Sim (*) | Nome jurídico do fornecedor |
| **Nome fantasia** | texto | Não | Nome de exibição |
| **CNPJ** | texto com máscara `00.000.000/0000-00` | Não (*inferido*) | Validação de dígitos (§13); pessoa jurídica |
| **CPF** | texto com máscara `000.000.000-00` | Não | Para fornecedor pessoa física (*inferido*) |
| **Contato (telefone/WhatsApp)** | texto/telefone com máscara | Não | Vira o **Identificador** na listagem |
| **E-mail** | e-mail | Não | — |
| **Endereço** | grupo | Não | CEP, logradouro, número, complemento, bairro, cidade, UF |
| **Categoria / Etiquetas** | seleção múltipla | Não | Segmentação do fornecedor |
| **Observações** | textarea | Não | — |
| **Ativo** | toggle | — | Default = ativo |

- **Rodapé:** botão **Salvar** (roxo). Possível **Cancelar**.
- **Validação:** campos obrigatórios com asterisco (*). CNPJ validado (§13).

### 10.2 Modal de confirmação de exclusão (*inferido*)
- Diálogo "Tem certeza que deseja excluir este fornecedor?" com **Cancelar** / **Excluir** (vermelho). Bloqueio se houver vínculos com contas a pagar/estoque (§13.4).

---

## 11. Modelo de dados

### 11.1 Entidade `Fornecedor` (*inferido*)

| Campo | Tipo | Nulo | Descrição |
|---|---|---|---|
| `id` | UUID / bigint | Não | Identificador único |
| `tipo` | enum (`fornecedor`) | Não | Discriminador do contato (mesma tabela base de contatos) |
| `razao_social` | string | Não | Nome jurídico (texto principal da listagem) |
| `nome_fantasia` | string | Sim | Nome de exibição |
| `pessoa` | enum (`juridica` \| `fisica`) | Não | Define se usa CNPJ ou CPF (*inferido*) |
| `cnpj` | string(14) | Sim | Documento PJ (armazenado sem máscara) |
| `cpf` | string(11) | Sim | Documento PF (alternativo) |
| `identificador` | string | Sim | Documento/telefone exibido na coluna **Identificador** |
| `contato_telefone` | string | Sim | Telefone/WhatsApp |
| `email` | string | Sim | E-mail |
| `endereco` | objeto/relacional | Sim | CEP, logradouro, número, complemento, bairro, cidade, UF |
| `etiquetas` | array<Etiqueta> | Sim | Tags/categorias (coluna **Etiquetas**) |
| `ativo` | boolean | Não | Status (coluna **Ativo**); default `true` |
| `observacoes` | text | Sim | Notas livres |
| `avatar_iniciais` | string | Não | Iniciais para o avatar (ex.: "FE") — *derivado* |
| `clinica_id` | UUID | Não | Tenant/clínica proprietária |
| `created_at` | timestamp | Não | Data de cadastro |
| `updated_at` | timestamp | Não | Última atualização |

### 11.2 Relacionamentos

- **Contas a pagar** (Tela 30): `ContaAPagar.fornecedor_id → Fornecedor.id` (1:N). Cada despesa/conta a pagar pode referenciar um fornecedor; usado para relatórios por fornecedor e conciliação. (*inferido*)
- **Estoque / Compras:** `MovimentacaoEstoque.fornecedor_id → Fornecedor.id` ou `Compra.fornecedor_id → Fornecedor.id` (1:N). Entradas de produtos/insumos no estoque registram o fornecedor de origem. (*inferido*)
- **Etiquetas:** relação N:N `Fornecedor ↔ Etiqueta` (categorização/segmentação). (*inferido*)
- **Endereço:** 1:1 (embutido ou tabela `endereco`). (*inferido*)
- **Contato base:** `Fornecedor` provavelmente é uma especialização da tabela genérica de **Contatos** (compartilhada com Pacientes e Profissionais), discriminada por `tipo`. (*inferido*, pela rota e UI idênticas a Profissionais.)

---

## 12. Endpoints de API (todos *inferidos*)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/clinica/fornecedores` | Lista paginada. Query: `page`, `per_page` (default 25), `q` (busca), `ativo`, `etiquetas[]`, `sort` (ex.: `nome:asc`) |
| `GET` | `/api/clinica/fornecedores/{id}` | Detalhe de um fornecedor |
| `POST` | `/api/clinica/fornecedores` | Cria fornecedor (payload do modal §10) |
| `PUT` / `PATCH` | `/api/clinica/fornecedores/{id}` | Atualiza fornecedor |
| `PATCH` | `/api/clinica/fornecedores/{id}/ativo` | Alterna status ativo/inativo (toggle) |
| `DELETE` | `/api/clinica/fornecedores/{id}` | Exclui fornecedor (bloqueado se houver vínculos) |
| `POST` | `/api/clinica/fornecedores/acoes-em-lote` | Ações em lote (`ids[]`, `acao`) |
| `GET` | `/api/clinica/fornecedores/exportar?formato=csv\|xlsx` | Exporta listagem |
| `GET` | `/api/clinica/fornecedores/etiquetas` | Lista de etiquetas para filtro |

**Resposta de listagem (*inferido*):**
```json
{
  "data": [
    {
      "id": "…",
      "razao_social": "Fornecedor",
      "nome_fantasia": "Fornecedor de exemplo",
      "tipo": "fornecedor",
      "identificador": null,
      "etiquetas": [],
      "ativo": true,
      "avatar_iniciais": "FE"
    }
  ],
  "meta": { "total": 1, "page": 1, "per_page": 25, "last_page": 1 }
}
```

---

## 13. Regras de negócio

### 13.1 CNPJ
- **Máscara de entrada:** `00.000.000/0000-00`.
- **Validação:** 14 dígitos; verificação dos **dois dígitos verificadores** (DV) pelo algoritmo módulo 11. (*inferido*)
- **Armazenamento:** somente dígitos (sem máscara). (*inferido*)
- **Unicidade:** CNPJ único por clínica (não permitir duplicado no mesmo tenant). (*inferido*)
- **Opcionalidade:** CNPJ não é obrigatório (fornecedor pode ser pessoa física com CPF ou cadastro simples). Na captura, o fornecedor de exemplo tem **Identificador = —** (sem documento). (*inferido*)

### 13.2 CPF (fornecedor pessoa física) — *inferido*
- Máscara `000.000.000-00`; validação de DV (módulo 11); alternativo ao CNPJ.

### 13.3 Razão social obrigatória
- Campo **Razão social** é obrigatório para salvar. (*inferido*)

### 13.4 Exclusão com vínculos — *inferido*
- Não permitir excluir (hard delete) fornecedor vinculado a contas a pagar ou movimentações de estoque; oferecer **desativação** (soft) em vez disso.

### 13.5 Multi-tenant
- Todos os fornecedores são escopados por `clinica_id`; usuário só vê os da própria clínica.

---

## 14. Fluxos

### 14.1 Criar fornecedor
1. Usuário clica no FAB **"+"**.
2. Abre modal **Novo fornecedor** (§10).
3. Preenche **Razão social** (obrigatório) e demais campos (CNPJ, contato, endereço, etiquetas).
4. Validação de CNPJ (§13.1) ocorre no blur/submit.
5. Clica **Salvar** → `POST /fornecedores`.
6. Modal fecha; toast de sucesso; nova linha aparece na tabela; contador incrementa.

### 14.2 Buscar / filtrar
1. Digita no campo **Buscar** ou aplica **+ Adicionar filtro**.
2. Tabela recarrega (server-side) com os resultados.
3. Sem resultados → empty state (§9.2) com **Limpar filtros**.

### 14.3 Ações em lote
1. Marca checkbox(es) de linha (ou select-all no cabeçalho).
2. Botão **Ações em lote ▾** habilita.
3. Escolhe ação (ativar, desativar, excluir, etiquetar) → confirmação → execução em massa.

### 14.4 Ativar/Desativar (toggle)
1. Clica no toggle **Ativo** da linha.
2. `PATCH /fornecedores/{id}/ativo`.
3. Toggle reflete o novo estado (verde/cinza) com feedback.

### 14.5 Exportar
1. Clica **Exportar ▾** → escolhe formato.
2. Download do arquivo da listagem (respeitando filtros aplicados — *inferido*).

### 14.6 Editar / Excluir
1. Menu **⋮** da linha → **Editar** (abre modal preenchido) ou **Excluir** (confirmação §10.2).

---

## 15. Notas de implementação

- **Componente reutilizado:** esta tela compartilha o componente de **listagem de contatos** com Profissionais (Tela 25) e provavelmente Pacientes. Recomenda-se parametrizar por `tipo=fornecedor` em vez de duplicar telas (rota, colunas, filtros e ações são os mesmos; muda o `tipo` e os rótulos).
- **Coluna "Nome" composta:** renderiza avatar (iniciais derivadas), texto principal (razão social / "razão (fantasia)") e subtítulo (tipo "Fornecedor"). No exemplo: **Fornecedor (Fornecedor de exemplo)** + subtítulo **Fornecedor**.
- **Identificador "—":** exibir traço quando `identificador` for nulo (não string vazia).
- **Configuração de colunas (⚙):** persistir preferência de colunas por usuário/clínica. Colunas adicionais (CNPJ, Contato, Categoria) podem ser habilitadas aqui.
- **Toggle "Ativo":** atualização otimista com rollback em erro de rede; debounce para evitar duplo clique.
- **"Ações em lote ▾"** deve permanecer **desabilitado** até haver seleção; sincronizar com select-all e seleção parcial (estado indeterminado do checkbox de cabeçalho).
- **Paginação:** server-side; `per_page` default **25**; persistir escolha do seletor "25 por página".
- **Busca:** aplicar debounce (~300 ms) e enviar como parâmetro `q`/`search`; resetar para página 1 a cada nova busca/filtro.
- **CNPJ:** validar DV no front (UX) e no back (segurança); normalizar para apenas dígitos antes de persistir.
- **Empty states:** reutilizar o componente padrão "Oops, nada foi encontrado!" (Tela 22) com CTA contextual de fornecedor.
- **Acessibilidade:** FAB "+" e ícones (⚙, ⋮, toggle) precisam de `aria-label` (ex.: "Novo fornecedor", "Configurar colunas", "Ações do fornecedor", "Ativar/desativar fornecedor"), pois não têm rótulo textual.
- **i18n:** todos os textos em pt-BR; centralizar strings ("Fornecedores", "Ações em lote", "Exportar", "Adicionar filtro", "Buscar", "25 por página").
- **Widgets de onboarding** (banner de desconto e "Seu progresso 0%") são globais e não fazem parte do escopo desta página.
