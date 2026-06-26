# Comissões

**Rota base:** `/comissoes-em-aberto` (item de menu "Comissões")
**Tipo:** Listagem (tabela) — 2 visões
**Screenshot:** `comissoes.png` (em aberto) · `comissoes-pagas.png` (finalizadas)

## Propósito
Acompanhamento das comissões dos profissionais geradas por vendas/atendimentos: o que está **em aberto** (a comissionar/receber) e o que já foi **finalizado/pago**, com filtro de período e total.

## Mapa do módulo (rotas reais)

| Rota | Título da página | Breadcrumb |
|---|---|---|
| `/comissoes-em-aberto` | Comissões em aberto | Comissões / Comissões em aberto |
| `/comissoes-pagas` | Comissões finalizadas | Comissões / Comissões pagas |

> **Não existem** páginas standalone de regras de comissão nem de fechamento. Rotas testadas que **redirecionam** p/ `/clinica/inicio` (não existem): `/comissoes` (→ em-aberto), `/comissoes/regras`, `/comissoes/fechamento`, `/comissoes-fechadas`, `/fechamento-de-comissoes`, `/regras-de-comissao`, `/comissoes-recebidas`. As **regras de comissão** (percentual/valor por profissional/serviço/produto) são configuradas **fora deste módulo** — no cadastro do profissional e/ou serviço/produto — e geram os lançamentos que aparecem aqui.

## Comissões em aberto (`/comissoes-em-aberto`)
- Título **Comissões em aberto**.
- Filtros: chip **Período** (default últimos 30 dias) · **Adicionar filtro** (+). Período via `?interval=<ini>&interval=<fim>`.
- Colunas: **Profissional** · **Total de comissões** · **A comissionar** · **A receber**.
- Paginação: "25 por página" + `« ‹ › »` + "Mostrando X a Y de Z".
- Rodapé: **Total do período** (R$).
- **Empty state:** ícone (i) + "**Hmm, está vazio por aqui!** Nenhum registro encontrado." (sem comissões no período testado).
- Sem FAB de criação (comissões são geradas automaticamente, não criadas manualmente aqui).

## Comissões finalizadas / pagas (`/comissoes-pagas`)
- Título **Comissões finalizadas** (breadcrumb "Comissões pagas").
- Filtros: **Período** · **Adicionar filtro**.
- Colunas: **Profissional** · **Total de comissões** · **Data** · **Comissão**.
- Paginação + **Total do período**. Mesmo empty state (vazio no período testado).

## Fluxos / teste
Nenhum registro de teste criado — **não há form de criação de comissão** (comissões originam-se de vendas/atendimentos conforme regra do profissional/serviço). Ambas as listas estavam **vazias** no período 26/05–25/06/2026, então não foi possível exercitar o detalhe nem o "fechamento" de uma comissão. Não existe ação destrutiva/financeira a documentar aqui além da inexistência de páginas de regras/fechamento standalone.

## Observações para o Artemise
- Modelo de comissão em 2 estágios: **em aberto** (a comissionar / a receber) → **finalizada/paga**. O "fechamento" provavelmente acontece ao liquidar/pagar a comissão (transição de estado), não numa tela dedicada.
- Distinção **"A comissionar" vs "A receber"**: sugere que a comissão só vira "a receber" quando o título de origem é efetivamente recebido (comissão atrelada ao recebimento, não só à venda) — regra importante de fluxo de caixa.
- Regras de comissão **descentralizadas** (no profissional/serviço) mantêm o módulo de Comissões enxuto (só consulta/relatório). Para o Artemise, decidir se regras ficam no cadastro do profissional (como aqui) ou numa tela central de regras — a central facilita auditoria, a descentralizada facilita o cadastro.
- Falta visível: tela de **regras de comissão** e de **fechamento em lote por período/profissional** — oportunidade de diferenciação.
