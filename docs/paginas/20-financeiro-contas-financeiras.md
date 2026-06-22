# Financeiro / Contas Financeiras

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Contas financeiras |
| **Rota** | `/financeiro/contas/` |
| **URL completa** | `app.clinicaexperts.com.br/financeiro/contas/` |
| **Módulo** | Financeiro |
| **Tela de referência** | Tela 36 (`docs/04-telas-31-a-40.md`) |
| **Imagem** | `../../images/Captura de tela 2026-06-22 153500.png` |
| **Tipo** | Cadastro + dashboard de saldos |
| **Acesso** | Sidebar → Financeiro → Contas financeiras |
| **Idioma** | pt-BR |
| **Data da captura** | 2026-06-22 |
| **Autenticação** | Requerida (sessão de usuário "LB" — Lucas Bastos) |

![](../../images/Captura de tela 2026-06-22 153500.png)

---

## 1. Identificação

- **Nome da página (título do card):** `Contas financeiras` (texto exato, negrito, no topo do card).
- **Breadcrumb:** `Financeiro / Contas financeiras` (segmento "Financeiro" em roxo/clicável; "Contas financeiras" em cinza, atual).
- **Rota:** `/financeiro/contas/` (com barra final).
- **Módulo:** Financeiro (ícone de cifrão/financeiro destacado em roxo na sidebar esquerda).
- **Aba do navegador:** capturada no navegador Brave (ignorar barra/extensões do navegador — não fazem parte do app).
- **Usuário logado:** avatar circular com iniciais `LB`, borda verde, canto superior direito.

---

## 2. Objetivo

Permitir o **cadastro e a visão consolidada das contas financeiras** da clínica — onde o dinheiro é guardado/movimentado. Cada conta representa um "bolso" financeiro de um determinado **tipo**:

- **Caixa** — dinheiro físico / caixa da clínica.
- **Conta Corrente** (banco) — conta bancária.
- **Carteira** — carteira digital / outros (inferido — não visível no print, mas tipo esperado para o domínio).

A página exibe, por conta, o **Saldo Atual**, e ao final um **Saldo total** consolidado (soma de todas as contas). É a base para vincular lançamentos financeiros (receitas/despesas), transferências entre contas e fluxo de caixa.

---

## 3. Navegação

- **Como chegar:** Sidebar esquerda → ícone **Financeiro** (cifrão, roxo) → item **Contas financeiras** (no menu/submenu do Financeiro). (inferido — o submenu de Financeiro não aparece expandido neste print)
- **Breadcrumb:** clicar em `Financeiro` retorna ao índice/dashboard do módulo Financeiro (inferido).
- **Saída:** menu de ações `⋮` por conta → editar/excluir; botão flutuante `+` → criar nova conta.
- **Páginas relacionadas (mesmo módulo):** Extrato de movimentação, Relatório de competência, Fluxo de caixa diário/mensal, Relatório de categorias, Categorias de contas, Métodos de pagamento.

---

## 4. Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Header app: ☰  clínicaexperts        WhatsApp  busca  Ajuda  🔔  LB] │
├──┬───────────────────────────────────────────────────────────────────┤
│S │ Financeiro / Contas financeiras                       (breadcrumb) │
│i │                                                                    │
│d │        ┌──────────────────────────────────────────────────┐       │
│e │        │ Contas financeiras                               │       │
│b │        │                                                  │       │
│a │        │  ┌─────────────────────┐  ┌────────────────────┐ │       │
│r │        │  │ 🏛  Banco padrão  ⋮ │  │ 🧾 Caixa        ⋮ │ │       │
│  │        │  │     Conta Corrente  │  │     Caixa         │ │       │
│  │        │  │  Saldo Atual        │  │  Saldo Atual      │ │       │
│  │        │  │  R$ 2.431,00        │  │  R$ 0,00          │ │       │
│  │        │  └─────────────────────┘  └────────────────────┘ │       │
│  │        │  ┌──────────────────────────────────────────────┐│       │
│  │        │  │  Saldo total                                 ││       │
│  │        │  │  R$ 2.431,00                                 ││       │
│  │        │  └──────────────────────────────────────────────┘│       │
│  │        └──────────────────────────────────────────────────┘       │
│  │                                                            (+)     │
└──┴───────────────────────────────────────────────────────────────────┘
```

- **Fundo da área principal:** cinza claro.
- **Card branco principal** centralizado horizontalmente (não ocupa largura total — alinhado à esquerda/centro-esquerda da área), cantos arredondados, sombra leve.
- **Título** `Contas financeiras` no topo do card.
- **Grade de cards de conta:** 2 colunas lado a lado (responsivo — grid de cards). (inferido: quebra para 1 coluna em telas estreitas)
- **Card de saldo total:** faixa larga abaixo da grade, ocupando a largura dos cards de conta somados.
- **Botão flutuante `+`** roxo, circular, canto inferior direito da viewport.
- **Widget de onboarding** (faixa laranja "Ei, Lucas Bastos! Tô aqui guardando o seu desconto!" + card "0% Seu progresso") sobreposto no canto inferior direito — elemento global, não pertence a esta página.

---

## 5. Componentes

### 5.1 Título
- `Contas financeiras` — título do card (negrito).

### 5.2 Botão "Nova conta"
- **Não há botão textual "Nova conta" visível** no print. A criação é feita pelo **botão flutuante `+`** (FAB roxo, circular, canto inferior direito).
- **Texto exato do botão (inferido):** o FAB não tem rótulo textual (apenas ícone `+`). O rótulo do modal de criação seria `Nova conta` ou `Adicionar conta financeira` (inferido).

### 5.3 Cards de conta (valores EXATOS do print)

| # | Nome | Tipo | Ícone | Rótulo saldo | Saldo Atual (valor exato) | Menu |
|---|---|---|---|---|---|---|
| 1 | `Banco padrão` | `Conta Corrente` | banco/instituição (🏛) | `Saldo Atual` | `R$ 2.431,00` | `⋮` |
| 2 | `Caixa` | `Caixa` | caixa/registradora (🧾) | `Saldo Atual` | `R$ 0,00` | `⋮` |

- Nome da conta em negrito (linha superior); tipo em cinza menor (linha inferior).
- Ícone à esquerda dentro de quadrado arredondado cinza claro.
- Menu `⋮` (três pontos verticais) no canto superior direito de cada card → abre ações (Editar / Excluir — inferido).
- Rótulo `Saldo Atual` em cinza pequeno; valor em negrito escuro abaixo.

### 5.4 Card de saldo total (valores EXATOS)
- Rótulo: `Saldo total` (cinza pequeno).
- Valor: `R$ 2.431,00` (negrito escuro).
- Confere com a soma: `R$ 2.431,00` (Banco padrão) + `R$ 0,00` (Caixa) = `R$ 2.431,00`.

---

## 6. Tabela / Lista

Esta tela **não usa tabela** — usa um **grid de cards** (um card por conta). Caso o produto migre/adicione visão em tabela, ou para descrever a estrutura lógica dos campos exibidos por conta, as colunas equivalentes são:

| Coluna | Conteúdo | Visível no print? |
|---|---|---|
| **Nome** | Nome da conta (ex.: `Banco padrão`, `Caixa`) | Sim |
| **Tipo** | `Conta Corrente`, `Caixa`, `Carteira` (inferido) | Sim |
| **Saldo inicial** | Valor informado na criação | Não (não exibido no card; existe no modelo) |
| **Saldo atual** | `R$ 2.431,00` / `R$ 0,00` (rótulo `Saldo Atual`) | Sim |
| **Ações** | `⋮` → `Editar`, `Excluir` (inferido) | Sim (ícone `⋮`) |

- **Ação Editar (inferido):** abre modal de edição da conta (nome, tipo, saldo inicial).
- **Ação Excluir (inferido):** remove a conta (com confirmação; bloqueada/avisada se houver lançamentos vinculados — inferido).

---

## 7. Formulários

### 7.1 Modal "Nova conta" (inferido — não aberto no print)

Campos do formulário de criação:

| Campo | Label (inferido) | Tipo de input | Obrigatório | Observação |
|---|---|---|---|---|
| Nome | `Nome` | texto | Sim | Identificação livre (ex.: "Banco padrão") |
| Tipo | `Tipo` | select/dropdown | Sim | Opções: `Caixa`, `Conta Corrente`, `Carteira` (Carteira inferido) |
| Saldo inicial | `Saldo inicial` | moeda (R$) | Sim | Valor inicial; default `R$ 0,00`. Define o ponto de partida do saldo atual |

- **Botões do modal (inferido):** `Cancelar` (secundário) e `Salvar` / `Criar conta` (primário roxo).
- **Máscara monetária:** formato pt-BR `R$ 1.234,56` (ponto como separador de milhar, vírgula como decimal).

---

## 8. Filtros

- **Nenhum filtro visível** nesta página. Não há campo de busca, chips de período nem "+ Adicionar filtro" (diferente de outras telas do módulo Financeiro).
- Listagem simples de todas as contas cadastradas.

---

## 9. Estados

### 9.1 Estado populado (atual no print)
- 2 cards de conta (Banco padrão, Caixa) + card de Saldo total.

### 9.2 Estado vazio (inferido)
- Sem contas cadastradas → área central com ícone ⓘ roxo + texto `Hmm, está vazio por aqui!` e subtexto `Nenhum registro encontrado.` + CTA para adicionar conta (padrão observado nas telas 39 e 40 do mesmo sistema).
- O card de `Saldo total` exibiria `R$ 0,00`.

### 9.3 Estado de carregamento (inferido)
- Skeleton dos cards enquanto busca dados.

### 9.4 Estado de erro (inferido)
- Mensagem de falha ao carregar contas, com opção de tentar novamente.

---

## 10. Modais

### 10.1 Modal "Nova conta" (acionado pelo FAB `+`)
Campos: **Nome** (texto), **Tipo** (select: Caixa / Conta Corrente / Carteira), **Saldo inicial** (moeda). Botões: Cancelar / Salvar. (Ver seção 7.)

### 10.2 Modal "Editar conta" (acionado por `⋮` → Editar)
- Mesmos campos do modal de criação, **pré-preenchidos** com os dados da conta.
- **Saldo inicial** editável (recalcula o saldo atual = novo saldo inicial + movimentações). (inferido)
- Botões: `Cancelar` / `Salvar`.

### 10.3 Confirmação de exclusão (acionado por `⋮` → Excluir)
- Diálogo de confirmação: título tipo `Excluir conta?` + texto de aviso + botões `Cancelar` / `Excluir` (vermelho). (inferido)
- Possível bloqueio/aviso se a conta tiver lançamentos ou for a conta padrão. (inferido)

---

## 11. Modelo de dados

### `ContaFinanceira` (inferido)

| Campo | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `id` | UUID / int | Identificador único | `1` |
| `nome` | string | Nome da conta | `"Banco padrão"` |
| `tipo` | enum `TipoConta` | Tipo da conta | `CONTA_CORRENTE` |
| `saldo_inicial` | decimal(12,2) | Saldo informado na criação | `0.00` |
| `saldo_atual` | decimal(12,2) | Calculado: inicial + movimentações | `2431.00` |
| `padrao` | boolean | Se é a conta padrão da clínica | `true` (Banco padrão) |
| `clinica_id` / `tenant_id` | UUID | Multi-tenant (clínica dona) | — |
| `criado_em` | datetime | Data de criação | `2026-06-22` |
| `atualizado_em` | datetime | Última atualização | — |
| `ativo` | boolean | Soft-delete / ativa | `true` |

### Enum `TipoConta`

| Valor (inferido) | Label exibido |
|---|---|
| `CAIXA` | `Caixa` |
| `CONTA_CORRENTE` | `Conta Corrente` |
| `CARTEIRA` | `Carteira` (inferido) |

> Observação: A Tela 32 (Relatório de competência) confirma a existência de lançamentos `Saldo inicial da conta Banco padrão` e `Saldo inicial da conta Caixa` (valor `0,00`), evidenciando que o **saldo inicial gera um lançamento financeiro** vinculado à conta.

---

## 12. Endpoints de API inferidos

| Método | Endpoint (inferido) | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/contas/` | Lista todas as contas com saldo atual |
| `GET` | `/api/financeiro/contas/saldo-total/` | Saldo total consolidado (ou calculado no front a partir da lista) |
| `GET` | `/api/financeiro/contas/{id}/` | Detalhe de uma conta |
| `POST` | `/api/financeiro/contas/` | Cria nova conta (`nome`, `tipo`, `saldo_inicial`) |
| `PUT` / `PATCH` | `/api/financeiro/contas/{id}/` | Edita conta |
| `DELETE` | `/api/financeiro/contas/{id}/` | Exclui conta |

**Payload de criação (inferido):**
```json
{
  "nome": "Banco padrão",
  "tipo": "CONTA_CORRENTE",
  "saldo_inicial": 0.00
}
```

**Resposta de listagem (inferido):**
```json
{
  "results": [
    { "id": 1, "nome": "Banco padrão", "tipo": "CONTA_CORRENTE", "saldo_inicial": 0.00, "saldo_atual": 2431.00, "padrao": true },
    { "id": 2, "nome": "Caixa", "tipo": "CAIXA", "saldo_inicial": 0.00, "saldo_atual": 0.00, "padrao": false }
  ],
  "saldo_total": 2431.00
}
```

---

## 13. Regras de negócio

1. **Saldo atual = saldo inicial + soma das movimentações** (receitas recebidas − despesas pagas + transferências de entrada − transferências de saída) vinculadas à conta.
   - Banco padrão: `0,00` (inicial) + `2.431,00` (movimentações líquidas de junho) = `R$ 2.431,00`. Confere com Tela 34 (lucro/saldo final de junho = `2.431,00`).
   - Caixa: `0,00` (inicial) + `0,00` = `R$ 0,00`.
2. **Saldo total = soma dos saldos atuais de todas as contas** = `2.431,00 + 0,00 = R$ 2.431,00`.
3. **Saldo inicial gera lançamento** com descrição `Saldo inicial da conta {nome}` (confirmado na Tela 32), na competência de criação da conta.
4. **Conta padrão:** existe uma conta marcada como padrão (`Banco padrão`) usada por default em novos lançamentos (inferido pelo nome).
5. **Tipos suportados:** ao menos `Caixa` e `Conta Corrente` (confirmados); `Carteira` esperado (inferido).
6. **Exclusão:** conta com lançamentos vinculados não deve ser excluída livremente (deve haver bloqueio/aviso) e a conta padrão provavelmente não pode ser excluída (inferido).
7. **Formatação monetária:** sempre pt-BR (`R$ #.###,##`), saldos negativos em destaque (vermelho — inferido).

---

## 14. Fluxos

### 14.1 Criar conta
1. Usuário clica no FAB `+`.
2. Abre modal "Nova conta".
3. Preenche `Nome`, seleciona `Tipo`, informa `Saldo inicial`.
4. Clica `Salvar` → `POST /api/financeiro/contas/`.
5. Sistema cria a conta, gera lançamento de saldo inicial e recalcula `Saldo total`.
6. Novo card aparece na grade; toast de sucesso (inferido).

### 14.2 Editar conta
1. `⋮` no card → `Editar`.
2. Modal pré-preenchido → ajusta campos → `Salvar` → `PATCH`.
3. Saldo atual e total recalculados.

### 14.3 Excluir conta
1. `⋮` no card → `Excluir`.
2. Confirmação → `DELETE`.
3. Card removido; `Saldo total` recalculado. Bloqueio se houver vínculos (inferido).

### 14.4 Consultar saldos
1. Usuário acessa `/financeiro/contas/`.
2. `GET` lista contas com saldo atual; front (ou back) calcula `Saldo total`.

---

## 15. Notas de implementação

- **Rota com barra final** (`/financeiro/contas/`) — garantir consistência de roteamento (redirect 301 de `/financeiro/contas` se necessário).
- **Grid responsivo** de cards (2 colunas em desktop → 1 em mobile); card de saldo total ocupa a largura total da linha de cards.
- **Cálculo de saldo:** preferir cálculo no backend (agregação de movimentações) para evitar divergências; expor `saldo_atual` já calculado e `saldo_total` agregado.
- **Multi-tenant:** filtrar contas por clínica/tenant do usuário logado.
- **Ícones por tipo:** mapear `Conta Corrente` → ícone de banco/instituição; `Caixa` → ícone de caixa/registradora; `Carteira` → ícone de carteira (inferido).
- **Conta padrão:** sinalizar visualmente (badge "Padrão" — inferido; não visível no print, mas o nome "Banco padrão" sugere o conceito).
- **Estado vazio:** reutilizar o componente padrão de empty-state do sistema (`Hmm, está vazio por aqui!` / `Nenhum registro encontrado.`).
- **Acessibilidade:** menu `⋮` e FAB `+` devem ter `aria-label` (ex.: "Ações da conta", "Nova conta").
- **Máscara de moeda** no input de saldo inicial (pt-BR), persistindo como decimal.
- **Atualização reativa:** após criar/editar/excluir, atualizar a grade e o `Saldo total` sem reload completo.
- **Itens fora do escopo desta página** (ignorar): barra/extensões do navegador Brave e o segundo monitor com jogo (não pertencem ao app). Widget de onboarding "Seu progresso" e faixa de desconto são globais.
