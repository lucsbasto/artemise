# Prontuário — Ficha Epilação

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Epilação**)
**Tipo:** Formulário de atendimento (avaliação para epilação/depilação)
**Screenshot:** (compartilha layout; ver `prontuario-ficha-corporal.png` para padrão)

## Propósito

Avaliação para procedimentos de epilação a laser/luz. Determina fototipo e características do pelo (relevantes para parâmetros do equipamento).

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## Campos

| # | Pergunta / Campo | Tipo | Opções / Notas |
|---|---|---|---|
| 1 | Escala de Fitzpatrick | card/escala visual | Tipo 1 · Tipo 2 · Tipo 3 · Tipo 4 · Tipo 5 · Tipo 6 (fototipo de pele) |
| 2 | Pigmento do pelo | text | livre |
| 3 | Espessura do pelo | text | livre |
| 4 | Frequência que realiza epilação | text | livre |
| 5 | Observações | textarea | livre |

## Observações para o Artemise

- **Escala de Fitzpatrick** padronizada é essencial para segurança/eficácia de laser — bom tê-la como widget reutilizável entre fichas (aparece em Epilação, Estética Facial e Facial).
- Ficha enxuta e focada: cada especialidade tem só os campos relevantes ao procedimento.
