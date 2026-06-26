# Início — Dashboard

**Rota:** `/clinica/inicio`
**Tipo:** Dashboard / visão geral (somente leitura)
**Screenshot:** `inicio.png`

## Propósito

Tela inicial pós-login. Consolida indicadores financeiros, agenda imediata, aniversariantes e gráficos analíticos da clínica.

## Filtro de período

Abas no topo: **Diária · Semanal · Mensal · Anual** — reprocessam todos os widgets para o período selecionado.

## Widgets / cards

| Card | Conteúdo |
|---|---|
| **Balanço** | Valor consolidado do período (ex.: `R$ 2.931,00`). Provável receitas − despesas. |
| **Agendamentos das próximas 24h** | Lista de compromissos imediatos. |
| **Próximos aniversariantes** | Pacientes com aniversário próximo (gancho de relacionamento/marketing). |
| **Relatórios** (seção de gráficos) | Conjunto de gráficos analíticos (abaixo). |

### Gráficos (seção Relatórios)

- **Agendamentos por profissional** — distribuição de agenda por profissional.
- **Status por agendamento** — breakdown por status (confirmado/cancelado/realizado/etc).
- **Pacientes por sexo** — segmentação demográfica.
- **Faturamento comparado** — comparativo de receita entre períodos.

## Observações para o Artemise

- Modelo de dashboard data-driven com filtro de período global → reaproveitável.
- "Próximos aniversariantes" como widget é diferencial de retenção barato de implementar.
- KPI de Balanço no topo dá leitura financeira imediata.

## Ações

Nenhum formulário nesta página (read-only). Header global expõe botões **Ajuda** e **Comunicação** + busca IA "Anna" (presentes em todas as telas).
