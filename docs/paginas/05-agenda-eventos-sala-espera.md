# Agenda / Eventos — Sala de Espera

| Metadado | Valor |
|---|---|
| **Página** | Agenda / Eventos — Sala de espera (listagem de eventos) |
| **Rota** | `/eventos?period=2026-05-23&period=2026-06-22` |
| **Breadcrumb** | `Agenda / Sala de espera` |
| **Módulo** | Agenda |
| **Tipo de tela** | Listagem paginada com filtros (estado vazio capturado) |
| **Estado capturado** | VAZIO — "Oops, nada foi encontrado!" |
| **Telas de referência** | Tela 8 (`01-telas-01-a-10.md`), Tela 15 (`02-telas-11-a-20.md`) |
| **Modais relacionados** | Novo evento (Telas 10–14): `consultation`, `lock`, `reminder`, `promotion`/`event` |
| **Permissão (inferido)** | Acesso ao módulo Agenda / Eventos |
| **Idioma** | pt-BR |
| **Data da captura** | 22/06/2026 |
| **Usuário logado** | Lucas Bastos (LB) |

Capturas de tela:

![](../../images/Captura%20de%20tela%202026-06-22%20152846.png)

![](../../images/Captura%20de%20tela%202026-06-22%20152946.png)

---

## 1. Identificação

- **Nome da página:** Eventos (Sala de espera).
- **Título visível do card:** **"Eventos"** (texto exato).
- **Breadcrumb visível:** **"Agenda"** (link roxo clicável) **/** **"Sala de espera"** (cinza, página atual).
- **Rota completa observada:** `app.clinicaexperts.com.br/eventos?period=2026-05-23&period=2026-06-22`.
  - Observação: a URL possui o parâmetro `period` **duplicado** (`period=2026-05-23&period=2026-06-22`), representando o intervalo `[início, fim]` como dois valores do mesmo nome de query string (padrão de array repetido) (inferido).
- **Slug-base da rota:** `/eventos`.
- **Contexto:** primeira captura (152846) mostra a página com a **sidebar de ícones colapsada**; a segunda captura (152946) mostra a **mesma página** com o **submenu textual "Contatos" aberto/expandido** à esquerda (estado de hover/navegação sobre o ícone de Contatos da sidebar). O conteúdo central (card "Eventos") é **idêntico** nas duas capturas.

---

## 2. Objetivo da página

- **Sala de espera / gestão de eventos do dia:** listar, buscar e filtrar todos os **eventos da agenda** de um período — englobando **agendamentos (consultas), bloqueios de horário, lembretes e eventos/promoções** — num formato de lista paginada, complementar à visão de calendário (Tela 4) e ao relatório de agendamentos (Tela 7).
- **Função operacional de "sala de espera"** (inferido): consolidar os eventos pendentes/do período para que a recepção acompanhe quem está aguardando atendimento e gerencie o fluxo de eventos. O breadcrumb "Sala de espera" reforça o uso pela recepção como painel de fila/eventos do dia.
- **Ponto de entrada para criação:** permite criar novos eventos de qualquer tipo via botão **"Novo evento"** (abre o modal das Telas 10–14).
- **Estado capturado:** período padrão (~30 dias: 23/05/2026 a 22/06/2026) **sem nenhum evento correspondente** → renderiza o **estado vazio de busca**.

---

## 3. Navegação (abas / submenu)

### 3.1 Submenu interno do módulo Agenda (inferido — Tela 4)
O módulo Agenda possui um submenu próprio (visto na Tela 4) com os itens:
- **"Agenda"** → calendário (`/agenda/.../2026/06/22`).
- **"Visão geral"** → dashboard de agendamentos (`/calendar/dashboard?interval=...`).
- **"Relatório de agendamentos"** → listagem tabular (`/calendar/listagem?interval=...`).
- **"Eventos"** → **esta página** (`/eventos?period=...`). (inferido: item ativo quando nesta rota)

### 3.2 Breadcrumb
- **"Agenda"** (link, roxo) → retorna à raiz do módulo Agenda.
- **"Sala de espera"** (cinza) → página atual.

### 3.3 Submenu "Contatos" (visível na 2ª captura — Tela 15)
Ao passar/clicar no ícone **Contatos** da sidebar, abre-se uma coluna textual com título **"Contatos"** e itens (textos exatos):
- **Pacientes** (link para `https://app.clinicaexperts.com.br/clinica/contatos/listagem-contatos` — visto no tooltip de status do navegador)
- **Profissionais**
- **Fornecedores**
- **Leads**
- **Todos os contatos**
- **Aniversariantes**
- **Frequência**
- **Mesclar contatos**
- **Convidar colaboradores**

> Este submenu **não pertence** à página Eventos; é um flyout da sidebar global e aparece sobreposto à esquerda. Documentado por estar visível na captura.

### 3.4 Sidebar de ícones (global)
Coluna vertical de ícones (extrema esquerda), com o ícone **Calendário/Agenda destacado em roxo** (módulo ativo). Ordem (de cima p/ baixo): coroa, atalhos (badge), casa/Início, **calendário/Agenda (ativo)**, pessoas/Contatos, estetoscópio, carrinho, cifrão/Financeiro, selo/percentual, caixa/estoque, balão/mensagens, integrações (badge verde), escudo/alvo, engrenagem/Configurações.

### 3.5 Header global
- Esquerda: hambúrguer (☰, colapsa sidebar) + logo **"clínicaexperts"**.
- Direita: botão **WhatsApp** (verde), **busca/lupa** global, **"Ajuda"** (ícone "?"), **sino** (notificações), avatar **"LB"**.

---

## 4. Layout

Estrutura de cima para baixo / esquerda para direita:

1. **Header global** (topo, largura total).
2. **Sidebar de ícones** (extrema esquerda, estreita). Na 2ª captura, com **flyout "Contatos"** expandido ao lado.
3. **Breadcrumb** "Agenda / Sala de espera" (acima do card, alinhado à esquerda).
4. **Card central branco** "Eventos" (área principal, centralizado), contendo:
   - **Cabeçalho do card:** título "Eventos" (linha própria).
   - **Barra de filtros + busca** (linha horizontal): chip de período + "Adicionar filtro" à esquerda; campo "Buscar" à direita.
   - **Área central de conteúdo:** lista de eventos OU estado vazio (capturado).
   - **Rodapé do card:** seletor "25 por página" (esquerda) + controles de paginação (direita).
5. **Widgets fixos inferiores-esquerdos:** toast laranja de desconto + barra "Seu progresso" (0%).
6. **FABs inferiores-direitos:** botão roxo **"+"** + botão de IA/assistente (gradiente com estrela).

---

## 5. Componentes (botões, filtros, ícones)

### 5.1 Cabeçalho do card
- **Título "Eventos"** — texto, peso negrito, alinhado à esquerda.

### 5.2 Barra de filtros e busca
- **Chip "Período: 23/05/2026 - 22/06/2026"** — pílula de filtro ativo com botão **"X"** à direita (remove o filtro de período).
- **"+ Adicionar filtro"** — link/botão de texto com ícone "+" roxo (abre seletor de filtros adicionais).
- **Campo "Buscar"** — input de texto à direita com placeholder **"Buscar"** (busca textual livre).

### 5.3 Estado vazio (área central) — botões
- **"Limpar filtros"** — botão secundário (fundo lilás claro, texto roxo).
- **"+ Novo evento"** — botão primário (fundo roxo, texto branco, ícone "+"). Abre o modal "Novo evento".

### 5.4 Rodapé
- **Seletor "25 por página"** — dropdown (valores prováveis: 10/25/50/100) (inferido).
- **Controles de paginação:** **«** (primeira), **‹** (anterior), **›** (próxima), **»** (última) — todos desabilitados/cinza no estado vazio.

### 5.5 Botões flutuantes (FAB)
- **"+"** roxo (canto inferior direito) — criar novo registro/evento (inferido: abre o mesmo modal "Novo evento").
- **Botão de IA/assistente** (gradiente com ícone de estrela/sparkle).

### 5.6 Ícones identificados
- Lupa (placeholder/ícone de busca e ilustração do estado vazio).
- "X" no chip de período (remover filtro).
- "+" em "Adicionar filtro", "Novo evento" e FAB.
- Setas de paginação « ‹ › ».

---

## 6. Tabela / lista de eventos (estado preenchido — inferido)

> No estado capturado a lista está **vazia**. As colunas abaixo são **inferidas** a partir do relatório de agendamentos (Tela 7) e do modelo de Evento.

### 6.1 Colunas inferidas
| Coluna | Conteúdo (inferido) | Ordenável (inferido) |
|---|---|---|
| **Checkbox** | Seleção da linha (para ações em lote) | — |
| **Tipo** | Badge: Agendamento / Bloqueio / Lembrete / Evento | Sim |
| **Título / Procedimento** | Título do evento ou procedimento do agendamento | Sim |
| **Paciente / Participantes** | Avatar + nome (apenas para agendamentos) | Sim |
| **Profissional** | Avatar "LB" + nome | Sim |
| **Data / Período** | Data e intervalo de horário (ex.: "22/06/2026 14:00 - 15:00") | Sim |
| **Status** | Badge colorido (Agendado/Confirmado/Concluído/…) | Sim |
| **⋮ (ações)** | Menu de ações da linha | — |

- **Configurar colunas:** ícone de **engrenagem** no canto direito do cabeçalho da tabela (inferido — padrão das Telas 7 e 16).

### 6.2 Ações por linha (inferido)
- Abrir **detalhe do evento** (drawer lateral — Tela 9) ao clicar na linha.
- Menu **"⋮"**: **Editar**, **Duplicar**, **Excluir** (inferido — espelha o drawer da Tela 9).

### 6.3 Ações em lote (inferido)
- Botão **"Ações em lote"** habilita ao selecionar linhas (padrão das Telas 7 e 16) — pode não estar presente nesta tela específica; **(inferido)**.

---

## 7. Formulários

A página em si **não contém formulário inline** além do campo de busca. A criação/edição de eventos ocorre via **modal "Novo evento"** (ver seção 10) e a edição via **drawer de detalhes** (Tela 9).

- **Campo de busca** (único input da página): texto livre, placeholder "Buscar". Dispara filtragem da lista (inferido: debounce ~300ms; busca por título/paciente/profissional).

---

## 8. Filtros

### 8.1 Filtro de período (ativo por padrão)
- **Label/valor exibido:** **"Período: 23/05/2026 - 22/06/2026"**.
- **Mapeamento na URL:** `?period=2026-05-23&period=2026-06-22` (dois valores `period`: início e fim, formato `YYYY-MM-DD`).
- **Padrão:** intervalo de ~30 dias terminando na data atual (22/06/2026). (inferido)
- **Remoção:** botão "X" no chip remove o filtro de período (recarrega lista sem restrição de data). (inferido)

### 8.2 Filtros adicionais ("+ Adicionar filtro")
Abre um seletor de filtros adicionais (inferido — padrão Tela 20, popover de duas colunas). Filtros prováveis:
- **Tipo de evento** (Agendamento / Bloqueio de horário / Lembrete / Evento). (inferido)
- **Profissional**. (inferido)
- **Status** (Agendado / Confirmado / Não compareceu / Concluído / Cancelado). (inferido)
- **Paciente**. (inferido)

### 8.3 Busca
- Campo "Buscar" — filtro textual livre, combinável com os filtros acima. (inferido)

---

## 9. Estados

### 9.1 Estado VAZIO (capturado) — TEXTOS EXATOS
Renderizado quando os filtros não retornam nenhum evento:
- **Ícone:** lupa roxa dentro de círculo lilás claro.
- **Título (negrito):** `Oops, nada foi encontrado!`
- **Subtexto:** `Os filtros selecionados não correspondem a nenhum registro.`
- **Botões:**
  - `Limpar filtros` (secundário, lilás)
  - `Novo evento` (primário roxo, com ícone "+")

> Distinção importante (inferido): este é o estado **"sem resultados para os filtros"** (`Oops, nada foi encontrado!` / `Os filtros selecionados não correspondem a nenhum registro.`), **diferente** do estado **"lista totalmente vazia / sem cadastro"** usado em outras telas (`Hmm, está vazio por aqui!` / `Nenhum registro encontrado.` — Telas 19/20). A presença do filtro de período ativo é o que dispara a variante "nada foi encontrado".

### 9.2 Estado de carregamento (inferido)
- Skeleton/spinner na área da lista enquanto busca os eventos do período.

### 9.3 Estado preenchido (inferido)
- Lista/tabela paginada de eventos (ver seção 6), com paginação ativa.

### 9.4 Estado de erro (inferido)
- Mensagem de falha de carregamento com opção de "Tentar novamente".

---

## 10. Modais

### 10.1 Modal "Novo evento" (Telas 10–14)
Acionado por **"Novo evento"** (estado vazio) ou pelo **FAB "+"** (inferido).

- **Abertura via URL:** acrescenta parâmetros à rota atual, ex.:
  `…/eventos?period=2026-05-23&period=2026-06-22&event_modal_type=<tipo>&event_modal_mode=new`
- **Cabeçalho:** título dinâmico conforme o tipo (ver tabela) + botão "X".
- **Seletor "Tipo\*"** (segmented control / pílulas, obrigatório):
  - **"Agendamento"** → `event_modal_type=consultation`
  - **"Bloqueio de horário"** → `event_modal_type=lock`
  - **"Lembrete"** → `event_modal_type=reminder`
  - **"Evento"** → `event_modal_type=promotion` (na Tela 10) / também referido como tipo "Evento"

| Tipo (UI) | `event_modal_type` | Título do modal | Campos principais |
|---|---|---|---|
| Agendamento | `consultation` | "Novo agendamento" | Paciente, Profissional, Status, Cor, Observações, Procedimentos/Produtos, Data (Dia/Início/Fim/Recorrência), Financeiro (comanda) |
| Bloqueio de horário | `lock` | "Novo bloqueio de horário" | Título, Profissionais (multi) + toggle "Clínica toda", Observações, Data (Dia/Início/Fim + toggle "Dia inteiro", Recorrência) |
| Lembrete | `reminder` | "Novo lembrete" | Título, Participantes (multi), Observações, Data (Dia/**Hora** única + toggle "Dia inteiro", Recorrência) |
| Evento | `promotion` | "Novo evento" | Título do evento, Data início/Hora início/Data fim/Hora fim, Profissionais (multi), Procedimentos, toggle "Permitir agendamentos de outros procedimentos nesta data" |

- **Campo de retorno:** a URL do modal de Evento inclui `return...` (inferido: rota de retorno após salvar/fechar).
- **Rodapé:** botão **"Salvar"** (roxo).
- **Fluxo:** ao salvar, persiste o evento, fecha o modal e atualiza a lista/calendário. Trocar o "Tipo" reconfigura o formulário e o `event_modal_type` na URL.

### 10.2 Drawer "Detalhes do evento" (Tela 9 — inferido para esta lista)
Ao clicar numa linha (estado preenchido), abre painel lateral à direita com detalhes + ações (Editar / Duplicar / Excluir / Editar consumo de material / Enviar formulário de pré atendimento / Iniciar atendimento / Iniciar comanda).
- **Abertura via URL (inferido):** `&event_modal_type=consultation&event_modal_mode=...` (padrão visto na Tela 9 sobre a listagem).

---

## 11. Modelo de dados — Evento

Modelo polimórfico (um único recurso "Evento" com discriminador `type`). Campos consolidados das Telas 8–15:

```
Evento {
  id: string
  type: "consultation" | "lock" | "reminder" | "promotion"   // promotion = "Evento" na UI
  title: string                  // título do evento (consultation usa procedimento)
  startDate: date                // "Dia" / "Data de início"
  startTime: time                // "Início" / "Hora de início"
  endDate: date | null           // "Data de fim" (ausente em reminder)
  endTime: time | null           // "Fim" / "Hora de fim" (reminder usa só startTime/"Hora")
  allDay: boolean                // toggle "Dia inteiro" (lock, reminder)
  recurrence: enum               // "Não se repete" | diário | semanal | mensal | ... (inferido)
  professionals: Professional[]  // multi (lock, reminder, promotion); 1 (consultation)
  clinicWide: boolean            // toggle "Clínica toda" (lock)
  observations: string

  // somente type=consultation:
  patient: Patient | null
  status: "scheduled"|"confirmed"|"no_show"|"completed"|"cancelled"  // Agendado/Confirmado/Não compareceu/Concluído/Cancelado (inferido)
  color: string                  // cor do evento na agenda
  items: ProcedureOrProduct[]    // { name, quantity }
  financial: { comandaEnabled: boolean }  // "Comanda habilitada/desabilitada"

  // somente type=promotion ("Evento"):
  allowOtherProcedures: boolean  // toggle "Permitir agendamentos de outros procedimentos nesta data"

  createdAt: datetime
  updatedAt: datetime
}
```

### Tipos de evento (discriminador `type`) — TEXTOS EXATOS de UI
| `type` | Rótulo na UI | Observação |
|---|---|---|
| `consultation` | **Agendamento** | Consulta com paciente, procedimentos e comanda |
| `lock` | **Bloqueio de horário** | Indisponibilidade; sem paciente/financeiro |
| `reminder` | **Lembrete** | Instante único (Hora), participantes internos |
| `promotion` | **Evento** | Evento de agenda; permite (ou não) outros agendamentos |

> Os valores de `type` (`consultation`, `lock`, `reminder`, `promotion`) são **confirmados** pelas URLs `event_modal_type=` capturadas nas Telas 10–14.

---

## 12. Endpoints de API inferidos

> Todos **(inferido)** — derivados das rotas e do comportamento observado.

### 12.1 Listagem
```
GET /api/eventos?period=2026-05-23&period=2026-06-22
                 &search=<texto>
                 &type=<consultation|lock|reminder|promotion>
                 &professional_id=<id>
                 &status=<...>
                 &page=1&per_page=25
→ 200 { data: Evento[], meta: { total, page, per_page, last_page } }
→ data: [] quando vazio  (dispara o estado "Oops, nada foi encontrado!")
```

### 12.2 Criação
```
POST /api/eventos
body: { type, title, startDate, startTime, endDate, endTime, allDay,
        recurrence, professionals[], clinicWide, observations,
        patient_id?, status?, color?, items[]?, financial?, allowOtherProcedures? }
→ 201 { Evento }
```

### 12.3 Detalhe / Edição / Exclusão / Duplicação
```
GET    /api/eventos/{id}            → 200 { Evento }
PUT    /api/eventos/{id}            → 200 { Evento }     // Editar
POST   /api/eventos/{id}/duplicate  → 201 { Evento }     // Duplicar
DELETE /api/eventos/{id}            → 204                 // Excluir
```

### 12.4 Suporte aos filtros/selects (inferido)
```
GET /api/profissionais?search=...      // multi-select Profissionais/Participantes
GET /api/pacientes?search=...          // select Paciente (consultation)
GET /api/procedimentos?search=...      // select Procedimentos/Produtos
```

---

## 13. Regras de negócio

1. **Filtro de período obrigatório por padrão:** a lista inicia restrita a ~30 dias (23/05 a 22/06). Remover o chip "X" limpa a restrição de data. (inferido)
2. **Estado "nada encontrado" vs. "vazio":** com filtro ativo e zero resultados → `Oops, nada foi encontrado!`. (confirmado pela captura)
3. **"Limpar filtros"** remove **todos** os filtros aplicados (incluindo período) e recarrega a lista. (inferido)
4. **Tipo de evento define os campos** do modal de criação (polimorfismo); o `event_modal_type` da URL reflete o tipo selecionado. (confirmado Telas 10–14)
5. **Campos obrigatórios** no modal marcados com `*` (Tipo, Título/Procedimento, Data e horários). (confirmado)
6. **Lembrete** tem apenas um instante (`Hora`), sem intervalo de fim. (confirmado Tela 14)
7. **Bloqueio "Clínica toda"** substitui a seleção individual de profissionais; **"Dia inteiro"** desabilita os campos de hora. (confirmado Tela 13)
8. **Evento (promotion)** com toggle "Permitir agendamentos de outros procedimentos nesta data" controla se o intervalo bloqueia ou não a agenda. (confirmado Tela 10)
9. **Banner de aviso de lembrete** (e-mail) aparece quando a antecedência configurada excede o tempo até o evento. (confirmado Tela 12)
10. **Paginação padrão:** 25 itens/página. (confirmado)

---

## 14. Fluxos

### 14.1 Acessar a lista de eventos
1. Usuário entra em **Agenda → Eventos** (ou via URL `/eventos`).
2. Sistema aplica período padrão e chama `GET /api/eventos?period=...`.
3. Sem resultados → exibe estado vazio "Oops, nada foi encontrado!".

### 14.2 Criar novo evento (a partir do estado vazio)
1. Clica **"Novo evento"** (ou FAB "+").
2. Abre modal "Novo evento" (`event_modal_mode=new`); seleciona o **Tipo**.
3. Preenche campos obrigatórios → **"Salvar"**.
4. Modal fecha; lista/calendário atualiza; o novo evento passa a aparecer (se dentro do período filtrado).

### 14.3 Buscar / filtrar
1. Digita em **"Buscar"** ou clica **"+ Adicionar filtro"**.
2. Lista recarrega com os parâmetros aplicados na URL.
3. Zero resultados → estado "nada encontrado" com botão **"Limpar filtros"**.

### 14.4 Limpar filtros
1. Clica **"Limpar filtros"** (ou "X" do chip de período).
2. Filtros removidos; lista recarrega sem restrições.

### 14.5 Abrir detalhe / editar (estado preenchido — inferido)
1. Clica numa linha → abre drawer "Detalhes do evento" (Tela 9).
2. Ações disponíveis: Editar, Duplicar, Excluir, Iniciar atendimento, Iniciar comanda, etc.

---

## 15. Notas de implementação

- **Sincronização URL ↔ estado:** período, busca, filtros, página e estado do modal devem estar refletidos na query string (`period`, `search`, `event_modal_type`, `event_modal_mode`, `page`) para deep-linking e back/forward do navegador. O `period` é serializado como **valor repetido** (`period=início&period=fim`), não como `start`/`end` separados.
- **Modal por URL:** a criação/edição é controlada por `event_modal_type` + `event_modal_mode` (`new`/edição). Garantir que fechar o modal limpe esses params e restaure a rota base (`return` param para o destino de retorno).
- **Componente de estado vazio reutilizável:** parametrizar título/subtítulo para diferenciar "Oops, nada foi encontrado!" (com filtros) de "Hmm, está vazio por aqui!" (sem cadastro). Textos exatos devem ser mantidos como strings i18n (pt-BR).
- **Listagem polimórfica:** a tabela deve renderizar colunas/badges condicionais conforme `type` do evento (agendamento mostra paciente/status; bloqueio/lembrete/evento não).
- **Paginação:** seletor "25 por página" + controles « ‹ › »; desabilitar controles quando `last_page <= 1`.
- **Busca:** aplicar debounce (~300ms) no input "Buscar" antes de disparar a requisição. (inferido)
- **Submenu "Contatos":** é um flyout global da sidebar — não acoplar à página de Eventos; ele apenas se sobrepõe visualmente.
- **Acessibilidade:** chips de filtro com botão "X" devem ter `aria-label` (ex.: "Remover filtro de período"); ícones-only da sidebar precisam de tooltip/`aria-label`.
- **Widgets de onboarding** (toast de desconto, barra "Seu progresso 0%") e **FABs** são globais e independentes desta página.
