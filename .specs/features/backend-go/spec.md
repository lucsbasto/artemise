# Backend Go — Specification

> Fase: **Specify** (requisitos e critérios de aceitação). Design e tarefas em arquivos separados.

---

## 1. Visão Geral

O SaaS **Clínica Experts** (gestão de clínicas estéticas) tem um frontend Next.js 100% funcional,
porém alimentado por dados estáticos (`web/src/lib/mock.ts`) e stores de sessão
(`web/src/lib/data/stores.ts`). Toda mutação — criação, edição, exclusão, toggle — persiste
apenas na memória da sessão e some ao recarregar a página.

Este spec define o backend Go que substitui **todo** o mock por dados reais persistidos em
Postgres (via Supabase). O objetivo final é que o frontend funcione identicamente — mesma UI,
mesmos contratos de dados — mas com persistência real, multi-sessão e multi-usuário.

---

## 2. Objetivo

Entregar uma API HTTP que:

1. Persiste e serve todas as entidades hoje mockadas.
2. Calcula KPIs e relatórios a partir dos dados reais (nenhum valor fixo hardcoded).
3. Aplica isolamento multi-clínica via RLS no Postgres.
4. Autentica sessões via cookie `httpOnly` e tabela `sessions`.
5. Vive em `backend/` no mesmo repositório, lado a lado com `web/`.

**Critério de conclusão**: nenhum import de `mock.ts` para dados mutáveis permanece ativo no
frontend; todos os stores (`web/src/lib/data/stores.ts`) consomem a API real.

---

## 3. Atores e Perfis de Acesso

O campo `perfilAcesso` do tipo `Profissional` (mock.ts, linha 230) define três perfis:

| Perfil         | Descrição                                                                 |
|----------------|---------------------------------------------------------------------------|
| `admin`        | Acesso irrestrito: cadastros, financeiro, relatórios, configurações.     |
| `recepção`     | Acesso à agenda, pacientes e orçamentos; sem financeiro nem configurações.|
| `profissional` | Acesso à própria agenda e ficha de atendimento; sem acesso financeiro.   |

Toda rota deve verificar o perfil da sessão ativa e retornar `403` quando insuficiente.

---

## 4. Requisitos Funcionais

### 4.1 Módulo: Auth

**RF-01 — Login**
O sistema deve aceitar `POST /auth/login` com `{ email, senha }`, verificar o hash da senha
(argon2id via `golang.org/x/crypto/argon2`), criar um registro em `sessions` com token UUID e retornar um cookie
`session` `httpOnly`; `Secure` em produção.
_Critério_: login com credenciais válidas retorna `200` e cookie; credenciais inválidas retornam `401`.

**RF-02 — Logout**
`POST /auth/logout` invalida a sessão da tabela `sessions` e limpa o cookie.
_Critério_: após logout, qualquer rota protegida retorna `401`.

**RF-03 — Sessão atual**
`GET /auth/me` retorna os dados do usuário logado (id, nome, email, perfilAcesso, clínicaId)
sem expor o hash da senha.
_Critério_: cookie válido → `200` com perfil; sem cookie → `401`.

**RF-04 — Proteção de rotas**
Todas as rotas fora de `/auth/*` exigem sessão válida. O middleware lê o cookie, busca a sessão
em `sessions` e injeta o `usuarioId` + `clinicaId` no contexto de cada request.
_Critério_: request sem cookie retorna `401`; request com sessão expirada retorna `401`.

**RF-05 — Expiração de sessão**
Sessões expiram após N horas (configurável via variável de ambiente `SESSION_TTL_H`; padrão 24h).
_Critério_: sessão criada há mais de `SESSION_TTL_H` horas retorna `401` em qualquer rota.

**RF-06 — Troca de senha**
`POST /auth/change-password` com `{ senhaAtual, novaSenha }` valida a senha atual antes de
atualizar o hash.
_Critério_: senha atual errada retorna `403`; correta atualiza e retorna `200`.

---

### 4.2 Módulo: Clínicas e Usuários

**RF-07 — CRUD de clínicas**
Endpoints `GET/POST /clinicas` e `GET/PATCH/DELETE /clinicas/:id`.
Uma clínica contém: razão social, nome fantasia, CNPJ, telefone, endereço, ativo.
_Critério_: criar clínica, ler, editar e desativar via toggle. Admin da plataforma apenas (fora
do escopo multi-tenant desta fase — ver RNF-06).

**RF-08 — CRUD de usuários**
Endpoints `GET/POST /usuarios` e `GET/PATCH/DELETE /usuarios/:id`, todos filtrados por
`clinicaId` do token.
Campos: nome, email, perfilAcesso (`admin`/`recepção`/`profissional`), ativo, vinculoProfissionalId (opcional).
_Critério_: admin cria usuário, profissional não consegue (`403`).

**RF-09 — Toggle ativo de usuário**
`PATCH /usuarios/:id` com `{ ativo: bool }`.
_Critério_: toggle reflete imediatamente em `/usuarios`.

---

### 4.3 Módulo: Pacientes

Fonte: tipo `Patient` + `FichaPaciente` de `mock.ts`.

**RF-10 — CRUD de pacientes**
`GET/POST /pacientes` e `GET/PATCH/DELETE /pacientes/:id`.
Campos: nome, tipo, etiquetas, identificador (telefone), sexo, dataNascimento, cpf, email,
endereco, observacoes, recebeNotificacoes, ativo.
_Critério_: criar, ler, editar e excluir paciente; listagem retorna apenas pacientes da
clínica do token (RLS).

**RF-11 — Toggle ativo de paciente**
`PATCH /pacientes/:id` com `{ ativo: bool }`.

**RF-12 — Busca e paginação de pacientes**
`GET /pacientes?q=&ativo=&page=&perPage=` (ver decisão D-01 em RNF-08).
_Critério_: `q=Clara` retorna pacientes cujo nome contém "Clara"; `ativo=false` retorna apenas
inativos.

---

### 4.4 Módulo: Profissionais

Fonte: tipos `Contact` + `Profissional` (incluindo `HorarioTrabalho`, `RegraComissao`,
`Conselho`, `VinculoTrabalho`) de `mock.ts`.

**RF-13 — CRUD de profissional (identificação)**
`GET/POST /profissionais` e `GET/PATCH/DELETE /profissionais/:id`.
Campos: nome, avatarTone, cpf, dataNascimento, telefone, email, ativo.
_Critério_: listar, criar, editar e excluir; somente da clínica do token.

**RF-14 — Perfil rico do profissional**
`GET/PATCH /profissionais/:id/detalhe` gerencia os campos estendidos:
conselho, registro, ufRegistro, especialidade, certificacoes, vinculo, procedimentoIds,
horarios (`HorarioTrabalho[]`), comissoes (`RegraComissao[]`), chavePix, perfilAcesso.
_Critério_: editar horários salva a lista completa; editar comissões salva as regras.

**RF-15 — Toggle ativo de profissional**
`PATCH /profissionais/:id` com `{ ativo: bool }`.

---

### 4.5 Módulo: Fornecedores

Fonte: tipo `Contact` com tipo = "Fornecedor".

**RF-16 — CRUD de fornecedores**
`GET/POST /fornecedores` e `GET/PATCH/DELETE /fornecedores/:id`.
Campos: nome, tipo, etiquetas, identificador, ativo.

**RF-17 — Toggle ativo de fornecedor**
`PATCH /fornecedores/:id` com `{ ativo: bool }`.

---

### 4.6 Módulo: Procedimentos (catálogo)

Fonte: tipo `Procedimento` de `mock.ts` (linha 426).

**RF-18 — CRUD de procedimentos**
`GET/POST /procedimentos` e `GET/PATCH/DELETE /procedimentos/:id`.
Campos: nome, categoria, duracaoMin, valor, ativo, usaMapa (booleano que indica se o
procedimento abre o mapa de injetáveis na ficha do paciente).
_Critério_: procedimento com `categoria = "Injetáveis"` deve ter `usaMapa = true` (validado
server-side como invariante de negócio).

**RF-19 — Toggle ativo de procedimento**
`PATCH /procedimentos/:id` com `{ ativo: bool }`.

---

### 4.7 Módulo: Pacotes

Fonte: tipo `Pacote` de `mock.ts` (linha 531).

**RF-20 — CRUD de pacotes**
`GET/POST /pacotes` e `GET/PATCH/DELETE /pacotes/:id`.
Campos: descricao, valorTotal, validade (texto: "Ilimitado" / "30 dias" etc.), ativo, itens
(array de `{ nome, quantidade, valor, desconto, totalItem }`).

**RF-21 — Cálculo de total do pacote**
O backend calcula e persiste `valorTotal` a partir dos itens: `totalItem = (qtd × valor) −
desconto_unitario`; `valorTotal = Σ totalItem − desconto_global`. O frontend não envia
`valorTotal` calculado; apenas envia os itens e o backend devolve o total computado na resposta.
_Critério_: alterar item via PATCH reflete `valorTotal` atualizado na resposta.

**RF-22 — Toggle ativo de pacote**
`PATCH /pacotes/:id` com `{ ativo: bool }`.

---

### 4.8 Módulo: Fichas de Atendimento e Modelos de Documento

Fonte: tipos `FichaAtendimento` e `ModeloDocumento` de `mock.ts`.

**RF-23 — CRUD de fichas de atendimento**
`GET/POST /fichas-atendimento` e `GET/PATCH/DELETE /fichas-atendimento/:id`.
Campos: nome, ativo.

**RF-24 — Toggle ativo de ficha**

**RF-25 — CRUD de modelos de documento**
`GET/POST /modelos-documento` e `GET/PATCH/DELETE /modelos-documento/:id`.
Campos: nome, tipo, ativo.

**RF-26 — Toggle ativo de modelo**

---

### 4.9 Módulo: Contas Financeiras

Fonte: tipo `ContaFinanceira` de `mock.ts` (linha 1050).

**RF-27 — CRUD de contas financeiras**
`GET/POST /contas-financeiras` e `GET/PATCH/DELETE /contas-financeiras/:id`.
Campos: nome, tipo (`Caixa`/`Conta Corrente`/`Carteira`), saldoInicial, icon.

**RF-28 — Saldo calculado**
O saldo corrente de cada conta é calculado na query: `saldoInicial + Σ entradas liquidadas −
Σ saídas liquidadas` a partir de `lancamentos_financeiros`. O campo `saldo` na resposta nunca
é estático.
_Critério_: criar um lançamento liquidado altera o saldo retornado em `/contas-financeiras`.

---

### 4.10 Módulo: Categorias de Contas

Fonte: tipo `CategoriaConta` (árvore auto-relacional) de `mock.ts` (linha 1067).

**RF-29 — CRUD de categorias de contas**
`GET/POST /categorias-contas` e `GET/PATCH/DELETE /categorias-contas/:id`.
Campos: descricao, ativo, parentId (null = categoria raiz).
_Critério_: `GET /categorias-contas` retorna árvore aninhada
(`[{ id, descricao, ativo, filhos: [...] }]`).

**RF-30 — Toggle ativo de categoria**

---

### 4.11 Módulo: Métodos de Pagamento

Fonte: tipo `MetodoPagamento` de `mock.ts` (linha 1114).

**RF-31 — CRUD de métodos de pagamento**
`GET/POST /metodos-pagamento` e `GET/PATCH/DELETE /metodos-pagamento/:id`.
Campos: descricao, tipo, marca, ativo.

**RF-32 — Toggle ativo de método**

---

### 4.12 Módulo: Ficha do Paciente — Registros de Procedimento

Fonte: tipos `RegistroProcedimento`, `FichaInjetaveis`, `PontoInjetavel`,
`RastreioInjetavel` de `mock.ts` (linhas 507–528).

**RF-33 — CRUD de registros de procedimento**
`GET/POST /pacientes/:id/registros-procedimento` e
`GET/PATCH/DELETE /registros-procedimento/:id`.
Campos: pacienteId, procedimentoId, profissionalId, data, status
(`realizado`/`agendado`/`cancelado`), valor, observacoes.
O campo `usaMapa` é derivado do catálogo `procedimentos.usaMapa` no momento do registro
(não enviado pelo frontend).
_Critério_: listar registros de um paciente retorna apenas os registros desse paciente + clínica.

**RF-34 — Persistência do mapa de injetáveis**
Quando `usaMapa = true`, o registro aceita e persiste o campo `mapa` (JSONB) com a estrutura
`FichaInjetaveis`: `{ pontos: PontoInjetavel[], rastreioPorSub: Record<string, RastreioInjetavel>, relatorio: string }`.
_Critério_: salvar mapa, reler o registro, mapa idêntico ao enviado.

**RF-35 — Linha do tempo do paciente**
`GET /pacientes/:id/timeline` retorna eventos cronológicos derivados de dados reais:
agendamentos concluídos, lançamentos financeiros criados, parcelas liquidadas — tipados como
`{ id, tipo, titulo, quando, valor? }`.
_Critério_: criar agendamento concluído aparece na timeline; criar lançamento também aparece.

**RF-36 — Carteira do paciente**
`GET /pacientes/:id/carteira` retorna `{ saldo, cashback, total }` calculados a partir dos
créditos e consumos do paciente.

---

### 4.13 Módulo: Estoque

Fonte: tipo `ItemEstoque` e funções `estoqueValor`/`estoqueBaixo` de `mock.ts` (linha 599).

**RF-37 — CRUD de itens de estoque**
`GET/POST /estoque` e `GET/PATCH/DELETE /estoque/:id`.
Campos: nome, sku, categoria, unidade, saldo, minimo, custo.
_Critério_: `GET /estoque` retorna também o campo calculado `valor = saldo × custo` e o flag
`estoqueBaixo = saldo <= minimo`.

**RF-38 — Baixa transacional ao registrar procedimento injetável**
Ao criar ou confirmar um `RegistroProcedimento` com `usaMapa = true`, o sistema debita
atomicamente de `itens_estoque` as unidades (campo `unidades`) de cada `PontoInjetavel` do
mapa, agrupadas por `substanciaId`.
_Critério_: registrar procedimento injetável com 2 pontos de substância X (5 ui + 3 ui) reduz
`saldo` da substância X em 8 ui em uma única transação.

**RF-39 — Estorno de baixa ao excluir registro injetável**
`DELETE /registros-procedimento/:id` com `usaMapa = true` estorna as ui debitadas.
_Critério_: excluir o registro restaura o saldo anterior.

**RF-40 — Ajuste de baixa por delta ao editar mapa**
`PATCH /registros-procedimento/:id` com mapa alterado calcula o delta por substância
(`novosUi − anteriorUi`) e aplica `UPDATE estoque SET saldo = saldo + delta`.
_Critério_: editar mapa aumentando 2 ui de substância X aumenta `saldo` em 2 (delta positivo
= estorno parcial); reduzindo 2 ui debita mais 2.

**RF-41 — Indicadores de estoque**
`GET /estoque/summary` retorna `{ baixo: N, alto: N, todos: N }` calculados em tempo real.

---

### 4.14 Módulo: Agenda

Fonte: tipos `WeekEvent`, `AgendaStatus`, `AgendaRow` de `mock.ts`.

**RF-42 — CRUD de eventos da agenda**
`GET/POST /eventos` e `GET/PATCH/DELETE /eventos/:id`.
Campos: tipo (`Agendamento`/`Bloqueio`/`Lembrete`/`Evento`), dayNum (ou data ISO), start,
end, pacienteId, profissionalId, procedimentoId, status (`AgendaStatus`), valor,
observacao, recorrencia.
_Critério_: criar evento, listar na semana, editar status, excluir.

**RF-43 — Filtro de eventos por data e profissional**
`GET /eventos?dataInicio=&dataFim=&profissionalId=&status=&pacienteId=`.
_Critério_: filtrar por semana retorna apenas eventos daquela semana.

**RF-44 — Toggle de status do evento**
`PATCH /eventos/:id` com `{ status: AgendaStatus }`.
_Critério_: status `Concluído` reflete nos relatórios de agenda.

**RF-45 — Próximos eventos (24h)**
`GET /eventos/proximos` retorna eventos com `start` entre agora e agora + 24h, ordenados
cronologicamente.

---

### 4.15 Módulo: Orçamentos

Fonte: tipo `Orcamento` + `itensOrcamento` de `mock.ts` (linhas 583–595).

**RF-46 — CRUD de orçamentos**
`GET/POST /orcamentos` e `GET/PATCH/DELETE /orcamentos/:id`.
Campos: pacienteId, vendedorId, data, itens (array de `{ nome, quantidade, valor, desconto }`),
descontoGlobal, condicaoPagamento.
Vinculação opcional a paciente via `pacienteId`; também listável em `GET /pacientes/:id/orcamentos`.

**RF-47 — Cálculo de totais do orçamento**
O backend calcula e retorna em cada resposta: `subtotal = Σ (qtd × valor)`,
`totalDescontos = Σ descontos_item + descontoGlobal`, `total = subtotal − totalDescontos`.
_Critério_: adicionar item via PATCH reflete `total` atualizado imediatamente.

---

### 4.16 Módulo: Lançamentos Financeiros

Fonte: tipos `FinanceRow`, `ExtratoRow`, `FinanceStatus`, `MetodoPgto` de `mock.ts`.
É a **fonte única de verdade** de todos os relatórios financeiros.

**RF-48 — CRUD de lançamentos financeiros**
`GET/POST /lancamentos` e `GET/PATCH/DELETE /lancamentos/:id`.
Campos: tipo (`receita`/`despesa`), descricao, valor, vencimento (date), liquidacao (date|null),
situacao (`Em aberto`/`Recebido`/`Pago`/`Em atraso`), metodoPagamentoId, categoriaContaId,
pacienteId (nullable), contaFinanceiraId.

**RF-49 — Situação calculada automática**
O campo `situacao` é derivado no endpoint de leitura:
- `liquidacao != null` → `Recebido` (receita) ou `Pago` (despesa).
- `liquidacao == null AND vencimento < hoje` → `Em atraso`.
- Caso contrário → `Em aberto`.
O frontend nunca envia `situacao` diretamente; envia `liquidacao`.
_Critério_: lançamento com `vencimento` ontem e sem liquidação retorna `situacao = "Em atraso"`.

**RF-50 — Liquidação de lançamento**
`PATCH /lancamentos/:id` com `{ liquidacao: "YYYY-MM-DD" }` marca como liquidado e atualiza
o saldo da conta financeira vinculada.
_Critério_: liquidar lançamento de R$ 500 em "Banco padrão" aumenta saldo da conta em R$ 500.

**RF-51 — Filtro de lançamentos**
`GET /lancamentos?tipo=&situacao=&categoriaId=&metodoPagamentoId=&pacienteId=&vencimentoInicio=&vencimentoFim=&liquidacaoInicio=&liquidacaoFim=&page=&perPage=`.

---

### 4.17 Módulo: Relatórios Computados

Todos os endpoints deste módulo são **somente leitura** e calculam seus valores a partir dos
dados reais de `lancamentos_financeiros`, `eventos`, `registros_procedimento` e demais tabelas.
Nenhum valor é snapshot estático.

**RF-52 — Dashboard**
`GET /dashboard?dataInicio=&dataFim=` retorna:
```
{
  balance: { saldoRealizado, saldoPrevisto, entradasRealizadas, entradasPrevistas,
             saidasRealizadas, saidasPrevistas, periodo },
  cashflowDaily: [{ label, entradas, entradasPrevistas, saidas, saidasPrevistas,
                    saldo, saldoPrevisto }],
  next24h: [{ paciente, procedimento, horario }],
  reports: {
    porProfissional, diasMovimentados, horarios, heatAtivo,
    statusAgendamento, pacientesPorSexo, faturamentoComparado
  }
}
```
_Critério_: saldoRealizado = Σ receitas liquidadas − Σ despesas liquidadas no período.

**RF-53 — Agenda — Visão geral**
`GET /agenda/visao-geral?dataInicio=&dataFim=` retorna:
KPIs (total agendamentos, ociosidade %, lista de espera), agendamentosPorPeriodo (contagem
por dia/semana/mês), agendamentosPorStatus (5 status com total e %), rankings (pacientes mais
frequentes, procedimentos mais frequentes, ociosidade por sala, ociosidade por profissional),
diasMovimentados (0=Dom…6=Sáb), horariosMovimentados (heatmap por hora).
_Critério_: 1 agendamento "Concluído" na segunda → `diasMovimentados[1] = 1`.

**RF-54 — Agenda — Relatório de agendamentos**
`GET /agenda/relatorio?dataInicio=&dataFim=&status=&profissionalId=&pacienteId=&page=&perPage=`
retorna rows (`AgendaRow`) + statusTabs (contagem por status + Todos).
_Critério_: filtro `status=Concluído` retorna apenas eventos concluídos.

**RF-55 — Financeiro — Visão geral**
`GET /financeiro/visao-geral?dataInicio=&dataFim=` retorna:
KPIs (receitas, despesas, a receber, a pagar), cashflow do período, contas financeiras com
saldo calculado, breakdowns aReceber e aPagar (inadimplência, para hoje, para este mês, etc.),
categorias por tipo (receita/despesa).
_Critério_: receitas = Σ lançamentos tipo receita liquidados no período.

**RF-56 — Financeiro — Extrato de movimentação**
`GET /financeiro/extrato?dataInicio=&dataFim=&tipo=&situacao=&page=&perPage=` retorna:
KPIs (receitas em aberto, receitas realizadas, despesas em aberto, despesas realizadas, total),
rows de lançamentos com todos os campos de `ExtratoRow`.

**RF-57 — Financeiro — Relatório de competência**
`GET /financeiro/competencia?mes=YYYY-MM` retorna:
KPIs (receitas, despesas, total), rows agrupados por data de competência (vencimento),
com bruto e líquido (despesas negativas).

**RF-58 — Financeiro — Fluxo de caixa diário**
`GET /financeiro/fluxo-diario?mes=YYYY-MM` retorna array de 28–31 pontos com:
`{ label, saldoInicial, entrada, saida, lucro, saldoFinal }`, onde `saldoFinal[N]` é
`saldoInicial` do dia N+1 (encadeamento).
_Critério_: Σ entrada de todos os dias = total receitas liquidadas no mês.

**RF-59 — Financeiro — Fluxo de caixa mensal**
`GET /financeiro/fluxo-mensal?ano=YYYY` retorna 12 pontos mensais, mesmo encadeamento.
_Critério_: `saldoFinal[Mai]` = `saldoInicial[Jun]`.

**RF-60 — Financeiro — Relatório de categorias**
`GET /financeiro/relatorio-categorias?mes=YYYY-MM` retorna:
`{ receitas: CategoriaReportNode[], despesas: CategoriaReportNode[] }` com valor e
percentual calculados por categoria pai + filhos.
_Critério_: soma dos filhos = valor do pai; soma de todas as categorias raiz = total do tipo.

**RF-61 — Financeiro — Contas a receber**
`GET /financeiro/contas-a-receber?dataInicio=&dataFim=&page=&perPage=` retorna:
KPIs (vencidos, vencem hoje, a vencer, a receber, recebidos, total do período) + rows de
lançamentos tipo `receita`.

**RF-62 — Financeiro — Contas a pagar**
`GET /financeiro/contas-a-pagar?dataInicio=&dataFim=&page=&perPage=` retorna:
KPIs análogos às contas a receber + rows de lançamentos tipo `despesa`.

**RF-63 — Financeiro — Comissões**
`GET /financeiro/comissoes?dataInicio=&dataFim=&profissionalId=` calcula comissões a partir
de `registros_procedimento` com `status = "realizado"` cruzados com `RegraComissao[]` do
profissional:
- Se existe regra específica para o `procedimentoId` → aplica essa regra.
- Caso contrário → aplica regra padrão (`procedimentoId = null`).
- Retorna: `{ profissional, referencia, data, base, percentual, valor, status }`.
_Critério_: procedimento de R$ 1.000 com comissão 40% → `valor = 400`.

---

## 5. Requisitos Não-Funcionais

**RNF-01 — Stack travada**
Go com `net/http` stdlib puro e `ServeMux` 1.22+ (route patterns com método e parâmetros
nomeados). Zero framework HTTP externo. Dependências externas permitidas: `pgx/v5` (driver
Postgres), `golang.org/x/crypto` (argon2id), e apenas outras com justificativa documentada no
`backend/go.mod`.

**RNF-02 — Banco de dados**
Postgres via Supabase. Cada tabela tem coluna `clinica_id UUID NOT NULL` referenciando
`clinicas(id)`. RLS habilitada por tabela: políticas restringem SELECT/INSERT/UPDATE/DELETE
ao `clinica_id` da sessão corrente.

**RNF-03 — RLS por request**
O backend NÃO usa a service role key do Supabase nem desabilita RLS. A cada request autenticado,
executa `SET LOCAL app.clinica_id = '<uuid>'` em uma transação, e as políticas RLS usam
`current_setting('app.clinica_id')`. Nenhuma query de dado de clínica escapa dessa convenção.
_Critério_: usuário da clínica A nunca vê registros da clínica B, mesmo chamando `/pacientes/ID-da-B`.

**RNF-04 — JSON camelCase**
Todos os campos JSON de request e response usam camelCase (ex.: `dataNascimento`, não
`data_nascimento`), alinhados com os tipos TypeScript do frontend. O mapeamento de snake_case
do Postgres para camelCase é feito no servidor Go.

**RNF-05 — Migrations versionadas**
Todo schema de banco é controlado por arquivos SQL versionados em `backend/migrations/`
(ex.: `0001_initial_schema.sql`, `0002_add_sessions.sql`). Aplicados manualmente via script
ou ferramenta de migration sem framework.

**RNF-06 — Seed a partir do mock**
`backend/cmd/seed/main.go` popula o banco com os valores exatos do mock atual
(pacientes, profissionais, procedimentos, estoque, etc.) para que o frontend funcione
imediatamente após a integração, com os mesmos dados de exemplo já conhecidos.

**RNF-07 — Localização no repositório**
O diretório `backend/` vive na raiz do repositório, paralelo a `web/`. Estrutura mínima:
```
backend/
  cmd/server/main.go
  cmd/seed/main.go
  internal/
    auth/
    handlers/
    db/
    models/
  migrations/
  go.mod
  go.sum
```

**RNF-08 — Decisão de busca/filtro/paginação (D-01)**
_Decisão registrada_: o backend expõe paginação via `?page=&perPage=` em todos os endpoints
de listagem. Busca textual (`?q=`) e ordenação (`?sortKey=&sortDir=`) são opcionais no MVP
— o frontend pode manter `useListControls` client-side para coleções pequenas (< 1.000
registros por recurso esperado em clínicas estéticas de pequeno porte). Os params `q`,
`sortKey` e `sortDir` são aceitos pelo backend mas podem ser implementados em iteração futura
sem quebrar contrato. Filtros de negócio específicos (por período, status, tipo) são
obrigatórios desde o MVP (ver RF-51, RF-61).

**RNF-09 — Formato de datas e moeda**
Datas trafegam em ISO 8601 (`YYYY-MM-DD`) na API. A formatação para o padrão brasileiro
(`DD/MM/AAAA`, `R$ #.###,##`) permanece responsabilidade do frontend.

**RNF-10 — Erros HTTP padronizados**
Respostas de erro seguem o formato `{ "erro": "<mensagem>" }` com o status HTTP correto
(400 para validação, 401 sem sessão, 403 sem permissão, 404 não encontrado, 409 conflito,
500 erro interno). Nenhum stack trace é exposto em produção.

---

## 6. Fora de Escopo

| Item | Justificativa |
|---|---|
| Gateway de pagamento real (Pix, cartão online) | Operação financeira fora do domínio de gestão |
| Envio real de mensagens (WhatsApp, e-mail, SMS) | Integração de comunicação é feature separada; modelos de mensagem existem no mock mas são catálogo estático |
| Upload e armazenamento de arquivos binários (fotos de pacientes, imagens de fichas) | Requer integração de object storage (ex.: Supabase Storage); fora desta fase |
| Dark mode / temas | Exclusivamente frontend |
| Sincronização em tempo real (WebSocket/SSE) | Polling convencional é suficiente para esta fase |
| Multi-tenância em nível de plataforma (painel super-admin) | Clínicas são geridas individualmente; gestão de plataforma é produto separado |
| Exportação de relatórios (PDF, Excel, CSV) | Frontend possui botões visuais inertes; geração de arquivos é iteração futura |
| Recorrência complexa de eventos de agenda | Criação de série recorrente é simplificada; expansão de ocorrências ilimitadas é iteração futura |
| Autenticação OAuth / SSO | Somente email + senha nesta fase |

---

## 7. Critérios de Aceitação Globais

**CA-01 — Zero mock para dados mutáveis**
Nenhum import de `web/src/lib/mock.ts` para dados mutáveis permanece ativo no frontend após a
integração. Os stores em `web/src/lib/data/stores.ts` consomem a API real. Dados estáticos de
domínio (ex.: lista de conselhos de classe, opções de validade de pacote) podem permanecer
como constantes locais se não forem gerenciados pelo backend.

**CA-02 — RLS impermeável**
Teste automatizado ou manual deve demonstrar que usuário logado na clínica A não consegue
ler, criar, editar ou excluir nenhum recurso da clínica B, independente do ID informado na URL.

**CA-03 — Consistência de saldo de estoque**
Após N registros de procedimentos injetáveis com mapas variados, o saldo de cada item de
estoque deve ser igual ao saldo inicial menos a soma de todas as ui debitadas (considerando
edições e exclusões com delta correto). Verificável com `SELECT saldo FROM itens_estoque`
comparado à soma dos eventos de baixa.

**CA-04 — Relatórios derivados de dados reais**
Qualquer valor retornado pelos endpoints de RF-52 a RF-63 deve ser recalculável a partir das
tabelas brutas (`lancamentos_financeiros`, `eventos`, `registros_procedimento`) com uma query
SQL sem dados auxiliares hardcoded.

**CA-05 — Build e tipo TypeScript limpos**
Após substituição do mock pela API real, `tsc --noEmit` e `eslint` no frontend passam sem
erros. Os contratos JSON da API casam com os tipos TypeScript existentes (nenhum `any`
introduzido pela integração).

---

## 8. Rastreabilidade

| ID    | Requisito                                              | Módulo              | Origem / Spec Relacionado                                       |
|-------|--------------------------------------------------------|---------------------|-----------------------------------------------------------------|
| RF-01 | Login email+senha + cookie httpOnly                   | Auth                | —                                                               |
| RF-02 | Logout                                                 | Auth                | —                                                               |
| RF-03 | GET /auth/me                                           | Auth                | —                                                               |
| RF-04 | Proteção de rotas                                      | Auth                | —                                                               |
| RF-05 | Expiração de sessão                                    | Auth                | —                                                               |
| RF-06 | Troca de senha                                         | Auth                | —                                                               |
| RF-07 | CRUD clínicas                                          | Clínicas/Usuários   | mock.ts (implícito)                                             |
| RF-08 | CRUD usuários com perfilAcesso                         | Clínicas/Usuários   | mock.ts:230 `perfilAcesso`                                      |
| RF-09 | Toggle ativo usuário                                   | Clínicas/Usuários   | —                                                               |
| RF-10 | CRUD pacientes                                         | Pacientes           | mock.ts:112 `Patient`, `FichaPaciente`                          |
| RF-11 | Toggle ativo paciente                                  | Pacientes           | stores.ts `pacientesStore.toggle`                               |
| RF-12 | Busca/paginação pacientes                              | Pacientes           | use-list-controls.ts                                            |
| RF-13 | CRUD profissional (identificação)                      | Profissionais       | mock.ts:163 `Contact` / specs/concorrente/paginas/contatos.md   |
| RF-14 | Perfil rico profissional                               | Profissionais       | mock.ts:206 `Profissional`                                      |
| RF-15 | Toggle ativo profissional                              | Profissionais       | stores.ts `profissionaisStore.toggle`                           |
| RF-16 | CRUD fornecedores                                      | Fornecedores        | mock.ts:266 `fornecedores`                                      |
| RF-17 | Toggle ativo fornecedor                                | Fornecedores        | —                                                               |
| RF-18 | CRUD procedimentos + usaMapa                           | Catálogo            | mock.ts:426 `Procedimento`, specs/cadastros/spec.md CAD-01      |
| RF-19 | Toggle ativo procedimento                              | Catálogo            | stores.ts `procedimentosStore.toggle`                           |
| RF-20 | CRUD pacotes com itens                                 | Catálogo            | mock.ts:531 `Pacote`, specs/cadastros/spec.md CAD-02            |
| RF-21 | Cálculo total pacote server-side                       | Catálogo            | lib/pacote-calc.ts (lógica existente)                           |
| RF-22 | Toggle ativo pacote                                    | Catálogo            | —                                                               |
| RF-23 | CRUD fichas atendimento                                | Configurações       | mock.ts:548 `FichaAtendimento`                                  |
| RF-24 | Toggle ativo ficha                                     | Configurações       | —                                                               |
| RF-25 | CRUD modelos documento                                 | Configurações       | mock.ts:565 `ModeloDocumento`                                   |
| RF-26 | Toggle ativo modelo                                    | Configurações       | —                                                               |
| RF-27 | CRUD contas financeiras                                | Fin. Cadastros      | mock.ts:1050, specs/financeiro-relatorios/spec.md FIN-04        |
| RF-28 | Saldo calculado de conta                               | Fin. Cadastros      | specs/financeiro-relatorios/spec.md FIN-04 AC-3                 |
| RF-29 | CRUD categorias contas (árvore)                        | Fin. Cadastros      | mock.ts:1067, specs/financeiro-relatorios/spec.md FIN-05        |
| RF-30 | Toggle ativo categoria                                 | Fin. Cadastros      | —                                                               |
| RF-31 | CRUD métodos pagamento                                 | Fin. Cadastros      | mock.ts:1114, specs/financeiro-relatorios/spec.md FIN-03        |
| RF-32 | Toggle ativo método                                    | Fin. Cadastros      | —                                                               |
| RF-33 | CRUD registros procedimento                            | Ficha               | mock.ts:507 `RegistroProcedimento`                              |
| RF-34 | Persistência mapa injetáveis (JSONB)                   | Ficha               | mock.ts:469 `FichaInjetaveis`, specs/features/ficha-paciente*   |
| RF-35 | Timeline do paciente                                   | Ficha               | mock.ts:681 `TimelineEvent`                                     |
| RF-36 | Carteira do paciente                                   | Ficha               | mock.ts:703 `carteira`                                          |
| RF-37 | CRUD itens estoque                                     | Estoque             | mock.ts:599, specs/cadastros/spec.md CAD-03                     |
| RF-38 | Baixa transacional injetável                           | Estoque             | mock.ts:474 `PontoInjetavel.unidades`                           |
| RF-39 | Estorno de baixa                                       | Estoque             | —                                                               |
| RF-40 | Ajuste de baixa por delta                              | Estoque             | —                                                               |
| RF-41 | Summary de estoque                                     | Estoque             | mock.ts:624 `estoqueSummary`                                    |
| RF-42 | CRUD eventos agenda                                    | Agenda              | mock.ts:90 `WeekEvent`, specs/agenda-completa/spec.md R-AG-5    |
| RF-43 | Filtro de eventos                                      | Agenda              | specs/agenda-completa/spec.md R-AG-3                            |
| RF-44 | Toggle status evento                                   | Agenda              | specs/agenda-completa/spec.md R-AG-7                            |
| RF-45 | Próximos eventos 24h                                   | Agenda              | mock.ts:41 `next24h`                                            |
| RF-46 | CRUD orçamentos com itens                              | Orçamentos          | mock.ts:583, stores.ts `orcamentosStore`                        |
| RF-47 | Cálculo totais orçamento                               | Orçamentos          | specs/orcamento-modais/spec.md                                  |
| RF-48 | CRUD lançamentos financeiros                           | Financeiro          | mock.ts:278 `FinanceRow`, `ExtratoRow`                          |
| RF-49 | Situação calculada automaticamente                     | Financeiro          | mock.ts:280 `FinanceStatus`                                     |
| RF-50 | Liquidação de lançamento                               | Financeiro          | specs/financeiro-relatorios/spec.md FIN-01 AC-2                 |
| RF-51 | Filtro de lançamentos                                  | Financeiro          | specs/financeiro-relatorios/spec.md FIN-01                      |
| RF-52 | Dashboard computado                                    | Computados          | mock.ts:17–73, specs/concorrente/paginas/inicio.md              |
| RF-53 | Agenda visão geral computada                           | Computados          | mock.ts:749–807, specs/agenda-completa/spec.md R-AG-2           |
| RF-54 | Agenda relatório computado                             | Computados          | mock.ts:821, specs/agenda-completa/spec.md R-AG-3               |
| RF-55 | Financeiro visão geral computada                       | Computados          | mock.ts:389–420, specs/concorrente/paginas/financeiro.png       |
| RF-56 | Extrato de movimentação computado                      | Computados          | mock.ts:890, specs/financeiro-relatorios/spec.md FIN-01         |
| RF-57 | Relatório de competência computado                     | Computados          | mock.ts:935, specs/financeiro-relatorios/spec.md FIN-02         |
| RF-58 | Fluxo de caixa diário computado                        | Computados          | mock.ts:972, specs/financeiro-relatorios/spec.md FIN-07         |
| RF-59 | Fluxo de caixa mensal computado                        | Computados          | mock.ts:997, specs/financeiro-relatorios/spec.md FIN-08         |
| RF-60 | Relatório de categorias computado                      | Computados          | mock.ts:1028, specs/financeiro-relatorios/spec.md FIN-09        |
| RF-61 | Contas a receber computado                             | Computados          | mock.ts:294, specs/financeiro-relatorios/spec.md FIN-01         |
| RF-62 | Contas a pagar computado                               | Computados          | mock.ts:322, specs/financeiro-relatorios/spec.md FIN-01         |
| RF-63 | Comissões computadas                                   | Computados          | mock.ts:1136, specs/financeiro-relatorios/spec.md FIN-06        |

**Formato de ID**: `RF-NN`
**Status**: Pending → In Design → In Tasks → Implementing → Verified
**Cobertura**: 63 requisitos funcionais + 10 RNF + 5 CA
