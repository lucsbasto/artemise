# Prontuário — Ficha Corporal

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Corporal**)
**Tipo:** Formulário de atendimento (avaliação corporal/estética)
**Screenshots:** `prontuario-corporal-01-overview.png` (topo: distribuição gordura + IMC vazio) · `prontuario-corporal-02-imc-normal.png` (IMC calculado 24,2) · `prontuario-corporal-03-adipometria.png` (tabela de dobras) · `prontuario-corporal-04-perimetria.png` (perimetria + celulite + popup de erro Petróski)

## Propósito

Avaliação corporal/estética numa única ficha por atendimento: biotipo (distribuição de gordura), **calculadora de IMC automática**, **adipometria** (dobras cutâneas, protocolo Petróski), **perimetria** (circunferências), grau de celulite, estrias, diástase abdominal e percepção corporal (escala 1–9). Mistura cards visuais (seleção por imagem) com inputs numéricos e saídas calculadas read-only.

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`. Verificado na ficha de teste `[DOC-TESTE] Ficha 001`, paciente **Clara Ribeiro** (♀, 34 anos).

---

## 1. Calculadora de IMC — VERIFICADA (cálculo automático)

Bloco **"Cálculo de IMC"**: 2 inputs (Peso, Altura) + 3 saídas read-only (IMC, Tipo de obesidade, Grau de risco) que recalculam **instantaneamente** ao digitar (sem botão "calcular"). Ilustração de corpo feminino ao lado (decorativa).

| Campo | Tipo | Unidade | Notas |
|---|---|---|---|
| Peso | input `tel` | kg | sufixo "kg" no input |
| Altura | input `tel` | cm | sufixo "cm"; **fórmula usa metros** (ver abaixo) |
| IMC | saída read-only | Kg/m² | calculado: `peso / (altura_m)²`, 1 casa |
| Tipo de obesidade | saída read-only | — | classificação OMS (texto) |
| Grau de risco | saída read-only | — | risco associado (texto) |

### Fórmula confirmada
`IMC = peso(kg) / (altura(cm)/100)²` — altura digitada em **cm**, convertida para metros internamente.
Ex.: 70 kg / 1,70² = **24,2** (app exibe `24,2 Kg/m²`, batendo com 24,22 arredondado a 1 casa).

### Tabela de classificação (6 valores testados, mesma altura 170 cm)

| Peso | IMC exibido | Tipo de obesidade | Grau de risco | Faixa OMS |
|---|---|---|---|---|
| 50 kg | 17,3 | Ausente | **Peso abaixo do normal** | < 18,5 |
| 70 kg | 24,2 | Ausente | **Peso saudável** | 18,5–24,9 |
| 80 kg | 27,7 | **Sobrepeso** | Moderado | 25–29,9 |
| 95 kg | 32,9 | **Grau I** | Alto | 30–34,9 |
| 110 kg | 38,1 | **Grau II** | Muito alto | 35–39,9 |
| 130 kg | 45,0 | **Grau III (mórbida)** | Extremo | ≥ 40 |

→ Classificação dupla: "Tipo de obesidade" (Ausente / Sobrepeso / Grau I / Grau II / Grau III (mórbida)) **+** "Grau de risco" (Peso abaixo do normal / Peso saudável / Moderado / Alto / Muito alto / Extremo). Segue a tabela OMS padrão. "Tipo de obesidade" = **Ausente** para tudo abaixo de sobrepeso.

---

## 2. Adipometria (dobras cutâneas) — VERIFICADA

Bloco **"Adipometria"** com select **Protocolo** + hint: *"Utilize o Protocolo de Petróski para calcular o percentual de gordura."*

- **Protocolo** (dropdown custom, não `<select>` nativo): opções = `Selecione` · **`Petróski`** (única opção de protocolo).
- Tabela: colunas **Dobra | 1ª Medida | 2ª Medida | 3ª Medida | Mediana**.
- **9 dobras** (linhas), cada uma com ícone de ajuda "?": **Tricipital, Subescapular, Biciptal, Axilar, Ilíaca, Supraespinhal, Abdominal, Coxa, Panturrilha**.
- 9 × 3 = **27 inputs** (`tel`, unidade **mm**, valor direto ex. `10.00`) + coluna **Mediana** read-only (`0,00 mm`).

### Cálculo da Mediana — confirmado é MEDIANA estatística (não média)
- Tricipital `10, 14, 12` → Mediana `12,00 mm` ✓
- Tricipital `10, 20, 12` → Mediana `12,00 mm` (média seria 14,00 → **descarta média**, é a mediana dos 3 valores) ✓

### ⚠️ BLOQUEIO: percentual de gordura (Petróski) não exercitável nesta ficha
Selecionar **Petróski** dispara erro de validação **reprodutível** (testado 2×) e o protocolo **reverte para "Selecione"**:
> **"Os dados fornecidos estão inválidos — O valor selecionado para o campo `templates.0.fields.0.uuid` é inválido."**

Com o protocolo não-persistido, **nenhum `% de gordura` é calculado** (preenchidas todas as dobras: nenhum valor `%` aparece na página). O cálculo de percentual de gordura existe no produto (hint explícito) mas está **inacessível neste atendimento de teste** — provável template/ficha com uuid de campo inválido. Não foi possível confirmar a fórmula de % de gordura nem variáveis (idade/sexo do paciente entram no Petróski).

---

## 3. Perimetria (circunferências) — VERIFICADA

Bloco **"Perimetria"** — layout em 2 colunas, **9 campos** (`tel`), todos exibindo **`0,00 mm`**:
**Braço · Braço Contraído · Tórax · Cintura · Quadril · Coxa mediana · Panturrilha · Úmero · Fêmur**.

- **Máscara de 2 decimais** (os 2 últimos dígitos são centesimais): digitar `"80"` → `0,80 mm`; digitar `"8000"` → **`80,00 mm`**. (Comportamento diferente da adipometria, que aceita valor direto.)
- Teste: Cintura `8000` → `80,00 mm`; Quadril `10000` → `100,00 mm` ✓
- **Unidade exibida = "mm"** (provável quirk; circunferências corporais seriam naturalmente cm — 80 mm de cintura é irreal). Documentado como exibido.

### ⚠️ NÃO há RCQ (Relação Cintura-Quadril)
Após preencher Cintura + Quadril, **nenhuma RCQ / razão é calculada** (busca por `RCQ|relação|cintura-quadril` na página = nada). Perimetria é apenas armazenamento de circunferências brutas, sem derivações.

---

## 4. Demais campos (cards de seleção visual + texto)

| # | Campo | Tipo | Opções / Notas |
|---|---|---|---|
| a | Distribuição de gordura corporal | card (imagem) | **Androide** · **Ginoide** |
| b | Grau de celulite | card (imagem) | Grau 01 · Grau 02 · Grau 03 · Grau 04 |
| c | Estrias | card (imagem) | Rubra · Alba |
| d | Observações | textarea | livre |
| e | Teste de diástase de reto abdominal | card | Negativo · Positivo |
| f | Tipo de diástase de reto abdominal | card | Tipo A · Tipo B · Tipo C · Tipo D |
| g | Observações | textarea | livre |
| h | Aparência percebida | card (escala) | 1–9 |
| i | Aparência desejada | card (escala) | 1–9 |

## 5. Gráfico de evolução
**Não existe** nesta ficha. É um snapshot por atendimento (sem `evolução/histórico/gráfico` no texto; os 19 `svg` da página são ícones/ilustrações, não charts). Evolução entre sessões teria de ser montada comparando atendimentos.

---

## Fórmulas observadas (resumo)

- **IMC** = `peso(kg) / (altura(cm)/100)²` → 1 casa decimal. Classificação OMS dupla (Tipo de obesidade + Grau de risco), tabela na seção 1.
- **Mediana da dobra** = mediana estatística das 3 medidas (não média).
- **% de gordura (Petróski)** = existe no produto mas **bloqueado** (erro de uuid de template) — fórmula não confirmada.
- **RCQ** = **não calculado** pelo sistema.

## Observações para o Artemise

- **Calculadora de IMC com classificação dupla automática** (Tipo de obesidade + Grau de risco, OMS) é forte e barata de replicar: 2 inputs → 3 saídas instantâneas, sem botão. Reaproveitar a tabela de faixas exata (seção 1) garante paridade com o concorrente.
- **Adipometria com 3 medidas + mediana por dobra** (boa prática clínica: 3 aferições, usa a do meio) — replicar a mediana, não a média. 9 sítios de dobra padrão.
- **Oportunidade de superar o concorrente:** (1) o **% de gordura (Petróski) está quebrado** na ficha deles (erro `templates.0.fields.0.uuid`) — entregar um cálculo de % gordura **funcional** (Petróski/Pollock/Guedes, com idade+sexo do paciente) já é diferencial; (2) **calcular RCQ** (cintura/quadril) automaticamente com classificação de risco — eles coletam cintura e quadril mas **não derivam a razão**, baixo esforço/alto valor clínico.
- **Padronizar unidades:** perimetria deles exibe "mm" para circunferências (provável bug/UX ruim). No Artemise usar **cm** com máscara coerente; evitar a máscara /100 confusa (digitar "8000" para 80,00).
- **Gráfico de evolução de medidas** (peso/IMC/circunferências/dobras ao longo das sessões) é ausente aqui — diferencial óbvio: prontuário corporal com timeline evolutiva por medida.
- **Cards visuais de seleção** (androide/ginoide, graus de celulite, estrias, diástase tipo A–D, escala de aparência 1–9) tornam a coleta rápida e padronizada — bom modelo de UX para reaproveitar (seleção por imagem > digitar).
- Escala **aparência percebida vs. desejada (1–9)** captura expectativa/satisfação do paciente — útil para alinhamento e marketing de resultado.
