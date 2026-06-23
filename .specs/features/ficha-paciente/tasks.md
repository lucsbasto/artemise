# Tasks: Ficha do Paciente (lote 4 — tela 08) — STATUS: ✅ concluída (build + lint verdes)

Origem: `docs/paginas/08-paciente-ficha.md`. Master-detail com 6 abas, mock estático.

- **T1 — Mock + fundação** ✅
  - `lib/mock.ts`: +`FichaPaciente`/`fichaPaciente` (Clara Ribeiro, valores exatos), +`fichaAbas`,
    +`TimelineEvent`/`timelineEvents` (10), +`carteira`, +`FichaFinKpi`/`fichaFinanceiroKpis` (5),
    +`FichaFinRow`/`fichaFinanceiroRows` (8) + `fichaFinanceiroTotal=28`.
  - `components/ficha/ficha-empty.tsx` (`EmptyData` + `EmptyFiltered`), `pagination.tsx`.

- **T2 — Layout master-detail** ✅
  - `app/pacientes/[id]/layout.tsx` (painel + área de conteúdo) + `page.tsx` (redirect → informacoes).
  - `components/ficha/ficha-sidebar.tsx` (client): avatar/selo EXEMPLO, nome, resumo, badge Paciente,
    "Enviar mensagem" + ⋮, menu 6 abas (ativo via pathname, slug `creditos`→label "Pacotes").

- **T3 — Abas** ✅ (6 sub-rotas + componentes)
  - Informações (`aba-informacoes.tsx`): 11 campos read-only c/ ícones + "Editar informações".
  - Linha do tempo (`aba-linha-do-tempo.tsx`): feed cronológico, ícone status, valor opcional.
  - Carteira (`aba-carteira.tsx`): 3 cards saldo (roxo/verde/branco) + extrato vazio + paginação.
  - Pacotes (`aba-pacotes.tsx`, client): Exportar desabilitado + popover filtro 2 colunas (Uso/Validade/…) + empty data.
  - Financeiro (`aba-financeiro.tsx`): 5 KPIs (Total do período ativo) + tabela (Venc/Exec/Desc/Situação/Valor líq) + realce Em atraso.
  - Orçamentos (`aba-orcamentos.tsx`): empty "Oops, nada foi encontrado!" + Limpar/Adicionar + paginação 25.

- **T4 — Integração + verificação** ✅
  - `patients-table.tsx`: nome linka → `/pacientes/{id}/informacoes`.
  - `npm run build` ✅ + `npm run lint` ✅. 7 rotas de ficha geradas.

## Ordem de execução
T1 → T2 → T3 → T4.

## Reuso
`Breadcrumb`, `StatusBadge`, `cn`, `brl`. Novos reusáveis: `EmptyData`/`EmptyFiltered`, `Pagination`.
