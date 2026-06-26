# Prontuário — Ficha Capilar

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Capilar**)
**Tipo:** Formulário de atendimento (ficha clínica especializada — tricologia)
**Screenshot:** `prontuario-ficha-capilar.png`

## Propósito

Avaliação capilar/tricológica. Combina seletores visuais (cards com fotos/ilustrações + tooltip de ajuda), radios, campos de texto e upload de tricoscopia.

> Estrutura comum (header paciente, sidebar de fichas, rodapé timer/Privado/Finalizar) descrita em `prontuario-ficha-anamnese.md`.

## Campos

Convenção de tipos: **card** = seleção visual por imagem (cada opção tem ícone "?" com tooltip explicativo); **radio**; **text**; **textarea**; **rich-text**; **upload**.

| # | Pergunta / Campo | Tipo | Opções |
|---|---|---|---|
| 1 | Tipo de cabelo | card (imagem) | Liso · Ondulados · Crespo |
| 2 | Frequência de lavagem do cabelo | radio + texto "Outro" | Diária · A cada dois dias · A cada três dias · Semanalmente · Outro |
| 3 | Diâmetro do fio | radio | Fino · Médio · Grosso |
| 4 | Grau de oleosidade do fio | radio | Oleoso · Seco · Misto |
| 5 | Grau de oleosidade do couro cabeludo | radio | Oleoso · Seco · Descamativo |
| 6 | Elasticidade do fio | radio | Ausente · Normal · Pouca · Boa |
| 7 | Porosidade do fio | radio | Normal · Poroso · Muito poroso |
| 8 | Comprimento do cabelo | radio | Extremamente curto · Curto · Médio · Longo · Extremamente longo |
| 9 | Cor natural | text | livre |
| 10 | Cor cosmética | text | livre |
| 11 | Uso de cosméticos | textarea | livre |
| 12 | Uso de química | text | livre |
| 13 | Perda diária de fios | text | livre |
| 14 | Displasias pilosas congênitas | card (imagem) | Moniletrix · Tricorrexe invaginada · Tricopoliodistrofia · Cabelos anágenos frouxos · Síndrome dos cabelos impenteáveis |
| 15 | Displasias pilosas adquiridas | card (imagem) | Tricorrexe nodosa · Tricoptilose · Triconodose · Tricotilomania |
| 16 | Escala de Savin | card (imagem) | I-1 · I-2 · I-3 · I-4 · II-1 · II-2 · III · Avançado · Frontal |
| 17 | Escala de Norwood-Hamilton | card (imagem) | Tipo I · II · I a · III a · III · III Vértex · IV · IV a · V · V a · VI · VII |
| 18 | Alopecia areata | card (imagem) | Unifocal · Total · Multifocal · Difusa · Ofiásica · Reticular |
| 19 | Classificação etiológica de alopecias | card/seleção | classificação (agrega opções acima) |
| 20 | Tricoscopia | upload (imagem/arquivo) | exames de tricoscopia |
| 21 | Utiliza boné? | radio + "Outro" | Sim · Não · Outro |
| 22 | Utiliza o cabelo preso? | radio + "Outro" | Sim · Não · Outro |
| 23 | Utiliza secador? | radio + "Outro" | Sim · Não · Outro |
| 24 | Utiliza chapinha? | radio + "Outro" | Sim · Não · Outro |
| 25 | Observações | rich-text + áudio | livre |

## Observações para o Artemise

- **Seletores visuais por imagem** com tooltip "?" (escalas de Savin/Norwood, displasias, tipo de cabelo) elevam a precisão diagnóstica e educam o profissional — diferencial em fichas especializadas.
- Escalas clínicas reconhecidas (Savin, Norwood-Hamilton) já embutidas como opções padronizadas = laudo consistente.
- Ficha altamente especializada por área (tricologia) sugere modelo de **fichas configuráveis por especialidade**.
