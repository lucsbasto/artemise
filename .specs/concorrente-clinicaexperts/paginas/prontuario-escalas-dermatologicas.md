# Prontuário — Escalas Dermatológicas (widgets clínicos)

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Estética Facial** e **Facial**)
**Tipo:** Widgets de classificação clínica reaproveitados entre fichas faciais
**Screenshots:** `prontuario-escala-fitzpatrick.png`, `prontuario-escala-baumann.png`, `prontuario-escala-discromia-hiperpig.png`, `prontuario-escala-glogau.png`, `prontuario-escala-rosacea-cicatrizes.png`

## Propósito

Documenta, **exercitando de verdade** (não só lendo), os widgets de escalas dermatológicas padronizadas que a Clínica Experts reúsa entre as fichas **Estética Facial** e **Facial**. Cada escala foi selecionada/alterada via automação para verificar a mecânica de seleção, os tooltips e o cálculo automático.

> Referenciada por `prontuario-ficha-estetica-facial.md` e `prontuario-ficha-facial.md`.

## Onde cada escala aparece

| Escala | Estética Facial | Facial |
|---|:---:|:---:|
| Escala de Fitzpatrick (fototipo) | ✅ | ✅ |
| Tipo de pele segundo Baumann | ✅ | ✅ |
| Grau da acne | ✅ | ✅ |
| Cicatrizes de acne | — | ✅ |
| Subtipos e grau de rosácea | — | ✅ |
| Discromia facial | ✅ | ✅ |
| Tipo de hiperpigmentação periocular | ✅ | ✅ |
| Escala de Glogau (fotoenvelhecimento) | — | ✅ |

## Padrões de UI (mecânica de seleção)

Há **3 mecânicas distintas** de widget, todas verificadas no DOM/automação:

1. **`image-select`** — grade de cards (swatch de cor, ilustração ou foto) com rótulo. Classe da opção: `image-select-option is-selectable`; selecionada vira `is-selected is-selectable`. **Seleção única** (selecionar outro card desmarca o anterior — verificado: Fitzpatrick Tipo 3 → clicar Tipo 4 → só Tipo 4 fica `is-selected`). Tooltip opcional via ícone "?" (`ei-question-circle`, Tippy.js, conteúdo carregado on-hover).
2. **Lista/tabela selecionável** (`appointment-field-acne-list-item` + `eui-button`) — linha inteira clicável; selecionada fica `is-primary is-filled`, demais `is-primary is-trans`. **Seleção única**. Usada em **Grau da acne** e **Glogau** (cada linha com tooltip "?").
3. **`vue-multiselect`** (dropdown de busca) — usado no **Baumann** (3 eixos) e no **grau de rosácea** (Suave/Moderado/Grave por subtipo). Opções em portal `.multiselect__content`; clique por **JS `.click()`/coordenada na opção aberta** funciona (clique por seletor de texto direto nem sempre).

> Nota de automação: nos cards `image-select`, o clique por coordenada do mouse **não** disparou a seleção; `element.click()` via `page.evaluate` funcionou. Nos `vue-multiselect`, clique por coordenada na opção aberta funcionou.

---

## 1. Escala de Fitzpatrick (Fototipo)

- **Widget:** 6 cards `image-select` com **swatch de cor de pele** (do mais claro ao mais escuro) + rótulo "Tipo 1"…"Tipo 6" + ícone "?". Seleção única.
- **Score/cálculo automático:** ❌ não há. A classificação **é** o tipo selecionado.
- **Opções (tooltip = descrição clínica, capturado on-hover):**

| Tipo | Descrição (tooltip) |
|---|---|
| Tipo 1 | Sempre queima, nunca bronzeia, muito sensível ao sol. |
| Tipo 2 | Sempre queima, bronzeia muito pouco, muito sensível ao sol. |
| Tipo 3 | Queima (moderadamente), bronzeia (moderadamente), sensibilidade normal ao sol. |
| Tipo 4 | Queima (pouco), bronzeia (moderadamente), sensibilidade normal ao sol. |
| Tipo 5 | Queima (pouco), sempre bronzeia, pouco sensível ao sol. |
| Tipo 6 | Nunca queima, totalmente pigmentada, insensível ao sol. |

**Teste executado:** Tipo 3 (default) → selecionado Tipo 4 (confirmado `is-selected`) → revertido para Tipo 3.

## 2. Tipo de pele segundo Baumann

- **Widget:** 3 dropdowns `vue-multiselect` + campo **"Resultado"** (read-only) que **calcula automaticamente** o código de 4 letras de Baumann.
- **Score/cálculo automático:** ✅ **SIM.** O Resultado concatena a inicial de cada eixo escolhido, na ordem [oleosidade/pigmentação → sensibilidade → rugas].

| Dropdown | Eixos cobertos | Opções |
|---|---|---|
| 1 | Oleosidade × Pigmentação | Selecione · **Oleosa Pigmentada** · Oleosa Não-Pigmentada · Seca Pigmentada · Seca Não-Pigmentada |
| 2 | Sensibilidade | Selecione · **Sensível** · Resistente |
| 3 | Rugas | Selecione · **Enrugada** · Firme |

- **Mapa de letras:** Oleosa=**O** / Seca=**S** · Pigmentada=**P** / Não-Pigmentada=**N** · Sensível=**S** / Resistente=**R** · Enrugada=**E** / Firme=**F**.
- **Verificado ao vivo:** `Oleosa Pigmentada + Sensível + Enrugada` → Resultado **`OPSE`**; alterado Enrugada→Firme → Resultado **`OPSF`** (recalcula em tempo real); revertido para `OPSE`.

> Observação: o 1º dropdown combina **dois** eixos (oleosidade + pigmentação) num único select de 4 valores; logo são 3 controles para 4 eixos. As iniciais PT podem colidir (Seca e Sensível = "S"), mas o código é **posicional** (posição 1 = oleosidade, posição 3 = sensibilidade).

## 3. Grau da acne

- **Widget:** lista selecionável (linha inteira clicável), seleção única. Linha selecionada = `is-filled`.
- **Score/cálculo automático:** ❌ (classificação = grau selecionado). 3 colunas por linha.

| Grau | Tipo | Morfologia |
|---|---|---|
| Grau I | Não-inflamatória | Comedogênica |
| Grau II | Inflamatória | Pápulo-pustulosa |
| Grau III | Inflamatória | Nódulo-cística |
| Grau IV | Inflamatória | Conglobata |
| Grau V | Inflamatória | Fulminans |

- Na ficha **Facial** há um campo livre **"Localização anatômica"** logo abaixo (texto).

## 4. Cicatrizes de acne *(só ficha Facial)*

- **Widget:** 4 cards `image-select` com **foto real de pele**, seleção única, **sem tooltip**.
- **Opções:** Icepick · Boxcar · Rolling · Hipertrófica.
- Campo livre **"Localização anatômica"** abaixo.

## 5. Subtipos e grau de rosácea *(só ficha Facial)*

- **Widget composto:** 4 cards `image-select` (Subtipo 1–4, com foto + tooltip "?") **e**, por subtipo, um dropdown de **grau**: Selecione · **Suave · Moderado · Grave**.
- **Score/cálculo automático:** ❌ — classificação por subtipo + grau independente (cada subtipo pode receber um grau).

| Subtipo | Nome clínico (tooltip resumido) |
|---|---|
| Subtipo 1 | Rosácea eritematotelangiectática — rubor e eritema facial central persistente; telangiectasias comuns (não essenciais). |
| Subtipo 2 | Rosácea papulopustular — eritema facial central persistente com pápulas/pústulas transitórios na distribuição central. |
| Subtipo 3 | Rosácea fimatosa — espessamento da pele, nódulos, irregularidades de superfície; folículos expressivos e telangiectasias. |
| Subtipo 4 | Rosácea ocular — aparência aquosa/injetada, telangiectasia de conjuntiva e margem palpebral, blefarite/conjuntivite, irregularidade das margens. |

## 6. Discromia facial

- **Widget:** 3 cards `image-select` com **ilustração de rosto** (região demarcada). Seleção única.
- **Opções:** Localização 1 · Localização 2 · Localização 3.
- Na ficha **Facial** há campo livre **"Tipo de Discromia"** (texto) associado.

## 7. Tipo de hiperpigmentação periocular

- **Widget:** 6 cards `image-select` com **foto real de olho** + ícone "?". Seleção única.
- **Opções (tooltip):**

| Tipo | Descrição (tooltip) |
|---|---|
| Tipo 1 | Deposição Dérmica de Melanina (coloração cinza a azul-acinzentado) |
| Tipo 2 | Edema periorbital |
| Tipo 3 | Vasculatura de localização superficial |
| Tipo 4 | Depressão do sulco lacrimal |
| Tipo 5 | Hiperpigmentação pós-inflamatória |
| Tipo 6 | Envelhecimento |

## 8. Escala de Glogau (Fotoenvelhecimento) *(só ficha Facial)*

- **Widget:** tabela de 4 linhas selecionáveis (linha = `is-filled` quando ativa), seleção única, cada linha com tooltip "?". 3 colunas: Tipo · Faixa etária · Característica.
- **Score/cálculo automático:** ❌ (classificação = tipo selecionado).

| Tipo | Faixa etária | Característica | Descrição (tooltip) |
|---|---|---|---|
| Tipo I | Entre 20 e 30 anos | Sem rugas | Rugas mínimas, pequenas mudanças de coloração na pele |
| Tipo II | Entre 30 e 40 anos | Rugas em movimento | Linhas começam a aparecer com o sorriso |
| Tipo III | Entre 40 e 60 anos | Rugas em repouso | Rugas mesmo quando o rosto está parado |
| Tipo IV | Acima de 60 anos | Somente rugas | Enrugado por completo, nenhuma pele normal |

> ⚠️ **Bug visual deles:** a 4ª linha é rotulada **"Tipo IIII"** (em vez de "Tipo IV") — numeral romano renderizado errado.

**Teste executado:** selecionado Glogau **Tipo II** (confirmado `is-filled`).

---

## Observações para o Artemise (modelar escalas clínicas configuráveis)

- **Abstração única "escala clínica" parametrizável.** Quase tudo aqui é a mesma primitiva com variações de render. Modelar um tipo `EscalaClinica` com:
  - `mecanica`: `card-imagem` | `card-cor` | `lista-tabela` | `dropdown-eixos` | `card+grau`.
  - `selecao`: `unica` (a regra geral aqui) | `multipla` (deixar configurável; nenhuma escala daqui era múltipla).
  - `opcoes[]`: `{ rotulo, midia?(cor/ilustração/foto), descricaoTooltip?, colunas?[] }`.
  - `colunas[]` para escalas tabulares (ex.: Grau da acne = [Grau, Tipo, Morfologia]; Glogau = [Tipo, Faixa etária, Característica]).
- **Score derivado configurável (diferencial Baumann).** O Baumann é o único com **cálculo automático**: código posicional a partir de N eixos. Generalizar como `formula: concat(initials)` ou `formula: soma/pontuação`, permitindo escalas que somam pontos (ex.: futuras escalas tipo GAGS de acne, que *somam* região×grau). Hoje eles **não** somam acne — oportunidade de superá-los com um score real.
- **Tooltips = base de conhecimento clínico.** Cada opção carrega uma descrição padronizada (fototipo, Glogau, rosácea, periocular). Modelar `descricaoTooltip` como conteúdo versionável/i18n — vira ajuda contextual e material de laudo.
- **Mídia por opção** (swatch de cor para Fitzpatrick, fotos reais para periocular/cicatriz/rosácea, ilustração de rosto para discromia) eleva a precisão da classificação visual. Suportar 3 tipos de mídia por opção.
- **Campos satélite por escala.** Várias escalas têm um campo livre acoplado (Grau da acne → "Localização anatômica"; Discromia → "Tipo de Discromia"; rosácea → grau por subtipo). Modelar `camposExtras[]` anexos à escala (texto/select/grau).
- **Reúso entre fichas/templates.** As mesmas escalas aparecem em "Estética Facial" e "Facial" com subconjuntos diferentes — confirma que **fichas são templates que compõem um catálogo de widgets de escala**. Modelar fichas como composição (`template → [widgets]`), não formulários fixos.
- **Corrigir o que eles erram:** rotular corretamente "Tipo IV" (eles mostram "Tipo IIII"); permitir score somatório quando a escala clínica o exigir.
