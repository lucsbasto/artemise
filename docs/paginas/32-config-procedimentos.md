# Configurações / Procedimentos

| Metadado | Valor |
|----------|-------|
| **Página** | Configurações / Procedimentos |
| **Rota (listagem)** | `/configuracoes/procedimentos` |
| **Rota (modal editar)** | `/configuracoes/procedimentos/{id}/editar` (ex.: `/configuracoes/procedimentos/1353394/editar`) |
| **Módulo** | Configurações |
| **App** | app.clinicaexperts.com.br |
| **Idioma** | pt-BR |
| **Tipo** | Listagem (tabela) + Modal de edição/criação |
| **Telas de referência** | Telas 52 (listagem) e 53 (modal) — `docs/06-telas-51-a-58.md` |
| **Perfil de acesso** | Administrador / Gestor da clínica (inferido) |
| **Última verificação** | 2026-06-22 |

---

## 1. Visão geral e propósito

A página **Configurações / Procedimentos** lista e gerencia os **procedimentos** (serviços) oferecidos pela clínica. Cada procedimento concentra a definição comercial (valor de venda, tipo de precificação, custo), operacional (duração na agenda, tempo de reconsulta, cor de identificação), de classificação (categoria) e de insumos (materiais de atendimento), além de informações adicionais recolhíveis. Os procedimentos cadastrados alimentam a **agenda** (duração, cor), as **vendas/orçamentos** (valor) e as **fichas de atendimento** (vínculo — inferido a partir de "Informações Adicionais").

A tela é composta por:
- Uma **listagem em tabela** (rota `/configuracoes/procedimentos`).
- Um **modal "Editar Procedimento"** sobreposto à listagem (rota `/configuracoes/procedimentos/{id}/editar`).
- Um **modal de criação** equivalente (inferido — abre via FAB "+"; título provável "Novo Procedimento").

Capturas:

![](../../images/Captura de tela 2026-06-22 153848.png)

![](../../images/Captura de tela 2026-06-22 153855.png)

---

## 2. Chrome comum (header, sidebar, breadcrumb)

Elementos de moldura presentes em toda a aplicação (ver `docs/06-telas-51-a-58.md`, seção "Elementos comuns"):

- **Header superior (faixa branca):**
  - Esquerda: ícone de menu hambúrguer (☰) e logotipo **"clínicaexperts"**.
  - Direita: botão circular do WhatsApp (rosa/vermelho), ícone de busca/atalhos (lupa), link **"Ajuda"** (com ícone de interrogação), ícone de sino (notificações) e avatar circular **"LB"** (Lucas Bastos).
- **Sidebar esquerda (estreita, ícones verticais):** navegação principal; ícone de **engrenagem (Configurações)** destacado em **roxo** ao ativar este módulo. Rodapé com seta (›) expandir/recolher.
- **Breadcrumb (topo da área principal):** **`Configurações / Procedimentos`** — "Configurações" é link clicável em roxo; "Procedimentos" em cinza (página atual).
- **Fundo da área principal:** cinza muito claro (≈ `#f5f5f7`), card branco centralizado.
- **Widgets fixos (canto inferior direito):** balão laranja de gamificação **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😅"**; botão flutuante roxo de IA/assistente (sparkle); card **"Seu progresso"** com **"0%"**.
- **FAB:** botão circular roxo **"+"** no canto inferior direito (criar novo procedimento).

> Nota: a captura mostra um segundo monitor com jogo — irrelevante e ignorado. Documenta-se apenas app.clinicaexperts.com.br.

---

## 3. Listagem — layout

A área principal exibe um **card branco centralizado** com:

1. **Cabeçalho do card:**
   - Título **"Procedimentos"** (negrito).
   - Contador secundário em cinza: **"4 registros"** (texto dinâmico no padrão "{N} registros").
   - À direita: botão **"Exportar"** com seta dropdown (▾).
2. **Barra de filtros / busca:**
   - À esquerda: link/botão **"+ Adicionar filtro"** (roxo).
   - À direita: campo de busca com placeholder **"Buscar"**.
3. **Tabela** de procedimentos (ver §4).
4. **Rodapé / paginação** (ver §5).
5. **FAB "+"** flutuante (criar novo).

---

## 4. Listagem — tabela (colunas, dados, ações)

### 4.1 Colunas (textos exatos)

| # | Cabeçalho | Ordenável (⇅) | Conteúdo | Observação |
|---|-----------|---------------|----------|------------|
| 1 | **Nome** | Sim | Nome do procedimento (link/clicável para editar — inferido) | Texto |
| 2 | **Categoria** | Sim | Nome da categoria ou **"-"** quando ausente | Relaciona à categoria |
| 3 | **Duração** | Sim | Duração em minutos (ex.: **"60"**) | Numérico (minutos) |
| 4 | **Valor** | Sim | Valor de venda formatado em BRL (ex.: **"R$ 200,00"**) | Moeda |
| 5 | **Ativo** | Não (inferido) | **Toggle/switch verde** (ligado) / cinza (desligado) | Edição inline |
| — | (engrenagem ⚙) | — | Ícone no canto direito do cabeçalho | Configurar colunas visíveis |

> O cabeçalho da listagem **não** exibe colunas próprias para **comissão**, **custo**, **cor**, **profissionais** ou **ficha de atendimento**. Essas informações existem no **modal** (§7) e/ou podem ser ativadas pelo ícone de engrenagem (⚙) de "configurar colunas" (inferido). A menção a "comissão" no escopo refere-se a campo do modal — ver §7.5 (não observado diretamente na captura; documentado como **(inferido)**).

### 4.2 Coluna de ações

- Cada linha possui, à direita, um **menu de três pontos verticais (⋮)** que abre as ações por registro:
  - **"Editar"** (abre o modal "Editar Procedimento" — rota `/configuracoes/procedimentos/{id}/editar`). *(inferido — rótulo exato)*
  - **"Excluir"** (remove o procedimento, provável confirmação). *(inferido — rótulo exato)*
  - Possíveis ações adicionais: **"Duplicar"**. *(inferido)*
- Abrir o modal de edição também é possível clicando no **nome** da linha (inferido).

### 4.3 Toggle "Ativo" inline

- A coluna **"Ativo"** exibe um **switch** por linha; alterná-lo ativa/desativa o procedimento **inline** (sem abrir o modal), com persistência imediata via API (inferido).

### 4.4 Dados de exemplo observados

| Nome | Categoria | Duração | Valor | Ativo |
|------|-----------|---------|-------|-------|
| Limpeza de Pele Profunda | - | 60 | R$ 200,00 | ✅ (verde) |
| Microagulhamento | - | 60 | R$ 500,00 | ✅ (verde) |
| Peeling Químico | - | 60 | R$ 300,00 | ✅ (verde) |
| Tratamento de Acne | - | 60 | R$ 250,00 | ✅ (verde) |

Todos sem categoria ("-"), duração 60 min, todos ativos.

---

## 5. Listagem — busca, filtros, ordenação, paginação, exportação

### 5.1 Busca
- Campo **"Buscar"** (placeholder). Busca textual sobre o **nome** do procedimento (inferido; possivelmente também categoria). Filtragem provavelmente server-side com debounce (inferido).

### 5.2 Filtros
- **"+ Adicionar filtro"** abre um construtor de filtros configurável (campo + operador + valor). Filtros prováveis: Categoria, Ativo, Faixa de valor, Duração. *(inferido)*

### 5.3 Ordenação
- Cabeçalhos **Nome**, **Categoria**, **Duração** e **Valor** exibem ícone de ordenação (⇅) — clique alterna asc/desc. *(asc/desc inferido)*

### 5.4 Paginação
- **Seletor de tamanho de página** à esquerda: **"25 por página"** (dropdown; outras opções prováveis: 10, 50, 100 — inferido).
- **Controles à direita:** **«** (primeira), **‹** (anterior), botão de página **"1"** (ativo, destaque roxo), **›** (próxima), **»** (última).

### 5.5 Exportação
- Botão **"Exportar"** (▾) abre menu com formatos. Formatos prováveis: **CSV**, **Excel (XLSX)**. *(inferido)*

### 5.6 Configurar colunas
- Ícone de **engrenagem (⚙)** no cabeçalho da tabela: abre painel para mostrar/ocultar colunas (ex.: exibir Custo, Comissão, Cor). *(inferido)*

---

## 6. Modal "Editar Procedimento" — layout

**Abertura:** rota `/configuracoes/procedimentos/{id}/editar` (modal sobre a listagem; overlay escurecido). O mesmo formulário, sem `{id}`, serve à **criação** (FAB "+") — título provável **"Novo Procedimento"** e botão **"Cadastrar"** ou **"Salvar"** *(inferido)*.

**Estrutura (de cima para baixo):**
1. **Cabeçalho:** título **"Editar Procedimento"** + botão **"X"** (fechar) no canto superior direito.
2. **Bloco principal de campos** (§7).
3. **Seção "Materiais de atendimento"** (§8).
4. **Linha "Custo total"** (§8.2).
5. **Seção recolhível "Informações Adicionais"** (§9).
6. **Rodapé:** botão **"Salvar"** (roxo, centralizado).

---

## 7. Modal — campos do bloco principal (detalhamento)

Disposição observada: **Nome** (largura total) → linha [**Valor de venda** + seletor | **Custo adicional** | **Cor**] → linha [**Duração** | **Tempo de reconsulta** | **Categoria** (+ link "Adicionar")] → toggle **Ativo**.

### 7.1 Nome
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Nome*"** |
| **Tipo** | Campo de texto (largura total) |
| **Obrigatório** | **Sim** (asterisco) |
| **Valor exemplo** | "Limpeza de Pele Profunda" |
| **Placeholder** | (não visível; provável "Digite") |

### 7.2 Valor de venda (+ tipo de precificação)
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Valor de venda"** |
| **Tipo** | Campo monetário (BRL) + **dropdown adjacente** de tipo de precificação |
| **Obrigatório** | Sim (inferido) |
| **Valor exemplo** | "R$ 200,00" |
| **Dropdown adjacente** | **"Fixo"** (tipo de precificação) |
| **Opções do dropdown** | **"Fixo"** (observado); demais opções prováveis: **"Variável"** / **"Percentual"** *(inferido)* |

### 7.3 Custo adicional
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Custo adicional"** + ícone de ajuda (ⓘ / **?**) |
| **Tipo** | Campo monetário (BRL) |
| **Obrigatório** | Não (sem asterisco) |
| **Valor exemplo** | "R$ 0,00" |
| **Tooltip** | Texto de ajuda ao passar o mouse (conteúdo não visível) — explica custo extra somado ao custo total *(inferido)* |

### 7.4 Cor
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Cor*"** |
| **Tipo** | Dropdown com **swatch** (amostra de cor) + nome da cor |
| **Obrigatório** | **Sim** (asterisco) |
| **Valor exemplo** | swatch + **"Cinza"** |
| **Opções** | Paleta de cores nomeadas (ex.: Cinza, Azul, Verde, Vermelho, Roxo...) *(inferido)* |
| **Uso** | Cor de identificação do procedimento na **agenda** |

### 7.5 Comissão *(inferido — não visível na captura)*
| Atributo | Valor |
|----------|-------|
| **Rótulo provável** | **"Comissão"** |
| **Localização provável** | Dentro da seção recolhível **"Informações Adicionais"** (§9) |
| **Tipo** | Campo numérico + seletor de unidade **"%"** / **"R$ (fixo)"** (percentual ou valor fixo) |
| **Obrigatório** | Não *(inferido)* |
| **Observação** | A seção "Informações Adicionais" está **recolhida** na captura; o campo de comissão não pôde ser confirmado. Documentado como **(inferido)** conforme escopo. Possível vínculo por profissional (comissão por profissional) — ver §7.9. |

### 7.6 Duração
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Duração"** |
| **Tipo** | Campo numérico com sufixo/unidade "minutos" |
| **Obrigatório** | Sim (inferido) |
| **Valor exemplo** | "60 minutos" |
| **Uso** | Define o **tamanho do bloco do agendamento** na agenda |

### 7.7 Tempo de reconsulta
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Tempo de reconsulta"** |
| **Tipo** | Campo numérico com sufixo/unidade "dias" |
| **Obrigatório** | Não (inferido) |
| **Valor exemplo** | "0 dias" |
| **Uso** | Intervalo sugerido para retorno/reconsulta após o procedimento *(inferido)* |

### 7.8 Categoria
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Categoria"** |
| **Tipo** | Dropdown de busca/seleção (single-select) |
| **Obrigatório** | Não (inferido — sem asterisco) |
| **Placeholder** | **"Pesquise/Selecione"** |
| **Ação adjacente** | Link **"+ Adicionar"** (acima/à direita do campo) — cria **nova categoria inline** (abre modal "Nova categoria" — ver Tela 54) |
| **Origem das opções** | Categorias de procedimentos cadastradas em `/configuracoes/categorias-de-procedimentos` |

### 7.9 Profissionais *(inferido — não visível no bloco principal)*
| Atributo | Valor |
|----------|-------|
| **Rótulo provável** | **"Profissionais"** |
| **Localização provável** | Dentro de **"Informações Adicionais"** (§9) |
| **Tipo** | Dropdown **multisseleção** (Pesquise/Selecione) |
| **Obrigatório** | Não *(inferido)* |
| **Uso** | Restringe quais profissionais podem executar/agendar o procedimento; base para comissão por profissional *(inferido)* |

### 7.10 Ficha de atendimento vinculada *(inferido — não visível no bloco principal)*
| Atributo | Valor |
|----------|-------|
| **Rótulo provável** | **"Ficha de atendimento"** |
| **Localização provável** | Dentro de **"Informações Adicionais"** (§9) |
| **Tipo** | Dropdown (single ou multi) de seleção de ficha |
| **Obrigatório** | Não *(inferido)* |
| **Origem das opções** | Fichas cadastradas em `/configuracoes/fichas-de-atendimentos` (Anamnese, Facial, Corporal, etc. — Tela 57) |
| **Uso** | Ficha clínica aberta automaticamente ao realizar o atendimento deste procedimento *(inferido)* |

### 7.11 Ativo
| Atributo | Valor |
|----------|-------|
| **Rótulo exato** | **"Ativo"** + ícone de ajuda (ⓘ / **?**) |
| **Tipo** | Toggle / switch |
| **Estado exemplo** | Verde (ligado) |
| **Uso** | Procedimentos inativos não aparecem para agendamento/venda *(inferido)*; espelha a coluna "Ativo" da listagem |

---

## 8. Modal — seção "Materiais de atendimento"

### 8.1 Adicionar material
- Título de seção (negrito): **"Materiais de atendimento"**.
- Campo com rótulo **"Adicionar material"** — dropdown de busca com placeholder **"Pesquise/Selecione"**.
- Ao selecionar um material, presume-se adição de linha com quantidade e custo unitário, somando ao custo total. *(estrutura de linha inferida)*
- Origem dos materiais: cadastro de produtos/insumos/estoque (inferido).

### 8.2 Custo total
- Linha **"Custo total"** (rótulo negrito à esquerda) com valor à direita: **"R$ 0,00"**.
- **Calculado** (somente leitura) = soma dos custos dos materiais de atendimento **+** "Custo adicional" (§7.3). *(fórmula inferida)*

---

## 9. Modal — seção recolhível "Informações Adicionais"

- Cabeçalho recolhível: **"Informações Adicionais"** com seta (▾) para expandir / (▴) para recolher.
- **Estado na captura:** recolhido (conteúdo não visível).
- **Conteúdo provável (inferido):** campos opcionais e avançados, possivelmente incluindo:
  - **Comissão** (% ou fixo) — §7.5.
  - **Profissionais** (multisseleção) — §7.9.
  - **Ficha de atendimento** vinculada — §7.10.
  - Código/SKU, descrição, observações internas, regras de agendamento, intervalo entre sessões. *(inferido)*

> Todos os itens desta seção marcados como **(inferido)** por estarem recolhidos na captura.

---

## 10. Botões e textos exatos (consolidado)

| Elemento | Texto exato |
|----------|-------------|
| Título do card (listagem) | **Procedimentos** |
| Contador | **{N} registros** (ex.: "4 registros") |
| Botão exportar | **Exportar** (▾) |
| Filtro | **+ Adicionar filtro** |
| Busca (placeholder) | **Buscar** |
| Cabeçalhos de tabela | **Nome** · **Categoria** · **Duração** · **Valor** · **Ativo** |
| Seletor de página | **25 por página** |
| Paginação | **«** · **‹** · **1** · **›** · **»** |
| Título do modal (editar) | **Editar Procedimento** |
| Fechar modal | **X** |
| Campo nome | **Nome*** |
| Campo valor | **Valor de venda** + dropdown **Fixo** |
| Campo custo | **Custo adicional** |
| Campo cor | **Cor*** (ex.: **Cinza**) |
| Campo duração | **Duração** (ex.: **60 minutos**) |
| Campo reconsulta | **Tempo de reconsulta** (ex.: **0 dias**) |
| Campo categoria | **Categoria** (placeholder **Pesquise/Selecione**) + **+ Adicionar** |
| Toggle ativo | **Ativo** |
| Seção materiais | **Materiais de atendimento** |
| Campo material | **Adicionar material** (placeholder **Pesquise/Selecione**) |
| Linha custo total | **Custo total** · **R$ 0,00** |
| Seção recolhível | **Informações Adicionais** |
| Botão salvar | **Salvar** |
| Botão criar (inferido) | **Cadastrar** / **Salvar** |

---

## 11. Estados da interface

### 11.1 Listagem populada
- Tabela com N linhas, toggles "Ativo" verdes, paginação em página 1 (estado observado: 4 registros).

### 11.2 Estado vazio (empty state) *(inferido — padrão do app, ver Tela 54)*
- Ícone informativo circular (ⓘ).
- Título: **"Hmm, está vazio por aqui!"**.
- Subtítulo: **"Nenhum registro encontrado."**.
- Botão de criação (roxo): **"+ Adicionar novo procedimento"** *(rótulo inferido por analogia com categorias)*.
- Paginação desabilitada.

### 11.3 Busca sem resultados *(inferido)*
- Mesmo padrão de empty state com mensagem "Nenhum registro encontrado.".

### 11.4 Carregamento *(inferido)*
- Skeleton/spinner na tabela durante fetch.

### 11.5 Modal — salvando *(inferido)*
- Botão "Salvar" em estado de loading (desabilitado + spinner); toast de sucesso/erro ao concluir.

### 11.6 Validação *(inferido)*
- Campos obrigatórios (**Nome***, **Cor***, e Valor de venda) destacam erro se vazios ao salvar.

---

## 12. Modelo de dados

### 12.1 Entidade `Procedimento`

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| `id` | integer/uuid | sim (PK) | Ex.: 1353394 |
| `nome` | string | sim | "Nome*" |
| `valor_venda` | decimal (BRL) | sim (inferido) | "Valor de venda" |
| `tipo_precificacao` | enum | sim (inferido) | `fixo` (observado) \| `variavel`/`percentual` (inferido) |
| `custo_adicional` | decimal (BRL) | não | "Custo adicional" (default 0,00) |
| `cor` | string/enum | sim | "Cor*" (ex.: "Cinza" / código hex inferido) |
| `duracao_minutos` | integer | sim (inferido) | "Duração" em minutos |
| `tempo_reconsulta_dias` | integer | não | "Tempo de reconsulta" em dias (default 0) |
| `categoria_id` | FK → Categoria | não | "Categoria" (nullable; "-" na lista) |
| `ativo` | boolean | sim | "Ativo" (default true) |
| `custo_total` | decimal (BRL) | calculado | custo_adicional + Σ materiais (read-only) |
| `comissao_valor` | decimal | não *(inferido)* | valor ou percentual |
| `comissao_tipo` | enum `percentual`/`fixo` | não *(inferido)* | unidade da comissão |
| `materiais[]` | relação → MaterialAtendimento | não | "Materiais de atendimento" |
| `profissionais[]` | M:N → Profissional | não *(inferido)* | "Profissionais" |
| `ficha_atendimento_id` | FK → Ficha | não *(inferido)* | "Ficha de atendimento" |
| `informacoes_adicionais` | objeto/JSON | não *(inferido)* | campos da seção recolhível |
| `created_at` / `updated_at` | timestamp | sim (inferido) | auditoria |

### 12.2 Relações

- **Procedimento N:1 Categoria** (`categoria_id`) — opcional. Origem: `/configuracoes/categorias-de-procedimentos`.
- **Procedimento N:M Profissional** *(inferido)* — quais profissionais executam o procedimento; base da comissão por profissional.
- **Procedimento N:1 (ou N:M) Ficha de atendimento** *(inferido)* — `ficha_atendimento_id`. Origem: `/configuracoes/fichas-de-atendimentos`.
- **Procedimento 1:N MaterialAtendimento** — linhas de insumo (material + quantidade + custo unitário) que compõem o custo total.

### 12.3 Entidade `Categoria` (resumo)
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | integer | sim |
| `nome` | string | sim ("Nome*") |
| `ativo` | boolean | sim |

### 12.4 Entidade `MaterialAtendimento` (linha — inferido)
| Campo | Tipo |
|-------|------|
| `produto_id` / `material_id` | FK |
| `quantidade` | decimal |
| `custo_unitario` | decimal |
| `custo_total_linha` | decimal (calculado) |

---

## 13. Endpoints de API *(inferidos — padrão REST)*

> Não confirmados na captura; documentados por convenção REST do app.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/procedimentos?page={n}&per_page={25}&search={q}&sort={campo}&order={asc\|desc}&filtro[...]` | Lista paginada/filtrada/ordenada |
| `POST` | `/api/procedimentos` | Cria procedimento |
| `GET` | `/api/procedimentos/{id}` | Detalhe (carrega o modal de edição) |
| `PUT`/`PATCH` | `/api/procedimentos/{id}` | Atualiza procedimento |
| `PATCH` | `/api/procedimentos/{id}` (campo `ativo`) | Toggle ativo inline |
| `DELETE` | `/api/procedimentos/{id}` | Exclui procedimento |
| `GET` | `/api/procedimentos/export?format={csv\|xlsx}` | Exportação |
| `GET` | `/api/categorias-de-procedimentos` | Opções do dropdown Categoria |
| `POST` | `/api/categorias-de-procedimentos` | Cria categoria inline ("+ Adicionar") |
| `GET` | `/api/fichas-de-atendimentos` | Opções de ficha vinculada |
| `GET` | `/api/profissionais` | Opções de profissionais |
| `GET` | `/api/materiais` (ou `/produtos`) | Opções de "Adicionar material" |

---

## 14. Regras de negócio

1. **Obrigatoriedade:** `Nome` e `Cor` são obrigatórios (asterisco). `Valor de venda` obrigatório (inferido). Bloqueia "Salvar" se vazios.
2. **Tipo de precificação ("Fixo"):** com "Fixo", o `valor_venda` é o preço cobrado. Em modo alternativo (variável/percentual — inferido), o valor pode ser calculado/aberto na venda.
3. **Custo total = `custo_adicional` + Σ(materiais de atendimento).** Campo somente leitura, recalculado ao adicionar/remover materiais e ao alterar "Custo adicional".
4. **Margem (inferido):** margem = `valor_venda − custo_total`; pode alimentar relatórios financeiros.
5. **Comissão (inferido):** definida por procedimento (% sobre valor de venda ou valor fixo), possivelmente por profissional; usada no cálculo de comissões de vendas/atendimentos.
6. **Duração na agenda:** `duracao_minutos` define o **tamanho do bloco** ao agendar o procedimento; reflete diretamente na grade da agenda.
7. **Cor na agenda:** `cor` define a **cor visual** do bloco do agendamento.
8. **Tempo de reconsulta:** dispara/sugere agendamento de retorno após N dias (inferido).
9. **Categoria opcional:** sem categoria, a listagem exibe "-".
10. **Ativo:** procedimentos inativos não aparecem para novo agendamento/venda (inferido); histórico preservado.
11. **Ficha vinculada (inferido):** ao executar o procedimento, a ficha associada é aberta automaticamente no atendimento.
12. **Profissionais (inferido):** se vinculados, apenas os listados podem ser selecionados ao agendar este procedimento.

---

## 15. Fluxos e notas de implementação

### 15.1 Fluxos principais
1. **Listar:** usuário acessa `/configuracoes/procedimentos` → tabela carrega via `GET` paginado.
2. **Buscar/filtrar/ordenar:** digita em "Buscar" / usa "+ Adicionar filtro" / clica em cabeçalho ⇅ → refetch.
3. **Criar:** clica no **FAB "+"** → abre modal de criação → preenche → **"Salvar"/"Cadastrar"** → `POST` → toast → tabela atualizada.
4. **Editar:** clica em **⋮ → Editar** (ou no nome) → navega para `/configuracoes/procedimentos/{id}/editar` → modal carregado via `GET {id}` → edita → **"Salvar"** → `PUT/PATCH` → fecha modal.
5. **Ativar/desativar:** alterna o toggle "Ativo" na linha → `PATCH` inline.
6. **Excluir:** **⋮ → Excluir** → confirmação → `DELETE`.
7. **Categoria inline:** dentro do modal, **"+ Adicionar"** abre modal "Nova categoria" → cria → retorna selecionada no dropdown.
8. **Materiais:** "Adicionar material" → seleciona insumo → linha somada ao "Custo total".
9. **Exportar:** "Exportar" (▾) → escolhe formato → download.

### 15.2 Notas de implementação
- **Rota do modal:** o modal de edição tem **URL própria** (`/configuracoes/procedimentos/{id}/editar`), permitindo deep-link e botão "voltar"; ao fechar (X), retorna para `/configuracoes/procedimentos`.
- **Overlay:** modal centralizado com backdrop escurecido; fechar via **X** (e provavelmente clique fora / tecla Esc — inferido).
- **Formatação monetária:** BRL `R$ #.###,##` (vírgula decimal, ponto de milhar).
- **Campos com unidade no texto:** "60 minutos", "0 dias" — o sufixo de unidade é renderizado junto ao valor.
- **Ícones de ajuda (ⓘ/?):** presentes em "Custo adicional" e "Ativo" — exibem tooltip explicativo no hover.
- **"Informações Adicionais" recolhida por padrão:** campos avançados (comissão, profissionais, ficha — inferidos) só renderizam ao expandir; considerar lazy-render.
- **Mesmo componente de modal** para criar e editar (diferença: presença de `{id}` e título/rótulo do botão).
- **Acessibilidade (inferido):** dropdowns de busca ("Pesquise/Selecione") devem suportar teclado; toggles com `aria-checked`.
- **Persistência do toggle inline:** atualização otimista com rollback em caso de erro (inferido).
- **Configurar colunas (⚙):** persistir preferência por usuário (inferido).

---

## Pendências de verificação (campos marcados "inferido")

- Presença e formato exatos de **Comissão**, **Profissionais** e **Ficha de atendimento vinculada** (estão na seção **"Informações Adicionais"** recolhida — precisam ser confirmados expandindo a seção).
- Opções completas do dropdown de **tipo de precificação** (além de "Fixo").
- Paleta completa do dropdown **"Cor"**.
- Rótulos exatos das ações **Editar/Excluir/Duplicar** no menu ⋮.
- Endpoints reais da API (documentados por convenção).
