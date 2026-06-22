# Agenda / Visão Geral

> Spec de desenvolvimento — reconstrução fiel da página **Agenda / Visão geral (Dashboard de agendamentos)** do SaaS **Clínica Experts** (`app.clinicaexperts.com.br`). Idioma da interface: **pt-BR**. Toda inferência está marcada com **(inferido)**.

| Metadado | Valor |
|---|---|
| **Nome da página** | Agenda / Visão geral (Dashboard de agendamentos) |
| **Produto** | Clínica Experts — gestão de clínicas (SaaS) |
| **Módulo** | Agenda |
| **Rota** | `/calendar/dashboard?interval=2026-06-21&interval=2026-06-27` |
| **Host** | `app.clinicaexperts.com.br` |
| **Tipo** | Dashboard analítico (somente leitura, com filtros) |
| **Idioma** | pt-BR |
| **Autenticação** | Requer login (sessão da clínica) (inferido) |
| **Capturas** | `Captura de tela 2026-06-22 152811.png` (topo), `Captura de tela 2026-06-22 152823.png` (base) |
| **Telas de referência** | Telas 5 e 6 de `docs/01-telas-01-a-10.md` |
| **Data da captura** | 22/06/2026 |

Capturas de tela:

![](../../images/Captura%20de%20tela%202026-06-22%20152811.png)

![](../../images/Captura%20de%20tela%202026-06-22%20152823.png)

---

## 1. Identificação

- **Página:** Agenda → "Visão geral" (item do submenu interno do módulo Agenda; ver Tela 4 da doc base, que lista os itens **Agenda**, **Visão geral**, **Relatório de agendamentos**, **Eventos**).
- **Rota canônica:** `/calendar/dashboard`
- **Query string observada:** `?interval=2026-06-21&interval=2026-06-27`
  - O parâmetro `interval` aparece **duas vezes**: o primeiro valor é a **data inicial** (`2026-06-21`) e o segundo é a **data final** (`2026-06-27`) do período filtrado. Formato `YYYY-MM-DD`. (inferido — array de duas datas)
- **Breadcrumb (inferido):** "Agenda / Visão geral".
- **Função:** painel analítico do módulo Agenda, consolidando volume, ociosidade, status, rankings e padrões temporais dos agendamentos dentro de um intervalo de datas.

---

## 2. Objetivo

Permitir ao gestor da clínica **monitorar a operação da agenda** num período, respondendo a:

- Quantos agendamentos houve no período (volume).
- Qual a **taxa de ociosidade** da agenda (capacidade ociosa) e sua variação vs. período anterior.
- Quantos pacientes estão na **lista de espera**.
- Distribuição dos agendamentos por **status** (Agendado, Confirmado, Não compareceu, Concluído, Cancelado) — base para taxas de comparecimento/no-show.
- **Rankings:** pacientes mais frequentes, procedimentos mais frequentes, ociosidade por sala e por profissional.
- **Padrões temporais:** dias e horários mais movimentados, série de agendamentos por período com média.

É a contraparte "analítica" da Agenda/Calendário (Tela 4) e do Relatório de agendamentos (Tela 7), todos compartilhando o mesmo filtro de período.

---

## 3. Navegação

### 3.1 Elementos globais (presentes em todas as telas)

- **Header (barra superior):**
  - Esquerda: ícone **hambúrguer** (☰, colapsa/expande sidebar) + **logo "clínicaexperts"** (símbolo roxo de lente/"C" + wordmark "clínica" normal / "experts" negrito).
  - Direita (esq.→dir.): botão circular **WhatsApp** (verde) · ícone **busca/lupa** (global) · **"Ajuda"** (ícone de interrogação) · **sino** (notificações) · **avatar "LB"** (Lucas Bastos, menu de conta).
- **Sidebar (menu vertical, somente ícones)** — o ícone de **calendário/agenda** está **destacado em roxo** (módulo ativo). Demais ícones (de cima p/ baixo, inferidos): coroa/estrela, foguete (com badge), casa (Início), calendário (ativo), pessoas (Pacientes), estetoscópio (Profissionais), carrinho (Vendas/PDV), cifrão (Financeiro), selo/% (Marketing), caixa (Estoque), balão (Mensagens), badge verde (Integrações), escudo/alvo, engrenagem (Configurações, rodapé).
- **Widgets fixos (canto inferior esquerdo):**
  - Banner laranja/gradiente: **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 🙂"**.
  - Card branco: indicador circular **"0%"** + **"Seu progresso"** + seta **">"** (checklist de onboarding).
  - Seta **"<" / ">"** no canto inferior esquerdo (recolher/expandir painel).
- **Botões flutuantes (canto inferior direito):**
  - FAB roxo **"+"** — criar novo agendamento/evento (inferido — leva ao modal "Novo evento", Tela 10).
  - FAB gradiente com **ícone de estrela/sparkle** — assistente/IA ou recursos premium (inferido).

### 3.2 Navegação interna do módulo Agenda (submenu)

Itens (ver Tela 4): **Agenda** (calendário) · **Visão geral** (esta página, ativa) · **Relatório de agendamentos** (`/calendar/listagem`) · **Eventos** (`/eventos`). O **filtro de período** é compartilhado entre Visão geral, Relatório e Calendário (mesmo parâmetro `interval`).

### 3.3 Saídas desta página (inferido)

- "ver mais" em cada card de ranking → tela/relatório detalhado correspondente.
- FAB "+" → modal "Novo evento".
- Trocar período no filtro → recarrega todos os indicadores.

---

## 4. Layout

Página de conteúdo rolável (área principal à direita da sidebar), fundo cinza-claro, cards brancos com cantos arredondados e sombra suave.

Ordem vertical (de cima para baixo):

1. **Painel "Filtros"** (largura total) — período + adicionar filtro.
2. **Linha de 3 cards-KPI** (3 colunas): Total de agendamentos · Ociosidade · Pacientes na lista de espera.
3. **Bloco gráfico/status** (duas colunas):
   - Esquerda (larga): **"Agendamentos por período"** (gráfico de barras + linha de média, com abas Diária/Semanal/Mensal/Anual).
   - Direita (estreita): **"Agendamentos por status"** (lista com contagem e %).
4. **Faixa de 4 cards de ranking** (4 colunas): Pacientes mais frequentes · Ociosidade por sala · Ociosidade por profissional · Procedimentos mais frequentes — cada um com "ver mais".
5. **Linha inferior de 3 gráficos** (3 colunas): card de barras (cinza, ranking/distribuição) · **"Dias mais movimentados"** · **"Horários mais movimentados"** (heatmap).

Grid responsivo (inferido): 12 colunas; KPIs em 4-4-4; bloco gráfico em 8 (gráfico) + 4 (status); rankings em 3-3-3-3; gráficos inferiores em 4-4-4.

---

## 5. Componentes

### 5.1 Painel "Filtros"

- Título **"Filtros"**.
- Indicador à direita do título: **"1 filtro aplicado"**.
- Link **"Limpar filtros"** (remove filtros, volta ao padrão). (inferido — ação)
- **Chip de filtro ativo:** **"Período: 21/06/2026 - 27/06/2026"** (formato `DD/MM/AAAA - DD/MM/AAAA`). Provável "X" para remover (inferido — não totalmente visível nesta tela; presente na Tela 8).
- Ação **"+ Adicionar filtro"** (abre seletor de filtros adicionais, ex.: profissional, sala, status). (inferido)

### 5.2 Cards-KPI (linha de 3)

| Card | Título exato | Valor exato | Badge/variação | Notas |
|---|---|---|---|---|
| KPI 1 | **"Total de agendamentos"** | **1** | — | Contagem de agendamentos no período. |
| KPI 2 | **"Ociosidade"** | **98 %** | **"-2%"** (verde, com **seta para baixo** ▼) | Taxa de ociosidade da agenda. Badge mostra variação vs. período anterior; queda de ociosidade é "positiva" (verde). (inferido) |
| KPI 3 | **"Pacientes na lista de espera"** | **0** | — | Contagem de pacientes aguardando encaixe. |

- Formato do valor de Ociosidade: número inteiro + sufixo **" %"** com espaço (texto exato **"98 %"**).
- Badge de variação: pílula clara com seta + percentual, cor verde quando favorável. (inferido — semântica da cor)

### 5.3 Painel "Agendamentos por período" (gráfico principal)

- **Título:** **"Agendamentos por período"**.
- **Abas de granularidade** (canto superior direito): **"Diária"** (ativa, sublinhada em roxo), **"Semanal"**, **"Mensal"**, **"Anual"**. Alternam o agrupamento temporal do eixo X. (inferido — comportamento)
- **Tipo:** gráfico **combinado** — **barras verticais** (série "Agendamentos") + **linha** (série "Média").
- **Eixo X:** datas do período, uma marca por dia: **21 Jun, 22 Jun, 23 Jun, 24 Jun, 25 Jun, 26 Jun, 27 Jun**.
- **Eixo Y:** contagem de agendamentos; escala observada de **0 a 1** (rótulos "0" e "1"; valor máximo do período = 1).
- **Dados (séries):**
  - **Agendamentos** (barras verdes): uma única barra com valor **1** em **22 Jun**; demais dias = 0.
  - **Média** (linha): linha horizontal atravessando o gráfico no valor da média (≈ 1 na escala atual). Cor da linha mais clara/tracejada. (inferido)
- **Legenda (rodapé do card):** **"Agendamentos"** (quadrado verde) · **"Média"** (linha).

### 5.4 Painel "Agendamentos por status" (coluna direita)

- **Título:** **"Agendamentos por status"**.
- Lista de 5 linhas, cada uma com **ícone colorido + label + contagem + percentual** (alinhado à direita):

| Status (label exato) | Ícone (cor inferida) | Contagem | Percentual |
|---|---|---|---|
| **Agendado** | calendário (roxo) | **0** | **0%** |
| **Confirmado** | calendário-check (azul) | **0** | **0%** |
| **Não compareceu** | sino-mute / no-show (cinza) | **0** | **0%** |
| **Concluído** | check em círculo (verde) | **1** | **100%** |
| **Cancelado** | X em círculo (vermelho) | **0** | **0%** |

- Percentual = contagem do status ÷ total de agendamentos do período × 100. Concluído 1/1 = 100%. (ver §13)

### 5.5 Faixa de cards de ranking (4 cards)

Cada card: título + link **"ver mais"** no topo; corpo com ranking (posição, item, contagem, %) ou estado vazio.

| Card | Título exato | Conteúdo | Valores exatos |
|---|---|---|---|
| Ranking 1 | **"Pacientes mais frequentes"** | 1 item | **"Clara Ribeiro (Pacie..."** (truncado) — **1** — **100%** |
| Ranking 2 | **"Ociosidade por sala"** | estado vazio | ícone de alerta + **"Não há nada aqui!"** / **"Nenhuma venda encontrada para os filtros selecionados"** |
| Ranking 3 | **"Ociosidade por profissional"** | estado vazio | ícone de alerta + **"Não há nada aqui!"** / **"Nenhuma venda encontrada para os filtros selecionados"** |
| Ranking 4 | **"Procedimentos mais frequentes"** | 1 item | **"Limpeza de Pele Pr..."** (truncado, = "Limpeza de Pele Profunda") — **1** — **100%** |

- Cada item de ranking exibe um **badge de posição** ("1") com ícone, o **nome** (truncado com reticências quando longo) e à direita a **contagem** e o **percentual** sobre o total. (inferido — layout)
- Observação: a mensagem de vazio reaproveita texto de Vendas ("Nenhuma venda encontrada") — provável componente compartilhado. (inferido)

### 5.6 Linha inferior de 3 gráficos

| Card | Título exato | Tipo | Eixos / dados |
|---|---|---|---|
| Gráfico A | *(sem título totalmente visível)* | barras verticais cinza | Várias barras de alturas diferentes — provável ranking/distribuição (ex.: agendamentos por profissional ou por procedimento). Sem rótulos legíveis. (inferido) |
| Gráfico B | **"Dias mais movimentados"** (ⓘ) | barras verticais (roxas) | Eixo X = dias da semana: **D S T Q Q S S** (Dom→Sáb). Eixo Y = 0 a 1. Pico **1** numa **segunda-feira** (2ª coluna, "S"); demais = 0. Rótulos de valor "0" sob cada coluna e "1" no topo da barra. |
| Gráfico C | **"Horários mais movimentados"** (ⓘ) | **heatmap** (grade de células) | Eixo Y = faixas de horário: **14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h, 22h** (linhas). Eixo X = dias (colunas, inferido). Uma célula destacada em **roxo** na linha **14h** (maior intensidade); demais células claras/vazias. |

- Os cards com **(ⓘ)** têm ícone de informação ao lado do título (tooltip explicativo). (inferido — tooltip)

---

## 6. Tabelas

Esta página **não possui tabela de dados tabular** (a listagem fica na tela "Relatório de agendamentos", `/calendar/listagem`, Tela 7). Os componentes mais próximos de tabela são:

- **Lista "Agendamentos por status"** (§5.4) — 5 linhas fixas (label · contagem · %).
- **Cards de ranking** (§5.5) — listas curtas (item · contagem · %).

Nenhuma linha de **totais** é exibida; os percentuais já representam a participação relativa (somam 100% por agrupamento).

---

## 7. Formulários

Não há formulário de entrada de dados nesta página. As únicas interações de entrada são os **filtros** (§8). O FAB "+" abre o modal "Novo evento" (formulário documentado na Tela 10, fora desta página).

---

## 8. Filtros

- **Filtro de Período (intervalo de datas) — ativo:**
  - Chip: **"Período: 21/06/2026 - 27/06/2026"**.
  - Refletido na URL como `?interval=2026-06-21&interval=2026-06-27`.
  - Seletor de intervalo (date range picker) com data inicial e final. (inferido — abre calendário ao clicar no chip)
  - Padrão observado: semana corrente (21–27/06/2026, domingo a sábado). (inferido)
- **"+ Adicionar filtro":** permite adicionar filtros adicionais. Candidatos (inferido, com base na natureza do dashboard):
  - **Profissional** (multi-select).
  - **Sala**.
  - **Status do agendamento**.
  - **Procedimento**.
- **"Limpar filtros":** remove todos os filtros aplicados e recarrega com período padrão. (inferido)
- Indicador **"1 filtro aplicado"** reflete a contagem de filtros ativos (aqui só o Período).
- Ao alterar qualquer filtro, **todos** os KPIs, gráficos e rankings recalculam para o novo escopo. (inferido)

---

## 9. Estados (vazio / carregamento / erro)

- **Estado vazio de card de ranking** (observado em "Ociosidade por sala" e "Ociosidade por profissional"):
  - Ícone de **alerta/atenção** (triângulo).
  - Texto principal: **"Não há nada aqui!"**
  - Subtexto: **"Nenhuma venda encontrada para os filtros selecionados"**.
- **Estado de baixo volume:** com apenas 1 agendamento no período, os gráficos exibem barras unitárias e rankings com 100% num único item — o layout permanece, sem mensagem especial.
- **Estado totalmente vazio (sem agendamentos)** (inferido): KPIs = 0, gráfico "Agendamentos por período" sem barras (somente eixos e linha de média em 0), status todos 0/0%, rankings em estado vazio.
- **Estado de carregamento** (inferido): skeletons/placeholders nos cards enquanto os dados são buscados.
- **Estado de erro** (inferido): mensagem de falha com opção de recarregar.

---

## 10. Modais

Nenhum modal é aberto por padrão nesta página. Modais/painéis acessíveis a partir dela (inferido):

- **FAB "+"** → modal **"Novo evento"** (Tela 10) com tipos Agendamento / Bloqueio de horário / Lembrete / Evento.
- **Chip "Período"** → popover de **date range picker** (calendário duplo). (inferido)
- **"+ Adicionar filtro"** → popover/menu de filtros adicionais. (inferido)
- **Tooltips (ⓘ)** nos cards "Dias mais movimentados" e "Horários mais movimentados". (inferido)
- "ver mais" nos rankings → drawer/página de detalhe do ranking. (inferido)

---

## 11. Modelo de dados inferido

Entidades centrais que alimentam o dashboard (inferido a partir dos indicadores):

| Entidade | Campo | Tipo | Observação |
|---|---|---|---|
| **Appointment** (agendamento) | `id` | uuid/int | PK |
| | `patient_id` | FK → Patient | paciente |
| | `professional_id` | FK → Professional | profissional |
| | `procedure_id` | FK → Procedure | procedimento |
| | `room_id` | FK → Room (nullable) | sala |
| | `status` | enum | `scheduled` / `confirmed` / `no_show` / `completed` / `cancelled` |
| | `start_at` | datetime | início (ex.: 2026-06-22 14:00) |
| | `end_at` | datetime | fim |
| | `duration_min` | int | duração em minutos (ex.: 60) |
| | `value` | decimal | valor do procedimento (ex.: 200,00) |
| | `created_at` / `updated_at` | datetime | auditoria |
| **Patient** | `id`, `name`, `phone`, `is_example` | — | "Clara Ribeiro (Paciente de exemplo)" |
| **Professional** | `id`, `name`, `initials` | — | "Lucas Bastos" / "LB" |
| **Procedure** | `id`, `name`, `default_duration_min`, `price` | — | "Limpeza de Pele Profunda" |
| **Room** | `id`, `name`, `capacity` | — | usado em "Ociosidade por sala" |
| **WaitingListEntry** | `id`, `patient_id`, `created_at` | — | "Pacientes na lista de espera" |
| **Agenda capacity / slots** | `professional_id`, `room_id`, `date`, `available_minutes`, `booked_minutes` | — | base do cálculo de ociosidade (inferido) |

**Status enum (mapeamento de labels pt-BR):**

| Enum (inferido) | Label exato | Cor |
|---|---|---|
| `scheduled` | Agendado | roxo |
| `confirmed` | Confirmado | azul |
| `no_show` | Não compareceu | cinza |
| `completed` | Concluído | verde |
| `cancelled` | Cancelado | vermelho |

---

## 12. Endpoints API inferidos

Todos os endpoints recebem o intervalo de datas (`start`/`end` ou `interval[]`) e, opcionalmente, filtros adicionais (profissional, sala, status). Prefixo provável `/api` ou `/calendar`. (inferido)

| Indicador / componente | Método + endpoint (inferido) | Resposta (inferido) |
|---|---|---|
| KPIs do topo | `GET /calendar/dashboard/summary?start=2026-06-21&end=2026-06-27` | `{ total_appointments: 1, idle_rate: 0.98, idle_rate_delta: -0.02, waiting_list: 0 }` |
| Agendamentos por período | `GET /calendar/dashboard/by-period?granularity=daily&start=...&end=...` | `{ points: [{date:'2026-06-22', count:1}, ...], average: 1 }` |
| Agendamentos por status | `GET /calendar/dashboard/by-status?start=...&end=...` | `[{status:'scheduled',count:0,pct:0}, {status:'completed',count:1,pct:100}, ...]` |
| Pacientes mais frequentes | `GET /calendar/dashboard/top-patients?start=...&end=...` | `[{patient:'Clara Ribeiro...', count:1, pct:100}]` |
| Procedimentos mais frequentes | `GET /calendar/dashboard/top-procedures?start=...&end=...` | `[{procedure:'Limpeza de Pele Profunda', count:1, pct:100}]` |
| Ociosidade por sala | `GET /calendar/dashboard/idle-by-room?start=...&end=...` | `[]` (vazio) |
| Ociosidade por profissional | `GET /calendar/dashboard/idle-by-professional?start=...&end=...` | `[]` (vazio) |
| Dias mais movimentados | `GET /calendar/dashboard/busiest-days?start=...&end=...` | `[{weekday:1, count:1}, ...]` (0=Dom) |
| Horários mais movimentados | `GET /calendar/dashboard/busiest-hours?start=...&end=...` | `[{hour:14, weekday:1, count:1}, ...]` |

- Compartilhamento de filtro: a navegação entre Visão geral / Relatório / Calendário preserva `interval[]`.

---

## 13. Regras / cálculos

### 13.1 Total de agendamentos

`total_agendamentos = COUNT(appointments WHERE start_at ∈ [periodo_inicio, periodo_fim] AND filtros)`. No exemplo = **1**.

### 13.2 Percentual por status

`pct_status = (count_status / total_agendamentos) × 100`, arredondado a inteiro.
- Concluído: 1/1 = **100%**. Demais: 0/1 = **0%**. Soma = 100%.

### 13.3 Taxa de ociosidade (Ociosidade)

(inferido) `ociosidade = (minutos_disponiveis − minutos_ocupados) / minutos_disponiveis × 100`.
- `minutos_ocupados` = soma das durações dos agendamentos não cancelados.
- `minutos_disponiveis` = capacidade da agenda no período (jornadas dos profissionais × dias úteis × salas, conforme configuração). (inferido)
- Exibido como inteiro + " %": **"98 %"**.
- **Variação (badge "-2%"):** `delta = ociosidade_periodo_atual − ociosidade_periodo_anterior` (em pontos percentuais ou variação relativa). Queda na ociosidade exibe seta **para baixo** e cor **verde** (interpretação favorável: agenda mais ocupada). (inferido)

### 13.4 Taxa de comparecimento / no-show (derivadas, inferido)

A partir da lista de status é possível derivar:
- **Taxa de comparecimento** = `Concluído / (Concluído + Não compareceu + Cancelado)` ou `Concluído / total`. No exemplo, 1/1 = 100%.
- **Taxa de no-show** = `Não compareceu / total agendamentos com desfecho`. No exemplo = 0%.
- **Taxa de cancelamento** = `Cancelado / total`. No exemplo = 0%.

> Estas taxas não aparecem como KPI explícito na tela, mas são deriváveis da seção "Agendamentos por status".

### 13.5 Rankings e percentuais

Para "Pacientes mais frequentes" e "Procedimentos mais frequentes":
- `count_item` = nº de agendamentos do item no período; `pct = count_item / total × 100`.
- Ordenação descendente por contagem. Nomes longos truncados com reticências ("...").

### 13.6 Média (linha do gráfico "por período")

`media = total_agendamentos / numero_de_periodos` (dias, na granularidade Diária). Exibida como linha horizontal de referência. (inferido)

### 13.7 Lista de espera

`pacientes_lista_espera = COUNT(WaitingListEntry ativas)`. Pode ou não depender do período. No exemplo = **0**. (inferido — independência do período)

---

## 14. Fluxos

1. **Carregar dashboard:** usuário acessa "Visão geral" → app lê `interval[]` da URL (ou aplica período padrão = semana corrente) → dispara os endpoints de §12 → renderiza KPIs, gráficos e rankings.
2. **Alterar período:** clicar no chip "Período" → abre date range picker → seleciona novo intervalo → URL atualiza `interval[]` → todos os indicadores recalculam.
3. **Adicionar filtro:** "+ Adicionar filtro" → escolhe profissional/sala/status → indicador "N filtros aplicados" atualiza → recálculo.
4. **Limpar filtros:** "Limpar filtros" → remove filtros → volta ao padrão.
5. **Trocar granularidade do gráfico:** abas Diária/Semanal/Mensal/Anual → reagrupa o eixo X e recarrega a série.
6. **Ver mais (ranking):** "ver mais" → abre detalhe/relatório do ranking. (inferido)
7. **Criar evento:** FAB "+" → modal "Novo evento" → ao salvar, indicadores podem refletir o novo agendamento (após reload). (inferido)

---

## 15. Notas de implementação

- **URL como fonte de verdade do período:** usar `interval[]` (array de 2 datas `YYYY-MM-DD`) na query string; manter ao navegar entre Visão geral, Relatório e Calendário.
- **Componentes reutilizáveis:** cards-KPI, card de gráfico com abas de granularidade, lista de status com %, card de ranking com estado vazio, heatmap. O estado vazio reaproveita a mensagem "Nenhuma venda encontrada para os filtros selecionados" — sugere componente genérico de "EmptyState" compartilhado com o módulo de Vendas (revisar texto para contexto da Agenda).
- **Cores semânticas dos status:** Agendado=roxo, Confirmado=azul, Não compareceu=cinza, Concluído=verde, Cancelado=vermelho — usar paleta consistente em todo o módulo (espelha as abas da Tela 7).
- **Formatação:**
  - Percentuais: inteiro + "%" (status) e inteiro + " %" com espaço (Ociosidade) — **atenção à inconsistência de espaçamento** observada ("98 %" vs "100%").
  - Datas no chip: `DD/MM/AAAA`; eixos de gráfico: `DD MMM` abreviado ("21 Jun").
  - Dias da semana no gráfico: iniciais "D S T Q Q S S" (Dom→Sáb).
- **Variação de KPI:** badge com seta direcional e cor condicional (verde favorável / vermelho desfavorável); para Ociosidade, queda = favorável.
- **Truncamento:** nomes longos de paciente/procedimento truncam com reticências; expor nome completo via tooltip. (inferido)
- **Tooltips (ⓘ):** "Dias mais movimentados" e "Horários mais movimentados" têm ícone de informação — incluir textos explicativos.
- **Desempenho:** preferir endpoints agregados (server-side) por indicador, com cache por (clínica, intervalo, filtros), evitando recomputar no cliente.
- **Acessibilidade:** gráficos devem ter equivalente textual (a própria lista de status já cumpre parte disso); garantir contraste das células do heatmap.
- **Estado de baixo volume:** validar que escalas de eixo (0–1) e a linha de média renderizam corretamente com 1 único registro.
