# Feature: UI Core — AppShell + 4 telas

> Reconstrução visual do SaaS **Clínica Experts** (pt-BR). Fonte de verdade upstream:
> `docs/paginas/*.md` (36 specs) + `images/*.png` (58 screenshots). Este spec NÃO duplica
> aquelas specs — referencia-as e define só o recorte desta entrega.

## Escopo

Stack: Next.js 16 (App Router) · Tailwind v4 · componentes shadcn-style (hand-rolled) · Recharts · lucide-react.
Dados: **mock estático** (valores exatos dos screenshots). Sem backend, sem fetch real.
App scaffoldado em `web/`.

## Requisitos (IDs rastreáveis)

### Shell
- **R-SHELL-1** — `<AppShell>` com `<HeaderGlobal>` fixo: hambúrguer, logo "clínicaexperts", ações à direita (WhatsApp, busca, Ajuda, sino, avatar "LB").
- **R-SHELL-2** — `<IconSidebar>` vertical estreita, só ícones, 14 itens com tooltip; item ativo destacado em roxo (fundo arredondado). Ordem conforme `docs/paginas/01-inicio-dashboard.md §4`.
- **R-SHELL-3** — Overlays globais fixos: banner laranja de desconto + card "0% / Seu progresso" (canto inf. esq.); FAB "+" roxo + FAB IA gradiente (canto inf. dir.).
- **R-SHELL-4** — Layout responsivo: conteúdo cinza claro com scroll; sidebar colapsável via hambúrguer.

### Dashboard — `/` (ref. `01-inicio-dashboard.md`)
- **R-DASH-1** — Breadcrumb "Clínica / Início".
- **R-DASH-2** — Card "Fluxo de caixa": tabs Diária|Semanal|Mensal|Anual + gráfico composto (barras empilhadas entradas/saídas + linhas saldo/saldo previsto). Valores exatos do spec §5.1.
- **R-DASH-3** — Card "Filtros" (Período date-range com setas) + Card "Balanço" (saldo R$ 1.831,00, entradas R$ 4.370,00, saídas -R$ 2.539,00, toggle olho).
- **R-DASH-4** — Card "Agendamentos das próximas 24h" (item Clara Ribeiro) + Card "Próximos aniversariantes" (estado vazio).
- **R-DASH-5** — Seção "Relatórios": tabs de ícones + 6 mini-cards (barra profissional, dias, heatmap horários, donut status, donut sexo, barras faturamento).

### Agenda — `/agenda` (ref. `02-agenda-calendario.md`)
- **R-AGE-1** — Submenu do módulo (Agenda·Visão geral·Relatório de agendamentos·Eventos), item Agenda ativo.
- **R-AGE-2** — Barra de controles: "Hoje", setas `<`/`>`, rótulo "21 - 27 de jun. de 2026", seletor "Semana", CTA roxo "Pedir à Mara".
- **R-AGE-3** — Grade semanal: cabeçalho 7 dias (21–27, dia 22 destacado), gutter de horas (08:00–22:00), linha vermelha "agora", card de agendamento roxo 14:00–15:00 na coluna 22.

### Pacientes — `/pacientes` (ref. `07-pacientes-listagem.md`)
- **R-PAC-1** — Breadcrumb "Contatos / Pacientes" + card com título "Pacientes" + "1 registro".
- **R-PAC-2** — Toolbar: "+ Adicionar filtro", busca, "Ações em lote" (disabled), "Exportar".
- **R-PAC-3** — Tabela: checkbox, Nome (avatar+sub "Paciente"), Etiquetas, Identificador (+ ícone WhatsApp), Ativo (toggle), menu "⋮". Linha exemplo Clara Ribeiro.
- **R-PAC-4** — Rodapé: "25 por página" + paginação.

### Financeiro Visão Geral — `/financeiro` (ref. `12-financeiro-visao-geral.md`)
- **R-FIN-1** — Bloco Filtros (chip "Período: 23/05/2026 – 22/06/2026", "+ Adicionar filtro", "Limpar filtros").
- **R-FIN-2** — 4 KPIs: Receitas R$ 6.320 · Despesas -R$ 3.889 · A receber R$ 2.180 · A pagar -R$ 3.380.
- **R-FIN-3** — Grid 2 col: Fluxo de caixa (gráfico) + Contas financeiras (Banco padrão R$ 2.431,00, Caixa R$ 0,00, Saldo total R$ 2.431,00 / "Ver todas").
- **R-FIN-4** — Grid 3 col: A receber (lista métricas), A pagar (lista métricas), Categorias (toggle Receita/Despesa + pizza).

## Fora de escopo
Modais/drawers, fluxos de criação, date-range picker funcional, demais 32 telas, autenticação, backend/RLS.

## Critério de aceite
`npm run build` passa. As 4 rotas renderizam fiel aos screenshots (layout, cores, textos exatos, gráficos). Navegação pela sidebar funciona. Lint sem erros.
