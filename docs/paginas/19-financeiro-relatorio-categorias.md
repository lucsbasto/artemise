# Financeiro / Relatório de Categorias

![](../../images/Captura de tela 2026-06-22 153450.png)

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Relatório de categorias |
| **Rota** | `/financeiro/relatorio-de-categorias` |
| **URL completa** | `app.clinicaexperts.com.br/financeiro/relatorio-de-categorias` |
| **Módulo** | Financeiro |
| **Breadcrumb** | Financeiro / Relatório de categorias |
| **Tipo de página** | Relatório (somente leitura / análise) |
| **Idioma** | pt-BR |
| **Autenticação** | Requer login (usuário "LB" — Lucas Bastos) |
| **Período exibido no print** | Junho de 2026 |
| **Referência cruzada** | `docs/04-telas-31-a-40.md` — Tela 35 |
| **Imagem de origem** | `Captura de tela 2026-06-22 153450.png` |

---

## 1. Identificação

- **Nome da tela:** Relatório de categorias.
- **Título do card (texto exato):** **"Relatório de categorias"**.
- **Rota:** `/financeiro/relatorio-de-categorias`.
- **URL completa observada:** `app.clinicaexperts.com.br/financeiro/relatorio-de-categorias`.
- **Breadcrumb (texto exato):** **"Financeiro / Relatório de categorias"** (segmento "Financeiro" como link roxo; "Relatório de categorias" como item atual).
- **Módulo:** Financeiro (ícone roxo destacado na sidebar vertical esquerda).
- **Usuário logado:** avatar circular **"LB"** (Lucas Bastos) com borda verde, canto superior direito.

---

## 2. Objetivo

Distribuir e analisar as **receitas e despesas do período (mês)** agrupadas por **categoria**, mostrando para cada categoria a sua participação **percentual** e o **valor** correspondente. (inferido) Serve como visão gerencial de "de onde vêm as receitas e para onde vão as despesas".

- A página separa os dados em **dois grupos**: **Receitas** e **Despesas**.
- Cada grupo é representado por:
  1. Um **gráfico de rosca (donut)** com legenda de categorias.
  2. Uma **tabela hierárquica** (categoria-pai → subcategoria) com colunas **Categorias**, **Percentual**, **Valor** e linha de **Total**.
- O percentual de cada categoria é calculado sobre o **total do seu próprio grupo** (Receitas ou Despesas), não sobre o total geral. (inferido — ver Seção 13)
- Período padrão: **mês corrente / mês selecionado** ("Junho de 2026" no print).

---

## 3. Navegação

- **Acesso:** menu lateral **Financeiro** → submenu **Relatório de categorias** (inferido), ou diretamente pela rota `/financeiro/relatorio-de-categorias`.
- **Breadcrumb:** **"Financeiro / Relatório de categorias"** — clicar em "Financeiro" retorna à raiz/visão do módulo Financeiro (inferido).
- **Sidebar vertical esquerda (padrão do app):** ícones empilhados; o ícone **Financeiro** (cifrão) aparece ativo com fundo roxo arredondado.
- **Header do app (padrão):** hambúrguer (recolhe sidebar) + logo **clínicaexperts**; à direita ícone WhatsApp, busca/atalho, **"Ajuda"** (com "?"), sino de notificações e avatar **"LB"**.
- **Navegação interna de período:** controles **‹** e **›** ao redor do rótulo **"Junho de 2026"** avançam/retrocedem o mês exibido (recarrega os gráficos e tabelas — inferido).
- **Botão flutuante "+"** (canto inferior direito, padrão do app) — ação rápida de adicionar registro (não específico desta tela).

---

## 4. Layout

Estrutura de cima para baixo, dentro de um **card branco único** centralizado sobre fundo cinza claro:

1. **Cabeçalho do card:**
   - À esquerda: título **"Relatório de categorias"**.
   - À direita: botão **"Exportar"** com seta para baixo (⌄).
2. **Barra de filtros (logo abaixo do título):**
   - Seletor de período em pílula cinza: **‹** **"Junho de 2026"** **›**.
3. **Área de gráficos (dois donuts lado a lado):**
   - Coluna esquerda: rótulo **"Receitas"** + legenda **"Receitas de serviços"** (quadradinho verde) + donut **verde**.
   - Coluna direita: rótulo **"Despesas"** + legenda **"Outras despesas"** (quadradinho rosa) + donut **vermelho/rosa**.
   - Disposição: rótulo "Receitas" e sua legenda à esquerda do donut verde; donut "Despesas" à esquerda do rótulo "Despesas" e sua legenda (legendas posicionadas nas extremidades externas).
4. **Seção "Receitas":**
   - Subtítulo **"Receitas"**.
   - Tabela com cabeçalho **Categorias | Percentual | Valor**.
   - Linhas de dados + linha **Total**.
5. **Seção "Despesas":**
   - Subtítulo **"Despesas"**.
   - Tabela com cabeçalho **Categorias | Percentual | Valor**.
   - Linhas de dados + linha **Total**.

**Responsividade (inferido):** em telas estreitas os dois donuts empilham verticalmente e as tabelas ocupam largura total.

---

## 5. Componentes

### 5.1 Cabeçalho

- **Título:** **"Relatório de categorias"** (texto escuro, negrito).
- **Botão "Exportar"** — rótulo **"Exportar"** + ícone de seta para baixo (⌄). Abre dropdown de formatos de exportação (PDF / Excel / CSV — inferido).

### 5.2 Seletor de período

- Pílula cinza arredondada contendo: botão **‹** (mês anterior) | rótulo central **"Junho de 2026"** | botão **›** (mês seguinte).
- Texto exato do rótulo: **"Junho de 2026"**.

### 5.3 Gráficos (donut / rosca)

- **Tipo:** gráfico de rosca (donut chart) — círculo com furo central. **Dois** gráficos independentes (um por grupo).
- **Donut "Receitas":**
  - Cor: **verde** (verde-claro/limão).
  - Rótulo do grupo: **"Receitas"**.
  - **Legenda:** quadrado verde + texto **"Receitas de serviços"**.
  - Séries: uma única fatia preenchendo 100% (no print só há a categoria "Receitas de serviços").
- **Donut "Despesas":**
  - Cor: **vermelho/rosa** (rosa-claro).
  - Rótulo do grupo: **"Despesas"**.
  - **Legenda:** quadrado rosa + texto **"Outras despesas"**.
  - Séries: uma única fatia preenchendo 100% (no print só há a categoria "Outras despesas").
- **Comportamento (inferido):** cada fatia representa uma categoria; cores das fatias mapeiam às cores da legenda; ao passar o mouse exibe tooltip com nome da categoria, valor e percentual. Com várias categorias, o donut é fatiado proporcionalmente.

### 5.4 Botões / ações

| Componente | Texto/Ícone | Ação (inferida) |
|---|---|---|
| Exportar | "Exportar" + ⌄ | Abre dropdown de formatos de exportação |
| Mês anterior | ‹ | Recarrega relatório do mês anterior |
| Mês seguinte | › | Recarrega relatório do mês seguinte |
| Expandir categoria | ▾ (na coluna Categorias) | Expande/recolhe subcategorias |

---

## 6. Tabelas

Há **duas tabelas** com a mesma estrutura de colunas. Em ambas, a coluna **Categorias** é alinhada à esquerda, **Percentual** ao centro/esquerda e **Valor** alinhada à direita.

**Colunas (texto exato dos cabeçalhos):**

| Coluna | Alinhamento | Conteúdo |
|---|---|---|
| **Categorias** | Esquerda | Nome da categoria; categoria-pai com seta ▾ de expandir; subcategoria indentada |
| **Percentual** | Centro | Participação % da categoria no total do grupo |
| **Valor** | Direita | Valor monetário em R$ (receitas positivas/verde; despesas negativas/vermelho) |

> Observação: o doc Tela 35 lista a ordem como "Categorias, Percentual, Valor". No print, a ordem visual confirmada (esquerda→direita) é **Categorias → Percentual → Valor**.

### 6.1 Tabela "Receitas" (valores exatos do print)

| Categorias | Percentual | Valor |
|---|---|---|
| ▾ Receitas | 100% | R$ 8.500,00 |
| &nbsp;&nbsp;&nbsp;&nbsp;Receitas de serviços | 100% | R$ 8.500,00 |
| **Total** | **100%** | **R$ 8.500,00** |

- A linha **"Receitas"** é a categoria-pai (expansível, seta ▾).
- A linha **"Receitas de serviços"** é a subcategoria (indentada).
- A linha **"Total"** aparece em **verde** com valor **R$ 8.500,00**.

### 6.2 Tabela "Despesas" (valores exatos do print)

| Categorias | Percentual | Valor |
|---|---|---|
| ▾ Outras despesas | 100% | -R$ 7.269,00 |
| &nbsp;&nbsp;&nbsp;&nbsp;Outras despesas | 100% | -R$ 7.269,00 |
| **Total** | **100%** | **-R$ 7.269,00** |

- A linha **"Outras despesas"** é a categoria-pai (expansível, seta ▾).
- A subcategoria também se chama **"Outras despesas"** (indentada).
- A linha **"Total"** aparece em **vermelho** com valor **-R$ 7.269,00** (sinal negativo).

**Totais:** cada tabela tem sua própria linha **Total** (não há total geral combinado receitas−despesas nesta tela).

---

## 7. Formulários

- **Não há formulários** de entrada de dados nesta tela. É uma página de relatório (somente leitura).
- As únicas entradas do usuário são: seleção de período (seletor de mês) e acionamento de exportação. (inferido)

---

## 8. Filtros

- **Filtro de período (mês):** único filtro visível. Pílula **‹ "Junho de 2026" ›**. Define o intervalo de competência/liquidação do relatório (mês cheio). (inferido — base: caixa ou competência não especificado no print)
- **Filtro por tipo (Receita / Despesa):** não há um seletor explícito; o relatório já apresenta **ambos os tipos simultaneamente** em seções separadas (Receitas e Despesas). (inferido) Um filtro adicional de tipo poderia restringir a exibição, mas não está presente no print.
- **Sem campo de busca** e **sem "+ Adicionar filtro"** visíveis nesta tela (diferente de outras telas do módulo Financeiro).

---

## 9. Estados

- **Estado populado (print):** mês com **uma única categoria por grupo** → ambos os donuts cheios (100%) e tabelas com 1 categoria-pai + 1 subcategoria + total.
- **Estado vazio (inferido):** mês sem lançamentos → donuts vazios/ocultos, tabelas exibindo apenas linha **Total** com **R$ 0,00** ou mensagem padrão do app **"Hmm, está vazio por aqui!"** / **"Nenhum registro encontrado."** (padrão observado em outras telas).
- **Estado de carregamento (inferido):** skeleton/spinner nos donuts e tabelas ao trocar de mês.
- **Estado com múltiplas categorias (inferido):** donuts fatiados; cada tabela lista N categorias-pai, cada uma com percentual < 100% somando 100% no Total.

---

## 10. Modais

- **Dropdown "Exportar":** ao clicar em **"Exportar"** abre menu suspenso com opções de formato — provavelmente **PDF**, **Excel (.xlsx)** e **CSV**. (inferido)
- **Tooltip de gráfico (inferido):** ao passar o mouse sobre uma fatia do donut, surge tooltip com nome da categoria + valor + percentual.
- **Não há modais de criação/edição** nesta tela (somente leitura).

---

## 11. Modelo de dados inferido

### Entidade `Categoria` (inferido)

```jsonc
{
  "id": "string (uuid)",
  "descricao": "string",          // ex.: "Receitas de serviços", "Outras despesas"
  "tipo": "RECEITA | DESPESA",     // grupo ao qual pertence
  "categoriaPaiId": "string|null", // null = categoria-pai; preenchido = subcategoria
  "ativo": "boolean"               // status (ver Tela 37 — categorias podem ser ativadas/desativadas)
}
```

### Entidade agregada do relatório `RelatorioCategoriaItem` (inferido)

```jsonc
{
  "categoriaId": "string",
  "descricao": "string",
  "tipo": "RECEITA | DESPESA",
  "valor": "number",          // valor monetário do período (ex.: 8500.00; despesa negativa: -7269.00)
  "percentual": "number",     // 0..100, valor/totalDoGrupo * 100
  "subcategorias": [          // hierarquia (categoria-pai → subitens)
    {
      "categoriaId": "string",
      "descricao": "string",
      "valor": "number",
      "percentual": "number"
    }
  ]
}
```

### Resposta do relatório (inferido)

```jsonc
{
  "periodo": { "mes": 6, "ano": 2026, "rotulo": "Junho de 2026" },
  "receitas": {
    "itens": [ /* RelatorioCategoriaItem[] tipo RECEITA */ ],
    "total": 8500.00,
    "totalPercentual": 100
  },
  "despesas": {
    "itens": [ /* RelatorioCategoriaItem[] tipo DESPESA */ ],
    "total": -7269.00,
    "totalPercentual": 100
  }
}
```

---

## 12. Endpoints de API inferidos

> Todos **(inferido)** — base URL provável `app.clinicaexperts.com.br/api`.

| Método | Endpoint | Descrição | Query params |
|---|---|---|---|
| `GET` | `/api/financeiro/relatorio-de-categorias` | Retorna agregados de receitas e despesas por categoria no período | `interval` ou `month=2026-06` (mês/ano); possivelmente `regime=caixa\|competencia` |
| `GET` | `/api/financeiro/categorias` | Lista de categorias (para legendas/cores) | `tipo=RECEITA\|DESPESA`, `ativo=true` |
| `GET` | `/api/financeiro/relatorio-de-categorias/export` | Exporta o relatório no formato escolhido | `format=pdf\|xlsx\|csv`, `month=2026-06` |

**Exemplo de requisição (inferido):**
`GET /api/financeiro/relatorio-de-categorias?month=2026-06`

---

## 13. Regras / cálculos

- **Percentual de cada categoria:**
  `percentual = (valor da categoria / total do grupo) * 100`
  onde "total do grupo" é o total de **Receitas** (para categorias de receita) ou o total de **Despesas** (para categorias de despesa). (inferido)
  - No print: única categoria por grupo → `8.500,00 / 8.500,00 = 100%` e `7.269,00 / 7.269,00 = 100%`.
- **Total de cada grupo:** soma dos valores de todas as categorias-pai do grupo.
  - Receitas: **R$ 8.500,00**. Despesas: **-R$ 7.269,00**.
- **Soma de subcategorias:** o valor da categoria-pai = soma dos valores de suas subcategorias. (inferido)
- **Sinais e cores:**
  - Receitas: valores positivos, exibidos em **verde** (ao menos a linha Total).
  - Despesas: valores **negativos** (prefixo "-"), exibidos em **vermelho/rosa** (ao menos a linha Total).
- **Formatação monetária:** padrão brasileiro `R$ #.###,00` (ponto como separador de milhar, vírgula como decimal). Despesas com prefixo de sinal: **"-R$ 7.269,00"**.
- **Formatação de percentual:** inteiro com símbolo "%" (ex.: **"100%"**) — sem casas decimais no print. (parcialmente inferido — casas decimais podem aparecer com múltiplas categorias)
- **Período:** mês-calendário completo do rótulo selecionado. (inferido)

---

## 14. Fluxos

1. **Visualizar relatório do mês corrente:** usuário acessa a rota → app carrega agregados do mês atual → renderiza dois donuts + duas tabelas com totais.
2. **Trocar de mês:** usuário clica em **‹** ou **›** → app refaz a consulta para o novo mês → atualiza donuts e tabelas (e o rótulo "Junho de 2026"). (inferido)
3. **Expandir/recolher categoria:** usuário clica na seta **▾** de uma categoria-pai → exibe/oculta as subcategorias indentadas. (inferido)
4. **Exportar:** usuário clica em **"Exportar"** → escolhe formato (PDF/Excel/CSV) → app gera e baixa o arquivo do período atual. (inferido)
5. **Inspecionar gráfico:** usuário passa o mouse sobre uma fatia do donut → tooltip com categoria, valor e percentual. (inferido)

---

## 15. Notas de implementação

- **Componente de gráfico:** usar biblioteca de donut chart (ex.: Chart.js, ECharts, Recharts/D3 — inferido). Manter paleta consistente entre fatia e legenda (verde = receitas, rosa/vermelho = despesas).
- **Hierarquia da tabela:** implementar como árvore de 2 níveis (categoria-pai expansível → subcategorias). Reaproveitar componente de tabela hierárquica de `/financeiro/categorias-de-contas` (Tela 37).
- **Cores semânticas:** verde para receitas, vermelho/rosa para despesas — alinhar com o restante do módulo Financeiro (extrato, competência, fluxo de caixa).
- **Sinal de despesa:** despesas devem ser persistidas/exibidas com sinal negativo (`-R$`).
- **Cálculo de percentual:** computar no backend para garantir consistência com o gráfico; arredondar para inteiro na exibição (e tratar soma ≠ 100% por arredondamento quando houver muitas categorias).
- **Filtro de período:** sincronizar o mês selecionado com a URL (query param `month`/`interval`) para deep-link e refresh — padrão das demais telas do módulo (ex.: `?interval=...` no extrato).
- **Estado vazio:** reutilizar o componente padrão **"Hmm, está vazio por aqui!" / "Nenhum registro encontrado."** quando o mês não tiver lançamentos.
- **Exportação:** o dropdown "Exportar" deve gerar arquivo respeitando o período e a estrutura (categorias + percentuais + totais por grupo).
- **Acessibilidade:** donuts devem ter alternativa textual (as próprias tabelas já cumprem esse papel); garantir contraste do verde-limão sobre branco.
- **Diferença vs. outras telas:** esta tela **não** possui campo "Buscar" nem "+ Adicionar filtro" (presentes em extrato/competência) — apenas o seletor de mês.
