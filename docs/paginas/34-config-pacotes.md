# Configurações / Pacotes

| Metadado | Valor |
|---|---|
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Host** | app.clinicaexperts.com.br |
| **Rota da página** | `/configuracoes/pacotes` |
| **Rota do modal (novo)** | `/configuracoes/pacotes?order_modal_type=combo&order_modal_mode=new` |
| **Módulo** | Configurações |
| **Breadcrumb** | `Configurações / Pacotes` |
| **Idioma** | pt-BR |
| **Moeda** | BRL (R$) |
| **Componente principal** | Listagem de pacotes + Modal "Novo pacote" |
| **Entidades** | `Pacote` (Combo), `ItemPacote` (ItemCombo) |
| **Telas de referência** | Telas 55 e 56 de `docs/06-telas-51-a-58.md` |
| **Capturas** | `Captura de tela 2026-06-22 153937.png` (Desconto recolhido), `Captura de tela 2026-06-22 153945.png` (Desconto expandido) |
| **Última atualização** | 2026-06-22 |

---

## 1. Visão geral e propósito

A página **Configurações / Pacotes** permite cadastrar e gerenciar **pacotes** (internamente referenciados como `combo`, conforme o parâmetro de URL `order_modal_type=combo`). Um pacote agrupa um ou mais **procedimentos e/ou produtos** em uma oferta única, com quantidades, valores unitários, descontos por item e um desconto global, resultando em um **Valor total** consolidado para venda conjunta.

Casos de uso típicos (inferido):

- Vender um "combo" de sessões de um mesmo procedimento (ex.: 10 sessões de Limpeza de Pele) com desconto.
- Montar um pacote multi-serviço (ex.: Microagulhamento + Peeling + produto de skincare).
- Definir validade (prazo de uso) e status ativo/inativo do pacote.

O cadastro/edição é feito por meio do **modal "Novo pacote"**, sobreposto à listagem. O modal é controlado por query string (`order_modal_type=combo&order_modal_mode=new`), o que indica que a abertura/estado do modal é roteável (deep-link) — `mode=new` para criação e, por inferência, `mode=edit` (ou similar) para edição. **(inferido)**

---

## 2. Layout geral

- **Chrome padrão do app** (header superior, sidebar de ícones com **engrenagem/Configurações** ativa em roxo, widgets fixos no canto inferior direito — balão de gamificação "Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😅", FAB roxo "+", card "Seu progresso 0%"). Esses elementos são comuns a todas as telas do módulo e estão descritos em `docs/06-telas-51-a-58.md` (seção "Elementos comuns a todas as telas").
- **Breadcrumb:** `Configurações / Pacotes` ("Configurações" é link roxo clicável).
- **Área principal:** card branco "Pacotes" centralizado (a listagem), atenuado por overlay escuro quando o modal está aberto.
- **Modal "Novo pacote":** card branco centralizado, com cabeçalho, corpo em seções e rodapé com botão de ação.

![](../../images/Captura de tela 2026-06-22 153937.png)

---

## 3. Página de listagem — "Pacotes"

> Observação: nas duas capturas a listagem aparece ao fundo, parcialmente coberta pelo modal. As colunas da tabela são **inferidas** a partir do padrão das demais telas de listagem do módulo (Procedimentos, Categorias, Fichas) e do modelo de dados do pacote.

### 3.1. Cabeçalho do card

- Título **"Pacotes"** (texto exato visível no topo do card ao fundo).
- À direita (inferido, por consistência com Telas 52/54): botão **"Exportar"** com seta dropdown (▾) e, possivelmente, **"Ações em lote"** (▾). **(inferido)**

### 3.2. Barra de filtros

- Link/botão **"+ Adicionar filtro"** (roxo, à esquerda) — texto exato visível ao fundo.
- Campo de busca à direita com placeholder **"Buscar"** — visível ao fundo.

### 3.3. Tabela de pacotes (colunas inferidas)

| Coluna | Origem do dado | Observação |
|---|---|---|
| **"Descrição"** (inferido — nome do pacote) | `Pacote.descricao` | Coluna principal; campo obrigatório do cadastro. |
| **"Valor total"** (inferido) | `Pacote.valor_total` | Valor final calculado do pacote (formato `R$ 0,00`). |
| **"Validade"** (inferido) | `Pacote.validade` | Ex.: "Ilimitado" ou prazo definido. |
| **"Ativo"** (inferido) | `Pacote.ativo` | Toggle/switch verde inline (padrão das demais listagens). |
| (⚙) Configurar colunas | — | Ícone de engrenagem no cabeçalho (padrão do módulo). **(inferido)** |
| (⋮) Ações por linha | — | Menu de três pontos: editar / duplicar / excluir. **(inferido)** |

### 3.4. Rodapé / paginação (inferido, padrão do módulo)

- Seletor **"25 por página"** (dropdown). Nota: nas capturas há um controle truncado mostrando "25" à esquerda do modal, consistente com esse seletor.
- Paginação: **«** (primeira), **‹** (anterior), **"1"** (página ativa, destaque roxo), **›** (próxima), **»** (última).

### 3.5. Criação

- **FAB roxo "+"** (canto inferior direito) e/ou estado vazio com botão "+ Adicionar ..." abrem o modal **"Novo pacote"** (`order_modal_mode=new`). **(inferido pelo padrão das demais telas.)**

---

## 4. Modal "Novo pacote" — estrutura

**Cabeçalho do modal:**
- Título **"Novo pacote"**.
- Botão **"X"** (fechar) no canto superior direito.

**Corpo (de cima para baixo):**
1. Linha de cabeçalho do formulário: **Descrição**, **Validade**, **Ativo**.
2. **Observações**.
3. Seção **"Procedimentos/Produtos"** (tabela de itens + "+ Adicionar Procedimentos/Produtos").
4. Seção recolhível **"Desconto"**.
5. Linha de total: **"Valor total"** → `R$ 0,00`.

**Rodapé:**
- Botão **"Salvar"** (roxo, centralizado).

---

## 5. Campos do cabeçalho do formulário

Linha de três colunas no topo do modal.

### 5.1. Descrição

| Atributo | Valor |
|---|---|
| **Rótulo exato** | `Descrição*` |
| **Tipo** | Campo de texto (input single-line) |
| **Placeholder** | `Digite` |
| **Obrigatório** | Sim (asterisco) |
| **Mapeamento** | `Pacote.descricao` |
| **Validação** | Não vazio. Comprimento máx. (inferido) ~120 caracteres. **(inferido)** |
| **Observação** | É o nome/identificador do pacote exibido na listagem e na venda. |

### 5.2. Validade

| Atributo | Valor |
|---|---|
| **Rótulo exato** | `Validade*` |
| **Tipo** | Dropdown (select) |
| **Valor padrão** | `Ilimitado` |
| **Obrigatório** | Sim (asterisco) |
| **Mapeamento** | `Pacote.validade` (+ possíveis campos auxiliares de prazo) |
| **Opções** | `Ilimitado` (visível). Demais opções não visíveis nas capturas; inferidas: prazos pré-definidos (ex.: 30 / 60 / 90 / 180 / 365 dias) e/ou "Personalizado" para informar quantidade + unidade (dias/meses). **(inferido)** |
| **Semântica** | Tempo durante o qual os créditos/sessões do pacote podem ser consumidos após a venda. "Ilimitado" = sem expiração. **(inferido)** |

### 5.3. Ativo

| Atributo | Valor |
|---|---|
| **Rótulo exato** | `Ativo` (com ícone de ajuda ⓘ ao lado) |
| **Tipo** | Toggle / switch |
| **Estado padrão** | Ligado (verde) |
| **Obrigatório** | N/A (booleano com default) |
| **Mapeamento** | `Pacote.ativo` (boolean) |
| **Semântica** | Pacotes inativos não ficam disponíveis para venda, mas permanecem cadastrados. **(inferido)** |
| **Tooltip** | Texto não legível nas capturas (ícone ⓘ presente). **(inferido)** |

### 5.4. Observações

| Atributo | Valor |
|---|---|
| **Rótulo exato** | `Observações` (com ícone de ajuda ⓘ ao lado) |
| **Tipo** | Campo de texto largura total (input/textarea) |
| **Placeholder** | `Digite` |
| **Obrigatório** | Não (sem asterisco) |
| **Mapeamento** | `Pacote.observacoes` |
| **Semântica** | Notas internas/descritivas sobre o pacote. **(inferido)** |

---

## 6. Seção "Procedimentos/Produtos" (itens do pacote)

Título da seção: **"Procedimentos/Produtos"** (negrito).

Estrutura de **tabela editável**, com uma ou mais linhas. Cabeçalhos de coluna (textos exatos):

| Coluna (rótulo exato) | Tipo de controle | Valor inicial / placeholder | Mapeamento (ItemPacote) | Obrigatório |
|---|---|---|---|---|
| **`Nome`** | Dropdown de busca (autocomplete) | placeholder `Pesquise/Selecione` | `item.procedimento_id` ou `item.produto_id` (+ `item.tipo`) | Sim (ao menos 1 item) |
| **`Qtd.`** | Campo numérico (stepper) | `1` | `item.quantidade` | Sim |
| **`Valor (R$)`** | Campo de valor monetário | `0,00` | `item.valor_unitario` | Sim |
| **`Desconto un.`** | Campo de valor + seletor de unidade | `0,00` + dropdown **`R$`** (▾) | `item.desconto_unitario` + `item.desconto_unitario_tipo` | Não |
| **`Total (R$)`** | Campo somente leitura (calculado) | `0,00` | `item.total` (calculado) | — (derivado) |
| (🗑) Remover | Ícone de lixeira | — | — | Ação por linha |

Abaixo da(s) linha(s):
- Link **"+ Adicionar Procedimentos/Produtos"** (roxo, com ícone "+") — adiciona uma nova linha vazia à tabela.

### 6.1. Detalhamento dos controles

- **`Nome` (dropdown "Pesquise/Selecione"):** busca tipo-ahead que lista procedimentos e produtos cadastrados na clínica. Ao selecionar, o **`Valor (R$)`** é pré-preenchido com o valor de venda do item escolhido. **(inferido)** O sistema distingue "Procedimento" (gera sessões/créditos de atendimento) de "Produto" (item físico/estoque). **(inferido)**
- **`Qtd.`:** quantidade de unidades/sessões do item dentro do pacote. Para procedimentos, equivale ao número de **sessões/créditos** concedidos. Mínimo `1` (inferido), inteiro positivo.
- **`Valor (R$)`:** valor unitário do item (por sessão/unidade). Formato BRL `0,00`.
- **`Desconto un.`:** desconto aplicado por unidade do item. O seletor de unidade **`R$`** alterna entre **R$** (valor absoluto) e **%** (percentual) — inferido pela presença do dropdown (▾), consistente com o seletor da seção Desconto. **(inferido)**
- **`Total (R$)`:** campo calculado e somente leitura (visualmente atenuado/cinza nas capturas). Ver fórmula na Seção 9.
- **Lixeira (🗑):** remove a linha do item. (Comportamento ao remover a única/última linha: inferido — manter ao menos uma linha vazia.) **(inferido)**

---

## 7. Seção "Desconto" (recolhida vs expandida)

Seção recolhível (collapsible) com cabeçalho **"Desconto"** (negrito).

### 7.1. Estado RECOLHIDO (captura `153937.png`)

- Cabeçalho **"Desconto"** com, à direita, o indicador de estado **"Sem desconto"** seguido de seta **▾** (chevron para baixo).
- Nenhum campo de desconto global visível.
- "Sem desconto" é o rótulo do estado padrão (nenhum desconto global aplicado).

![](../../images/Captura de tela 2026-06-22 153937.png)

### 7.2. Estado EXPANDIDO (captura `153945.png`)

- Cabeçalho **"Desconto"** com seta **▴** (chevron para cima) à direita.
- Conteúdo revelado:
  - **Rótulo exato:** `Desconto`
  - **Campo de valor:** `0,00`
  - **Seletor de unidade (dropdown ▾):** `R$` — alterna entre **`R$`** (desconto fixo em reais) e **`%`** (desconto percentual sobre o total dos itens). **(inferido: a presença do dropdown indica as duas unidades; o seletor de unidade por item usa o mesmo padrão.)**

![](../../images/Captura de tela 2026-06-22 153945.png)

### 7.3. Campos da seção Desconto

| Atributo | Valor |
|---|---|
| **Rótulo exato** | `Desconto` |
| **Tipo do desconto** | Seletor de unidade: `R$` (valor) ou `%` (percentual) — `Pacote.desconto_tipo` |
| **Valor do desconto** | Campo numérico/monetário, default `0,00` — `Pacote.desconto_valor` |
| **Indicador (recolhido)** | `Sem desconto` quando nenhum desconto global está aplicado |
| **Obrigatório** | Não |
| **Semântica** | Desconto **global** aplicado sobre a soma dos itens (após os descontos por item), além dos descontos unitários da tabela. Ver Seção 9. **(inferido)** |

---

## 8. Total e ações

### 8.1. Valor total

- Linha **"Valor total"** (negrito, à esquerda) com o valor calculado à direita: **`R$ 0,00`** (no estado vazio).
- Campo somente leitura, recalculado em tempo real conforme itens e descontos. Representa o **valor final** do pacote.
- **Mapeamento:** `Pacote.valor_total`.

### 8.2. Botão de ação

| Botão | Texto exato | Estilo | Ação |
|---|---|---|---|
| Salvar | **`Salvar`** | Roxo, centralizado no rodapé do modal | Persiste o pacote (POST/PUT) e fecha o modal. |
| Fechar | **`X`** | Ícone, canto superior direito | Fecha o modal sem salvar (descarta). **(inferido)** |

> Não há botão "Cancelar" textual visível; o fechamento se dá pelo "X" (e, por inferência, clique no overlay / tecla Esc). **(inferido)**

---

## 9. Regras de negócio e cálculos

> Notação: campos calculados são derivados; o backend deve recalcular/validar (não confiar apenas no cliente).

### 9.1. Total por item (`Total (R$)` da linha)

```
desconto_item_efetivo =
    (desconto_unitario_tipo == "%")  ? valor_unitario * (desconto_unitario / 100)
                                      : desconto_unitario        // R$

valor_unitario_liquido = max(0, valor_unitario - desconto_item_efetivo)

item.total = quantidade * valor_unitario_liquido
```

- O desconto por unidade é aplicado **por unidade**, antes de multiplicar pela quantidade. **(inferido — interpretação literal de "Desconto un.")**

### 9.2. Subtotal do pacote (soma dos itens)

```
subtotal = Σ item.total   (para todos os itens da tabela)
```

### 9.3. Desconto global e Valor total (valor final)

```
desconto_global_efetivo =
    (desconto_tipo == "%")  ? subtotal * (desconto_valor / 100)
                            : desconto_valor        // R$

valor_total = max(0, subtotal - desconto_global_efetivo)
```

- O desconto global incide sobre o **subtotal já líquido** dos descontos por item. **(inferido)**
- Estado vazio: sem itens → `subtotal = 0` → `valor_total = R$ 0,00`.

### 9.4. Sessões / créditos

- Para cada item do tipo **Procedimento**, a `quantidade` define o número de **sessões/créditos** concedidos ao paciente na venda do pacote.
- Créditos por sessão = `quantidade` do item (1 crédito = 1 sessão do procedimento). **(inferido)**
- Para itens do tipo **Produto**, `quantidade` representa unidades do produto (sem noção de sessão). **(inferido)**
- A `validade` do pacote define o prazo de consumo desses créditos após a venda ("Ilimitado" = sem expiração). **(inferido)**

### 9.5. Validações

- `Descrição` obrigatória e não vazia.
- `Validade` obrigatória (default "Ilimitado").
- Ao menos **1 item** com `Nome` selecionado, `Qtd. >= 1` e `Valor >= 0`. **(inferido)**
- Descontos não podem tornar o total negativo (clamp em `0`). **(inferido)**
- Percentuais entre 0 e 100. **(inferido)**

---

## 10. Modelo de dados

> Nomes de tabela/campo são **inferidos** a partir dos rótulos da UI e do parâmetro `order_modal_type=combo`. Ajustar à convenção real do backend.

### 10.1. `Pacote` (combo)

| Campo | Tipo | Origem (UI) | Obrigatório | Notas |
|---|---|---|---|---|
| `id` | UUID / bigint | — | sim (PK) | Identificador. |
| `descricao` | string(120) | `Descrição*` | sim | Nome do pacote. |
| `validade` | enum / string | `Validade*` | sim | Ex.: `ilimitado` ou prazo. **(inferido)** |
| `validade_qtd` | int (nullable) | `Validade` (personalizado) | não | Quantidade de prazo, se aplicável. **(inferido)** |
| `validade_unidade` | enum(`dias`,`meses`) (nullable) | `Validade` (personalizado) | não | Unidade do prazo. **(inferido)** |
| `ativo` | boolean | `Ativo` | sim (default `true`) | Disponível para venda. |
| `observacoes` | text (nullable) | `Observações` | não | Notas. |
| `desconto_tipo` | enum(`valor`,`percentual`) | seletor `R$`/`%` da seção Desconto | não (default `valor`) | **(inferido)** |
| `desconto_valor` | decimal(12,2) | campo `Desconto` | não (default `0`) | **(inferido)** |
| `subtotal` | decimal(12,2) | calculado | — | Σ itens (derivado). **(inferido)** |
| `valor_total` | decimal(12,2) | `Valor total` | — | Valor final (derivado). |
| `created_at` / `updated_at` | timestamp | — | — | Auditoria. **(inferido)** |

### 10.2. `ItemPacote` (item_combo)

| Campo | Tipo | Origem (UI) | Obrigatório | Notas |
|---|---|---|---|---|
| `id` | UUID / bigint | — | sim (PK) | — |
| `pacote_id` | FK → `Pacote.id` | — | sim | Relacionamento. |
| `tipo` | enum(`procedimento`,`produto`) | seleção em `Nome` | sim | Distingue serviço/produto. **(inferido)** |
| `procedimento_id` | FK (nullable) | `Nome` | condicional | Quando `tipo = procedimento`. **(inferido)** |
| `produto_id` | FK (nullable) | `Nome` | condicional | Quando `tipo = produto`. **(inferido)** |
| `nome` | string | `Nome` | sim | Rótulo do item (snapshot). **(inferido)** |
| `quantidade` | int | `Qtd.` | sim (default `1`) | Sessões/créditos (procedimento) ou unidades (produto). |
| `valor_unitario` | decimal(12,2) | `Valor (R$)` | sim (default `0,00`) | Valor por unidade/sessão. |
| `desconto_unitario` | decimal(12,2) | `Desconto un.` | não (default `0`) | Valor do desconto por unidade. |
| `desconto_unitario_tipo` | enum(`valor`,`percentual`) | seletor `R$`/`%` da linha | não (default `valor`) | **(inferido)** |
| `total` | decimal(12,2) | `Total (R$)` | — | Calculado (derivado). |
| `ordem` | int | posição na tabela | não | Ordenação das linhas. **(inferido)** |

### 10.3. Relacionamento

- `Pacote` 1—N `ItemPacote` (um pacote tem muitos itens).
- `ItemPacote` N—1 `Procedimento` **ou** N—1 `Produto` (polimórfico via `tipo`). **(inferido)**

---

## 11. Endpoints de API (inferidos)

> Rotas e contratos **inferidos**; a UI usa query params `order_modal_type=combo&order_modal_mode=new`, sugerindo um recurso "combo"/"pacote" com modo de operação.

| Método | Rota (inferida) | Descrição |
|---|---|---|
| `GET` | `/api/combos` (ou `/api/pacotes`) | Lista pacotes (com paginação `per_page=25`, filtros, busca). |
| `GET` | `/api/combos/{id}` | Detalhe de um pacote (para edição). |
| `POST` | `/api/combos` | Cria pacote (`order_modal_mode=new` → Salvar). |
| `PUT` / `PATCH` | `/api/combos/{id}` | Atualiza pacote (modo edição). |
| `DELETE` | `/api/combos/{id}` | Exclui pacote. |
| `PATCH` | `/api/combos/{id}/ativo` | Alterna status ativo (toggle inline na listagem). **(inferido)** |
| `GET` | `/api/procedimentos?q=...` | Autocomplete do dropdown `Nome` (procedimentos). |
| `GET` | `/api/produtos?q=...` | Autocomplete do dropdown `Nome` (produtos). |
| `GET` | `/api/combos/export` | Exportação (botão "Exportar"). **(inferido)** |

### 11.1. Payload de criação (POST) — exemplo inferido

```json
{
  "descricao": "Pacote Limpeza 10 sessões",
  "validade": "ilimitado",
  "ativo": true,
  "observacoes": "",
  "desconto_tipo": "percentual",
  "desconto_valor": 10,
  "itens": [
    {
      "tipo": "procedimento",
      "procedimento_id": 1353394,
      "nome": "Limpeza de Pele Profunda",
      "quantidade": 10,
      "valor_unitario": 200.00,
      "desconto_unitario": 0,
      "desconto_unitario_tipo": "valor"
    }
  ]
}
```

Resposta esperada (inferida): objeto `Pacote` persistido com `subtotal`, `valor_total` recalculados pelo servidor e `itens[].total`.

---

## 12. Fluxos de uso

### 12.1. Criar novo pacote

1. Usuário clica no **FAB "+"** (ou botão de empty state) na página `/configuracoes/pacotes`.
2. URL recebe `?order_modal_type=combo&order_modal_mode=new`; abre o modal **"Novo pacote"** (em branco).
3. Preenche **Descrição*** (obrigatório).
4. Define **Validade*** (default "Ilimitado") e mantém/ajusta **Ativo** (default ligado).
5. (Opcional) Preenche **Observações**.
6. Em **Procedimentos/Produtos**, seleciona um item no dropdown **`Nome`**; ajusta **`Qtd.`**, confere/edita **`Valor (R$)`** e, se desejar, **`Desconto un.`** (R$/%). O **`Total (R$)`** atualiza automaticamente.
7. (Opcional) Clica **"+ Adicionar Procedimentos/Produtos"** para incluir mais itens.
8. (Opcional) Expande a seção **"Desconto"** e informa um desconto global (R$/%). O indicador "Sem desconto" deixa de ser exibido.
9. Confere **"Valor total"** (recalculado em tempo real).
10. Clica **"Salvar"** → POST → modal fecha → pacote aparece na listagem.

### 12.2. Cancelar / fechar

- Clica em **"X"** (ou overlay/Esc — inferido) → modal fecha sem persistir → URL limpa os query params. **(inferido)**

### 12.3. Editar pacote (inferido)

- Via menu **⋮** da linha → "Editar" → abre o modal com dados carregados (`order_modal_mode=edit` ou similar) → título passa a "Editar pacote" (inferido) → **"Salvar"** faz PUT/PATCH. **(inferido)**

### 12.4. Remover item

- Clica no ícone **🗑** da linha → item removido → totais recalculados.

---

## 13. Estados e validações de UI

| Estado | Comportamento |
|---|---|
| **Modal em branco (new)** | Todos os campos vazios/padrão; 1 linha de item vazia; "Desconto" recolhido ("Sem desconto"); "Valor total" = `R$ 0,00`. |
| **Desconto recolhido** | Seta ▾; indicador "Sem desconto" à direita; campos de desconto global ocultos. |
| **Desconto expandido** | Seta ▴; campo `Desconto` (`0,00`) + seletor `R$`/`%` visíveis. |
| **Total (R$) por item** | Somente leitura (cinza/atenuado); recalculado a cada mudança de Qtd./Valor/Desconto un. |
| **Valor total** | Somente leitura; recalculado a cada mudança em itens ou desconto global. |
| **Validação ao salvar** | Bloqueia se `Descrição` vazia ou sem itens válidos; exibe mensagens de erro nos campos. **(inferido)** |
| **Campos obrigatórios** | `Descrição*`, `Validade*` (asterisco). |

---

## 14. Notas de implementação

- **Roteamento por query string:** o modal é deep-linkável (`order_modal_type=combo&order_modal_mode=new`). Implementar o estado do modal sincronizado à URL para permitir refresh/compartilhamento e botão "voltar" do navegador fechar o modal. **(inferido)**
- **Nomenclatura interna `combo`:** apesar do rótulo de UI ser "pacote", o backend/roteamento usa `combo`. Manter consistência: rótulos em pt-BR ("Pacote", "Pacotes"), recurso técnico `combo`.
- **Recalcular no servidor:** `item.total`, `subtotal` e `valor_total` devem ser recalculados no backend a partir de `quantidade`, `valor_unitario`, descontos e tipos — nunca confiar apenas nos valores enviados pelo cliente (evitar manipulação de preço).
- **Unidades de desconto (R$/%):** dois pontos de desconto (por item via `Desconto un.` e global via seção "Desconto"), ambos com seletor R$/%. Garantir tratamento de arredondamento monetário consistente (2 casas, BRL) e clamp em 0.
- **Snapshot de valores:** ao salvar, considerar gravar `nome` e `valor_unitario` como snapshot no `ItemPacote`, para que alterações futuras no procedimento/produto não alterem retroativamente pacotes já cadastrados. **(inferido)**
- **Autocomplete `Nome`:** debounce na busca; diferenciar visualmente Procedimento × Produto; pré-preencher `Valor (R$)` ao selecionar.
- **Validade:** se houver opção "Personalizado", expandir campos de quantidade + unidade (dias/meses). Mapear "Ilimitado" para ausência de expiração nos créditos vendidos.
- **Acessibilidade:** o seletor R$/% e o toggle "Ativo" devem ter rótulos acessíveis; os ícones ⓘ devem expor tooltip via `aria`. **(inferido)**
- **Internacionalização monetária:** entrada/saída no formato `R$ 0,00` (vírgula decimal, ponto de milhar) pt-BR.

---

## 15. Inventário de textos exatos (UI)

| Contexto | Texto exato |
|---|---|
| Breadcrumb | `Configurações` / `Pacotes` |
| Título do card (listagem) | `Pacotes` |
| Filtro | `+ Adicionar filtro` |
| Busca | `Buscar` |
| Título do modal | `Novo pacote` |
| Campo | `Descrição*` |
| Placeholder | `Digite` |
| Campo | `Validade*` |
| Opção validade | `Ilimitado` |
| Toggle | `Ativo` |
| Campo | `Observações` |
| Seção | `Procedimentos/Produtos` |
| Coluna | `Nome` |
| Placeholder do item | `Pesquise/Selecione` |
| Coluna | `Qtd.` |
| Coluna | `Valor (R$)` |
| Coluna | `Desconto un.` |
| Unidade de desconto | `R$` |
| Coluna | `Total (R$)` |
| Link | `+ Adicionar Procedimentos/Produtos` |
| Seção | `Desconto` |
| Indicador (recolhido) | `Sem desconto` |
| Campo (expandido) | `Desconto` |
| Total | `Valor total` |
| Valor (vazio) | `R$ 0,00` |
| Botão | `Salvar` |
| Fechar | `X` |

---

> **Legenda:** itens marcados **(inferido)** não estão diretamente visíveis nas capturas e foram deduzidos do contexto, do padrão das demais telas do módulo (`docs/06-telas-51-a-58.md`) e do modelo de dados. Validar com o backend antes de implementar.
