# STATE — memória do projeto

## Projeto
Reconstrução do SaaS **Clínica Experts** (gestão de clínicas, pt-BR) a partir de 36 specs
em `docs/paginas/` + 58 screenshots em `images/`. App web em `web/`.

## Decisões
- **D1** — Stack UI: Next.js 16 (App Router, Turbopack) + Tailwind v4 + componentes shadcn-style hand-rolled + Recharts + lucide-react. Tailwind v4 usa `@theme` em CSS (sem tailwind.config). shadcn CLI evitado (instável no Next 16); primitives feitas à mão em `src/components/ui/`.
- **D2** — Dados: mock estático em `src/lib/mock.ts`, valores exatos dos screenshots.
- **D3** — Cor de marca roxo `#7c3aed` (token `--brand`). Sem dark mode nesta fase.
- **D4** — Charts são Client Components (`"use client"`); páginas seguem Server Components.
- **D5** — Rotas simplificadas: `/`, `/agenda`, `/pacientes`, `/financeiro` (specs reais usam `/clinica/...`).

## Lições
- **L1** — Server Component NÃO pode passar função como prop a Client Component (ex.: `tickFormatter`). Usar enum string serializável e resolver a função dentro do client. (Quebrou o build; corrigido em `mini-bars.tsx`.)
- **L2** — Recharts `ResponsiveContainer` emite warning `width(-1)` no prerender estático — inofensivo, hidrata no client.

## Concluído
- Feature **ui-core**: AppShell + 4 telas (Dashboard, Agenda, Pacientes, Financeiro). `.specs/features/ui-core/`.
- Feature **ui-tables**: +4 telas — Profissionais (10), Fornecedores (11), Contas a receber (13), Contas a pagar (14). Componentes reusáveis `ContactsTable`, `FinanceTable`, `StatusBadge`. 8/36 telas.
- Ambas no `origin/main` (PR #1 mergeado via hook OMC). build ✅ lint ✅.
- Feature **cadastros** (lote 3): +3 telas — Procedimentos (32), Pacotes (34), Estoque/Controle (24), cada uma com modal de cadastro/edição. Novos primitives reusáveis: `ListShell`, `Modal`, `Field`/`Input`/`Select`. Helper `lib/pacote-calc.ts` (cálculo de total de pacote, testável). Submenu de Estoque (`app/estoque/layout.tsx`). Rotas reais: `/configuracoes/procedimentos`, `/configuracoes/pacotes`, `/estoque/items`. Sidebar Configurações/Estoque navegáveis. **11/36 telas.** `.specs/features/cadastros/`. build ✅ lint ✅. Branch `feat/cadastros`.
- Feature **ficha-paciente** (lote 4): +1 tela complexa — Ficha do Paciente (08), master-detail com **6 abas** (Informações, Linha do tempo, Carteira, Pacotes/creditos, Financeiro, Orçamentos). Layout aninhado `app/pacientes/[id]/layout.tsx` (painel lateral persistente via `ficha-sidebar.tsx`) + 6 sub-rotas; `page.tsx` redireciona → informacoes. Novos reusáveis: `ficha-empty.tsx` (EmptyData/EmptyFiltered — 2 variantes de empty state da plataforma), `ficha/pagination.tsx`. Popover de filtro 2 colunas na aba Pacotes. Tabela financeira do paciente (5 KPIs + realce Em atraso). `patients-table` linka nome → ficha. **12/36 telas.** `.specs/features/ficha-paciente/`. build ✅ lint ✅. Branch `feat/ficha-paciente`.
- Feature **agenda-completa** (lote 6): +3 telas + modais — **Visão geral** (03, `/agenda/visao-geral`): KPIs, gráfico "Agendamentos por período" (barras+linha de média via `agenda/period-chart`), lista por status, 4 rankings (2 com empty state), dias/horários movimentados (reusa `MiniBars`/`Heatmap`). **Relatório de agendamentos** (04, `/agenda/relatorio`): `agenda/relatorio-table` (client) com abas-resumo por status, tabela checkbox/colunas/⋮, paginação; clique na linha → drawer. **Eventos/Sala de espera** (05, `/agenda/eventos`): `agenda/eventos-card` estado vazio "Oops, nada foi encontrado!" + busca; "Novo evento" → modal. **Modais** (06): `agenda/novo-evento-modal` (segmented 4 tipos: Agendamento/Bloqueio/Lembrete/Evento, seções colapsáveis Data/Financeiro) + `agenda/evento-drawer` "Detalhes do evento". Novos reusáveis: `agenda/agenda-submenu` (usePathname — calendário refatorado p/ usá-lo), `agenda/status-badge` (enum Agendado/Confirmado/Não compareceu/Concluído/Cancelado + cores + `statusDot`). Calendário (02) já existia (ui-core). **16/36 telas.** `.specs/features/agenda-completa/`. build ✅ lint ✅. Em `origin/main`? não — local @ `747be48` (merge direto). Branch `feat/agenda-completa`.
- Feature **orcamento-modais** (lote 5): +1 tela complexa — Orçamentos (09), modal de criação anexo à ficha (aba Orçamentos → "+ Adicionar novo orçamento"). Toggle interno **Personalizado|Pacote** troca título/campo Pacote/tabela de itens. `ficha/orcamento-modal.tsx` (client): dados básicos (Cliente/Vendedor/Pacote), opções avançadas, tabela Procedimentos/Produtos (Nome→valor, Qtd, Valor, Desconto un R$/%, Total, lixeira), desconto do orçamento, condições de pagamento, Subtotal/Valor total em tempo real. `ficha/orcamento-button.tsx` (client). **Reusa `lib/pacote-calc` (fórmulas §9 idênticas)** + `ui/modal` + `ui/field`. Mock novo: `itensOrcamento`. **13/36 telas.** `.specs/features/orcamento-modais/`. build ✅ lint ✅. Em `origin/main` @ `bff4501` (merge direto). Branch `feat/orcamento-modais`.

## Sessão / retomada
- **Lote 6 concluído em 2026-06-23.** main local @ `747be48`, build ✅ lint ✅. (não há push p/ origin neste lote.)
- **Retomar com:** `cd web && npm run dev` → http://localhost:3000/agenda/visao-geral (+ /agenda/relatorio, /agenda/eventos).
- **Worktree do lote 6:** `../artemise-worktrees/agenda-completa` (removido ao fim do lote). Nota: build via Turbopack NÃO roda em worktree (junction de node_modules rejeitada); validar lá com `tsc --noEmit` + `eslint`, build real após merge no main.
- **Próximo:** lote 7. Faltam 20 telas: financeiro relatórios 15-23 (worktree `feat/financeiro-relatorios` em andamento por outro agente), estoque 25-27, comunicação 28-29, config 30,31,33,35,36. 16/36.
- Branches locais `feat/ui-core`, `feat/ui-tables`, `feat/cadastros`, `feat/ficha-paciente`, `feat/orcamento-modais` já mergeadas (podem ser deletadas).

## Próximos passos (task board multi-agent)

**Protocolo de posse (multi-agent):** antes de começar uma task, agente edita a linha
e preenche `Owner` com seu id (`@nome` ou session id) e muda `Status` para `wip`.
Ao terminar, muda `Status` para `done` e limpa `Owner`. Só pegar tasks `todo` com
`Owner` vazio. Uma task `wip` com Owner preenchido = já tem dono, NÃO pegar.
Status válidos: `todo` | `wip` | `blocked` | `done`.

| ID  | Status | Owner | Task | Notas |
|-----|--------|-------|------|-------|
| T1  | todo   |       | Verificação visual pixel-a-pixel das 13 telas | usuário abre http://localhost:3000 |
| T2  | todo   |       | Ajustar rótulos dia-da-semana em `weekDays` (mock) se divergir do screenshot | `web/src/lib/mock.ts` |
| T3  | done   |       | Lote 5 — modal de orçamento (Tela 09) | spec real = 09-paciente-orcamento-modais; 24/estoque já feito no lote 3 |
| T4  | todo   |       | Date-range picker funcional | usado em Agenda/Financeiro |
| T5  | todo   |       | Próximas telas (24 restantes das 36) | fatiar em lotes ao planejar |
| T6  | todo   |       | Backend + RLS | fase futura, sem mock |

## Preferências
- Usuário pediu fluxo **tlc-spec-driven**. Artefatos em `.specs/`.
