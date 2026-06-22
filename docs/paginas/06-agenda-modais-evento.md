# Agenda — Modais de Evento

| Metadado | Valor |
|---|---|
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Host** | `app.clinicaexperts.com.br` |
| **Módulo** | Agenda |
| **Componente** | Modal compartilhado de criação/edição de evento + Drawer de detalhes |
| **Idioma** | pt-BR |
| **Rotas-base observadas** | `/eventos`, `/calendar/listagem`, `/calendar/dashboard`, `/calendar/[...]` |
| **Query params de controle** | `event_modal_type` (`consultation` \| `lock` \| `reminder` \| `promotion`), `event_modal_mode` (`new` \| `edit` — inferido), `period`/`interval` (datas), `return` (inferido — URL de retorno) |
| **Tipos de evento** | Agendamento (`consultation`), Bloqueio de horário (`lock`), Lembrete (`reminder`), Evento/Promoção (`promotion`) |
| **Telas-fonte (docs)** | `01-telas-01-a-10.md` (Telas 9, 10) e `02-telas-11-a-20.md` (Telas 11–14) |
| **Capturas-fonte** | 6 PNGs de 2026-06-22 (drawer + 5 estados de modal) |
| **Data do levantamento** | 2026-06-22 |
| **Status** | Spec de desenvolvimento — textos exatos das telas; itens não visíveis marcados **(inferido)** |

---

## Visão geral da arquitetura

O sistema usa **um único modal compartilhado** ("Novo evento") parametrizado pelo query param `event_modal_type`. O seletor de **Tipo** no topo do modal alterna entre quatro formulários (Agendamento / Bloqueio de horário / Lembrete / Evento), reescrevendo `event_modal_type` na URL e reconfigurando os campos exibidos. O **Drawer "Detalhes do evento"** é a visão de leitura/ação de um evento já existente, ancorado à direita.

Mapa tipo de evento ↔ `event_modal_type` ↔ título do modal:

| Tipo (rótulo da aba) | `event_modal_type` | Título do modal | Seções internas |
|---|---|---|---|
| Agendamento | `consultation` | **Novo agendamento** | Dados básicos · Procedimentos/Produtos · Data · Financeiro |
| Bloqueio de horário | `lock` | **Novo bloqueio de horário** | Dados básicos · Data |
| Lembrete | `reminder` | **Novo lembrete** | Dados básicos · Data |
| Evento (promoção) | `promotion` | **Novo evento** | (Tipo) · Dados básicos |

> Observação: o rótulo da aba é **"Evento"**, mas o `event_modal_type` correspondente é `promotion`. Tratar como sinônimos no código (a aba "Evento" = evento promocional/de agenda que pode reservar procedimentos numa data).

Seletor de **Tipo*** (segmented control, presente em todos os modais de criação), na ordem exata:
**Agendamento · Bloqueio de horário · Lembrete · Evento** (a aba ativa fica com fundo roxo e texto branco).

Rodapé comum: botão primário roxo **"Salvar"**.
Cabeçalho comum: título à esquerda + botão **"X"** (fechar) à direita.

---

## Modal — Detalhes do evento (drawer)

![](../../images/Captura%20de%20tela%202026-06-22%20152856.png)

- **Rota observada:** `app.clinicaexperts.com.br/calendar/listagem?interval=2026-06-21&interval=2026-06-27&event_modal_type=consultation&event_modal_mode=...`
- **Tipo de componente:** Drawer lateral deslizante ancorado à direita (~30% da largura), sobre overlay escurecido. Difere dos demais (que são modais centrais).
- **Modo:** visualização/ação de evento existente (leitura). É a porta de entrada para Editar/Duplicar/Excluir.
- **Título:** **"Detalhes do evento"** + botão **"X"** (fechar).

### Corpo — informações (somente leitura)
Linhas no formato `ícone + texto` (valores do exemplo capturado):

| Linha | Conteúdo exato | Observação |
|---|---|---|
| Cabeçalho do evento | **"Agendamento"** | Tipo do evento (badge/cor à esquerda) |
| Data/hora | **"Seg, 22 de jun de 2026 • 14:00 - 15:00"** | Formato `ddd, DD de MMM de YYYY • HH:mm - HH:mm` |
| Profissional | avatar "LB" + **"Lucas Bastos"** | — |
| Paciente | avatar + **"Clara Ribeiro (Paciente de exemplo)"** + ícone **WhatsApp** | ícone WhatsApp dispara conversa (inferido) |
| Status | ícone verde + **"Concluído"** | cor segue o status |
| Procedimento/valor | **"1x Limpeza de Pele Profunda"** — **"R$ 200,00"** | `{qtd}x {procedimento}` + valor à direita |
| Recebimento | ícone cifrão + **"Sem previsão de recebimento"** | estado financeiro |
| Observação | ícone balão + **"Esse agendamento é uma consulta de exemplo."** | texto livre do evento |

### Ações — linha de botões de texto
| Texto exato | Ícone | Ação |
|---|---|---|
| **"Editar"** | lápis | Reabre o modal de edição do evento (`event_modal_mode=edit` — inferido) |
| **"Duplicar"** | cópia | Cria novo evento pré-preenchido a partir deste (inferido) |
| **"Excluir"** | lixeira | Exclui o evento (confirmação esperada — inferido) |

### Botões largura total
| Texto exato | Estilo | Ação (inferida) |
|---|---|---|
| **"Editar consumo de material"** | lilás claro | Abre fluxo de baixa/edição de insumos do atendimento |
| **"Enviar formulário de pré atendimento"** | azul claro, com ícone | Envia formulário pré-atendimento ao paciente (via WhatsApp) |

### Rodapé do drawer — botões primários
| Texto exato | Estilo | Ação (inferida) |
|---|---|---|
| **"Iniciar atendimento"** | roxo | Abre prontuário/atendimento clínico |
| **"Iniciar comanda"** | roxo | Abre comanda/PDV de venda vinculada ao agendamento |

> As ações de rodapé e "Editar consumo de material" são específicas do tipo **Agendamento**; para Bloqueio/Lembrete/Evento o drawer provavelmente expõe apenas Editar/Excluir (inferido).

---

## Modal — Novo agendamento (`event_modal_type=consultation`)

![](../../images/Captura%20de%20tela%202026-06-22%20152914.png)
![](../../images/Captura%20de%20tela%202026-06-22%20152920.png)

- **Rota observada:** `app.clinicaexperts.com.br/eventos?period=2026-05-23&period=2026-06-22&event_modal_type=consultation&event_modal_mode=new`
- **Título:** **"Novo agendamento"** (edição: "Editar agendamento" — inferido) + **"X"**.
- **Tipo de componente:** modal central com rolagem vertical; seções colapsáveis ("Data" e "Financeiro" têm chevron `^`/`▾`).
- **Aba ativa:** **Agendamento**.

### Seção: Dados básicos

| Rótulo exato | Tipo | Obrigatório | Placeholder | Opções visíveis / valor padrão | Dependências / notas |
|---|---|---|---|---|---|
| **Paciente** | autocomplete (combobox c/ busca) | Não* (inferido — obrigatório para gerar comanda) | `Pesquise/Selecione` | — | Link **"+ Adicionar"** à direita do rótulo abre cadastro rápido de paciente. Busca assíncrona (inferido) |
| **Profissional** | select (autocomplete) | Sim (inferido) | — | Padrão: avatar "LB" + **"Lucas Bastos"** (usuário logado) | Lista de profissionais da clínica |
| **Status** | select | Sim (inferido) | — | Padrão **"Agendado"** (com indicador colorido). Opções (inferido, das abas de status da Tela 7): Agendado, Confirmado, Não compareceu, Concluído, Cancelado | Define cor/estado na agenda |
| **Cor** | select (swatch de cor) | Não (inferido) | — | Amostra de cor (swatch) + dropdown | Sobrescreve a cor do evento na agenda |
| **Observações** | text (linha única) | Não | `Digite` | vazio | Texto livre |

### Seção: Procedimentos/Produtos
Tabela editável com colunas **Nome** e **Qtd.** (linha repetível):

| Rótulo/coluna | Tipo | Obrigatório | Placeholder | Padrão | Notas |
|---|---|---|---|---|---|
| **Nome** | autocomplete (combobox) | Não (inferido) | `Pesquise/Selecione` | — | Busca procedimentos e produtos do catálogo |
| **Qtd.** | number | Não | — | `1` | Quantidade (≥ 1 inferido) |
| (remover) | botão ícone lixeira | — | — | — | Remove a linha |

- Link de ação: **"+ Adicionar Procedimentos/Produtos"** — adiciona nova linha.
- Os itens alimentam a comanda/financeiro e definem a **duração** padrão (Fim calculado pela duração do procedimento — inferido).

### Seção: Data (colapsável, expandida por padrão)

| Rótulo exato | Tipo | Obrigatório | Máscara/formato | Valor exemplo | Notas |
|---|---|---|---|---|---|
| **Dia*** | date | Sim | `DD/MM/AAAA` | `22/06/2026` | Ícone de calendário |
| **Início*** | time | Sim | `HH:mm` | `15:29` | Ícone de relógio |
| **Fim*** | time | Sim | `HH:mm` | `15:59` | Ícone de relógio; calculado por duração do procedimento (inferido) |
| **Recorrência*** | select | Sim | — | `Não se repete` | Opções (inferido): Não se repete, Diariamente, Semanalmente, Mensalmente, Anualmente, Personalizado |

- **Banner de aviso (dinâmico, amarelo, borda lateral):** texto exato — *"A notificação de **Lembrete de agendamento (E-mail)** não será enviada pois o tempo de antecedência configurado é maior que o tempo disponível até o agendamento."*
  - Exibido quando o horário do agendamento está mais próximo do que a antecedência configurada do lembrete por e-mail (inferido).

### Seção: Financeiro (colapsável, recolhida por padrão)
- Título **"Financeiro"** à esquerda.
- Controle à direita: **"Comanda desabilitada"** (dropdown/toggle) — alterna entre comanda **desabilitada** e **habilitada**. Quando habilitada, o evento gera lançamento/comanda financeira (inferido). Ao expandir, espera-se exibir forma de pagamento, parcelas, previsão de recebimento (inferido).

### Botões
| Texto exato | Ação |
|---|---|
| **"Salvar"** (roxo) | Persiste o agendamento, fecha o modal, atualiza agenda/listagem |
| **"X"** (cabeçalho) | Cancela/fecha sem salvar |

---

## Modal — Novo bloqueio de horário (`event_modal_type=lock`)

![](../../images/Captura%20de%20tela%202026-06-22%20152929.png)

- **Rota observada:** `app.clinicaexperts.com.br/eventos?period=2026-05-23&period=2026-06-22&event_modal_type=lock&event_modal_mode=new`
- **Título:** **"Novo bloqueio de horário"** + **"X"**.
- **Aba ativa:** **Bloqueio de horário**.
- **Propósito:** marcar indisponibilidade na agenda para um/vários profissionais ou para a clínica inteira. Sem paciente, status, cor, procedimentos ou financeiro.

### Seção: Dados básicos

| Rótulo exato | Tipo | Obrigatório | Placeholder | Valor padrão | Dependências / notas |
|---|---|---|---|---|---|
| **Título*** | text | Sim | — | **"Bloqueio de horário"** (pré-preenchido) | Editável |
| **Profissionais** | multi-select (chips) | Sim, exceto se "Clínica toda" ligado (inferido) | — | chip **"Lucas Bastos ✕"** | Botão **"✕"** (limpar tudo) + dropdown `▾`. Desabilitado quando "Clínica toda" ligado (inferido) |
| **Clínica toda** (toggle, à direita de Profissionais) | toggle | — | — | **desligado** | Quando ligado, aplica o bloqueio a todos os profissionais e ignora a seleção individual |
| **Observações** | textarea | Não | `Digite` | vazio | Texto livre multilinha |

### Seção: Data (expandida)

| Rótulo exato | Tipo | Obrigatório | Formato | Valor exemplo | Notas |
|---|---|---|---|---|---|
| **Dia*** | date | Sim | `DD/MM/AAAA` | `22/06/2026` | Ícone calendário |
| **Início*** | time | Sim (oculto se "Dia inteiro") | `HH:mm` | `15:29` | Ícone relógio |
| **Fim*** | time | Sim (oculto se "Dia inteiro") | `HH:mm` | `15:59` | Ícone relógio |
| **Dia inteiro** (toggle) | toggle | — | — | **desligado** | Quando ligado, oculta/desabilita Início e Fim e bloqueia o dia todo |
| **Recorrência*** | select | Sim | — | `Não se repete` | Mesmas opções de recorrência |

### Botões
| Texto exato | Ação |
|---|---|
| **"Salvar"** (roxo) | Cria o bloqueio e atualiza a agenda |
| **"X"** | Fecha sem salvar |

---

## Modal — Novo lembrete (`event_modal_type=reminder`)

![](../../images/Captura%20de%20tela%202026-06-22%20152935.png)

- **Rota observada:** `app.clinicaexperts.com.br/eventos?period=2026-05-23&period=2026-06-22&event_modal_type=reminder&event_modal_mode=new`
- **Título:** **"Novo lembrete"** + **"X"**.
- **Aba ativa:** **Lembrete**.
- **Propósito:** lembrete interno (não vinculado a paciente) para participantes da clínica; possui apenas um **instante** (Hora), não um intervalo.

### Seção: Dados básicos

| Rótulo exato | Tipo | Obrigatório | Placeholder | Valor padrão | Dependências / notas |
|---|---|---|---|---|---|
| **Título*** | text | Sim | `Lembrete` | vazio | — |
| **Participantes** | multi-select (chips) | Sim (inferido) | — | chip **"Lucas Bastos ✕"** | Botão **"✕"** (limpar) + dropdown `▾`. Define quem visualiza/recebe |
| **Observações** | textarea | Não | `Digite` | vazio | Texto livre |

### Seção: Data (expandida)

| Rótulo exato | Tipo | Obrigatório | Formato | Valor exemplo | Notas |
|---|---|---|---|---|---|
| **Dia*** | date | Sim | `DD/MM/AAAA` | `22/06/2026` | Ícone calendário |
| **Hora*** | time | Sim (oculto se "Dia inteiro") | `HH:mm` | `15:29` | **Apenas um horário**, sem "Fim" |
| **Dia inteiro** (toggle) | toggle | — | — | **desligado** | Quando ligado, oculta/desabilita Hora |
| **Recorrência*** | select | Sim | — | `Não se repete` | Mesmas opções de recorrência |

### Botões
| Texto exato | Ação |
|---|---|
| **"Salvar"** (roxo) | Cria o lembrete |
| **"X"** | Fecha sem salvar |

---

## Modal — Novo evento / promoção (`event_modal_type=promotion`)

![](../../images/Captura%20de%20tela%202026-06-22%20152907.png)

- **Rota observada:** `app.clinicaexperts.com.br/eventos?period=2026-05-23&period=2026-06-22&event_modal_type=promotion&event_modal_mode=new&return...`
- **Título:** **"Novo evento"** + **"X"**.
- **Aba ativa:** **Evento** (a quarta pílula do seletor de Tipo).
- **Propósito:** criar um evento de agenda (promoção/campanha) que reserva profissionais e procedimentos numa janela de datas, com opção de permitir ou não outros agendamentos nesse período.

### Seletor "Tipo*"
Mesmo segmented control: **Agendamento · Bloqueio de horário · Lembrete · Evento** (Evento ativo/roxo).

### Seção: Dados básicos

| Rótulo exato | Tipo | Obrigatório | Placeholder | Valor exemplo | Dependências / notas |
|---|---|---|---|---|---|
| **Título do evento*** | text | Sim | `Digite` | vazio | — |
| **Data de início*** | date | Sim | `DD/MM/AAAA` | `22/06/2026` | Ícone calendário |
| **Hora de início*** | time | Sim | `HH:mm` | `15:29` | Ícone relógio |
| **Data de fim*** | date | Sim | `DD/MM/AAAA` | `22/06/2026` | Ícone calendário |
| **Hora de fim*** | time | Sim | `HH:mm` | `15:59` | Ícone relógio |
| **Profissionais** | multi-select (chips) | Não (inferido) | — | chip **"Lucas Bastos ✕"** | Botão **"✕"** (limpar) + dropdown `▾` |
| **Procedimentos** | autocomplete (combobox) | Não (inferido) | `Pesquise/Selecione` | vazio | Busca no catálogo de procedimentos |
| **Permitir agendamentos de outros procedimentos nesta data** (toggle) | toggle | — | — | **desligado** | Quando desligado, o intervalo do evento bloqueia a marcação de outros procedimentos; quando ligado, permite |

> Diferença em relação aos demais: este formulário usa **Data de início/Data de fim** separadas (intervalo multi-dia possível), e **não** tem campo de Recorrência nesta captura.

### Botões
| Texto exato | Ação |
|---|---|
| **"Salvar"** (roxo) | Cria o evento/promoção |
| **"X"** | Fecha sem salvar |

---

## Modelo de dados inferido por tipo de evento

Modelo polimórfico — entidade base `Event` + campos específicos por `type`. **(todos os campos abaixo são inferidos a partir das telas)**

### Campos comuns (entidade base `Event`)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid/int | — |
| `type` | enum | `consultation` \| `lock` \| `reminder` \| `promotion` |
| `clinic_id` | fk | tenant |
| `recurrence` | enum/objeto | `none` por padrão ("Não se repete") |
| `created_at` / `updated_at` | datetime | — |

### `consultation` (Agendamento)
| Campo | Tipo | Origem (rótulo) |
|---|---|---|
| `patient_id` | fk | Paciente |
| `professional_id` | fk | Profissional |
| `status` | enum | Status (Agendado/Confirmado/Não compareceu/Concluído/Cancelado) |
| `color` | string | Cor |
| `notes` | text | Observações |
| `items[]` | array `{procedure_or_product_id, qty}` | Procedimentos/Produtos (Nome, Qtd.) |
| `day` | date | Dia |
| `start_time` / `end_time` | time | Início / Fim |
| `recurrence` | enum | Recorrência |
| `billing_enabled` | bool | Financeiro — "Comanda habilitada/desabilitada" |
| `expected_receipt` | enum/date | "Sem previsão de recebimento" |

### `lock` (Bloqueio de horário)
| Campo | Tipo | Origem |
|---|---|---|
| `title` | string | Título (default "Bloqueio de horário") |
| `professional_ids[]` | array fk | Profissionais |
| `whole_clinic` | bool | Clínica toda |
| `notes` | text | Observações |
| `day` | date | Dia |
| `start_time` / `end_time` | time | Início / Fim (nulos se `all_day`) |
| `all_day` | bool | Dia inteiro |
| `recurrence` | enum | Recorrência |

### `reminder` (Lembrete)
| Campo | Tipo | Origem |
|---|---|---|
| `title` | string | Título |
| `participant_ids[]` | array fk | Participantes |
| `notes` | text | Observações |
| `day` | date | Dia |
| `time` | time | Hora (instante único; nulo se `all_day`) |
| `all_day` | bool | Dia inteiro |
| `recurrence` | enum | Recorrência |

### `promotion` (Evento)
| Campo | Tipo | Origem |
|---|---|---|
| `title` | string | Título do evento |
| `start_date` / `end_date` | date | Data de início / Data de fim |
| `start_time` / `end_time` | time | Hora de início / Hora de fim |
| `professional_ids[]` | array fk | Profissionais |
| `procedure_ids[]` | array fk | Procedimentos |
| `allow_other_procedures` | bool | "Permitir agendamentos de outros procedimentos nesta data" |

---

## Endpoints API inferidos

> Não visíveis nas telas — derivados das rotas e do comportamento. Rotas REST plausíveis.

| Operação | Método + rota (inferido) | Corpo / params | Notas |
|---|---|---|---|
| Listar eventos | `GET /api/events?period_start=&period_end=&type=` | filtros de período/tipo | alimenta `/eventos` e calendário |
| Detalhe do evento | `GET /api/events/{id}` | — | alimenta o drawer "Detalhes do evento" |
| Criar evento | `POST /api/events` | `{ type, ...campos do tipo }` | `event_modal_mode=new`; payload varia por `type` |
| Editar evento | `PUT/PATCH /api/events/{id}` | payload do tipo | `event_modal_mode=edit` |
| Excluir evento | `DELETE /api/events/{id}` | — | ação "Excluir"; recorrentes podem pedir escopo (esta/todas) |
| Duplicar evento | `POST /api/events/{id}/duplicate` | — | ação "Duplicar" |
| Buscar pacientes | `GET /api/patients?q=` | termo | autocomplete Paciente |
| Buscar profissionais | `GET /api/professionals?q=` | termo | selects Profissional/Profissionais/Participantes |
| Buscar procedimentos/produtos | `GET /api/catalog?q=` | termo | combobox Procedimentos/Produtos |
| Verificar conflito | `GET /api/events/conflicts?professional_id=&day=&start=&end=` | janela | validação de conflito de horário (inferido) |
| Iniciar atendimento | `POST /api/events/{id}/start-care` | — | botão "Iniciar atendimento" |
| Iniciar comanda | `POST /api/events/{id}/order` (ou PDV) | — | botão "Iniciar comanda" |
| Enviar pré-atendimento | `POST /api/events/{id}/pre-care-form` | — | botão "Enviar formulário de pré atendimento" |

Auth/tenant: header de autenticação + `clinic_id` do contexto (inferido).

---

## Regras de negócio

### Recorrência
- Campo `Recorrência*` presente em Agendamento, Bloqueio e Lembrete; padrão **"Não se repete"**.
- Quando ≠ "Não se repete", abre opções de frequência (Diária/Semanal/Mensal/Anual/Personalizado — inferido) e gera série de ocorrências.
- Editar/Excluir um evento recorrente deve oferecer escopo "somente esta ocorrência" vs. "toda a série" (inferido).
- O modal **Evento/promoção** usa intervalo `Data de início`→`Data de fim` (multi-dia) em vez de recorrência.

### Conflito de horário
- Agendamentos e bloqueios do mesmo profissional não devem sobrepor (inferido) — validar `start/end` × eventos existentes.
- **Bloqueio de horário** com "Clínica toda" ou "Dia inteiro" reserva toda a janela; agendamentos nessa janela devem ser barrados (inferido).
- **Evento/promoção** com toggle "Permitir agendamentos de outros procedimentos nesta data" **desligado** bloqueia a marcação de outros procedimentos no intervalo; **ligado** permite coexistência.

### Vínculo financeiro
- Apenas **Agendamento** tem seção **Financeiro**. "Comanda desabilitada" → sem lançamento; "Comanda habilitada" → gera comanda/título financeiro a partir dos itens de Procedimentos/Produtos.
- Valor do agendamento = soma de `qty × preço` dos itens (ex.: "1x Limpeza de Pele Profunda — R$ 200,00").
- "Iniciar comanda" no drawer abre o fluxo de venda/PDV; estado de recebimento exibido como "Sem previsão de recebimento" enquanto não baixado.

### Lembrete por e-mail (banner dinâmico — Agendamento)
- Se a antecedência configurada do "Lembrete de agendamento (E-mail)" for maior que o tempo restante até o início, o sistema exibe o banner amarelo e **não envia** a notificação.

---

## Fluxos passo a passo

### Criar agendamento
1. Usuário clica em **"+ Novo evento"** (página Eventos) ou no FAB **"+"**, ou em horário vazio do calendário.
2. Abre o modal compartilhado; `event_modal_type=consultation`, `event_modal_mode=new`.
3. Seleciona aba **Agendamento** (default ao vir do calendário — inferido).
4. Preenche **Paciente** (autocomplete; ou "+ Adicionar" para cadastrar), confirma **Profissional**, ajusta **Status/Cor**, **Observações**.
5. Adiciona itens em **Procedimentos/Produtos** (Nome + Qtd.; "+ Adicionar" para mais linhas).
6. Em **Data**, define **Dia/Início/Fim** e **Recorrência**; observa eventual banner de lembrete.
7. Opcional: expande **Financeiro** e habilita comanda.
8. Clica **"Salvar"** → valida obrigatórios e conflito → persiste → fecha modal → atualiza agenda/listagem.

### Criar bloqueio de horário
1. Abrir modal e selecionar aba **Bloqueio de horário** (`event_modal_type=lock`).
2. Ajustar **Título**, selecionar **Profissionais** (ou ligar **Clínica toda**), **Observações**.
3. Definir **Dia/Início/Fim** (ou ligar **Dia inteiro**) e **Recorrência**.
4. **"Salvar"** → cria indisponibilidade na agenda.

### Criar lembrete
1. Abrir modal, aba **Lembrete** (`event_modal_type=reminder`).
2. Preencher **Título**, **Participantes**, **Observações**.
3. Definir **Dia/Hora** (ou **Dia inteiro**) e **Recorrência**.
4. **"Salvar"**.

### Criar evento/promoção
1. Abrir modal, aba **Evento** (`event_modal_type=promotion`).
2. Preencher **Título do evento**, intervalo **Data/Hora de início** e **Data/Hora de fim**.
3. Selecionar **Profissionais** e **Procedimentos**; decidir o toggle "Permitir agendamentos de outros procedimentos nesta data".
4. **"Salvar"**.

### Ver/editar/excluir evento existente (drawer)
1. Clicar num evento (calendário/listagem) → abre **Drawer "Detalhes do evento"**.
2. Ler infos; usar **Editar** (reabre modal em modo edição), **Duplicar** ou **Excluir**.
3. Para agendamentos: **Iniciar atendimento**, **Iniciar comanda**, **Editar consumo de material**, **Enviar formulário de pré atendimento**.

---

## Validações inferidas

- Campos com **`*`** são obrigatórios: **Tipo** (sempre); por tipo — Agendamento: Dia, Início, Fim, Recorrência (+ Paciente/Profissional para gerar comanda); Bloqueio: Título, Dia, Início/Fim (salvo Dia inteiro), Recorrência; Lembrete: Título, Dia, Hora (salvo Dia inteiro), Recorrência; Evento: Título do evento, Data/Hora de início, Data/Hora de fim.
- **Fim ≥ Início** (mesma janela); **Data de fim ≥ Data de início** no Evento.
- **Qtd. ≥ 1** em Procedimentos/Produtos.
- **Bloqueio/Lembrete:** ao ligar "Dia inteiro", campos de hora viram opcionais/ocultos.
- **Bloqueio:** ao ligar "Clínica toda", a seleção de Profissionais deixa de ser exigida.
- **Conflito de horário** do profissional bloqueia o salvamento (ou exige confirmação).
- Datas/horas com máscara `DD/MM/AAAA` e `HH:mm`.

---

## Notas de implementação

- **Modal único parametrizado por tipo:** um componente que lê `event_modal_type` da URL e renderiza o schema de campos do tipo. Trocar a aba de Tipo deve sincronizar `event_modal_type` na query string (deep-link/refresh preservam o estado).
- **`event_modal_mode`** controla `new` vs `edit` (inferido); o título muda ("Novo …" vs "Editar …").
- **Mapeamento de rótulos:** aba **"Evento"** ↔ `promotion`; "Agendamento" ↔ `consultation`; demais 1:1.
- **Seções colapsáveis** ("Data", "Financeiro") com chevron persistem estado aberto/fechado; "Data" abre por padrão, "Financeiro" recolhido.
- **Componentes reutilizados:** segmented control de Tipo, multi-select em chips (Profissionais/Participantes), autocomplete (Paciente/Procedimentos), date/time pickers com ícones, toggles (Clínica toda / Dia inteiro / Permitir outros procedimentos), banner de aviso dinâmico.
- **Persistência de query params:** `period`/`interval` e `return` devem ser preservados ao abrir/fechar o modal para retornar à listagem/calendário correto.
- **Drawer vs modal:** "Detalhes do evento" é drawer lateral (leitura/ação); criação/edição é modal central. Manter componentes separados, mas compartilhar o serviço de dados do evento.
- **Banner de lembrete por e-mail:** lógica client/server que compara antecedência configurada × tempo até o evento e suprime a notificação quando insuficiente.
