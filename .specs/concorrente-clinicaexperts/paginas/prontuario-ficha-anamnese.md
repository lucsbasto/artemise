# Prontuário — Ficha de Anamnese

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Anamnese**)
**Tipo:** Formulário de atendimento (ficha clínica)
**Screenshot:** `prontuario-atendimento.png`

## Propósito

Ficha inicial do atendimento. Coleta queixa, histórico e questionário de saúde (anamnese) do paciente. É a ficha aberta por padrão ao entrar no atendimento.

## Estrutura geral do atendimento (comum a TODAS as fichas)

- **Header do paciente** (canto sup. esq. da área de conteúdo): avatar com iniciais, **Nome** (`Clara Ribeiro (Paciente de exemplo)`), **idade detalhada** (`34 anos, 6 meses, 20 dias`), ícone de prancheta (copiar/ver ficha).
- **Sidebar de fichas** (coluna esquerda) — lista clicável de fichas; ficha ativa em destaque roxo. Algumas fichas têm um **marcador (bolinha)**: azul (`Estética Facial` = ficha com dado/em edição) e verde (no ícone lateral). As fichas: Anamnese · Capilar · Corporal · Epilação · Estética Facial · Facial · Fotos e anexos · Injetáveis · Orçamento · Plano de tratamento.
- **Rodapé fixo:**
  - **Timer** (cronômetro) — tempo decorrido do atendimento (ex.: `01:01:24`), conta enquanto "Em andamento".
  - **Visibilidade** — dropdown **Privado** (cadeado) → controla quem vê o conteúdo da ficha (Privado / provavelmente Público/Compartilhado).
  - **Cancelar** (descarta) · **Finalizar atendimento** (botão primário roxo — encerra o atendimento). *Não acionado.*
- **Header global do app:** botão WhatsApp, badge de status **Em andamento** (estado do atendimento), ícone IA (Anna), Ajuda, notificações, avatar do usuário (LB).
- **Transcrição por IA:** no topo há bloco **"Inicie a Transcrição"** com checkboxes **Habilitar gravação de áudio** e **Identificar locutores**, e **upload de áudio** — transcreve a consulta e popula as fichas automaticamente. Cada campo rich-text também aceita upload de áudio para transcrição localizada.

## Campos da ficha Anamnese

Padrão dos campos de saúde: **radio com 3 opções — Sim · Não · Outro** (a opção "Outro" libera um campo de texto livre, placeholder `Outro`).

| # | Pergunta / Campo | Tipo | Opções / Notas |
|---|---|---|---|
| 1 | Queixa Principal | rich-text (editor B/I/U/S, cor, alinhamento, listas, undo/redo) + upload de áudio (transcrição) | texto livre formatado |
| 2 | Tratamentos anteriores | rich-text + upload de áudio | texto livre formatado |
| 3 | Gestante? | radio | Sim / Não / Outro (texto) |
| 4 | Tabagista? | radio | Sim / Não / Outro |
| 5 | Possui diabetes? | radio | Sim / Não / Outro |
| 6 | Possui hipertensão? | radio | Sim / Não / Outro |
| 7 | Utiliza marcapasso? | radio | Sim / Não / Outro |
| 8 | Possui alterações hormonais ou na tireóide? | radio | Sim / Não / Outro |
| 9 | Possui doença hepática? | radio | Sim / Não / Outro |
| 10 | Utiliza filtro solar diariamente? | radio | Sim / Não / Outro |
| 11 | Utiliza medicamentos contínuos? | radio | Sim / Não / Outro |
| 12 | Realiza atividade física regular? | radio | Sim / Não / Outro |
| 13 | Já fez cirurgia? | radio | Sim / Não / Outro |
| 14 | Patologias cutâneas? | radio | Sim / Não / Outro |
| 15 | Alterações pigmentares cutâneas? | radio | Sim / Não / Outro |
| 16 | Observações | rich-text + upload de áudio | texto livre formatado |

## Observações para o Artemise

- **Transcrição de consulta por IA** (áudio → texto nas fichas, com identificação de locutores) é diferencial forte; reduz digitação do profissional.
- Padrão **Sim/Não/Outro** com campo livre no "Outro" cobre exceções sem poluir o formulário — bom modelo para questionários de saúde.
- **Visibilidade por ficha (Privado)** permite ocultar anotações sensíveis do paciente/outros profissionais.
- **Timer de atendimento** embutido alimenta métricas de duração de consulta e produtividade.
- Idade exibida em granularidade alta (anos/meses/dias) — útil em estética/pediatria.
