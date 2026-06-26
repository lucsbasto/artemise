# Tasks — Mapa de Injetáveis (MVP face-only)

Spec: `spec.md`. App é mock client-side (React 19 / Next 16). Sem backend.

| ID | Status | Tarefa | AC (spec) |
|---|---|---|---|
| T1 | ✅ | Asset base frontal em `web/public/mapa-injetaveis/face-frontal.svg` | Imagem base |
| T2 | ✅ | Tipos do domínio (Substancia, Regiao, Ponto, Rastreio) no componente | Modelo de dados |
| T3 | ✅ | Componente `<MapaInjetaveis>` — layout (legenda + mapa + rastreio) sobre o SVG | P1/P5 |
| T4 | ✅ | Modo **Mão livre**: clicar no rosto cria ponto + input de unidades + badge | P1 |
| T5 | ✅ | Editar/remover ponto (clicar ponto reabre popover) | P1.5 |
| T6 | ✅ | Toggle **Mão livre ⇄ Selecionável**; pontos preservados | P2 |
| T7 | ✅ | Modo **Selecionável**: regiões-semente clicáveis (coords ajustadas no rosto) + tooltip | P2/P3 |
| T8 | ✅ | **Rastreabilidade por substância** (marca/lote/diluição/volume/validade) | P4 |
| T9 | ✅ | Toggle **Exibir quantidades** | P5 |
| T10 | ✅ | Rota demo `/mapa-injetaveis` renderizando o componente | — |
| T11 | ✅ | Verificação: `tsc --noEmit` ✅ + eslint ✅ + render testado no browser | Goals |

## Fora do MVP (follow-up)
- CRUD de regiões na clínica (Configurações → Injetáveis) — hoje regiões são seed em código (P3 parcial).
- Vistas de perfil (E/D) — V2.
- Persistência em store + vínculo a atendimento real (hoje estado local do componente).
- Baixa de estoque por unidade aplicada.
