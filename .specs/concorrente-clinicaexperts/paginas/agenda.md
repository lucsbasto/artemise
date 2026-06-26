# Agenda

**Rota:** `/agenda` → redireciona p/ `/agenda/semana/AAAA/MM/DD`
**Tipo:** Calendário (FullCalendar) + filtros + criação rápida
**Screenshot:** `agenda.png`

## Propósito

Visualização e gestão de todos os compromissos da clínica. Calendário central com filtros laterais e criação de eventos via FAB.

## Layout

- **Sidebar de filtros (esquerda):** mini-calendário (mês) + filtros.
- **Calendário central:** grade de horários (timegrid). Linha vermelha = horário atual. Eventos coloridos por status/tipo.
- **Toolbar superior:** navegação de data (`‹ Hoje ›`, duplo `«»` p/ pular), seletor de visão, "Pedir à Anna" (IA).
- **FAB (+) inferior direito:** menu de criação rápida (global, aparece em várias telas).

## Filtros (sidebar)

| Filtro | Tipo | Default |
|---|---|---|
| Status | select busca | Todos |
| Profissional | select busca | Todos |
| Paciente | select busca | Todos |
| Procedimento | select busca | Todos |
| Sala de atendimento | select busca | Todas |
| Mostrar finais de semana | checkbox | |
| Mostrar lembretes | checkbox | |
| Mostrar feriados | checkbox | |
| Mostrar eventos do sistema | checkbox | |
| Mostrar eventos no mês | checkbox | |
| Sobrepor eventos | checkbox | |

Botão **Limpar filtros**. Seção "Seções avançadas" (recolhível).

## Visões de calendário

Seletor (botão "Semana ▾"): Dia / Semana / Mês / Lista (FullCalendar views). Default: Semana.

## FAB — Menu de criação rápida (global)

Botão `+` flutuante. Opções (8):

1. **Novo agendamento** (consultation)
2. **Novo bloqueio de horário** (bloqueia slot)
3. **Novo lembrete**
4. **Novo evento**
5. **Nova venda personalizada**
6. **Nova venda de crédito**
7. **Nova venda de pacote**
8. **Novo atendimento**

> Implementação: cada ação abre um modal cujo estado é refletido na URL via query params, ex.:
> `?event_modal_type=consultation&event_modal_mode=new`. Deep-linkável.

## Form: Novo agendamento

Modal com abas de **Tipo**: `Agendamento` · `Bloqueio de horário` · `Lembrete` · `Evento`.

### Aba Agendamento

**Dados básicos**

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Paciente | select busca ("Pesquise/Selecione") | — | Link **+ Adicionar** cria paciente inline |
| Profissional | select busca | — | Default: usuário logado (Lucas Bastos) |
| Status | select | — | Default "Agendado" (outros: confirmado/cancelado/…) |
| Cor | color picker | — | Cor do evento no calendário |
| Observações | textarea ("Digite") | — | |

**Procedimentos/Produtos** (lista, repetível)

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | select busca | — | Procedimento ou produto |
| Qtd | tel/number | — | |
| Dia | date | ✅ | |
| Início | time | ✅ | |
| Fim | time | ✅ | |

Link **+ Adicionar Procedimentos/Produtos** (adiciona nova linha). Botão **Salvar**.

### Outras abas (variações do mesmo modal)

- **Bloqueio de horário:** marca período indisponível (sem paciente/procedimento).
- **Lembrete:** nota/alerta no calendário.
- **Evento:** compromisso genérico.

## Observações para o Artemise

- Quick-create global (FAB) com 8 atalhos cobre os fluxos mais comuns sem navegar — ótimo p/ produtividade.
- Modal de agendamento une paciente + profissional + procedimentos + horário numa tela só (procedimento carrega duração → calcula Fim).
- Estado do modal na URL = deep-link/compartilhável e bom p/ histórico do browser.
- Criar paciente inline ("+ Adicionar") evita sair do fluxo de agendamento.

## Notas técnicas (automação)

- Calendário = FullCalendar (`fc-timegrid`). Criação de evento por slot-click parece desabilitada; usar FAB.
- Onboarding usa **Userpilot** (tours/coach-marks) que sobrepõe backdrop bloqueando cliques até completar as "missões".
