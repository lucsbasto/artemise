# Mapa de Injetáveis Facial — Mão-livre + Selecionável (Specification)

## Problem Statement

Sistemas de prontuário estético registram aplicação de injetáveis (toxina botulínica, ácido
hialurônico, fios) marcando pontos num mapa facial. O concorrente **Clínica Experts** oferece
**apenas modo mão-livre** (canvas Fabric.js: clique em qualquer coordenada → ponto + unidades),
com três limitações que queremos superar no Artemise:

1. **Sem modo selecionável**: não há regiões anatômicas pré-mapeadas (testa, glabela, pés-de-galinha…).
   O profissional clica "no olho" sem padronização — dificulta relatórios agregados por região e
   comparação entre sessões.
2. **Rastreabilidade global, não por substância**: marca/lote/validade/diluição são um único bloco
   para a ficha inteira. Usar 2 produtos na mesma sessão = rastreio impreciso.
3. **Sem escolha de modo**: o profissional não pode alternar entre precisão livre e padronização por região.

Queremos um componente de mapa facial onde o profissional **escolhe o modo** (mão-livre ou selecionável),
com **regiões configuráveis pela clínica**, e rastreabilidade **por substância/produto**.

## Goals

- [ ] Componente `<MapaInjetaveis>` (React/TS) reutilizável na ficha de atendimento.
- [ ] **Toggle de modo** por ficha: `Mão livre` ⇄ `Selecionável`.
- [ ] **Mão livre**: clicar em qualquer coordenada do rosto cria ponto na substância ativa + quantidade (ui).
- [ ] **Selecionável**: clicar numa **região anatômica pré-definida** aplica naquela região; soma unidades por região.
- [ ] **Regiões configuráveis pela clínica** (CRUD em Configurações): nome, polígono/marcador na imagem, lado (E/D/centro).
- [ ] **Substâncias** configuráveis (cor, ícone, unidade) — ao menos Toxina/Ácido/Fio de PDO padrão.
- [ ] **Rastreabilidade por substância**: marca, lote, diluição, validade — um conjunto **por substância** usada.
- [ ] Toggle **Exibir quantidades** (badges ui on/off).
- [ ] **MVP = só vista frontal do rosto** (imagem base já definida — ver abaixo). Múltiplas vistas (perfis) ficam para V2.
- [ ] Zero regressão: `tsc --noEmit` ✅, eslint ✅, build ✅ (no main pós-merge).

## Imagem base (definida)

Asset CC0 (domínio público) já no projeto:

- **Arquivo:** `web/public/mapa-injetaveis/face-frontal.svg` → servido em **`/mapa-injetaveis/face-frontal.svg`**.
- **Conteúdo:** rosto frontal feminino em line-art (olhos, sobrancelhas, nariz, lábios, contorno do cabelo). `viewBox="0 0 729 1280"` (path único traçado, `fill #000`).
- **Licença:** CC0 / domínio público (FreeSVG / Pixabay) — uso comercial livre, sem atribuição. Original em `docs/2029666.svg`.
- **Uso:** camada de fundo do mapa. As coordenadas de pontos e regiões são **relativas 0..1** sobre esse `viewBox` (independem do tamanho renderizado). Para recolorir o traço, sobrescrever `fill`/`stroke` via CSS.
- **Substituição:** trocar a base = só repor este arquivo (mesmo caminho). É o único lugar que referencia a imagem.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Mapa **corporal** | Esta fase é só facial; corporal vira spec própria depois. |
| **Vistas de perfil** (perfil E/D) | MVP é só vista **frontal**. Perfis ficam para V2 (precisam de novos assets de imagem). |
| Backend/persistência real | App é mock client-side (`useCollection` + stores); estado fica no store mock. |
| Cálculo de baixa de estoque por ui | Integração com módulo Estoque é fase posterior; aqui só registra unidades. |
| Importar imagem facial custom do paciente (foto real) | V2; nesta fase usa ilustração padrão por vista. |
| IA de sugestão de pontos | Fora de escopo. |

---

## Conceitos e modelo de dados (mock-compatible)

```ts
// Configuração da clínica (Configurações → Injetáveis)
type SubstanciaInjetavel = {
  id: string;
  nome: string;            // "Toxina botulínica"
  cor: string;             // hex do marcador
  icone: 'dot' | 'triangle' | 'square';
  unidade: string;         // "ui", "ml"
  ativo: boolean;
};

type VistaFacial = 'frontal' | 'perfil-esquerdo' | 'perfil-direito';

type RegiaoFacial = {            // configurável pela clínica
  id: string;
  nome: string;                  // "Glabela", "Pés-de-galinha"
  vista: VistaFacial;
  lado: 'esquerdo' | 'direito' | 'centro' | null;
  // marcador no mapa: ponto âncora (modo selecionável) e/ou polígono (área clicável)
  ancora: { x: number; y: number };      // 0..1 relativo à imagem
  poligono?: Array<{ x: number; y: number }>;
  ativo: boolean;
};

// Registro no atendimento
type ModoMapa = 'mao-livre' | 'selecionavel';

type PontoAplicacao = {
  id: string;
  substanciaId: string;
  vista: VistaFacial;
  modo: ModoMapa;
  // mão-livre: coordenada livre. selecionável: herda âncora da região + regiaoId
  x: number;                     // 0..1 relativo
  y: number;                     // 0..1 relativo
  regiaoId?: string;             // só no modo selecionável
  unidades: number;              // ui aplicadas neste ponto
};

type RastreioProduto = {         // POR SUBSTÂNCIA (diferencial vs concorrente)
  substanciaId: string;
  marca: string;
  numeroLote: string;
  dataDiluicao?: string;         // ISO date
  volumeDiluicao?: string;
  dataValidade?: string;         // ISO date
};

type FichaInjetaveis = {
  atendimentoId: string;
  modo: ModoMapa;                // toggle por ficha (default da clínica)
  pontos: PontoAplicacao[];
  rastreio: RastreioProduto[];   // 1 por substância usada
  relatorio?: string;            // texto livre
  exibirQuantidades: boolean;
};
```

---

## User Stories

### P1: Marcar aplicação em modo mão-livre ⭐ MVP

**User Story**: Como profissional, quero clicar em qualquer ponto do rosto e registrar a substância e
as unidades aplicadas, para documentar livremente onde apliquei.

**Why P1**: É o comportamento-base (paridade com o concorrente) e o núcleo do registro clínico.

**Acceptance Criteria**:
1. WHEN o modo é `mão-livre` AND seleciono uma substância na legenda THEN o sistema SHALL entrar em
   "modo adicionar" (cursor de marcação; legenda destacada).
2. WHEN clico numa coordenada do mapa em modo adicionar THEN o sistema SHALL criar um `PontoAplicacao`
   naquela coordenada (0..1 relativa) com a substância e vista ativas.
3. WHEN crio um ponto THEN o sistema SHALL abrir input inline de **unidades** com confirmar (✓) e remover (−).
4. WHEN confirmo as unidades THEN o ponto SHALL exibir badge `N {unidade}` e o **total da substância** na
   legenda SHALL somar todos os pontos daquela substância na ficha.
5. WHEN clico num ponto existente THEN o sistema SHALL reabrir o input para editar unidades ou remover.
6. WHEN clico fora ou deseleciono a substância THEN o sistema SHALL sair do "modo adicionar".

**Independent Test**: Em modo mão-livre, selecionar Toxina, clicar na testa, digitar 4 → ver badge "4 ui"
e legenda Toxina = 4 ui; clicar o ponto e mudar para 6 → legenda atualiza.

---

### P2: Alternar entre modos Mão-livre e Selecionável ⭐ MVP

**User Story**: Como profissional, quero um toggle para escolher entre clicar livremente ou escolher
regiões pré-definidas, para padronizar quando quiser e ter liberdade quando precisar.

**Why P2**: É o pedido central do usuário — a opção de escolha entre os dois modos.

**Acceptance Criteria**:
1. WHEN abro a ficha de injetáveis THEN o sistema SHALL exibir um toggle `Mão livre | Selecionável`
   com o default configurado pela clínica.
2. WHEN alterno o modo THEN o sistema SHALL preservar os pontos já marcados (cada ponto guarda seu próprio `modo`).
3. WHEN o modo é `selecionável` THEN o mapa SHALL destacar as **regiões anatômicas** configuradas (marcadores/áreas clicáveis).
4. WHEN clico numa região (modo selecionável) com substância ativa THEN o sistema SHALL criar/somar
   aplicação **naquela região** (ponto ancorado à região) e pedir unidades.
5. WHEN passo o mouse sobre uma região THEN o sistema SHALL exibir o nome da região (tooltip).
6. IF não há regiões configuradas para a vista atual THEN o modo selecionável SHALL exibir aviso
   "Nenhuma região configurada — configure em Configurações → Injetáveis" e permitir trocar p/ mão-livre.

**Independent Test**: Alternar para Selecionável → ver regiões destacadas; clicar "Glabela", aplicar 2 ui →
ponto fica ancorado na glabela; alternar para Mão livre → pontos continuam visíveis.

---

### P3: Regiões anatômicas configuráveis pela clínica

**User Story**: Como administrador da clínica, quero cadastrar/editar as regiões faciais de aplicação,
para adaptar o mapa ao protocolo da minha clínica.

**Why P3**: Decisão do usuário — regiões vêm da configuração da clínica (não fixas no código).

**Acceptance Criteria**:
1. WHEN acesso Configurações → Injetáveis → Regiões faciais THEN o sistema SHALL listar as regiões
   (nome, vista, lado, ativo) com ações criar/editar/excluir/ativar.
2. WHEN crio/edito uma região THEN o sistema SHALL permitir definir nome, vista, lado e o **marcador
   âncora** clicando na imagem do rosto (captura x,y relativos).
3. WHEN salvo uma região THEN ela SHALL aparecer no modo Selecionável das fichas daquela vista.
4. WHEN desativo uma região THEN ela SHALL sumir do mapa de novas fichas (pontos históricos preservados).
5. The system SHALL vir com um **conjunto-semente** de regiões faciais comuns (testa, glabela,
   pés-de-galinha E/D, malar E/D, sulco nasolabial E/D, mento, código de barras) que a clínica pode editar.

**Independent Test**: Criar região "Bigode chinês E" na vista frontal, marcar âncora na imagem, salvar →
abrir ficha em modo Selecionável e ver a nova região clicável.

---

### P4: Rastreabilidade por substância

**User Story**: Como profissional, quero registrar marca/lote/validade/diluição **de cada produto**
usado, para rastreabilidade sanitária correta quando uso mais de um produto.

**Why P4**: Corrige a limitação do concorrente (bloco único global).

**Acceptance Criteria**:
1. WHEN uso uma substância (≥1 ponto) THEN o sistema SHALL exibir um bloco de rastreio **para aquela substância**.
2. The system SHALL coletar por substância: Marca, Número do lote, Data de diluição, Volume de diluição, Data de validade.
3. WHEN alterno a substância ativa THEN os campos de rastreio SHALL refletir os dados **daquela** substância (não compartilhados).
4. WHEN exporto/imprimo a ficha THEN o sistema SHALL listar o rastreio por substância junto das unidades totais.

**Independent Test**: Aplicar Toxina (lote A) e Ácido (lote B) na mesma ficha → cada um mantém seu próprio lote.

---

### P5: Exibir quantidades (vista frontal — MVP)

**User Story**: Como profissional, quero ligar/desligar os números no mapa, para ter uma vista limpa
para foto e uma vista com dados para o registro.

**Why P5**: MVP usa **só a vista frontal** (asset `face-frontal.svg`). O seletor de múltiplas vistas
(perfis) fica para V2 — ver Out of Scope.

**Acceptance Criteria**:
1. The system SHALL renderizar o mapa sobre a vista **frontal** (`/mapa-injetaveis/face-frontal.svg`).
2. WHEN desligo "Exibir quantidades" THEN os badges de ui SHALL ocultar (pontos continuam visíveis).

**Independent Test**: Marcar 2 pontos com unidades → desligar "Exibir quantidades" oculta os badges; ligar volta a mostrar.

> **V2 (fora do MVP):** seletor de vistas frontal/perfil-E/perfil-D, com `vista` por ponto/região
> (o modelo de dados já prevê `VistaFacial`). Requer novos assets de perfil.

---

## UX / Layout

- **Coluna esquerda — Legenda de substâncias**: lista com cor/ícone + total `N {unidade}`; clicar seleciona (modo adicionar).
- **Centro — Mapa** (`<canvas>` ou SVG sobre `<img>` da vista):
  - Toggle **Mão livre | Selecionável** no topo do mapa.
  - Modo selecionável: regiões com realce sutil + tooltip de nome no hover.
  - Pontos: dot/triângulo/quadrado na cor da substância + badge `N ui`.
  - Ferramentas: fullscreen, pan/zoom.
- **Direita — Vistas**: thumbnails (frontal/perfil E/perfil D).
- **Abaixo — Rastreio da substância ativa** (P4) + **Relatório** (textarea) + toggle **Exibir quantidades**.

## Decisões técnicas

- Coordenadas **relativas (0..1)** à imagem → responsivo e independente de resolução do canvas.
- Render: SVG preferível a canvas raster (regiões clicáveis com `<polygon>`/`<circle>`, hit-testing nativo, acessibilidade, export fácil). Canvas só se performance exigir.
- Estado no store mock (`useCollection`/zustand-like), seguindo padrão dos demais módulos.
- Componente em `web/src/components/ficha/` (ex.: `mapa-injetaveis.tsx`) + config em rota de Configurações.

## Referência

- Doc do concorrente (comportamento atual e limitações): `.specs/concorrente-clinicaexperts/paginas/prontuario-ficha-injetaveis.md`.

## Tasks

Ver `tasks.md` (a gerar após aprovação desta spec).
