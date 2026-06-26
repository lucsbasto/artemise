# Onboarding (trial) / Boas-vindas

**Rotas:** `/setup` (wizard inicial "Anna") → `/trial-onboarding` (checklist)
**Tipo:** Onboarding gamificado
**Screenshot:** `onboarding.png`

## Propósito

Guiar o novo usuário do trial a experimentar os fluxos centrais, com gamificação (recompensa/cupom) e contagem regressiva do período grátis.

## Wizard inicial (`/setup`)
- Assistente "Anna" (IA) que se apresenta e coleta dados para **criar a clínica** ("Vou coletar algumas informações que me ajudarão criar a sua clínica..."). Conduz à criação da clínica e depois redireciona ao checklist.

## Checklist de tarefas (`/trial-onboarding`)

Cabeçalho: "Lucas, em poucos minutos nós vamos aumentar a eficiência da sua clínica" · "A cada passo concluído, mais praticidade no seu trabalho!".

Banner: **"Desbloqueie uma recompensa exclusiva concluindo todas as tarefas"**.

### 5 tarefas (cada uma com botão **Iniciar tarefa** → leva guiado ao módulo via tour Userpilot)
1. **Criar um agendamento** — "Dê o passo inicial para ter uma agenda clara, organizada e pronta para crescer."
2. **Realizar um atendimento** — "Experimente na prática como é simples atender e registrar tudo em um só lugar."
3. **Fazer uma venda** — "Veja na prática como é simples gerar cobranças e manter o financeiro em dia."
4. **Automatize seus lembretes**
5. **Assine um documento**

Cada tarefa tem um **checkbox** que marca conclusão. Concluir todas → **cupom de desconto** liberado ("Quando concluir todas as tarefas abaixo, seu cupom de desconto estará disponível aqui!").

### Linha do tempo do trial
| Marco | Data (exemplo) |
|---|---|
| Início do teste grátis | 25/06/2026 |
| Lembrete do fim do teste | 30/06/2026 |
| Fim do teste grátis | 01/07/2026 |

(Trial de ~7 dias; reward = cupom.)

### Bloco de ajuda
- "Precisa de ajuda? Escolha o melhor canal para o que precisa" → **Canais de suporte**, **Pedir à Anna** (IA), **Dúvidas frequentes** (FAQ).

## Mecânica técnica
- Tours/coach-marks via **Userpilot** (backdrop que bloqueia cliques até completar o passo).
- Widget de onboarding (mini-checklist + busca "Anna") fica fixo no header de todas as telas até conclusão.

## Observações para o Artemise
- Onboarding gamificado com recompensa (cupom) aumenta ativação no trial — alto ROI.
- Tarefas = os 5 fluxos de maior valor (agendar, atender, vender, lembrete, assinar) — foco no "aha moment".
- Contagem regressiva visível + lembrete de fim do trial criam urgência de conversão.
- Wizard com IA ("Anna") reduz fricção do setup inicial da clínica.
- Tour guiado por passo ensina na prática (learning by doing) em vez de manual.
