# Tasks — Aba Procedimentos + caminho até o Mapa

Spec: `spec.md` (+ `../mapa-injetaveis/spec.md`). App mock client-side (React 19 / Next 16).
Decisões: mapa abre como **modal**; substâncias vêm do **Estoque** (baixa por ui); regiões de botox pesquisadas.

| ID | Status | Tarefa | Spec |
|---|---|---|---|
| T1 | ⬜ | Estender tipo `Procedimento`: `categoria` + `usaMapa`. Preencher seed do catálogo com os estéticos comuns | B·P1 |
| T2 | ⬜ | Estender `RegistroProcedimento`: `usaMapa?` + `mapa?` (estado do `<MapaInjetaveis>`) | B·P3 |
| T3 | ⬜ | Aba Procedimentos: garantir lista feitos + agendados por paciente + botão Novo (reusa `aba-procedimentos.tsx`) | B·P2 |
| T4 | ⬜ | Modal Novo/Editar: ao escolher procedimento `usaMapa`, exibir ação **"Abrir mapa"** | B·P3 |
| T5 | ⬜ | Linha da lista: ação **"Mapa"** (via `RowActions`) só para registros `usaMapa` | B·P3 |
| T6 | ⬜ | `<MapaInjetaveis>` controlado (`value`/`onChange`) — extrair estado interno p/ props | A·P1 |
| T7 | ⬜ | Abrir o mapa em **`<Modal size="xl">`** vinculado ao registro; persistir no registro via `useCollection` | B·P3 |
| T8 | ⬜ | Reabrir registro mostra pontos previamente marcados | B·P3 |
| T9 | ⬜ | Seed de regiões faciais com a lista pesquisada (toxina + preenchimento) | A·P3 |
| T10 | ⬜ | **Estoque:** substâncias do mapa vêm de itens "Injetáveis" do `estoqueStore` (`itemEstoqueId`) | A·P6 |
| T11 | ⬜ | **Baixa por ui** no estoque ao salvar; ajuste na edição; aviso se saldo insuficiente | A·P6 |
| T12 | ⬜ | Verificação: `tsc --noEmit` ✅ + eslint ✅ + build ✅ + render testado no browser | Goals |

## Ordem sugerida
1. Dados (T1, T2) → 2. Aba/lista (T3) → 3. Mapa controlado + modal (T6, T7, T4, T5, T8) →
4. Regiões seed (T9) → 5. Estoque (T10, T11) → 6. Verificação (T12).

## Fora do MVP (follow-up)
- CRUD de regiões pela clínica (Configurações).
- Persistência backend; módulo Procedimentos top-level; vistas de perfil.
