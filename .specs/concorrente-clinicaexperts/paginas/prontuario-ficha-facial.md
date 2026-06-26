# Prontuário — Ficha Facial

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Facial**)
**Tipo:** Formulário de atendimento (dermatologia/estética facial avançada)
**Screenshot:** `prontuario-ficha-facial.png` · escalas: `prontuario-escala-glogau.png`, `prontuario-escala-rosacea-cicatrizes.png`, `prontuario-escala-discromia-hiperpig.png`

> **Escalas dermatológicas detalhadas (verificadas com testes reais):** ver `prontuario-escalas-dermatologicas.md` — mecânica de seleção, todas as opções, tooltips e cálculo automático.

## Propósito

Ficha facial mais clínica/dermatológica: classificações de pele, cicatrizes de acne, rosácea, discromias, fotoenvelhecimento (Glogau).

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## Campos

| # | Pergunta / Campo | Tipo | Opções / Notas |
|---|---|---|---|
| 1 | Escala de Fitzpatrick | `image-select` (6 cards de cor) | Tipo 1–6 (fototipo), tooltip por tipo † |
| 2 | Tipo de pele de Baumann | 3 dropdowns + Resultado auto | **código de 4 letras** (ex.: OPSE) † |
| 3 | Grau da acne | lista/tabela selecionável | Grau I–V × Tipo × Morfologia † |
| 4 | Localização anatômica | text | livre (referente à acne) |
| 5 | Cicatrizes de acne | `image-select` (4 fotos) | Icepick · Boxcar · Rolling · Hipertrófica (sem tooltip) † |
| 6 | Localização anatômica | text | livre (referente às cicatrizes) |
| 7 | Subtipos e grau de rosácea | `image-select` (4 cards) + dropdown de grau | Subtipo 1–4, cada um c/ tooltip + grau Suave/Moderado/Grave † |
| 8 | Discromia facial | `image-select` (3 ilustrações de rosto) | Localização 1 · 2 · 3 |
| 9 | Tipo de Discromia | text | livre |
| 10 | Tipo de hiperpigmentação periocular | `image-select` (6 fotos de olho) | Tipo 1–6, tooltip por tipo † |
| 11 | Escala de Glogau | tabela selecionável (4 linhas) | Tipo I–IV × faixa etária × rugas, tooltip por tipo † |
| 12 | Observações | textarea | livre |

† **Detalhe completo (opções, tooltips, score, testes executados):** `prontuario-escalas-dermatologicas.md`.

## Escalas (resumo verificado)

Esta ficha é a mais rica em escalas. Além de Fitzpatrick / Baumann / Grau da acne (comuns à Estética Facial), tem:

- **Cicatrizes de acne** — 4 cards de foto (Icepick · Boxcar · Rolling · Hipertrófica), seleção única, sem tooltip.
- **Subtipos e grau de rosácea** — 4 cards (Subtipo 1–4) com tooltip clínico + dropdown de grau (Suave/Moderado/Grave) por subtipo. Subtipos: 1=eritematotelangiectática, 2=papulopustular, 3=fimatosa, 4=ocular.
- **Escala de Glogau (fotoenvelhecimento)** — tabela de 4 linhas (Tipo I–IV), seleção única, tooltip por linha (ver tabela completa no consolidado). ⚠️ a 4ª linha aparece rotulada como **"Tipo IIII"** (bug de numeral romano deles). Verificado: seleção de Glogau Tipo II marca a linha (`is-filled`).

Nenhuma escala desta ficha soma pontos; só o **Baumann** gera código automático. Mecânica e tabelas completas em `prontuario-escalas-dermatologicas.md`.

## Observações para o Artemise

- Cobertura dermatológica profunda (Glogau, rosácea, cicatrizes de acne por morfologia) — posiciona o produto para dermatologia, não só estética.
- **Rosácea como widget composto** (card + grau por subtipo) é o modelo mais interessante: card de classificação + select de severidade acoplado. Reusar como padrão `card+grau`.
- Campos de **localização anatômica** acompanham cada achado (acne, cicatriz) — bom para laudo topográfico; modelar como `camposExtras[]` anexos à escala.
- Forte sobreposição com "Estética Facial": sugere que fichas são **templates configuráveis** que clínicas escolhem/adaptam por perfil de atendimento.
