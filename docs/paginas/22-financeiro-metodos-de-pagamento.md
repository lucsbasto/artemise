# Financeiro / Métodos de Pagamento

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Métodos de pagamento |
| **Rota** | `/financeiro/metodos-de-pagamento` |
| **URL completa** | `app.clinicaexperts.com.br/financeiro/metodos-de-pagamento` |
| **Módulo** | Financeiro |
| **Tipo de página** | Listagem (tabela) + cadastro via modal (inferido) |
| **Breadcrumb** | Financeiro / Métodos de pagamento |
| **Título do card** | Métodos de pagamento |
| **Contador** | 8 registros |
| **Acesso** | Sidebar → ícone Financeiro (cifrão, roxo) |
| **Documento-fonte** | `docs/04-telas-31-a-40.md` (Tela 38) |
| **Imagem de referência** | `Captura de tela 2026-06-22 153517.png` |
| **Idioma** | pt-BR |
| **Data de captura** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153517.png)

---

## 1. Identificação

- **Nome da página:** Métodos de pagamento
- **Rota (path):** `/financeiro/metodos-de-pagamento`
- **URL completa:** `app.clinicaexperts.com.br/financeiro/metodos-de-pagamento`
- **Módulo:** Financeiro
- **Submódulo:** Cadastros financeiros (junto de Contas financeiras e Categorias de contas)
- **Breadcrumb exibido:** `Financeiro / Métodos de pagamento` (segmento "Financeiro" em roxo/link, "Métodos de pagamento" em cinza/atual)
- **Título do card (H1 de conteúdo):** **Métodos de pagamento**
- **Badge de contagem ao lado do título:** **8 registros**
- **SaaS:** Clínica Experts — gestão de clínicas
- **Persona logada na captura:** Lucas Bastos (avatar **LB**)

> Observação: na captura a sidebar/ícones estão recolhidos; o ícone do Financeiro (cifrão) aparece destacado em roxo, indicando módulo ativo. O segundo monitor (jogo) foi ignorado — apenas `app.clinicaexperts.com.br`.

---

## 2. Objetivo

Cadastrar e administrar os **meios de pagamento** que a clínica aceita de seus clientes/pacientes nas vendas, atendimentos e lançamentos financeiros. Cada método representa uma forma pela qual o dinheiro entra (ou é registrado) na operação.

**O que a página resolve / contempla:**

- **Dinheiro:** pagamento em espécie, recebimento imediato, sem taxa. (tipo "Dinheiro")
- **Cartão (crédito/débito):** registra a forma; tipicamente envolve **taxa da operadora/adquirente** (% sobre o valor bruto) e **prazo de recebimento** (D+1, D+30 etc.). _(taxa e prazo são inferidos — ver §7 e §11; não há colunas de taxa/prazo visíveis na tabela atual)_
- **Máquina de cartão:** terminal POS/maquininha — normalizado como Marca/Bandeira "Outro".
- **PIX:** transferência instantânea, recebimento imediato (D+0), normalmente sem taxa ou taxa baixa. _(taxa inferida)_
- **Boleto:** título bancário com prazo de compensação e possível taxa por boleto emitido. _(inferido)_
- **Depósito / Transferência / Depósito bancário:** entradas via banco.
- **Taxas:** percentual descontado do valor bruto para chegar ao **valor líquido** efetivamente creditado. _(modelagem inferida — §13)_
- **Parcelas:** número de parcelas permitidas (típico em cartão de crédito) e como a taxa/prazo se aplicam por parcela. _(inferido — não há coluna de parcelas na captura)_
- **Conta destino:** conta financeira que recebe o valor líquido de cada método. _(inferido — vínculo com Tela 36, Contas financeiras)_

> **Importante (estado real da captura):** a tabela atual exibe **apenas** as colunas `Descrição`, `Tipo`, `Marca/Bandeira`, `Ativo` e `Ações`. As colunas/campos de **taxa %**, **prazo de recebimento**, **parcelas** e **conta destino** **não aparecem** na interface capturada. Eles foram solicitados no escopo e estão documentados como **(inferido)** ao longo desta spec, como modelo-alvo de implementação. O desenvolvedor deve tratá-los como evolução proposta, não como estado atual confirmado.

---

## 3. Navegação

- **Entrada na página:**
  - Sidebar principal → ícone **Financeiro** (cifrão, roxo) → submenu/agrupamento de cadastros financeiros → **Métodos de pagamento**.
  - Acesso direto pela URL `/financeiro/metodos-de-pagamento`.
- **Breadcrumb:** `Financeiro / Métodos de pagamento`. Clique em **Financeiro** retorna ao hub/relatórios do módulo Financeiro. _(inferido)_
- **Páginas irmãs (mesmo submódulo de cadastros financeiros):**
  - `Financeiro / Contas financeiras` — `/financeiro/contas/` (Tela 36)
  - `Financeiro / Categorias de contas` — `/financeiro/categorias-de-contas` (Tela 37)
- **Saídas:**
  - Botão flutuante **"+"** (canto inferior direito) e/ou botão **Novo método** → abre modal de cadastro. _(inferido — ver §5/§10)_
  - Menu de ações **⋮** por linha → Editar / Excluir / (Ativar/Inativar). _(inferido)_
- **Header global (comum a todas as telas):** menu hambúrguer, logo **clínicaexperts**, ícone WhatsApp, ícone de busca, link **Ajuda**, sino de notificações, avatar **LB**.

---

## 4. Layout

Estrutura de cima para baixo, dentro da área de conteúdo (fundo cinza claro, card branco central com cantos arredondados e sombra leve):

1. **Header do app** (topo, fundo branco) — logo à esquerda; à direita WhatsApp, busca, **Ajuda**, sino, avatar **LB** (borda verde).
2. **Breadcrumb** — `Financeiro / Métodos de pagamento`.
3. **Card principal** (centralizado, largura fixa/limitada, não ocupa toda a largura — há grandes margens laterais cinza):
   - **Cabeçalho do card:** título **"Métodos de pagamento"** (esquerda) + badge cinza **"8 registros"**.
   - **Barra de filtros:** link **"+ Adicionar filtro"** (roxo, esquerda) + campo **"Buscar"** (direita, com placeholder).
   - **Tabela** de métodos (colunas: Descrição, Tipo, Marca/Bandeira, Ativo, Ações).
   - **Rodapé/paginação:** seletor **"25 por página"** (esquerda) + controles **«** **‹** **1** **›** **»** (direita).
4. **Botão flutuante "+"** (canto inferior direito, círculo roxo) — ação rápida de adicionar.
5. **Widget de onboarding/promo** (canto inferior direito, sobreposto): faixa laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** + card **"0% · Seu progresso"**. (elemento global, não pertence à página)

**Alinhamento das colunas:** textos à esquerda; toggle **Ativo** centralizado na coluna; coluna **Ações** à direita.

---

## 5. Componentes

| Componente | Texto exato / detalhe | Observação |
|---|---|---|
| Título do card | **Métodos de pagamento** | H1 de conteúdo |
| Badge de contagem | **8 registros** | cinza, à direita do título |
| Link de filtro | **+ Adicionar filtro** | roxo, abre seletor de filtros |
| Campo de busca | placeholder **Buscar** | filtra a lista por texto |
| Toggle de status (por linha) | (sem rótulo textual) | verde = ativo / cinza = inativo |
| Menu de ações (por linha) | ícone **⋮** (três pontos) | esmaecido nas linhas inativas |
| Seletor de paginação | **25 por página** | dropdown |
| Controles de paginação | **«** **‹** **1** **›** **»** | "1" = página atual (roxo) |
| Botão flutuante | **+** | círculo roxo, inferior direito |
| Botão "Novo método" | **+ Adicionar método de pagamento** _(inferido — texto exato não visível na captura; o CTA presente é o "+" flutuante)_ | abre modal de cadastro |

**Badges / indicadores visuais:**

- **Status "Ativo" (toggle verde):** método habilitado para uso em vendas/recebimentos.
- **Status inativo (toggle cinza):** método desabilitado; nesse estado o botão **⋮** aparece **esmaecido/desabilitado** (fundo cinza).
- **Ícone de Marca/Bandeira:** ícone pequeno à esquerda do rótulo na coluna Marca/Bandeira (varia por método: boleto, cartão, depósito, dinheiro, maquininha, PIX, transferência).
- **Setas de ordenação (↕):** presentes nos cabeçalhos **Descrição**, **Tipo**, **Marca/Bandeira** e **Ativo**.

> **(inferido)** Em uma evolução com taxa/parcelas, sugere-se badge de **taxa %** (ex.: `2,99%`) e badge de **prazo** (ex.: `D+30`) por linha.

---

## 6. Tabela / Lista

### 6.1 Colunas atuais (conforme captura)

| # | Coluna | Ordenável | Conteúdo |
|---|---|---|---|
| 1 | **Descrição** | Sim (↕) | Nome do método (texto livre) |
| 2 | **Tipo** | Sim (↕) | Categoria/natureza do método |
| 3 | **Marca/Bandeira** | Sim (↕) | Rótulo + ícone; "Outro" para cartões |
| 4 | **Ativo** | Sim (↕) | Toggle verde (ativo) / cinza (inativo) |
| 5 | **Ações** | Não | Menu **⋮** (esmaecido se inativo) |

### 6.2 Dados de exemplo (8 registros — exatos da captura)

| Descrição | Tipo | Marca/Bandeira | Ativo |
|---|---|---|---|
| Boleto | Boleto | Boleto | Ligado (verde) |
| Cartão de crédito | Cartão de crédito | Outro | Ligado (verde) |
| Cartão de débito | Cartão de débito | Outro | Ligado (verde) |
| Depósito | Depósito | Depósito | Desligado (cinza) |
| Dinheiro | Dinheiro | Dinheiro | Desligado (cinza) |
| Máquina de cartão | Máquina de cartão | Outro | Ligado (verde) |
| PIX | PIX | PIX | Ligado (verde) |
| Transferência | Transferência | Transferência | Desligado (cinza) |

**Observações de dados:**
- Tipo corresponde 1:1 à Descrição nos registros padrão.
- Marca/Bandeira repete a Descrição, exceto para os 3 tipos de cartão (Cartão de crédito, Cartão de débito, Máquina de cartão), normalizados como **"Outro"**.
- Linhas inativas: **Depósito**, **Dinheiro**, **Transferência** → toggle cinza e **⋮** esmaecido.

### 6.3 Colunas propostas (inferido — modelo-alvo com taxa/prazo/parcelas)

| Coluna | Tipo de dado | Formato/exemplo | Origem |
|---|---|---|---|
| **Descrição** | texto | "Cartão de crédito" | atual |
| **Tipo** | enum | "Cartão de crédito" | atual |
| **Taxa (%)** | decimal | `2,99%` | (inferido) |
| **Prazo de recebimento** | inteiro (dias) / enum | `D+1`, `D+30`, `D+0` | (inferido) |
| **Parcelas** | inteiro (máx.) | `12x` | (inferido) |
| **Ativo** | boolean (toggle) | verde/cinza | atual |
| **Ações** | menu | ⋮ Editar / Excluir | atual |

**Ações por linha (⋮) — (inferido):** **Editar**, **Excluir**, e possivelmente **Ativar/Inativar** (também acessível pelo toggle direto). Em linhas inativas o menu aparece desabilitado na captura.

### 6.4 Rodapé / paginação

- Seletor **"25 por página"** (dropdown; opções típicas 10/25/50/100 — inferido).
- Controles: **«** (primeira) · **‹** (anterior) · **1** (página atual, roxo) · **›** (próxima) · **»** (última).
- Com 8 registros e 25 por página → uma única página.

---

## 7. Formulários (Modal de cadastro/edição)

> O modal não aparece na captura; estrutura **(inferida)** a partir do escopo e dos campos coerentes com cartões/taxas/parcelas.

**Modal "Novo método de pagamento" / "Editar método de pagamento"** — campos:

| Campo | Tipo de controle | Obrigatório | Detalhe / opções |
|---|---|---|---|
| **Descrição / Nome** | input texto | Sim | Nome exibido na lista (ex.: "Cartão de crédito") |
| **Tipo** | select | Sim | Dinheiro, PIX, Cartão de crédito, Cartão de débito, Máquina de cartão, Boleto, Depósito, Transferência |
| **Marca/Bandeira** | select | Não | Boleto, Dinheiro, PIX, Depósito, Transferência, **Outro** (cartões) — derivado/relacionado ao Tipo |
| **Taxa (%)** | input numérico (decimal) | Não | % descontado do bruto. Ex.: `2,99`. Default `0` |
| **Prazo de recebimento** | input numérico (dias) ou select D+N | Não | Dias até o crédito. Ex.: `30` (D+30). Default `0` (D+0) |
| **Parcelas (máx.)** | input numérico inteiro | Não | Máximo de parcelas permitidas. Default `1` (à vista) |
| **Conta destino** | select (Contas financeiras) | Não | Conta que recebe o valor líquido (vínculo Tela 36): ex.: "Banco padrão", "Caixa" |
| **Ativo** | toggle | Sim | Default ligado (verde) |

**Botões do modal (inferido):** **Cancelar** (secundário) e **Salvar** (primário, roxo). Validação: Descrição e Tipo obrigatórios; Taxa entre 0 e 100; Prazo ≥ 0; Parcelas ≥ 1.

---

## 8. Filtros

- **+ Adicionar filtro** (link roxo): abre seletor de filtros aplicáveis. Filtros prováveis **(inferido)**:
  - **Tipo** (Dinheiro, Cartão de crédito, Cartão de débito, Máquina de cartão, PIX, Boleto, Depósito, Transferência)
  - **Marca/Bandeira**
  - **Ativo** (Sim/Não)
- **Campo "Buscar":** busca textual por **Descrição** (e possivelmente Tipo/Marca). Filtragem client-side ou server-side via query param. _(inferido)_
- **Ordenação:** clique nos cabeçalhos ordenáveis (Descrição, Tipo, Marca/Bandeira, Ativo) alterna ascendente/descendente.

---

## 9. Estados

| Estado | Descrição |
|---|---|
| **Populado (captura atual)** | 8 registros, paginação em "1", 25 por página |
| **Linha ativa** | toggle verde, **⋮** habilitado |
| **Linha inativa** | toggle cinza, **⋮** esmaecido/desabilitado (Depósito, Dinheiro, Transferência) |
| **Vazio** _(inferido — padrão do sistema)_ | ícone circular ⓘ roxo + texto **"Hmm, está vazio por aqui!"** + subtexto **"Nenhum registro encontrado."** (mesmo padrão das Telas 39 e 40) |
| **Busca sem resultado** _(inferido)_ | mesmo estado vazio, mantendo filtros aplicados |
| **Carregando** _(inferido)_ | skeleton/spinner na área da tabela |
| **Erro de carga** _(inferido)_ | mensagem de erro + ação de tentar novamente |

---

## 10. Modais

**Modal Novo método / Editar método** — campos detalhados em §7. Comportamento:

- **Novo:** disparado pelo botão flutuante **"+"** ou botão **+ Adicionar método de pagamento** (inferido). Abre modal com campos vazios e **Ativo** ligado por padrão.
- **Editar:** disparado por **⋮ → Editar** (linhas ativas). Abre modal pré-preenchido com os dados da linha.
- **Excluir** _(inferido):_ **⋮ → Excluir** → modal de confirmação (ex.: "Deseja realmente excluir este método de pagamento?" com **Cancelar** / **Excluir**). Bloqueio/aviso se o método já possuir lançamentos vinculados (recomenda-se **inativar** em vez de excluir).
- **Ativar/Inativar:** ação imediata pelo toggle da linha (não exige modal); persiste via PATCH.

Campos do modal (resumo): Descrição, Tipo, Marca/Bandeira, Taxa (%), Prazo de recebimento, Parcelas (máx.), Conta destino, Ativo.

---

## 11. Modelo de dados

### 11.1 `MetodoPagamento` (PaymentMethod)

| Campo | Tipo | Obrigatório | Descrição | Status |
|---|---|---|---|---|
| `id` | UUID / string | Sim | Identificador único | inferido |
| `descricao` | string | Sim | Nome exibido (coluna Descrição) | confirmado |
| `tipo` | enum `TipoMetodoPagamento` | Sim | Natureza do método (coluna Tipo) | confirmado |
| `marcaBandeira` | enum `MarcaBandeira` | Não | Marca/bandeira ("Outro" p/ cartões) | confirmado |
| `taxaPercentual` | decimal(5,2) | Não | % descontado do bruto (0–100). Default 0 | inferido |
| `prazoRecebimentoDias` | integer | Não | Dias até o crédito (D+N). Default 0 | inferido |
| `parcelasMax` | integer | Não | Máx. de parcelas. Default 1 | inferido |
| `contaDestinoId` | UUID (FK → ContaFinanceira) | Não | Conta que recebe o líquido | inferido |
| `ativo` | boolean | Sim | Toggle Ativo. Default true | confirmado |
| `clinicaId` / `tenantId` | UUID | Sim | Multi-tenant | inferido |
| `criadoEm` | datetime | Sim | Auditoria | inferido |
| `atualizadoEm` | datetime | Sim | Auditoria | inferido |

### 11.2 Enum `TipoMetodoPagamento`

`DINHEIRO` ("Dinheiro") · `PIX` ("PIX") · `CARTAO_CREDITO` ("Cartão de crédito") · `CARTAO_DEBITO` ("Cartão de débito") · `MAQUINA_CARTAO` ("Máquina de cartão") · `BOLETO` ("Boleto") · `DEPOSITO` ("Depósito") · `TRANSFERENCIA` ("Transferência")

### 11.3 Enum `MarcaBandeira`

`BOLETO` ("Boleto") · `DINHEIRO` ("Dinheiro") · `PIX` ("PIX") · `DEPOSITO` ("Depósito") · `TRANSFERENCIA` ("Transferência") · `OUTRO` ("Outro" — usado por Cartão de crédito, Cartão de débito, Máquina de cartão)

### 11.4 Exemplo JSON _(inferido)_

```json
{
  "id": "b1f2...",
  "descricao": "Cartão de crédito",
  "tipo": "CARTAO_CREDITO",
  "marcaBandeira": "OUTRO",
  "taxaPercentual": 2.99,
  "prazoRecebimentoDias": 30,
  "parcelasMax": 12,
  "contaDestinoId": "banco-padrao-uuid",
  "ativo": true,
  "clinicaId": "clinica-uuid",
  "criadoEm": "2026-06-22T18:35:00Z",
  "atualizadoEm": "2026-06-22T18:35:00Z"
}
```

---

## 12. Endpoints API (inferidos)

> Base inferida: `/api/financeiro/metodos-de-pagamento` (todos exigem autenticação + escopo de tenant/clínica).

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/metodos-de-pagamento` | Lista paginada. Query: `?search=&tipo=&ativo=&page=1&perPage=25&sort=descricao&order=asc` |
| `GET` | `/api/financeiro/metodos-de-pagamento/{id}` | Detalhe de um método |
| `POST` | `/api/financeiro/metodos-de-pagamento` | Cria método (payload = corpo de `MetodoPagamento`) |
| `PUT` / `PATCH` | `/api/financeiro/metodos-de-pagamento/{id}` | Atualiza método (edição via modal) |
| `PATCH` | `/api/financeiro/metodos-de-pagamento/{id}` | Toggle `ativo` (ativar/inativar) |
| `DELETE` | `/api/financeiro/metodos-de-pagamento/{id}` | Exclui (ou bloqueia se houver vínculos) |
| `GET` | `/api/financeiro/contas` | Popula select **Conta destino** (Tela 36) |

**Resposta de listagem (inferida):**

```json
{
  "data": [ /* MetodoPagamento[] */ ],
  "meta": { "total": 8, "page": 1, "perPage": 25, "totalPages": 1 }
}
```

---

## 13. Regras / Cálculos

> Cálculos abaixo são **(inferidos)** como modelo financeiro associado a taxa/prazo. Não há, na captura atual, exibição de valores monetários nesta página.

### 13.1 Valor líquido

```
valorLiquido = valorBruto - (valorBruto * taxaPercentual / 100)
```

Ex.: bruto R$ 1.000,00 com taxa 2,99% → desconto R$ 29,90 → **líquido R$ 970,10**.

- Métodos **sem taxa** (Dinheiro, PIX, Transferência, Depósito): `taxaPercentual = 0` → `líquido = bruto`.
- Sinal: para **despesas**, o líquido segue negativo (coerente com Telas 31/32).

### 13.2 Prazo / data de crédito

```
dataCredito = dataTransacao + prazoRecebimentoDias  (dias corridos, D+N)
```

- **D+0** (PIX, Dinheiro): crédito no mesmo dia.
- **D+1** (cartão de débito, típico): crédito no dia seguinte.
- **D+30** (cartão de crédito, típico): crédito 30 dias após a venda.
- Boleto: crédito após compensação (ex.: D+1/D+2 após pagamento).

### 13.3 Parcelas

- `parcelasMax` define o número máximo de parcelas ofertável na venda.
- À vista quando `parcelasMax = 1`.
- **(inferido)** Em parcelamento, a taxa pode ser aplicada sobre o bruto total e o crédito ocorrer parcela a parcela (D+30, D+60, ...), ou a taxa pode variar por número de parcelas (tabela de taxas) — definir na implementação.

### 13.4 Regras de status

- Toggle **Ativo** controla disponibilidade do método nas telas de venda/recebimento.
- Métodos **inativos** não aparecem como opção em novos lançamentos, mas permanecem no histórico.
- Linha inativa → menu **⋮** desabilitado (comportamento observado na captura).

### 13.5 Integridade

- **(inferido)** Não excluir método com lançamentos vinculados → preferir inativar (soft action). Excluir só quando sem uso.
- `marcaBandeira = OUTRO` é forçado/sugerido automaticamente para tipos de cartão.

---

## 14. Fluxos

**14.1 Listar métodos**
1. Usuário acessa `/financeiro/metodos-de-pagamento`.
2. `GET` lista → renderiza tabela (8 registros), badge "8 registros".
3. Usuário pode buscar, filtrar, ordenar, paginar.

**14.2 Criar método** _(inferido)_
1. Clica em **"+"** (flutuante) / **+ Adicionar método de pagamento**.
2. Preenche modal (Descrição, Tipo, Marca/Bandeira, Taxa, Prazo, Parcelas, Conta destino, Ativo).
3. **Salvar** → `POST` → fecha modal, atualiza lista, incrementa contador.

**14.3 Editar método** _(inferido)_
1. **⋮ → Editar** (linha ativa) → modal pré-preenchido.
2. Ajusta campos → **Salvar** → `PUT/PATCH` → atualiza linha.

**14.4 Ativar/Inativar**
1. Clica no toggle **Ativo** da linha.
2. `PATCH ativo` → toggle muda de cor (verde↔cinza); ao inativar, **⋮** fica esmaecido.

**14.5 Excluir** _(inferido)_
1. **⋮ → Excluir** → modal de confirmação.
2. Confirma → `DELETE` → remove da lista e decrementa contador (ou erro se houver vínculos).

**14.6 Estado vazio** _(inferido)_
- Sem registros → exibe **"Hmm, está vazio por aqui!"** / **"Nenhum registro encontrado."** + CTA de adicionar.

---

## 15. Notas de implementação

- **Estado real vs. proposto:** a UI capturada tem somente **Descrição / Tipo / Marca/Bandeira / Ativo / Ações**. Taxa %, Prazo, Parcelas e Conta destino são **propostas (inferido)** — sinalizar com a equipe antes de implementar como colunas visíveis; podem viver apenas no modal de edição numa primeira fase.
- **Normalização cartão → "Outro":** Cartão de crédito, Cartão de débito e Máquina de cartão usam `marcaBandeira = "Outro"`. Demais métodos repetem a descrição na bandeira.
- **Toggle e menu acoplados:** quando `ativo = false`, desabilitar visualmente o menu **⋮** (padrão observado). Reavaliar UX: pode ser preferível manter "Editar"/"Reativar" sempre acessíveis.
- **Ordenação:** colunas Descrição, Tipo, Marca/Bandeira e Ativo são ordenáveis (setas ↕). Implementar sort server-side via `sort`/`order`.
- **Paginação:** seletor "25 por página"; manter parâmetros `page`/`perPage` na query/URL para deep-link.
- **Multi-tenant:** filtrar sempre por `clinicaId`/`tenantId` do usuário logado.
- **Internacionalização:** todos os textos em pt-BR; valores monetários em `R$` com vírgula decimal e ponto de milhar (`R$ 1.000,00`); taxa exibida como `2,99%`.
- **Vínculo com Contas financeiras (Tela 36):** select de Conta destino deve consumir `/api/financeiro/contas` (ex.: "Banco padrão", "Caixa").
- **Vínculo com lançamentos:** o `tipo`/`método` é referenciado nas telas de extrato e competência (Telas 31–32, coluna "Método" por ícone) — manter consistência de ícones por Marca/Bandeira.
- **Acessibilidade:** toggles e menu **⋮** precisam de `aria-label` (ex.: "Ativar método Boleto"); estado desabilitado deve ser anunciado.
- **Seed padrão:** ao criar uma clínica, pré-popular os 8 métodos observados (Boleto, Cartão de crédito, Cartão de débito, Depósito, Dinheiro, Máquina de cartão, PIX, Transferência), com PIX/cartões/boleto/maquininha ativos e Depósito/Dinheiro/Transferência inativos — espelhando a captura.
- **Elementos globais ignorados na spec:** widget laranja de promoção/onboarding e botões do navegador (Brave) e o segundo monitor (jogo) não fazem parte do app.
