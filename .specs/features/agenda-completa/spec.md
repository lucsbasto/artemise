# Spec: Agenda Completa (Lote 6)

Fontes: `docs/paginas/03-agenda-visao-geral.md`, `04-agenda-relatorio-agendamentos.md`,
`05-agenda-eventos-sala-espera.md`, `06-agenda-modais-evento.md`. Completa o módulo
Agenda — o calendário (02) já existia do ui-core.

## Escopo
3 telas de submenu sem página + modais compartilhados do módulo:
- **Visão geral** (03) — `/agenda/visao-geral` (dashboard analítico, leitura).
- **Relatório de agendamentos** (04) — `/agenda/relatorio` (listagem tabular).
- **Eventos / Sala de espera** (05) — `/agenda/eventos` (estado vazio capturado).
- **Modais** (06) — modal "Novo evento" + drawer "Detalhes do evento".

## Requisitos
- **R-AG-1** — Submenu do módulo (`Agenda · Visão geral · Relatório de agendamentos · Eventos`)
  extraído p/ `AgendaSubmenu` (item ativo via `usePathname`); calendário refatorado p/ usá-lo.
- **R-AG-2** — Visão geral: 3 KPIs (Total / Ociosidade c/ badge -2% / Lista de espera),
  "Agendamentos por período" (barras verdes + linha de média, abas Diária/Semanal/Mensal/Anual),
  "Agendamentos por status" (5 linhas dot+label+contagem+%), 4 rankings (Pacientes / Ociosidade
  sala / Ociosidade prof / Procedimentos — salas/prof em empty state), Dias movimentados (barras)
  e Horários movimentados (heatmap).
- **R-AG-3** — Relatório: cabeçalho título+contador+Ações em lote(off)+Exportar; chip Período + filtro;
  abas-resumo por status (contagem + Todos); tabela checkbox / Procedimentos / Paciente / Profissional /
  Duração / Agendado para / Status(badge) / ⚙ / ⋮; paginação. Clique na linha abre o drawer.
- **R-AG-4** — Eventos: card "Eventos", chip Período (×) + filtro + Buscar; estado vazio
  "Oops, nada foi encontrado!" / "Os filtros selecionados não correspondem a nenhum registro."
  com botões "Limpar filtros" + "Novo evento" (abre modal); paginação desabilitada.
- **R-AG-5** — Modal "Novo evento": segmented Tipo* (Agendamento/Bloqueio de horário/Lembrete/Evento)
  troca título e campos. Agendamento: dados básicos + tabela Procedimentos/Produtos + Data (colapsável,
  banner de lembrete) + Financeiro (colapsável). Bloqueio: Título/Profissionais+Clínica toda/Obs + Data
  (Dia inteiro). Lembrete: Título/Participantes/Obs + Data (Hora única, Dia inteiro). Evento: Título +
  Data/Hora início/fim + Profissionais + Procedimentos + toggle "Permitir outros procedimentos". Salvar (roxo).
- **R-AG-6** — Drawer "Detalhes do evento": leitura (tipo/data-hora, profissional, paciente+WhatsApp,
  status, procedimento+valor, recebimento, observação) + ações Editar/Duplicar/Excluir + botões largura
  total (Editar consumo / Enviar pré-atendimento) + rodapé Iniciar atendimento / Iniciar comanda.
- **R-AG-7** — `AgendaStatusBadge` + `statusDot`: enum Agendado(roxo)/Confirmado(azul)/Não compareceu(cinza)/
  Concluído(verde)/Cancelado(vermelho) com ícone + texto.

## Decisões
- Sem `layout.tsx` p/ a Agenda: calendário precisa full-height (overflow hidden) e os dashboards
  precisam de altura natural rolável — conflito de `h-full`. Cada página monta seu wrapper + `AgendaSubmenu`.
- Reuso: `ui/modal`, `ui/field`, `ui/toggle`, `ui/card`, `ui/breadcrumb`, `ui/empty-state`, `ui/tabs`,
  `charts/mini-bars`, `charts/heatmap`. Novo `agenda/period-chart` (Recharts ComposedChart).
- Mock novo: `agendaKpis/PorPeriodo/PorStatus/PacientesFreq/ProcedimentosFreq/Ociosidade*`,
  `agendaDiasMovimentados/Horarios`, `agendaRelatorioRows`, `agendaStatusTabs`, `eventosRows`, `eventoDetalhe`.
- Sem persistência (D2): Salvar fecha o modal; filtros/abas só visuais (abas de status filtram rows em memória).

## Não-escopo (inferidos da spec, fora desta fatia)
- Drag & drop / resize / now-line dinâmica no calendário; date-range picker funcional (board T4).
- Sincronização por query string (`interval`/`period`/`event_modal_*`); deep-link de modal.
- Autocomplete real (selects estáticos), recorrência avançada, conflito de horário, exportar/ações em lote.
