# Clínica Experts — Documentação do Sistema

Documentação de referência gerada a partir de 58 screenshots da aplicação **Clínica Experts** (`app.clinicaexperts.com.br`), um SaaS de gestão de clínicas (saúde/estética) em português do Brasil. Objetivo: servir de base para **recriar o sistema**.

> Observação: nos screenshots aparece um segundo monitor com um site de jogo — esse conteúdo foi ignorado. Apenas a aba `app.clinicaexperts.com.br` foi documentada.

## Specs por página (recomendado para desenvolvimento)

➡️ **[paginas/00-indice-paginas.md](paginas/00-indice-paginas.md)** — 36 specs, uma página por arquivo, com modelo de dados e endpoints inferidos, máximo detalhe para reconstrução.

## Banco de dados (ERD + DDL)

➡️ **[banco-de-dados/00-ERD-e-multitenancy.md](banco-de-dados/00-ERD-e-multitenancy.md)** — modelo consolidado (~40 tabelas), diagramas Mermaid por módulo, estratégia multi-tenant.
➡️ **[banco-de-dados/schema.sql](banco-de-dados/schema.sql)** — DDL PostgreSQL completo, multi-tenant com Row-Level Security.

## Documentos (lotes por ordem de captura)

| Lote | Arquivo | Telas |
|------|---------|-------|
| 1 | [01-telas-01-a-10.md](01-telas-01-a-10.md) | Dashboard, Agenda/Calendário, Sala de espera, Eventos, Modais de evento |
| 2 | [02-telas-11-a-20.md](02-telas-11-a-20.md) | Modais (agendamento, bloqueio, lembrete), Pacientes, Ficha do paciente (Informações, Linha do tempo, Carteira, Pacotes) |
| 3 | [03-telas-21-a-30.md](03-telas-21-a-30.md) | Financeiro do paciente, Orçamentos, Profissionais, Fornecedores, Financeiro (Visão geral, Contas a receber/pagar) |
| 4 | [04-telas-31-a-40.md](04-telas-31-a-40.md) | Extrato, Competência, Fluxo de caixa, Categorias, Contas financeiras, Métodos de pagamento, Comissões, Estoque |
| 5 | [05-telas-41-a-50.md](05-telas-41-a-50.md) | Estoque (giro, contagem, itens), Comunicação (canais, modelos de mensagem), Preferências do sistema |
| 6 | [06-telas-51-a-58.md](06-telas-51-a-58.md) | Configurações: Dados da clínica, Procedimentos, Categorias, Pacotes, Fichas de atendimento, Atestados/Prescrições |

## Mapa de módulos (sidebar / navegação)

- **Início / Dashboard** — `/clinica/inicio` — fluxo de caixa, balanço, agendamentos 24h, KPIs, aniversariantes.
- **Agenda** — `/agenda`, `/calendar/dashboard`, `/calendar/listagem`, `/eventos` — calendário semanal, dashboard de agendamentos, relatório, sala de espera, eventos. Modais: agendamento/consulta, bloqueio de horário, lembrete, promoção.
- **Contatos** — `/clinica/contatos` — Pacientes, Profissionais, Fornecedores. Ficha do paciente com abas: Informações, Linha do tempo, Carteira, Pacotes (créditos), Financeiro, Orçamentos.
- **Financeiro** — `/clinica/financeiro` — Visão geral, Contas a receber, Contas a pagar, Extrato de movimentação, Relatório de competência, Fluxo de caixa (diário/mensal), Relatório de categorias, Contas financeiras, Categorias de contas, Métodos de pagamento, Comissões em aberto.
- **Estoque** — `/estoque` — Itens, Giro, Contagem, Itens abertos. Modais: abrir item, nova contagem.
- **Comunicação** — `/comunicacao` — Canais de atendimento, Modelos de mensagens (mensagens do sistema / automações).
- **Configurações** — `/configuracoes` — Preferências do sistema, Dados da clínica, Procedimentos, Categorias de procedimentos, Pacotes, Fichas de atendimentos, Modelos de atestados e prescrições.

## Stack inferida (visão de produto)

Sistema web multi-tenant para clínicas com 3 grandes pilares:
1. **Operação clínica** — agenda, prontuário/ficha do paciente, fichas de atendimento, atestados/prescrições.
2. **Financeiro** — contas a pagar/receber, fluxo de caixa, comissões, orçamentos, métodos de pagamento.
3. **Gestão** — estoque, comunicação/automação (WhatsApp/e-mail), configurações, cadastros (procedimentos, pacotes, profissionais, fornecedores).

Cada lote acima detalha layout, elementos de UI, textos exatos e funcionalidade inferida tela a tela.
