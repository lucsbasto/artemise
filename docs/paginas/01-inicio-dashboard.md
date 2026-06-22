# Início / Dashboard da Clínica

| Rota | Módulo | Tipo |
|------|--------|------|
| `/clinica/inicio` (URL completa: `app.clinicaexperts.com.br/clinica/inicio`) | Clínica (Início / Home) | Página / Dashboard (somente leitura, com filtros) |

![](../../images/Captura%20de%20tela%202026-06-22%20152724.png)
![](../../images/Captura%20de%20tela%202026-06-22%20152743.png)
![](../../images/Captura%20de%20tela%202026-06-22%20152617.png)

---

## 1. Identificação

- **Nome da página:** Início (também referida como "Dashboard da Clínica").
- **Rota exata:** `/clinica/inicio` — URL absoluta `https://app.clinicaexperts.com.br/clinica/inicio`.
- **Título do documento/aba (inferido):** "Início" / "Clínica Experts" (não há título textual de página visível além do breadcrumb).
- **Módulo:** Clínica (primeira tela pós-login; ícone "Casa" na sidebar, destacado em roxo quando ativo).
- **Produto:** Clínica Experts — SaaS de gestão de clínicas (pt-BR).
- **Conta de exemplo:** Lucas Bastos (iniciais "LB"), dados de onboarding com paciente fictício "Clara Ribeiro (Paciente de exemplo)".

---

## 2. Objetivo & contexto

Tela inicial exibida logo após o login. Consolida, em um único painel, a **saúde financeira** (fluxo de caixa realizado vs. previsto, balanço de entradas/saídas), a **agenda imediata** (próximas 24h), **aniversariantes** e um bloco de **relatórios analíticos** (produtividade por profissional, dias/horários mais movimentados, status dos agendamentos, distribuição por sexo e faturamento comparado).

- **Público:** gestor/profissional da clínica.
- **Período padrão (inferido):** intervalo dos últimos ~5 dias terminando "hoje" — no exemplo `18/06/2026 - 22/06/2026` (5 dias, "hoje" = 22/06/2026).
- **Granularidade financeira:** alternável entre Diária / Semanal / Mensal / Anual.
- Todos os widgets reagem ao filtro de **Período** (coluna direita).

---

## 3. Navegação / breadcrumb

- **Breadcrumb:** `Clínica / Início`
  - "Clínica" (link, cor cinza/secundária — inferido: leva à raiz do módulo).
  - separador `/`.
  - "Início" (item atual, cor mais escura/ativa).
- Posicionado no topo da área de conteúdo, logo abaixo do header global.
- A página é acessada pelo **ícone "Casa"** na sidebar (terceiro de cima para baixo).

---

## 4. Layout (árvore de componentes)

```
<AppShell>
├── <HeaderGlobal>  (barra superior, fixa, fundo branco)
│   ├── <BotaoHamburguer>  ☰  (colapsa/expande a sidebar)
│   ├── <Logo>  símbolo roxo ("C"/lente) + wordmark "clínicaexperts"
│   │            ("clínica" peso normal + "experts" negrito)
│   └── <HeaderActions>  (alinhado à direita)
│       ├── <BotaoWhatsApp>  círculo verde (atalho integração WhatsApp)
│       ├── <BotaoBuscaGlobal>  ícone lupa
│       ├── <ItemAjuda>  ícone "?" + texto "Ajuda"
│       ├── <BotaoNotificacoes>  ícone sino (com badge inferido)
│       └── <AvatarUsuario>  círculo roxo "LB"  (menu de conta)
│
├── <Sidebar>  (coluna vertical estreita, somente ícones, com tooltip)
│   ├── (1) ícone Coroa/Estrela        → Planos / Upgrade / Novidades
│   ├── (2) ícone Foguete (com badge)  → Atalhos / Novidades
│   ├── (3) ícone Casa  ★ATIVO★        → Início (/clinica/inicio)
│   ├── (4) ícone Calendário           → Agenda
│   ├── (5) ícone Pessoas (2 bonecos)  → Pacientes / Clientes
│   ├── (6) ícone Estetoscópio         → Profissionais / Atendimento
│   ├── (7) ícone Carrinho             → Vendas / PDV / Comandas
│   ├── (8) ícone Cifrão ($)           → Financeiro
│   ├── (9) ícone Selo/percentual      → Marketing / Fidelidade
│   ├── (10) ícone Caixa/Pacote        → Estoque / Produtos
│   ├── (11) ícone Balão de conversa   → Mensagens / CRM
│   ├── (12) ícone Badge verde         → Integrações / Automação
│   ├── (13) ícone Escudo/Alvo         → Privacidade / Segurança
│   └── (14) ícone Engrenagem          → Configurações (rodapé)
│
├── <ConteudoPrincipal>  (fundo cinza claro, scroll vertical)
│   ├── <Breadcrumb>  "Clínica / Início"
│   │
│   ├── <GridTopo>  (2 colunas: esquerda larga ~62%, direita estreita ~38%)
│   │   ├── COLUNA ESQUERDA
│   │   │   └── <CardFluxoDeCaixa>
│   │   │       ├── título "Fluxo de caixa" + ⓘ
│   │   │       ├── <Tabs> Diária* | Semanal | Mensal | Anual
│   │   │       ├── <GraficoComposto>  (barras empilhadas + 2 linhas)
│   │   │       └── <Legenda>  6 séries
│   │   └── COLUNA DIREITA
│   │       ├── <CardFiltros>     (Período + navegação)
│   │       └── <CardBalanco>     (saldo, entradas, saídas + olho)
│   │
│   ├── <GridMeio>  (2 colunas)
│   │   ├── <CardAgendamentos24h>          (lista de eventos próximos)
│   │   └── <CardProximosAniversariantes>  (estado vazio)
│   │
│   └── <SecaoRelatorios>
│       ├── título "Relatórios" + ⓘ
│       ├── <TabsIcones>  4 ícones (1º ativo)  → trocam agrupamento
│       ├── <GridRelatorios linha1>  (3 cards)
│       │   ├── <CardAgendamentosPorProfissional>  (barra vertical)
│       │   ├── <CardDiasMaisMovimentados>          (barras por dia)
│       │   └── <CardHorariosMaisMovimentados>      (heatmap)
│       └── <GridRelatorios linha2>  (3 cards)
│           ├── <CardStatusPorAgendamento>  (donut verde)
│           ├── <CardPacientesPorSexo>      (donut amarelo)
│           └── <CardFaturamentoComparado>  (barras)
│
├── <WidgetsCantoInferiorEsquerdo>  (fixos, sobre o conteúdo)
│   ├── <BannerDesconto>  laranja: "Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 🙂"
│   └── <CardOnboarding>  "0%" + "Seu progresso" + seta ">"
│
└── <FabsCantoInferiorDireito>  (fixos)
    ├── <Fab "+">  círculo roxo  (criar novo registro)
    └── <FabIA>  círculo gradiente com sparkle  (assistente/IA)
```

---

## 5. Componentes (valores exatos)

### 5.1 Card "Fluxo de caixa"

- **Cabeçalho:** título **"Fluxo de caixa"** + ícone de informação **ⓘ** (tooltip — inferido).
- **Abas (segmented/tabs, canto superior direito):** **"Diária"** (ativa, sublinhado roxo), **"Semanal"**, **"Mensal"**, **"Anual"**. Alternam a granularidade do gráfico.
- **Tipo de gráfico:** combinado — **barras empilhadas (colunas) + 2 linhas** sobrepostas.
- **Eixo Y (valores em R$, de cima para baixo):** `R$ 4k`, `R$ 3k`, `R$ 1k`, `-R$ 40`, `-R$ 2k`, `-R$ 4k`.
  - *(inferido)* escala não-linear/rótulos arredondados; o ponto "0/negativo baixo" é representado como `-R$ 40`.
- **Eixo X (datas, granularidade diária):** `18 Jun`, `19 Jun`, `20 Jun`, `21 Jun`, `22 Jun`.
- **Séries / Legenda (6 itens):**
  1. **Entradas** — verde (barra).
  2. **Entradas previstas** — verde claro (barra).
  3. **Saídas** — vermelho (barra, valores negativos abaixo do eixo).
  4. **Saídas previstas** — vermelho claro (barra).
  5. **Saldo** — linha azul/sólida com marcadores.
  6. **Saldo previsto** — linha tracejada.
- **Leitura visual (inferido a partir das barras):** barras verdes (entradas) acima do zero, barras vermelhas (saídas) abaixo; pico de entrada em **22 Jun** (~R$ 4k+); a linha de saldo sobe ao longo do período terminando alta em 22 Jun.
- **Marcadores em forma de estrela** sobre algumas barras (inferido: indicam ponto realizado/destaque).

### 5.2 Card "Filtros"

- **Título:** **"Filtros"**.
- **Campo "Período":**
  - Rótulo **"Período"**.
  - Seletor de intervalo: **"18/06/2026 - 22/06/2026"**.
  - Botões de navegação **`<`** (período anterior) e **`>`** (próximo período), nas extremidades do campo.
- *(inferido)* clicar no campo abre um **date range picker**.

### 5.3 Card "Balanço"

- **Cabeçalho:** título **"Balanço"** + **ⓘ**; à direita ícone de **olho riscado** (👁 com traço) = ocultar/mostrar valores monetários.
- **Saldo (destaque, verde):** **"R$ 1.831,00"** — legenda abaixo: **"de R$ 781,00 previstos"**.
- **Sub-bloco "Entradas:"**
  - Valor verde: **"R$ 4.370,00"**.
  - Legenda: **"de R$ 6.200,00 previsto"**.
  - Ícone de **link externo** ↗ (inferido: abre detalhamento no Financeiro).
- **Sub-bloco "Saídas:"**
  - Valor vermelho: **"-R$ 2.539,00"**.
  - Legenda: **"de -R$ 5.419,00 previsto"**.
  - Ícone de **link externo** ↗.

### 5.4 Card "Agendamentos das próximas 24h"

- **Título:** **"Agendamentos das próximas 24h"**.
- **Item (faixa lateral roxa):**
  - Nome: **"Clara Ribeiro (Paciente de exemplo)"** (com ponto/bullet roxo).
  - Procedimento: **"Limpeza de Pele Profunda"**.
  - Horário: **"14:00 - 15:00"**.
- *(inferido)* clicar no item abre o **drawer "Detalhes do evento"**.

### 5.5 Card "Próximos aniversariantes"

- **Título:** **"Próximos aniversariantes"**.
- **Estado vazio:**
  - Ícone de **alerta** (triângulo).
  - Mensagem: **"Não há nada aqui!"**.
  - Subtexto: **"Nenhum aniversariante em junho"**.

### 5.6 Seção "Relatórios"

- **Cabeçalho:** título **"Relatórios"** + **ⓘ**.
- **Abas em ícones (4):** linha de 4 ícones; **a primeira ativa** (sublinhado roxo). Inferência dos agrupamentos:
  1. ícone "pessoa" → por **profissional/pessoa** (ativo).
  2. ícone "documento/prancheta" → por **procedimento**.
  3. ícone "relógio" → por **horário**.
  4. ícone "grade" → por **grade/categoria**.
- **Grade:** 3 colunas × 2 linhas de mini-cards.

#### Card "Agendamentos por profissional"
- Título **"Agendamentos por profissional"** + ⓘ.
- **Tipo:** barra única vertical (roxa).
- **Rótulo da barra:** **"LB"** (Lucas Bastos); valor **1** (eixo X mostra "1").

#### Card "Dias mais movimentados"
- Título **"Dias mais movimentados"** + ⓘ.
- **Tipo:** barras verticais por dia da semana.
- **Eixo X:** `D S T Q Q S S` (Dom→Sáb). Valores rotulados: `0 0 S 0 0 S S` *(rótulos parcialmente ambíguos; leitura: maioria 0)*.
- **Eixo Y:** topo **1**, base **0**.
- **Pico:** valor **1** numa **segunda-feira (S)**; demais **0**.

#### Card "Horários mais movimentados"
- Título **"Horários mais movimentados"** + ⓘ.
- **Tipo:** **heatmap** (mapa de calor) — grade horário × dia.
- **Eixo Y (faixas de horário):** `14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h, 22h`.
- **Célula destacada em roxo:** **14h** (única ocupada; demais em cinza claro/vazias).

#### Card "Status por agendamento"
- Título **"Status por agendamento"** + ⓘ.
- **Tipo:** **donut (rosca)** verde.
- **Número central:** **"1"**; label **"Agendamentos"**.
- **Legenda:** **"1 agendamentos no período"**.

#### Card "Pacientes por sexo"
- Título **"Pacientes por sexo"** + ⓘ.
- **Tipo:** **donut (rosca)** amarelo.
- **Número central:** **"1"**; label **"Pacientes"**.
- **Legenda:** **"1 pacientes no período"**.

#### Card "Faturamento comparado"
- Título **"Faturamento comparado"** + ⓘ.
- **Tipo:** barras verticais (roxas).
- **Eixo Y (R$):** `R$ 0`, `R$ 1k`, `R$ 2k`, `R$ 3k`, `R$ 4k`, `R$ 5k`.
- **Eixo X (datas):** `18 Jun`, `19 Jun`, `20 Jun`, `21 Jun`, `22 Jun`.
- **Barra:** uma barra roxa em **18 Jun** (~R$ 3,5k–4k); demais vazias.
- *(inferido)* "comparado" sugere duas séries (período atual vs. anterior); apenas uma visível com os dados de exemplo.

---

## 6. Tabelas

Esta página **não possui tabelas tabulares**. Os únicos elementos em formato de lista são:

- **Lista "Agendamentos das próximas 24h"** — itens em cartão (não-tabela): { bullet, nome do paciente, procedimento, faixa de horário }.
- **Legendas de relatórios** (rótulo + valor) nos donuts e barras.

*(Tabelas tabulares completas aparecem na tela "Relatório de agendamentos" do módulo Agenda — fora do escopo desta página.)*

---

## 7. Formulários / campos

A página é majoritariamente de leitura. Único controle de entrada:

| Campo | Rótulo | Tipo | Obrigatório | Placeholder | Máscara/Formato | Validação (inferida) |
|-------|--------|------|-------------|-------------|------------------|----------------------|
| Período | "Período" | Date range picker (com setas `<` / `>`) | Sim (sempre tem valor padrão) | — | `DD/MM/AAAA - DD/MM/AAAA` | data fim ≥ data início; intervalo válido |

- Controles auxiliares (não-formulário): **toggle de olho** (ocultar valores no Balanço), **abas** (Fluxo de caixa, Relatórios).

---

## 8. Filtros

| Filtro | Localização | Tipo | Opções / Valores |
|--------|-------------|------|------------------|
| **Período** | Card "Filtros" | Date range + setas | Intervalo de datas; ex. `18/06/2026 - 22/06/2026`; `<` período anterior, `>` próximo |
| **Granularidade (Fluxo de caixa)** | Abas do card "Fluxo de caixa" | Tabs | **Diária** (padrão), **Semanal**, **Mensal**, **Anual** |
| **Agrupamento (Relatórios)** | Abas em ícones da seção "Relatórios" | Tabs de ícones | 4 opções (1ª ativa): por profissional, por procedimento, por horário, por grade *(inferido)* |
| **Ocultar valores** | Card "Balanço" | Toggle (ícone olho riscado) | Mostrar / Ocultar valores monetários |

- O filtro **Período** é global para a página: recalcula Fluxo de caixa, Balanço e todos os Relatórios.

---

## 9. Estados

### Carregando (inferido)
- Skeletons/placeholders nos gráficos e cards enquanto os dados do período carregam.

### Vazio (textos exatos observados)
- **Card "Próximos aniversariantes":** ícone de alerta + **"Não há nada aqui!"** / subtexto **"Nenhum aniversariante em junho"**.
- **Relatórios sem dados (inferido):** cards de donut/barras exibem `0` central e legenda `0 ... no período`.
- **Heatmap vazio:** células em cinza claro sem destaque.

### Erro (inferido)
- Mensagem de falha ao carregar indicadores + ação "Tentar novamente" (padrão do produto; não visível nas capturas).

---

## 10. Modais / drawers

Nenhum modal é aberto **a partir desta página** nas capturas. Fluxos inferidos:

- **Date range picker** (popover) ao clicar no campo "Período".
- **Drawer "Detalhes do evento"** ao clicar no item de "Agendamentos das próximas 24h" (mesmo painel lateral usado no módulo Agenda).
- **FAB "+"** abre criação de novo registro (novo agendamento/evento) — modal/drawer do módulo Agenda.
- **FAB IA (sparkle)** abre assistente/IA (inferido).

---

## 11. Modelo de dados inferido

| Entidade | Campos (tipo) | Relações |
|----------|---------------|----------|
| **Clinica** | id (uuid); nome (string); ownerUserId (uuid) | 1—N Agendamentos, Pacientes, Profissionais, Lancamentos |
| **Usuario** | id (uuid); nome (string); iniciais (string, ex. "LB"); email (string); avatarUrl (string?) | N—N Clinica (papel) |
| **Profissional** | id (uuid); clinicaId (uuid); nome (string, "Lucas Bastos"); iniciais (string); avatarUrl (string?) | 1—N Agendamentos |
| **Paciente** | id (uuid); clinicaId (uuid); nome (string, "Clara Ribeiro"); isExemplo (bool); sexo (enum: M/F/Outro?); dataNascimento (date?); whatsapp (string?) | 1—N Agendamentos |
| **Procedimento** | id (uuid); nome (string, "Limpeza de Pele Profunda"); duracaoMin (int, 60); valor (decimal, 200.00) | 1—N ItensAgendamento |
| **Agendamento** | id (uuid); pacienteId (uuid); profissionalId (uuid); procedimentoId (uuid); inicio (datetime, 2026-06-22T14:00); fim (datetime, 15:00); duracaoMin (int, 60); status (enum: agendado/confirmado/nao_compareceu/concluido/cancelado); valor (decimal, 200.00); observacao (string) | N—1 Paciente, Profissional, Procedimento |
| **LancamentoFinanceiro** | id (uuid); clinicaId (uuid); tipo (enum: entrada/saida); valor (decimal); previsto (bool); data (date); origemAgendamentoId (uuid?) | N—1 Clinica; N—1 Agendamento (opcional) |
| **Balanco (agregado/VO)** | saldoRealizado (decimal, 1831.00); saldoPrevisto (decimal, 781.00); entradasRealizadas (decimal, 4370.00); entradasPrevistas (decimal, 6200.00); saidasRealizadas (decimal, -2539.00); saidasPrevistas (decimal, -5419.00); periodoInicio (date); periodoFim (date) | derivado de LancamentoFinanceiro |
| **PontoFluxoCaixa (série)** | data (date); entradas (decimal); entradasPrevistas (decimal); saidas (decimal); saidasPrevistas (decimal); saldo (decimal); saldoPrevisto (decimal) | derivado de LancamentoFinanceiro |
| **Aniversariante** | pacienteId (uuid); nome (string); dataNascimento (date) | N—1 Paciente |
| **RelatorioAgenda (agregados)** | porProfissional[]; porDiaSemana[]; porHorario[] (heatmap); porStatus[]; porSexo[]; faturamentoComparado[] | derivado de Agendamento/Lancamento |

---

## 12. Endpoints de API inferidos

> Todos *(inferidos)*; base `/api`. Parâmetros de período: `inicio`/`fim` em `YYYY-MM-DD`.

```
GET /api/clinica/{clinicaId}/dashboard?inicio=2026-06-18&fim=2026-06-22
  → { balanco, fluxoDeCaixa[], agendamentosProximos24h[], aniversariantes[], relatorios{...} }   (agregado único — provável)

GET /api/clinica/{clinicaId}/fluxo-caixa?inicio=&fim=&granularidade=diaria|semanal|mensal|anual
  → [ { data, entradas, entradasPrevistas, saidas, saidasPrevistas, saldo, saldoPrevisto } ]

GET /api/clinica/{clinicaId}/balanco?inicio=&fim=
  → { saldoRealizado:1831.00, saldoPrevisto:781.00,
      entradasRealizadas:4370.00, entradasPrevistas:6200.00,
      saidasRealizadas:-2539.00, saidasPrevistas:-5419.00 }

GET /api/clinica/{clinicaId}/agendamentos?inicio={agora}&fim={agora+24h}&ordenar=inicio
  → [ { id, paciente:{nome, isExemplo}, procedimento:{nome}, inicio, fim } ]

GET /api/clinica/{clinicaId}/aniversariantes?mes=6
  → []   (vazio → estado "Nenhum aniversariante em junho")

GET /api/clinica/{clinicaId}/relatorios?inicio=&fim=&agrupar=profissional|procedimento|horario|grade
  → { agendamentosPorProfissional:[{label:"LB", total:1}],
      diasMaisMovimentados:[{dia, total}],
      horariosMaisMovimentados:[{hora:"14h", total:1}],
      statusPorAgendamento:[{status, total, percentual}],   // total central = 1
      pacientesPorSexo:[{sexo, total}],                       // total central = 1
      faturamentoComparado:[{data, atual, anterior}] }
```

---

## 13. Regras de negócio / cálculos

Valores do exemplo (período 18/06–22/06):

- **Saldo (realizado)** = Entradas realizadas + Saídas realizadas
  `4.370,00 + (−2.539,00) = R$ 1.831,00` ✓ (bate com o exibido).
- **Saldo previsto** = Entradas previstas + Saídas previstas
  `6.200,00 + (−5.419,00) = R$ 781,00` ✓ (bate com "de R$ 781,00 previstos").
- **Entradas:** soma dos `LancamentoFinanceiro` tipo `entrada` no período → realizado `R$ 4.370,00`, previsto `R$ 6.200,00`.
- **Saídas:** soma dos `LancamentoFinanceiro` tipo `saida` (negativos) → realizado `−R$ 2.539,00`, previsto `−R$ 5.419,00`.
- **Fluxo de caixa (por ponto/dia):** barras = entradas/saídas do dia; linha de **Saldo** = saldo acumulado ou do dia (inferido: acumulado, pela tendência ascendente); **previstos** desenhados como séries paralelas (barra clara / linha tracejada).
- **Granularidade:** Diária = 1 ponto/dia; Semanal = agrega por semana; Mensal = por mês; Anual = por ano (re-agrega os mesmos lançamentos).
- **Status por agendamento (%):** `percentual = total_do_status / total_de_agendamentos_no_período`. Exemplo: 1 "Concluído" / 1 total = 100%.
- **Ocultar valores:** o toggle do olho substitui números monetários por máscara (ex. `••••`) sem refazer chamada (client-side, inferido).
- **Aniversariantes:** filtra `Paciente.dataNascimento.mes == mês(período)`; vazio → estado "Nenhum aniversariante em {mês}".
- **Próximas 24h:** `Agendamento.inicio` entre `agora` e `agora + 24h`.

---

## 14. Fluxos de interação (passo a passo)

**A) Login → Dashboard**
1. Usuário autentica → redirecionado para `/clinica/inicio`.
2. Front carrega período padrão (`hoje−4d … hoje`) e dispara as chamadas de dashboard.
3. Skeletons → dados preenchem Fluxo de caixa, Balanço, Agendamentos 24h, Aniversariantes e Relatórios.

**B) Alterar período**
1. Usuário clica em "Período" (ou nas setas `<` / `>`).
2. Seleciona novo intervalo no date range picker.
3. Front refaz as chamadas (fluxo-caixa, balanço, relatórios, aniversariantes) com o novo `inicio`/`fim`.
4. Todos os widgets atualizam.

**C) Trocar granularidade do Fluxo de caixa**
1. Usuário clica em "Semanal"/"Mensal"/"Anual".
2. Front chama `fluxo-caixa` com `granularidade` correspondente; só o gráfico recarrega.

**D) Ocultar/mostrar valores**
1. Usuário clica no ícone de olho riscado no card "Balanço".
2. Valores monetários são mascarados/revelados (estado local).

**E) Abrir agendamento próximo**
1. Usuário clica no item "Clara Ribeiro (Paciente de exemplo)".
2. Abre o drawer "Detalhes do evento" com ações (Editar, Iniciar atendimento, etc.).

**F) Trocar agrupamento de Relatórios**
1. Usuário clica em outro ícone das abas de "Relatórios".
2. Front chama `relatorios` com `agrupar` correspondente; os 6 cards recalculam.

**G) Onboarding / desconto (widgets fixos)**
1. Banner laranja exibe oferta; card "0% / Seu progresso" abre checklist de configuração ao clicar na seta `>`.

---

## 15. Notas de implementação

- **Componentes reutilizáveis:**
  - `<AppShell>` (Header + Sidebar + área de conteúdo) — compartilhado por todas as telas.
  - `<CardPainel>` genérico (título + ⓘ + slot de conteúdo) — usado em todos os blocos.
  - `<Tabs>` (texto) para Fluxo de caixa; `<TabsIcones>` para Relatórios.
  - `<DateRangePicker>` com setas de navegação — reutilizado em Filtros/Agenda.
  - `<EstadoVazio>` (ícone + "Não há nada aqui!" + subtexto) — reutilizado em vários cards.
  - `<ValorMonetario>` com suporte a máscara/ocultar.
  - `<FabAcao>` ("+") e `<FabIA>` (sparkle) — globais.
  - Banner de desconto e card de progresso — overlays globais fixos.
- **Bibliotecas (inferido):**
  - Gráficos: biblioteca de charting (ex.: Recharts/ECharts/Chart.js) com suporte a **composto (barras + linhas)**, **donut**, **heatmap** e barras simples.
  - Datas: lib tipo `date-fns`/`dayjs` (formato `DD/MM/AAAA`, locale pt-BR).
  - UI: design system próprio em roxo (primária ~roxo, sucesso verde, erro vermelho, alerta amarelo).
- **Formatação monetária:** pt-BR, `R$ #.###,##`; saídas exibidas com sinal negativo (`-R$`).
- **Cores semânticas:** Entradas/saldo positivo = verde; Saídas/negativo = vermelho; séries "previstas" em tom claro; linhas previstas tracejadas; donuts com cor por categoria (verde = status, amarelo = sexo); destaques/roxo = marca.
- **Responsividade (inferido):** grids de 2/3 colunas colapsam para 1 coluna em telas estreitas; sidebar colapsável via hambúrguer.
- **Acessibilidade (inferido):** tooltips ⓘ para explicar cada KPI; toggle de ocultar valores para privacidade em tela.

---

> **Nota sobre a captura `152617.png`:** mostra a mesma página `/clinica/inicio` em resolução reduzida (metade esquerda da tela). O monitor à direita exibe um jogo não relacionado — **ignorado**. Conteúdo idêntico ao das capturas `152724.png` (topo) e `152743.png` (Relatórios).
