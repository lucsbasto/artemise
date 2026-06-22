# Contatos / Profissionais

| Metadado | Valor |
|---|---|
| **Tela** | Contatos / Profissionais (listagem) |
| **Rota/URL** | `app.clinicaexperts.com.br/clinica/contatos/listagem-profissionais` |
| **Breadcrumb** | `Contatos / Profissionais` |
| **Módulo** | Contatos (ícone "pessoas" na sidebar, destacado em roxo) |
| **Tipo de página** | Listagem (tabela) com filtros, busca, ações em lote e exportação |
| **Cruzamento de doc** | `docs/03-telas-21-a-30.md` → Tela 25 |
| **Imagem de referência** | `Captura de tela 2026-06-22 153258.png` |
| **Idioma** | pt-BR |
| **Perfil/usuário capturado** | Lucas Bastos (avatar "LB", iniciais verde) |
| **Registros na captura** | 1 registro |

![](../../images/Captura de tela 2026-06-22 153258.png)

---

## 1. Identificação

- **Nome da tela:** Profissionais (listagem de profissionais).
- **Rota:** `/clinica/contatos/listagem-profissionais`.
- **Breadcrumb (texto exato):** `Contatos / Profissionais`.
- **Título do card (texto exato):** **Profissionais**.
- **Contador ao lado do título (texto exato):** **1 registro**.
- **Pertence ao módulo:** Contatos. É a aba/seção "Profissionais" do módulo, irmã de "Pacientes" e "Fornecedores" (ver `/clinica/contatos/listagem-fornecedores`, Tela 26).

> Nota: A captura corresponde exatamente à **Tela 25** documentada em `docs/03-telas-21-a-30.md`. Esta spec aprofunda aquela descrição com detalhes de implementação. **Importante:** a tela observada usa um padrão de listagem genérico de contatos — colunas **Nome / Etiquetas / Identificador / Ativo** — e **não** exibe colunas específicas de "especialidade / conselho / contato / comissão" na captura. Os campos específicos de profissional descritos no briefing (especialidade, conselho, comissão, agenda, cor) são tratados como **(inferido)** ao longo deste documento e provavelmente vivem no formulário/modal de cadastro e na ficha do profissional, não nas colunas da listagem.

---

## 2. Objetivo

Permitir a **gestão do cadastro de profissionais** da clínica (médicos, dentistas, esteticistas, terapeutas, atendentes que executam procedimentos ou atendem agenda). A partir desta tela o usuário pode:

- Visualizar a lista de profissionais cadastrados, com seu identificador (telefone/WhatsApp) e status **Ativo/Inativo**.
- Buscar e filtrar profissionais.
- Ativar/desativar um profissional via toggle direto na linha.
- Acessar ações individuais (editar, excluir, ver ficha) via menu **⋮**.
- Executar **Ações em lote** após selecionar linhas.
- **Exportar** a lista.
- Criar um **novo profissional** (botão flutuante **+**) — abre o modal/fluxo de cadastro.

Objetivo de negócio (inferido): manter a base de profissionais que será vinculada à **agenda** (quem atende), às **comissões** (quem recebe percentual sobre vendas/procedimentos) e ao **prontuário/execução** dos procedimentos.

---

## 3. Navegação

- **Entrada:** via sidebar → ícone **Contatos** (pessoas) → submenu/seção **Profissionais**; ou diretamente pela rota.
- **Breadcrumb:** `Contatos` (link, roxo) `/` `Profissionais` (atual).
  - Clicar em **Contatos** retorna ao índice/listagem padrão de contatos (inferido: listagem de pacientes ou hub de contatos).
- **Telas vizinhas (mesmo módulo):**
  - `/clinica/contatos/listagem-fornecedores` — Fornecedores (Tela 26), estrutura idêntica.
  - `/clinica/contatos/listagem/paciente/{id}/...` — ficha de paciente (Telas 21–24).
- **Saídas a partir desta tela:**
  - **+** (botão flutuante roxo, canto inferior direito) → abre modal **Novo profissional** (inferido).
  - **⋮** na linha → ações individuais (Editar / Excluir / Ver ficha — inferido).
  - Clique no **nome do profissional** → ficha/detalhe do profissional (inferido).
  - Ícone **WhatsApp** verde no identificador → inicia conversa no WhatsApp com o telefone do profissional.
  - **Exportar ▾** → gera arquivo (CSV/XLSX — inferido).

### Header e sidebar (comuns a todas as telas)

- **Header:** logo **clínicaexperts**; botão hambúrguer (☰) colapsa/expande sidebar; à direita: ícone **WhatsApp** (fundo rosa), ícone **busca/atalhos** (lupa com "+"), link **Ajuda** (ícone "?"), **notificações** (sino com badge), **avatar** "LB" (Lucas Bastos).
- **Sidebar de ícones (vertical):** coroa (planos/upgrade) · foguete (atalhos) · casa (início) · calendário (agenda) · **pessoas (Contatos — destacado roxo)** · estetoscópio (clínico) · carrinho (vendas) · cifrão (financeiro) · selo/% (marketing) · cubo (estoque) · chat (mensagens) · campanha (automação, badge verde) · coração (fidelização) · engrenagem (configurações) · seta ">" no rodapé para expandir rótulos.
- **Widget de onboarding (canto inferior direito):** banner laranja "**Ei, Lucas Bastos! Tô aqui guardando o seu desconto!**" e card "**Seu progresso 0%**" (com seta de recolher).

---

## 4. Layout

Da esquerda para a direita, de cima para baixo:

1. **Sidebar de ícones** (estreita, à esquerda), com **Contatos** destacado em roxo.
2. **Header** (topo, full-width).
3. **Breadcrumb** `Contatos / Profissionais` logo abaixo do header.
4. **Área de conteúdo** centralizada, sobre fundo cinza claro, contendo um único **card branco** com cantos arredondados e sombra suave. Estrutura interna do card:
   - **Linha de cabeçalho do card:**
     - Esquerda: título **Profissionais** + contador cinza **1 registro**.
     - Direita: botão **Ações em lote ▾** (desabilitado/cinza) e botão **Exportar ▾**.
   - **Linha de filtros/busca:**
     - Esquerda: link **+ Adicionar filtro** (roxo).
     - Direita: campo de busca **Buscar** (input com placeholder).
   - **Tabela** (cabeçalho + linhas).
   - **Rodapé do card (paginação):** seletor **25 por página** (esquerda) e controles `«  ‹  [1]  ›  »` (direita).
5. **Botão flutuante +** (círculo roxo) no canto inferior direito, sobre o conteúdo.
6. **Widget de onboarding** sobreposto no canto inferior direito.

Observações de layout:
- A coluna **Etiquetas** aparece vazia na captura (sem chips).
- Espaço amplo (em branco) entre o nome e a coluna Identificador, indicando colunas de largura fixa e tabela responsiva.

---

## 5. Componentes

| Componente | Texto exato / aparência | Estado na captura | Comportamento |
|---|---|---|---|
| Título | **Profissionais** | — | Estático |
| Contador | **1 registro** | cinza | Atualiza conforme total filtrado (pluralização: "1 registro" / "N registros" — inferido) |
| Botão ações em lote | **Ações em lote ▾** | desabilitado (cinza) | Habilita ao marcar ≥1 checkbox; abre dropdown com ações (inferido: Ativar / Desativar / Excluir / Exportar selecionados / Adicionar etiqueta) |
| Botão exportar | **Exportar ▾** | habilitado | Abre dropdown de formatos (CSV/XLSX — inferido) |
| Link adicionar filtro | **+ Adicionar filtro** | roxo | Abre seletor de filtros (campo + operador + valor — inferido) |
| Campo de busca | placeholder **Buscar** | vazio | Busca textual (debounce) por nome / identificador (inferido) |
| Checkbox cabeçalho | (sem texto) | desmarcado | Seleciona/desmarca todos da página |
| Ícone de ordenação (col. Nome) | **◆** (losango ao lado de "Nome") | — | Alterna ordenação asc/desc por Nome |
| Engrenagem (cabeçalho da tabela) | **⚙** | — | Configurar colunas visíveis (inferido) |
| Avatar | iniciais **LB** em círculo verde | — | Mostra iniciais do nome; cor pode refletir a "cor" do profissional (inferido) |
| Toggle Ativo | switch | **desligado** (cinza) | Ativa/desativa o profissional (PATCH no status) |
| Ícone WhatsApp | ícone verde ao lado do telefone | — | Abre conversa no WhatsApp |
| Menu de linha | **⋮** | — | Ações individuais (Editar / Excluir / Ver ficha — inferido) |
| Botão flutuante | **+** (círculo roxo) | — | Cria novo profissional (abre modal — inferido) |
| Seletor de paginação | **25 por página ▾** | — | Define page size (opções inferidas: 10 / 25 / 50 / 100) |
| Controles de página | `«  ‹  [1]  ›  »` | página **1** ativa (roxo) | Navega entre páginas |

> **Badge de status:** na captura, o status é representado **pelo toggle "Ativo"** (switch), não por um badge textual. Caso exista badge textual (ex.: "Ativo"/"Inativo") em outras resoluções, considere-o equivalente ao estado do toggle. **(inferido)**

> **Botão "Novo profissional":** na captura **não há** um botão textual "Novo profissional" no topo; a criação ocorre pelo **botão flutuante +**. O texto exato "+ Adicionar novo profissional" / "Novo profissional" é **(inferido)** por analogia com a Tela 22 ("**+ Adicionar novo orçamento**") — provavelmente aparece no rótulo do FAB (tooltip) e/ou no estado vazio.

---

## 6. Tabela

### 6.1 Colunas (exatas, conforme captura)

| # | Coluna (texto exato) | Conteúdo | Ordenável | Observações |
|---|---|---|---|---|
| 1 | *(checkbox)* | Checkbox de seleção da linha | Não | Cabeçalho tem select-all |
| 2 | **Nome** | Avatar (iniciais) + nome em destaque + subtítulo | Sim (**◆**) | Subtítulo exibe o tipo/rótulo do contato |
| 3 | **Etiquetas** | Chips de etiquetas | Não (inferido) | Vazio na captura |
| 4 | **Identificador** | Telefone + ícone WhatsApp | Não (inferido) | Ex.: `+55 (63) 98502-1531` |
| 5 | **Ativo** | Toggle (switch) | Não | Liga/desliga status |
| 6 | *(engrenagem ⚙)* | Cabeçalho para configurar colunas | — | + menu **⋮** por linha |

> **Importante (cruzamento com briefing):** as colunas pedidas no briefing — **especialidade, conselho/registro, contato, status** — **não** correspondem 1:1 às colunas reais. O mapeamento observado/inferido é:
> - **nome** → coluna **Nome** (real).
> - **contato** → coluna **Identificador** (real; telefone/WhatsApp).
> - **status** → coluna **Ativo** (real; toggle).
> - **especialidade** → exibida como **subtítulo** sob o nome (na captura aparece o rótulo genérico **Profissional**); como coluna dedicada é **(inferido)**.
> - **conselho/registro** (CRM/CRO/CREFITO etc.) → **não exibido** na listagem; provavelmente só na ficha/modal. **(inferido)**

### 6.2 Linha de exemplo (dados exatos da captura)

| Elemento | Valor exato |
|---|---|
| Checkbox | desmarcado |
| Avatar | **LB** (círculo verde) |
| Nome | **Lucas Bastos** |
| Subtítulo (sob o nome) | **Profissional** |
| Etiquetas | *(vazio)* |
| Identificador | **+55 (63) 98502-1531** + ícone WhatsApp verde |
| Ativo | toggle **desligado** (cinza) |
| Ações | menu **⋮** |

### 6.3 Avatar

- Círculo com **iniciais** derivadas do nome (ex.: "Lucas Bastos" → **LB**).
- Cor de fundo verde na captura. **(inferido)**: a cor pode ser determinística por hash do nome **ou** corresponder ao campo **cor** do profissional (usado também na agenda para colorir os eventos do profissional).

### 6.4 Ações por linha

- **Toggle Ativo:** alterna status sem sair da tela (PATCH otimista — inferido).
- **⋮ (menu de contexto):** ações inferidas: **Editar**, **Excluir** (ou **Inativar**), **Ver ficha**, **Enviar mensagem (WhatsApp)**, **Duplicar**.
- **Ícone WhatsApp:** abre `https://wa.me/<telefone>` (inferido).

### 6.5 Ordenação

- Apenas a coluna **Nome** exibe controle de ordenação (**◆**). Clique alterna **asc ⇄ desc**. Demais colunas: ordenação **(inferido)** / não evidente.
- Ordenação default (inferido): **Nome asc**.

### 6.6 Paginação

- Seletor **25 por página** (default 25).
- Controles: **«** (primeira), **‹** (anterior), **[1]** (página atual, roxo), **›** (próxima), **»** (última).
- Na captura, com 1 registro, há apenas a página **1**.
- Paginação **(inferido)** server-side (params `page`/`per_page` ou cursor).

---

## 7. Formulários

A tela de **listagem** não possui formulário próprio além de **busca** e **filtros**. Os formulários relevantes são:

1. **Busca:** input único **Buscar** (texto livre). Submete por digitação (debounce) ou Enter. Escopo de busca inferido: nome + identificador (telefone).
2. **Adicionar filtro:** formulário dinâmico (campo → operador → valor). Ver seção 8.
3. **Cadastro/edição de profissional:** modal (ver seção 10).

---

## 8. Filtros

- **Gatilho:** link **+ Adicionar filtro** (roxo).
- **Comportamento (inferido):** abre um construtor de filtros (chip/condição) onde se escolhe um **campo**, um **operador** e um **valor**; cada filtro aplicado vira um **chip** removível (padrão observado na Tela 27/28, ex.: chip `Período: …`).
- **Campos de filtro disponíveis (inferido):**
  - **Status** (Ativo / Inativo).
  - **Especialidade**.
  - **Conselho/registro** (tipo de conselho: CRM, CRO, CREFITO, etc.).
  - **Etiquetas**.
  - **Nome / Identificador** (texto).
- **Empty state de filtro sem resultados:** ver seção 9 (padrão "Oops, nada foi encontrado!").
- **Limpar filtros:** botão/link para remover todos os filtros (padrão observado nas Telas 22 e 27).

---

## 9. Estados

| Estado | Descrição |
|---|---|
| **Carregando** | Skeleton de linhas / spinner enquanto busca dados (inferido). |
| **Com dados** | Estado da captura: 1 linha, paginação na página 1. |
| **Vazio (sem cadastro)** | Nenhum profissional cadastrado. (inferido) Mensagem de incentivo ao cadastro + botão **+ Adicionar novo profissional** (texto inferido, por analogia com a Tela 22). |
| **Vazio por filtro** | Filtros não retornam registros. Padrão observado (Tela 22): ícone de lupa em círculo roxo claro, título **Oops, nada foi encontrado!**, texto **Os filtros selecionados não correspondem a nenhum registro.**, botões **Limpar filtros** (contorno roxo) e **+ Adicionar novo orçamento**→ aqui **+ Adicionar novo profissional** (inferido). |
| **Ações em lote ativas** | Ao marcar ≥1 checkbox, o botão **Ações em lote ▾** habilita e (inferido) surge um indicador "N selecionados". |
| **Erro** | Falha de carregamento → mensagem de erro + retry (inferido). |
| **Toggle em processamento** | Ao alternar **Ativo**, estado de loading curto no switch (inferido). |

---

## 10. Modais

### 10.1 Modal "Novo profissional" (inferido)

Aberto pelo botão flutuante **+** (e/ou pelo botão do empty state). Estrutura inferida com base no padrão de modais do app (Telas 23/24): modal centralizado, fundo escurecido, cabeçalho com título + **×**, conteúdo em seções, rodapé com botão **Salvar** (roxo).

**Título inferido:** **Novo profissional** (com **×** para fechar).

**Campos inferidos** (alinhados ao briefing):

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| **Nome** | texto | Sim (`*`) | Nome completo do profissional |
| **Identificador / Telefone** | telefone (máscara `+55 (DD) 9XXXX-XXXX`) | Não | Usado na coluna Identificador + WhatsApp |
| **E-mail** | e-mail | Não | (inferido) para login/notificações |
| **Especialidade** | select / texto | Não | Ex.: Dermatologia, Estética, Fisioterapia |
| **Conselho** | grupo: tipo (select: CRM/CRO/CREFITO/…) + número (texto) + UF (select) | Não | Registro profissional |
| **Comissão** | percentual (%) ou valor (R$) | Não | Default (inferido) 0%. Pode ser por procedimento (ver §13) |
| **Agenda** | toggle/checkbox "Disponível na agenda" + vínculo | Não | Define se o profissional atende agenda (§13) |
| **Cor** | color picker | Não | Cor usada na agenda e/ou avatar |
| **Etiquetas** | multiselect (chips) | Não | Tags livres |
| **Ativo** | toggle | — | Default **ativo** (inferido) |

**Rodapé:** botão **Salvar** (roxo). Campos obrigatórios marcados com `*`.

### 10.2 Outros modais/diálogos (inferido)

- **Editar profissional:** mesmo formulário pré-preenchido (via **⋮ → Editar**).
- **Confirmar exclusão/inativação:** diálogo de confirmação ("Tem certeza que deseja excluir/inativar este profissional?") com **Cancelar** / **Confirmar**.
- **Dropdown de Exportar:** opções de formato.
- **Dropdown de Ações em lote:** lista de operações em massa.

---

## 11. Modelo de dados

### 11.1 Entidade `Profissional` (inferido)

| Campo | Tipo | Origem | Observações |
|---|---|---|---|
| `id` | UUID / int | sistema | PK |
| `nome` | string | UI (Nome) | Obrigatório |
| `iniciais` | string (derivado) | sistema | Para o avatar (ex.: "LB") |
| `tipo` / `rotulo` | enum/string | UI (subtítulo) | Na captura: **"Profissional"** |
| `telefone` / `identificador` | string (E.164 ou mascarado) | UI (Identificador) | Ex.: `+55 (63) 98502-1531`; alimenta link WhatsApp |
| `email` | string | UI | (inferido) |
| `especialidade` | string / FK `especialidade_id` | UI | (inferido) |
| `conselho_tipo` | enum (CRM, CRO, CREFITO, CRP, …) | UI | (inferido) |
| `conselho_numero` | string | UI | (inferido) |
| `conselho_uf` | string(2) | UI | (inferido) |
| `comissao_padrao` | decimal | UI | % ou valor; ver `tipo_comissao` |
| `tipo_comissao` | enum (`percentual` \| `valor`) | UI | (inferido) |
| `disponivel_agenda` | bool | UI | Define se aparece na agenda |
| `cor` | string (hex) | UI | Cor na agenda/avatar |
| `etiquetas` | array<Etiqueta> | UI | Relação N:N |
| `ativo` | bool | UI (toggle) | **false** na captura |
| `created_at` | datetime | sistema | |
| `updated_at` | datetime | sistema | |

### 11.2 Relações (inferido)

- **Profissional 1—N Comissões / Regras de comissão**
  - `RegraComissao { id, profissional_id, escopo (geral|procedimento|produto|categoria), referencia_id?, tipo (percentual|valor), valor }`.
  - Comissão padrão no profissional + regras específicas por procedimento/produto/categoria que sobrescrevem o padrão.
  - Comissões geram lançamentos no **Financeiro** (a pagar ao profissional) ao concluir venda/procedimento.
- **Profissional 1—N Eventos de Agenda**
  - `EventoAgenda { id, profissional_id, paciente_id, procedimento_id, inicio, fim, status }`.
  - `disponivel_agenda` controla se o profissional é selecionável ao criar evento.
  - `cor` colore os eventos do profissional na visão de agenda.
- **Profissional N—N Etiquetas.**
- **Profissional N—N Procedimentos** (inferido): procedimentos que o profissional executa (habilidades/serviços ofertados).
- **Profissional 0..1—1 Usuário** (inferido): vínculo opcional com conta de acesso ao sistema.

---

## 12. Endpoints de API (inferidos)

> Todos **(inferido)**. Base assumida: `/api` (ou similar). Recurso: `profissionais`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/contatos/profissionais?search=&page=1&per_page=25&sort=nome&order=asc&ativo=` | Lista paginada/filtrada (alimenta a tabela) |
| `GET` | `/api/contatos/profissionais/{id}` | Detalhe/ficha do profissional |
| `POST` | `/api/contatos/profissionais` | Cria profissional (modal Novo) |
| `PUT/PATCH` | `/api/contatos/profissionais/{id}` | Edita profissional |
| `PATCH` | `/api/contatos/profissionais/{id}/status` | Alterna **Ativo** (toggle da linha) |
| `DELETE` | `/api/contatos/profissionais/{id}` | Exclui/inativa |
| `POST` | `/api/contatos/profissionais/bulk` | Ações em lote (body: `ids[]`, `action`) |
| `GET` | `/api/contatos/profissionais/export?format=csv\|xlsx&...filtros` | Exportação |
| `GET` | `/api/contatos/profissionais/filtros` | Metadados de campos filtráveis (inferido) |
| `GET` | `/api/especialidades` | Opções de especialidade (modal) |
| `GET/POST` | `/api/contatos/profissionais/{id}/comissoes` | Regras de comissão |
| `GET` | `/api/contatos/profissionais/{id}/agenda` | Eventos de agenda do profissional |
| `GET/POST` | `/api/etiquetas` | Etiquetas (multiselect) |

**Resposta de listagem (inferida):**

```json
{
  "data": [
    {
      "id": "10318910",
      "nome": "Lucas Bastos",
      "iniciais": "LB",
      "tipo": "Profissional",
      "identificador": "+55 (63) 98502-1531",
      "etiquetas": [],
      "ativo": false,
      "cor": "#22c55e"
    }
  ],
  "meta": { "total": 1, "page": 1, "per_page": 25, "last_page": 1 }
}
```

---

## 13. Regras de negócio

> Campos específicos de profissional não aparecem na listagem; as regras abaixo são **(inferido)** salvo o comportamento do toggle e da listagem, que são observados.

### 13.1 Comissão (inferido)

- Cada profissional pode ter uma **comissão padrão** (`%` ou valor fixo `R$`).
- Regras específicas por **procedimento/produto/categoria** sobrescrevem o padrão.
- Ao **concluir uma venda/procedimento** executado pelo profissional, o sistema calcula a comissão e gera lançamento correspondente no **Financeiro** (conta a pagar ao profissional) — relação com Telas 27/30.
- Comissão pode incidir sobre valor **bruto** ou **líquido** (após descontos) — parametrizável (inferido).
- Profissional **inativo** não recebe novas atribuições de comissão (inferido), mas mantém histórico.

### 13.2 Vínculo com a agenda (inferido)

- O flag **`disponivel_agenda`** define se o profissional aparece como opção ao **agendar** atendimentos.
- A **cor** do profissional é usada para colorir seus eventos na visão de agenda (e possivelmente o avatar na listagem).
- Profissional **inativo** (toggle desligado) **não** deve ser selecionável para novos agendamentos; agendamentos existentes são preservados (inferido).
- Apenas profissionais que **executam** determinado procedimento (relação N:N Procedimentos) devem ser ofertados para aquele tipo de atendimento (inferido).

### 13.3 Status Ativo/Inativo (observado + inferido)

- Toggle **Ativo** alterna o status diretamente na linha (na captura, **desligado**).
- Efeito esperado (inferido): inativo some das seleções de agenda/venda/comissão, mas permanece na listagem (filtrável) e no histórico.

### 13.4 Conselho/registro (inferido)

- Campos de conselho (tipo + número + UF) são informativos/validáveis; não bloqueiam o cadastro (opcionais).
- Podem ser exibidos na ficha e em documentos clínicos (prontuário/receituário).

### 13.5 Identificador/WhatsApp (observado)

- O **Identificador** é o telefone do profissional; o **ícone WhatsApp** abre conversa direta. Telefone em formato BR `+55 (DD) 9XXXX-XXXX`.

---

## 14. Fluxos

### 14.1 Listar e localizar profissional (observado)

1. Usuário acessa `Contatos → Profissionais`.
2. Sistema carrega a tabela (GET listagem) → exibe **N registros**.
3. Usuário digita em **Buscar** ou adiciona filtros → tabela atualiza.
4. Ordena por **Nome** (◆) se necessário.

### 14.2 Criar novo profissional (inferido)

1. Usuário clica no **+** flutuante (ou **+ Adicionar novo profissional** no empty state).
2. Abre **modal Novo profissional**.
3. Preenche **Nome** (obrigatório) e demais campos (especialidade, conselho, comissão, agenda, cor, etiquetas).
4. Clica **Salvar** (POST).
5. Modal fecha; nova linha aparece na tabela; contador incrementa.

### 14.3 Ativar/desativar (observado)

1. Usuário clica no toggle **Ativo** da linha.
2. PATCH status; switch reflete o novo estado.
3. Efeitos de negócio em agenda/comissão conforme §13.

### 14.4 Editar / Excluir (inferido)

1. Usuário abre **⋮** na linha.
2. Escolhe **Editar** → modal pré-preenchido → **Salvar** (PUT/PATCH).
3. Ou **Excluir/Inativar** → diálogo de confirmação → DELETE/PATCH.

### 14.5 Ações em lote (inferido)

1. Usuário marca checkboxes (cabeçalho seleciona todos).
2. **Ações em lote ▾** habilita.
3. Escolhe ação (ex.: Ativar/Desativar/Excluir/Etiquetar) → confirmação → POST bulk.

### 14.6 Exportar (inferido)

1. Usuário clica **Exportar ▾** → escolhe formato.
2. Sistema gera e baixa o arquivo respeitando filtros aplicados.

### 14.7 Empty state por filtro (inferido, padrão Tela 22)

1. Filtros sem resultado → "**Oops, nada foi encontrado!**".
2. Usuário clica **Limpar filtros** (volta a listar) ou **+ Adicionar novo profissional**.

---

## 15. Notas de implementação

- **Reúso de componente:** a listagem de Profissionais e a de **Fornecedores** (Tela 26) são **estruturalmente idênticas** (mesmas colunas Nome/Etiquetas/Identificador/Ativo, mesmos botões). Implementar como um **componente de listagem de contatos parametrizável** (tipo = `profissional` | `fornecedor` | `paciente`), variando apenas rota, endpoint e colunas/filtros específicos.
- **Colunas configuráveis:** a engrenagem (⚙) no cabeçalho sugere persistência de preferências de colunas por usuário (inferido) — armazenar em preferências do usuário.
- **Avatar:** gerar iniciais a partir do nome; cor a partir do campo `cor` do profissional (fallback: hash determinístico do nome).
- **Toggle otimista:** aplicar atualização otimista no switch **Ativo** com rollback em caso de erro do PATCH.
- **Ações em lote:** manter o botão desabilitado até `selecionados ≥ 1`; exibir contador de selecionados.
- **Busca:** debounce (~300–400 ms); busca server-side por nome e identificador.
- **Filtros como chips:** seguir o padrão visual das Telas 27/28 (chips removíveis + "Limpar filtros").
- **WhatsApp:** normalizar telefone para E.164 ao montar o link `wa.me`.
- **Acessibilidade:** toggles e checkboxes com `aria-label`; ícone WhatsApp e ⋮ com rótulos acessíveis; ordenação anunciada via `aria-sort`.
- **i18n:** todos os textos em pt-BR; pluralização do contador ("1 registro" / "{n} registros").
- **Empty states:** reutilizar o componente de empty state já existente (ícone de lupa roxo + "Oops, nada foi encontrado!") para o caso de filtro sem resultados.
- **Vínculo agenda/comissão:** ao inativar um profissional, validar/avisar sobre agendamentos futuros e regras de comissão ativas (inferido).
- **Discrepância a confirmar com produto:** o briefing pede colunas de especialidade/conselho/comissão na tabela, mas a UI real exibe apenas Nome/Etiquetas/Identificador/Ativo. Confirmar se essas informações devem (a) virar colunas configuráveis, (b) ficar só na ficha/modal, ou (c) aparecer como subtítulo sob o nome (hoje exibe o rótulo genérico "Profissional").
