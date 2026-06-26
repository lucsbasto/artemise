# Configurações — Fichas de atendimentos (Template builder de prontuário)

**Rotas:** `/configuracoes/fichas-de-atendimentos/` (listagem) · `/editar/{uuid}` · `/novo` (builder)  ·  **Tipo:** Listagem + **builder drag-and-drop**  ·  **Screenshots:** `config-fichas.png`, `config-fichas-builder.png`

## Propósito

Construtor de **modelos de prontuário/ficha de atendimento**. Cada ficha é um formulário customizável montado por drag-and-drop a partir de uma paleta rica de tipos de campo genéricos + **dezenas de widgets clínicos especializados** (escalas dermatológicas, odontograma, IMC, prescrição, etc.). É o coração da diferenciação do produto para nichos (estética, dermato, capilar, odonto, oftalmo, nutrição).

## Listagem (`/fichas-de-atendimentos/`)

- Cabeçalho: **Fichas de atendimentos** + contador (10 registros) + **Editar minhas fichas ↗** (canto superior direito).
- **Adicionar filtro**. Colunas: **Nome** · **Ativo** (toggle) · menu **⋮** por linha (**Excluir / Duplicar / Editar**).
- Fichas pré-existentes (templates de fábrica): Anamnese · Capilar · Corporal · Epilação · Estética Facial · Facial · Fotos e anexos · Injetáveis · Orçamento · Plano de tratamento.
- **FAB (+)** → nova ficha. Paginação "25 por página".

### Modal "Editar minhas fichas"
Dual-list **drag-and-drop** (transfer list) com 2 colunas: **Não mostrar** / **Mostrar** — define quais fichas aparecem e em que ordem no atendimento. Setas `» › ‹ «` movem itens; arrastar reordena. Botão Salvar.

## Builder (`/novo` e `/editar/{uuid}`)

Layout 3 zonas:
- **Esquerda — "Adicionar novo campo"**: busca ("Digite" + lupa) + paleta de campos. *"Arraste ou clique duplo para adicionar."*
- **Topo do canvas**: **Nome da ficha*** (text, obrigatório) · **Ativo*** (toggle) · **Formulário de pré-atendimento** (toggle — ficha preenchida pelo paciente antes da consulta).
- **Centro — canvas**: campos adicionados (reordenáveis); placeholder "Arraste e solte um campo aqui" quando vazio. Clicar um campo abre painel **Propriedades** (lateral direita): **Nome do campo** + **Descrição** + botão **Aplicar** (+ provável: obrigatoriedade, opções, etc.).
- Rodapé: **Cancelar / Salvar**.

### Paleta — tipos de campo genéricos
Seleção única (radio) · Seleção múltipla (checkboxes) · Seleção de imagem · Data · **Editor de texto** (rich text: B/I/U/S, cor, alinhamento, listas, undo/redo) · Envio de arquivos · Envio de imagens · Lista de itens · Lista única (dropdown) · Lista múltipla · Número · Texto · **Rótulo** (label/título) · Texto longo · **Tabela**.

### Paleta — widgets clínicos especializados (busca)
Adipometria · Alopecia areata · **Análise facial com IA** · Atestado · **Cálculo de IMC** · **CID-11** · Cicatrizes de acne · Classificação etiológica de alopécia · Curva de crescimento · Discromia facial · Displasias pilosas congênitas · Displasias pilosas adquiridas · Distribuição de gordura corporal (androide/ginóide) · **Editor de texto com modelo** · Escala de Glogau · Escala de Norwood-Hamilton · Escala de Savin · **Escala de Fitzpatrick** · Escala de Bristol · Escala de cor de urina · Escala da percepção da imagem pessoal · Estrias · Formato corporal (oval/retângulo/ampulheta/triângulo invertido/triângulo) · Formato de sobrancelha · Formatos de rosto · Formatos de unhas · Grau da acne · Grau de celulite · Hiperpigmentação periocular · **Injetáveis** · **Odontograma** · **Orçamento** (seleciona procedimentos/produtos) · Perimetria · **Prescrição** · Prescrição de óculos · **Prescrição Memed** (integração externa) · Quantificação de estrias · Subtipos e grau de rosácea · Somatótipo (Ecto/Meso/Endomorfo) · Teste de diástase de reto abdominal · **Termografia** · Tipo de cabelo · Tipo de diástase de reto abdominal · Tipo de pele de Baumann.

### Exemplo real (ficha Anamnese)
Campos: Queixa Principal (editor de texto) · Tratamentos anteriores (editor de texto) · perguntas Sim/Não (Gestante? / Tabagista? / Diabetes? / Hipertensão? / Marcapasso? / Alterações hormonais/tireóide? / Doença hepática? / Filtro solar diário? / Medicamentos contínuos? / Atividade física regular? / Já fez cirurgia?) · Patologias cutâneas (multi: Psoríase/Vitiligo/Lupus/Rosácea) · Alterações pigmentares (multi: Sardas/Manchas senis/Melasma/Manchas por sequela de cicatrizes) · Observações.

## Fluxos testados
- **Editar Anamnese** (real): abri o builder via ⋮ → Editar; **cancelei sem alterar** (regra de segurança).
- ✅ **Nova ficha**: criei **`[DOC-TESTE] Ficha 001`** (Nome + 1 campo "Texto" via duplo-clique na paleta → Aplicar propriedades → Salvar) → aparece na listagem.

## Observações para o Artemise

- **Maior diferencial competitivo observado.** O builder de prontuário com **~45 widgets clínicos especializados** (escalas dermatológicas validadas — Glogau, Fitzpatrick, Norwood-Hamilton, Savin, Baumann, Bristol; odontograma; somatótipo; adipometria; perimetria; diástase) é altíssima barreira de entrada. Cada widget encapsula conhecimento clínico de um nicho.
- **Integrações embutidas como campos**: Prescrição Memed (receituário digital BR), Análise facial com IA, CID-11. Campos não são só inputs — alguns disparam integrações/serviços.
- Distinção **ficha normal vs. "Formulário de pré-atendimento"** (paciente preenche antes) é UX inteligente: coleta dados sem ocupar tempo do profissional.
- Engine de form-builder genérica (15 tipos base: texto, número, data, seleções, listas, tabela, uploads, rich text, rótulo) + camada de widgets de domínio. Boa arquitetura: **core form engine + plugins clínicos**.
- "Editar minhas fichas" (transfer list de visibilidade/ordem) separa *o que existe* de *o que aparece pra mim* — personalização por usuário/contexto sem deletar templates.
- Para o Artemise: priorizar o core builder (tipos genéricos + obrigatoriedade + reordenação) e, se mirar estética/dermato, alguns widgets-âncora (IMC, Fitzpatrick, odontograma, prescrição) já cobrem muito caso de uso.
