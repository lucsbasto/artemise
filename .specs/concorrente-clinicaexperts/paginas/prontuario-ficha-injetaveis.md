# Prontuário — Ficha Injetáveis

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Injetáveis**)
**Tipo:** Formulário de atendimento (mapeamento de injetáveis)
**Screenshots:** `prontuario-ficha-injetaveis.png`, `prontuario-ficha-injetaveis-mapa.png` (ponto 4 ui marcado), `prontuario-ficha-injetaveis-rastreio.png` (campos de produto)

## Propósito

Registrar aplicação de injetáveis com **mapa facial interativo** (marcar pontos de aplicação por substância, com quantidade em unidades) + rastreabilidade do produto (lote, validade, diluição).

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## Widget principal: Mapa de injetáveis (Facial)

Cabeçalho do widget: **"Injetáveis (Facial)"** — o sufixo "(Facial)" indica que o mapa é por região; provável existência de mapa corporal em outras configurações de ficha.

- **Legenda de substâncias** (coluna esq.) — 3 "canetas" pré-definidas, cada uma com cor/ícone e **contador total de unidades** acumulado:
  - 🔵 Toxina botulínica — `N ui`
  - 🔴 Ácido hialurônico — `N ui`
  - 🟢 Fio de PDO — `N ui`
- **Canvas facial** (centro): **Fabric.js** (`injectable-canvas`, 500×500). Ilustração do rosto onde se marcam pontos livres (clique em qualquer coordenada). Ferramentas flutuantes: **expandir/fullscreen** e **mover/pan (mãozinha)**.
- **Múltiplas vistas** (direita): thumbnails de ângulos do rosto (frontal + 2 perfis) + botão **"+"** para adicionar imagem/vista personalizada. **Os pontos são por vista.**
- Toggle **Exibir quantidades** — mostra/oculta os badges "N ui" sobre os pontos no mapa.

## Fluxo de marcação (ponto a ponto) — verificado

1. **Selecionar substância:** clicar na linha da substância na legenda → entra em **modo adicionar** (tooltip muda de "+ Adicionar" para **"Parar de adicionar"**; linha fica destacada).
2. **Marcar ponto:** clicar numa coordenada do rosto no canvas → cria um ponto (dot na cor da substância) naquele local anatômico.
3. **Quantidade por ponto:** abre **popup inline** com input numérico ("Digite") + **✓ confirmar** (verde) + **− remover** (vermelho). Digitar as **unidades (ui)** e confirmar (Enter ou ✓).
4. O ponto passa a exibir badge **"N ui"**; o **total da substância** na legenda soma (ex.: 2 pontos de 4 ui → legenda mostra `4,00 ui` por ponto / acumulado).
5. Permanece em modo adicionar para marcar mais pontos; clicar a substância de novo sai do modo.
6. **Editar/remover ponto:** clicar num ponto existente reabre o popup (alterar ui ou remover com −).

> Resultado: cada substância vira uma camada de pontos com unidades individuais — registro fiel de "o que foi aplicado e onde, em quantas unidades".

## Campos de rastreabilidade do produto

> ⚠️ **Importante (verificado):** estes campos são **ÚNICOS por ficha (globais)**, NÃO por substância nem por ponto. Ao preencher "Marca" e alternar entre Toxina/Ácido/PDO, o valor **persiste** (não troca por substância). Ou seja: se forem usados 2 produtos diferentes na mesma sessão, a granularidade de lote/validade é limitada a um único conjunto.

| # | Campo | Tipo | Notas |
|---|---|---|---|
| 1 | Marca | text | marca/nome do produto |
| 2 | Número do lote | text | rastreabilidade do lote |
| 3 | Data de diluição | date (datepicker) | |
| 4 | Volume de diluição | text | ex.: mL de diluente |
| 5 | Data de validade | date (datepicker) | |
| 6 | Relatório | textarea | descrição livre da aplicação |

Teste criado: ponto de **4 ui** de Toxina botulínica na testa + Marca `[DOC-TESTE] Botox Allergan 100U` (na ficha `[DOC-TESTE] Ficha 001`).

## Observações para o Artemise

- **Mapa anatômico interativo** (canvas) com pontos + unidades por ponto é diferencial premium (harmonização facial) — muito acima de um prontuário de texto.
- Modelo de dados sugerido: `ficha_injetavel` → N `pontos` (substância, vista, x, y, unidades) + 1 bloco de rastreio (marca, lote, diluição, validade). **Melhoria sobre o concorrente:** tornar rastreio (lote/validade) **por substância/produto** — limitação real deles.
- **Múltiplas vistas** (frontal/perfis + upload) = documentação por ângulo; pontos atrelados à vista.
- Contador de **ui por substância** habilita controle de custo/estoque por aplicação (1 frasco de toxina = X ui → baixa proporcional).
- Rastreabilidade lote/validade/diluição atende exigência sanitária (ANVISA) e dá segurança jurídica.
- "Exibir quantidades" (toggle) bom p/ alternar entre vista limpa (foto) e vista com dados.
