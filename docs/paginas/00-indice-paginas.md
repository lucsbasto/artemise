# Clínica Experts — Specs de Desenvolvimento por Página

Uma página por arquivo, com detalhamento máximo para reconstrução: identificação/rota, objetivo, navegação, layout (árvore de componentes), componentes, tabelas, formulários/campos, filtros, estados, modais, **modelo de dados inferido**, **endpoints de API inferidos**, regras/cálculos, fluxos e notas de implementação.

> Base: 58 screenshots de `app.clinicaexperts.com.br`. Textos e valores exatos transcritos; tudo que não estava visível na captura está marcado **(inferido)**.

## Módulo: Início
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 01 | Início / Dashboard | `/clinica/inicio` | [01-inicio-dashboard.md](01-inicio-dashboard.md) |

## Módulo: Agenda
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 02 | Calendário (semana) | `/agenda` | [02-agenda-calendario.md](02-agenda-calendario.md) |
| 03 | Visão geral (dashboard) | `/calendar/dashboard` | [03-agenda-visao-geral.md](03-agenda-visao-geral.md) |
| 04 | Relatório de agendamentos | `/calendar/listagem` | [04-agenda-relatorio-agendamentos.md](04-agenda-relatorio-agendamentos.md) |
| 05 | Eventos / Sala de espera | `/eventos` | [05-agenda-eventos-sala-espera.md](05-agenda-eventos-sala-espera.md) |
| 06 | Modais de evento (agendamento, bloqueio, lembrete, promoção) | `/eventos?event_modal_*` | [06-agenda-modais-evento.md](06-agenda-modais-evento.md) |

## Módulo: Contatos
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 07 | Pacientes (listagem) | `/clinica/contatos/listagem-pacientes` | [07-pacientes-listagem.md](07-pacientes-listagem.md) |
| 08 | Ficha do paciente (6 abas) | `/clinica/contatos/listagem/paciente/{id}` | [08-paciente-ficha.md](08-paciente-ficha.md) |
| 09 | Modais de orçamento | `.../orcamentos?sale_quote_*` | [09-paciente-orcamento-modais.md](09-paciente-orcamento-modais.md) |
| 10 | Profissionais (listagem) | `/clinica/contatos/listagem-profissionais` | [10-profissionais-listagem.md](10-profissionais-listagem.md) |
| 11 | Fornecedores (listagem) | `/clinica/contatos/listagem-fornecedores` | [11-fornecedores-listagem.md](11-fornecedores-listagem.md) |

## Módulo: Financeiro
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 12 | Visão geral | `/clinica/financeiro/visao-geral` | [12-financeiro-visao-geral.md](12-financeiro-visao-geral.md) |
| 13 | Contas a receber | `/clinica/financeiro/contas-a-receber` | [13-financeiro-contas-a-receber.md](13-financeiro-contas-a-receber.md) |
| 14 | Contas a pagar | `/clinica/financeiro/contas-a-pagar` | [14-financeiro-contas-a-pagar.md](14-financeiro-contas-a-pagar.md) |
| 15 | Extrato de movimentação | `/financeiro/extrato-de-movimentacao` | [15-financeiro-extrato-movimentacao.md](15-financeiro-extrato-movimentacao.md) |
| 16 | Relatório de competência | `/financeiro/relatorio-de-competencia` | [16-financeiro-relatorio-competencia.md](16-financeiro-relatorio-competencia.md) |
| 17 | Fluxo de caixa diário | `/financeiro/fluxo-de-caixa-diario/day` | [17-financeiro-fluxo-caixa-diario.md](17-financeiro-fluxo-caixa-diario.md) |
| 18 | Fluxo de caixa mensal | `/financeiro/fluxo-de-caixa-mensal/month` | [18-financeiro-fluxo-caixa-mensal.md](18-financeiro-fluxo-caixa-mensal.md) |
| 19 | Relatório de categorias | `/financeiro/relatorio-de-categorias` | [19-financeiro-relatorio-categorias.md](19-financeiro-relatorio-categorias.md) |
| 20 | Contas financeiras | `/financeiro/contas/` | [20-financeiro-contas-financeiras.md](20-financeiro-contas-financeiras.md) |
| 21 | Categorias de contas | `/financeiro/categorias-de-contas` | [21-financeiro-categorias-de-contas.md](21-financeiro-categorias-de-contas.md) |
| 22 | Métodos de pagamento | `/financeiro/metodos-de-pagamento` | [22-financeiro-metodos-de-pagamento.md](22-financeiro-metodos-de-pagamento.md) |
| 23 | Comissões em aberto | `/comissoes-em-aberto` | [23-financeiro-comissoes-em-aberto.md](23-financeiro-comissoes-em-aberto.md) |

## Módulo: Estoque
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 24 | Itens | `/estoque/items` | [24-estoque-itens.md](24-estoque-itens.md) |
| 25 | Giro de estoque | `/estoque/giro` | [25-estoque-giro.md](25-estoque-giro.md) |
| 26 | Contagem (+ modais) | `/estoque/contagem-estoque` | [26-estoque-contagem.md](26-estoque-contagem.md) |
| 27 | Itens abertos (+ modal) | `/estoque/itens-aberto` | [27-estoque-itens-abertos.md](27-estoque-itens-abertos.md) |

## Módulo: Comunicação
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 28 | Canais de atendimento | `/comunicacao/canais-de-comunicacao` | [28-comunicacao-canais-atendimento.md](28-comunicacao-canais-atendimento.md) |
| 29 | Modelos de mensagens (automações) | `/comunicacao/mensagens/mensagens-do-sistema` | [29-comunicacao-modelos-mensagens.md](29-comunicacao-modelos-mensagens.md) |

## Módulo: Configurações
| # | Página | Rota | Arquivo |
|---|--------|------|---------|
| 30 | Preferências do sistema | `/configuracoes/preferencias-do-sistema` | [30-config-preferencias-sistema.md](30-config-preferencias-sistema.md) |
| 31 | Dados da clínica | `/configuracoes/dados-da-clinica` | [31-config-dados-clinica.md](31-config-dados-clinica.md) |
| 32 | Procedimentos (+ modal) | `/configuracoes/procedimentos` | [32-config-procedimentos.md](32-config-procedimentos.md) |
| 33 | Categorias de procedimentos | `/configuracoes/categorias-de-procedimentos` | [33-config-categorias-procedimentos.md](33-config-categorias-procedimentos.md) |
| 34 | Pacotes (+ modal) | `/configuracoes/pacotes` | [34-config-pacotes.md](34-config-pacotes.md) |
| 35 | Fichas de atendimentos | `/configuracoes/fichas-de-atendimentos/` | [35-config-fichas-atendimento.md](35-config-fichas-atendimento.md) |
| 36 | Modelos de atestados e prescrições | `/configuracoes/modelos-de-atestados-e-prescricoes` | [36-config-atestados-prescricoes.md](36-config-atestados-prescricoes.md) |

---

## Como usar para desenvolvimento

1. **Modelagem de dados** — junte as seções "Modelo de dados inferido" de cada página para montar o schema completo (entidades: Paciente, Profissional, Fornecedor, Evento/Agendamento, Procedimento, Categoria, Pacote/Crédito, Orçamento, ContaReceber/Pagar, Movimentação, ContaFinanceira, MetodoPagamento, Comissão, ItemEstoque, ContagemEstoque, ItemAberto, FichaAtendimento, ModeloMensagem, ModeloDocumento, Clinica).
2. **API** — as seções "Endpoints inferidos" dão o contrato REST por recurso.
3. **UI** — cada página tem layout, componentes e campos com textos exatos. Componentes recorrentes (sidebar, header, tabela com filtros, modal parametrizado, seletor de período) devem virar componentes reutilizáveis.
4. **(inferido)** — marca tudo que não estava visível na captura; valide com o sistema real antes de implementar.
