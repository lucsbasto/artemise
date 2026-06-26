# Configurações — Horários de funcionamento

**Rota:** `/configuracoes/horarios-de-funcionamento`  ·  **Tipo:** Form de settings (semanal)  ·  **Screenshot:** `config-horarios.png`

> ⚠️ Afeta a agenda real da clínica. NÃO alterei/salvei.

## Propósito

Define os horários de funcionamento da clínica por dia da semana. Alimenta a agenda (setting "Mostrar apenas horários de funcionamento" em Preferências) e o agendamento online (CliniSite).

## Layout

Lista de 7 dias (Domingo → Sábado). Cada dia:
- **Toggle ativo/inativo** (dia aberto ou fechado). No exemplo: Domingo e Sábado **off**; Segunda a Sexta **on**.
- Para dia ativo: **horário início** (time picker, ex. 08:00) · **horário fim** (time picker, ex. 18:00) · ícone **lixeira** (remove a faixa) · **+ Adicionar** (adiciona outra faixa de horário no mesmo dia — suporta múltiplos turnos, ex. manhã e tarde com intervalo de almoço).
- Time pickers com ícone de relógio.

Rodapé: **Cancelar / Salvar**.

## Observações para o Artemise

- **Múltiplas faixas por dia** ("+ Adicionar") cobre clínicas com intervalo de almoço ou turnos partidos — modelar `horario` como lista de intervalos por dia, não um único início/fim.
- Toggle por dia = forma limpa de marcar dias fechados sem apagar configuração.
- Integra com 2 features de agenda: restrição de grade de horários e bloqueio de feriados (settings em Preferências). Horário de funcionamento é a base; profissionais têm disponibilidade própria por cima (visto no módulo de profissionais).
- Picker de hora nativo + validação início < fim esperada.
