# Prontuário — Ficha Estética Facial

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Estética Facial**)
**Tipo:** Formulário de atendimento (estética facial)
**Screenshot:** `prontuario-ficha-estetica-facial.png` · escalas: `prontuario-escala-fitzpatrick.png`, `prontuario-escala-baumann.png`, `prontuario-escala-discromia-hiperpig.png`

> **Escalas dermatológicas detalhadas (verificadas com testes reais):** ver `prontuario-escalas-dermatologicas.md` — mecânica de seleção, todas as opções, tooltips e o cálculo automático do Baumann.

## Propósito

Ficha de estética facial com histórico em rich-text, classificações dermatológicas (Fitzpatrick, Baumann, acne) e mapeamento de discromias. A ficha vinha **pré-preenchida** com dados do paciente exemplo (Queixa Principal, Histórico Familiar, Tratamentos Anteriores) — confirma persistência de conteúdo rich-text.

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## Campos

| # | Pergunta / Campo | Tipo | Opções / Notas |
|---|---|---|---|
| 1 | Queixa Principal | rich-text + áudio | livre (pré-preenchido no exemplo) |
| 2 | Histórico Familiar | rich-text + áudio | livre |
| 3 | Tratamentos Anteriores | rich-text + áudio | livre |
| 4 | Alergias | rich-text + áudio | livre |
| 5 | Escala de Fitzpatrick | `image-select` (6 cards de cor) | Tipo 1–6 (fototipo), seleção única, tooltip por tipo † |
| 6 | Tipo de pele segundo Baumann | 3 dropdowns `vue-multiselect` + Resultado auto | **calcula código de 4 letras** (ex.: OPSE) † |
| 7 | Grau da acne | lista/tabela selecionável | Grau I–V × Tipo × Morfologia, seleção única † |
| 8 | Discromia facial | `image-select` (3 ilustrações de rosto) | Localização 1 · 2 · 3 |
| 9 | Tipo de hiperpigmentação periocular | `image-select` (6 fotos de olho) | Tipo 1–6, tooltip por tipo † |
| 10 | Observações | textarea | livre |
| 11 | Plano de tratamento | rich-text | livre |

† **Detalhe completo (opções, tooltips, score, testes executados):** `prontuario-escalas-dermatologicas.md`.

## Escalas (resumo verificado)

Escalas presentes nesta ficha: **Fitzpatrick** (fototipo I–VI, cards de cor + tooltip), **Baumann** (3 dropdowns → Resultado auto de 4 letras, ex.: `Oleosa Pigmentada + Sensível + Enrugada = OPSE`, recalcula em tempo real — verificado OPSE↔OPSF), **Grau da acne** (lista Grau I–V), **Discromia facial** (3 cards de rosto), **Hiperpigmentação periocular** (6 fotos de olho com tooltip). Apenas o **Baumann** tem cálculo/score automático. Mecânica e tabelas completas em `prontuario-escalas-dermatologicas.md`.

## Observações para o Artemise

- Reúso de **classificações dermatológicas padronizadas** (Fitzpatrick, Baumann, graus de acne) como widgets compartilhados entre fichas faciais.
- **Baumann com score automático** (código posicional de iniciais) é o único cálculo derivado — base para modelar escalas com fórmula configurável (ver consolidado).
- Conteúdo rich-text **persiste por ficha** e é editável a qualquer momento do atendimento.
- "Plano de tratamento" embutido na própria ficha facial (além da ficha global "Plano de tratamento") — há sobreposição/contexto por especialidade.
