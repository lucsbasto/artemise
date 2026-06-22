# Configurações / Modelos de Atestados e Prescrições

| Metadado | Valor |
|----------|-------|
| **Página** | Configurações / Modelos de Atestados e Prescrições |
| **Rota** | `/configuracoes/modelos-de-atestados-e-prescricoes` |
| **Rota (modal aberto)** | `/configuracoes/modelos-de-atestados-e-prescricoes?settings_modal_type=medical_document_template&medic...` (query truncada na captura) |
| **Módulo** | Configurações |
| **Tela cruzada** | `06-telas-51-a-58.md` → Tela 58 |
| **Modal documentado** | "Editar modelo de atestado" |
| **App** | app.clinicaexperts.com.br |
| **Idioma** | pt-BR |
| **Perfil de acesso** | Administrador / Gestor da clínica (inferido) |
| **Captura** | `Captura de tela 2026-06-22 154017.png` |

![](../../images/Captura de tela 2026-06-22 154017.png)

---

## 1. Visão geral e propósito

Esta página pertence ao módulo **Configurações** do SaaS "Clínica Experts" e tem por
finalidade **cadastrar, listar, editar e manter os modelos de documentos clínicos** —
atestados, prescrições e receitas — que ficam disponíveis para emissão durante o
atendimento ao paciente.

Cada modelo é um documento-base, composto por:

- um **nome** identificador (ex.: "Atestado");
- um **tipo** (atestado, prescrição ou receita — ver §6) (inferido a partir do título do modal "Editar modelo de **atestado**" e do nome da página "Modelos de atestados **e prescrições**");
- um **corpo de texto rico** (WYSIWYG) com formatação;
- **variáveis dinâmicas** (placeholders / chips) que são **substituídas por dados reais** (paciente, clínica, profissional, data) no momento da emissão.

O propósito de produto é padronizar a documentação médica/clínica, reduzir retrabalho e
garantir consistência (cabeçalho, dados da clínica, dados do profissional emissor) em
todos os documentos emitidos.

Na captura, a tela está com o **modal "Editar modelo de atestado" aberto** sobre a
listagem (atenuada pelo overlay escuro). O card de fundo mostra o título
**"Modelos de atestados e prescrições"** com o contador **"1 registro"**.

---

## 2. Layout geral e chrome comum

Reaproveita os elementos de chrome documentados nas demais telas do módulo
Configurações (ver `06-telas-51-a-58.md`, seção "Elementos comuns a todas as telas"):

- **Header superior (faixa branca):** menu hambúrguer (☰), logotipo **"clínicaexperts"**; à direita ícone WhatsApp, lupa de busca/atalhos, link **"Ajuda"** (com ⓘ), sino de notificações e avatar **"LB"**.
- **Sidebar esquerda (ícones verticais):** ícone de engrenagem (**Configurações**) destacado em roxo (módulo ativo). Rodapé com seta (›) de expandir/recolher.
- **Breadcrumb (área principal):** `Configurações / Modelos de atestados e prescrições` ("Configurações" clicável em roxo).
- **Fundo da área principal:** cinza muito claro com card branco centralizado.
- **Widgets fixos (canto inferior direito):** balão laranja de gamificação ("Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😅"), botão flutuante roxo de assistente/IA (sparkle), card **"Seu progresso"** com **"0%"**.
- **FAB:** botão circular roxo **"+"** (canto inferior direito) — criar novo modelo.

> Observação: o segundo monitor (jogo) visível na captura original foi ignorado; documenta-se exclusivamente `app.clinicaexperts.com.br`.

---

## 3. Listagem de modelos (card de fundo)

A página principal exibe um card branco centralizado com a lista de modelos. Na
captura, está parcialmente coberto pelo modal, então os itens abaixo combinam o que é
visível com o padrão das demais listagens do módulo.

### 3.1 Cabeçalho do card

- **Título:** **"Modelos de atestados e prescrições"**.
- **Contador (cinza, ao lado do título):** **"1 registro"** (texto exato visível: aparenta "1registro" por compressão de renderização; padrão do app é "N registros").
- **(inferido)** À direita: botão **"Exportar"** com seta dropdown (▾), seguindo o padrão das telas de listagem do módulo (Procedimentos, Fichas).

### 3.2 Barra de filtros

- Link/botão **"+ Adicionar filtro"** (roxo, à esquerda).
- Campo de busca à direita com placeholder **"Buscar"**.

### 3.3 Tabela de modelos

Colunas (combinação do visível + inferência pelo padrão do módulo):

| Coluna | Conteúdo | Observação |
|--------|----------|------------|
| **Nome** | Nome do modelo (ex.: "Atestado") | com ícone de ordenação ⇅ (inferido) |
| **Tipo** *(inferido)* | Atestado / Prescrição / Receita | classifica o documento; ver enum §6 |
| **Ativo** *(inferido)* | toggle/switch verde (ligado/desligado) | padrão das listagens do módulo |
| **Ações** | menu de três pontos verticais **⋮** | editar / duplicar / excluir (inferido) |

- **(inferido)** Ícone de engrenagem (⚙) no canto direito do cabeçalho para configurar colunas visíveis.
- Linha de exemplo conhecida: **"Atestado"** (o único registro existente — "1 registro").

### 3.4 Rodapé / paginação (inferido)

- Seletor **"25 por página"** (dropdown).
- Controles de paginação: **«** **‹** **1** **›** **»** (página 1 ativa, destaque roxo).

### 3.5 Ações de criação

- **FAB roxo "+"** (canto inferior direito) — abre o modal de criação de novo modelo.
- **(inferido)** Empty state (quando sem registros): ícone ⓘ, título **"Hmm, está vazio por aqui!"**, subtítulo **"Nenhum registro encontrado."** e botão de adicionar — conforme padrão da Tela 54.

---

## 4. Modal "Editar modelo de atestado"

Modal **grande (quase tela cheia)**, centralizado sobre a listagem, com fundo escurecido
(overlay). Fundo branco. Estrutura vertical: cabeçalho → linha de Nome + toggle Ativo →
campo Modelo (toolbar + editor WYSIWYG) → rodapé com botão de ação.

### 4.1 Cabeçalho do modal

| Elemento | Texto / Tipo | Posição |
|----------|--------------|---------|
| Título | **"Editar modelo de atestado"** | superior esquerdo |
| Fechar | botão **"×"** (X) | superior direito |

> No fluxo de criação, o título correspondente é **"Novo modelo de atestado"** (inferido pelo padrão dos demais modais do módulo).

### 4.2 Campos do modal

Tabela completa dos campos visíveis, com rótulo exato, tipo, obrigatoriedade e
valor/estado na captura:

| # | Rótulo exato | Tipo de controle | Obrigatório | Valor/estado na captura | Observações |
|---|--------------|------------------|-------------|--------------------------|-------------|
| 1 | **Nome** | Campo de texto (input, largura quase total) | Não marcado com `*` na captura → **opcional na UI** (mas funcionalmente esperado; ver §7) | **"Atestado"** | Identificador do modelo exibido na listagem. |
| 2 | **Ativo** | Toggle / switch (verde quando ligado) | Não | **Ligado** (verde) | Controla se o modelo aparece disponível para emissão. Posicionado no canto superior direito, alinhado à linha do campo Nome. |
| 3 | **Modelo*** | Editor de texto rico (rich text / WYSIWYG) com toolbar | **Sim** (asterisco `*`) | Conteúdo de atestado preenchido (ver §4.4) | Corpo do documento. Único campo marcado como obrigatório. |
| 4 | **Tipo** *(inferido)* | Dropdown (atestado / prescrição / receita) | inferido obrigatório | não visível no modal "Editar modelo de atestado" (provavelmente fixado pelo contexto de entrada / `settings_modal_type`) | Ver enum §6. Pode ser definido no momento de criação e não reexibido na edição. |

> **Nota sobre obrigatoriedade:** na captura, **apenas "Modelo*"** exibe asterisco. "Nome" aparece sem `*`. Mantém-se a documentação fiel ao visível; a recomendação de implementação (§13) é tornar "Nome" obrigatório por consistência.

### 4.3 Barra de ferramentas do editor (toolbar WYSIWYG)

Da esquerda para a direita, exatamente como na captura:

| Ordem | Controle | Função |
|-------|----------|--------|
| 1 | Dropdown **"Texto normal"** (▾) | Estilo de bloco/parágrafo (Texto normal, Título 1, Título 2... — inferido) |
| 2 | **"−"** | Diminuir tamanho da fonte |
| 3 | **"15"** | Tamanho de fonte atual (valor numérico editável) |
| 4 | **"+"** | Aumentar tamanho da fonte |
| 5 | **B** | Negrito (bold) |
| 6 | **I** | Itálico (italic) |
| 7 | **U** | Sublinhado (underline) |
| 8 | **A** | Cor do texto |
| 9 | Ícone de marca-texto/realce | Cor de realce/destaque (highlight) |
| 10 | Ícone de imagem | Inserir imagem |
| 11 | Alinhar à esquerda | **Ativo** (destacado em roxo) |
| 12 | Alinhar ao centro | Alinhamento centralizado |
| 13 | Alinhar à direita | Alinhamento à direita |
| 14 | Justificar | Texto justificado |
| 15 | Lista com marcadores | Bullet list |
| 16 | Lista numerada | Ordered list |
| 17 | Ícone `{}` (código/chaves) | **Inserir variável dinâmica** (paleta de placeholders) (inferido — coerente com os chips lilás no corpo) |
| 18 | Ícone **"Tₓ"** | Limpar formatação (clear formatting) |
| 19 | **↶** | Desfazer (undo) |
| 20 | **↷** | Refazer (redo) |
| 21 | Ícone **⛶** | Expandir / tela cheia (fullscreen do editor) |

### 4.4 Corpo do editor — conteúdo do modelo "Atestado"

Conteúdo exato renderizado, com as variáveis dinâmicas exibidas como **chips em fundo
lilás/roxo claro** inseridos inline no texto:

- **Título (fonte grande, bold):** **"ATESTADO MÉDICO"**
- Parágrafo:
  > "Atesto, para os devidos fins, que o paciente **`Nome completo`** , esteve sob cuidados médicos na **`Nome da clínica`** ."
- Linha: **"Local:"** **`Endereço da clínica`**
- Linha: **`Data de hoje`**
- (linha em branco / espaço)
- Linha: **`Nome do profissional`**
- Linha: **`Conselho do profissional`**

**Variáveis dinâmicas identificadas no corpo (chips):**

| Chip (rótulo exibido) | Substituído por (inferido) | Fonte do dado |
|-----------------------|----------------------------|---------------|
| **`Nome completo`** | Nome completo do paciente | Cadastro do paciente |
| **`Nome da clínica`** | Nome fantasia/razão social da clínica | Configurações › Dados da Clínica (Tela 51) |
| **`Endereço da clínica`** | Endereço comercial completo da clínica | Configurações › Dados da Clínica |
| **`Data de hoje`** | Data de emissão do documento | Data corrente no ato da emissão |
| **`Nome do profissional`** | Nome do profissional emissor | Cadastro do profissional logado/emissor |
| **`Conselho do profissional`** | Conselho/registro profissional (ex.: CRM, CRO + número) | Cadastro do profissional |

> A solicitação menciona variáveis genéricas como `{paciente}`, `{data}`, `{medico}`,
> `{CID}`. No produto real, os chips usam **rótulos legíveis em pt-BR** (ex.:
> `Nome completo`, `Data de hoje`, `Nome do profissional`) e não os tokens
> `{paciente}`/`{data}`. Uma variável de **CID** não aparece neste modelo de atestado
> específico, mas é esperada no catálogo de variáveis para prescrições/atestados com
> diagnóstico (inferido — ver §6 e §7).

### 4.5 Rodapé do modal

| Elemento | Texto exato | Estilo | Posição |
|----------|-------------|--------|---------|
| Botão de ação | **"Salvar"** | Botão roxo preenchido | Centralizado no rodapé |

> No fluxo de criação, o botão pode ser **"Cadastrar"** (padrão observado em outros
> modais do módulo, ex.: Tela 54), enquanto na edição é **"Salvar"** (inferido).

---

## 5. Catálogo de variáveis dinâmicas (paleta) (inferido)

Lista esperada de variáveis disponíveis via o botão `{}` da toolbar, agrupadas por
origem. As confirmadas na captura estão marcadas; as demais são inferidas pelo domínio.

| Variável (rótulo) | Grupo | Confirmada na captura |
|-------------------|-------|------------------------|
| `Nome completo` | Paciente | ✅ |
| `Data de nascimento` | Paciente | (inferido) |
| `CPF` | Paciente | (inferido) |
| `Idade` | Paciente | (inferido) |
| `Nome da clínica` | Clínica | ✅ |
| `Endereço da clínica` | Clínica | ✅ |
| `CNPJ da clínica` | Clínica | (inferido) |
| `Telefone da clínica` | Clínica | (inferido) |
| `Nome do profissional` | Profissional | ✅ |
| `Conselho do profissional` | Profissional | ✅ |
| `Especialidade do profissional` | Profissional | (inferido) |
| `Data de hoje` | Sistema | ✅ |
| `CID` | Atendimento/Diagnóstico | (inferido) |
| `Número de dias de afastamento` | Atendimento | (inferido, típico de atestado) |

---

## 6. Modelo de dados — `ModeloDocumento` (inferido)

Entidade que representa um modelo de documento clínico. Nomes de campos sugeridos
(snake_case / camelCase conforme convenção do backend).

### 6.1 Entidade `ModeloDocumento` (`MedicalDocumentTemplate`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID / int | sim | Identificador único. |
| `clinica_id` | UUID / int (FK) | sim | Clínica proprietária do modelo (multi-tenant). |
| `nome` | string | sim* | Nome exibido na listagem ("Atestado"). (*opcional na UI atual; ver §4.2) |
| `tipo` | enum `TipoDocumento` | sim | Atestado / Prescrição / Receita (ver §6.2). |
| `conteudo` | text / HTML (rich) | sim | Corpo WYSIWYG do modelo, com tokens de variáveis embutidos (`Modelo*`). |
| `conteudo_formato` | enum (`html` \| `delta` \| `json`) | sim | Formato de serialização do editor (ex.: HTML ou Quill/TipTap Delta). |
| `ativo` | boolean | sim | Disponível para emissão (toggle "Ativo"). Default `true`. |
| `profissional_id` | UUID / int (FK, nullable) | não | Vínculo opcional a um profissional específico (ver §7). |
| `criado_em` | datetime | sim | Timestamp de criação. |
| `atualizado_em` | datetime | sim | Timestamp da última atualização. |
| `criado_por` | UUID / int (FK usuário) | sim | Usuário autor. |

### 6.2 Enum `TipoDocumento` (`TipoModeloDocumento`) (inferido)

| Valor (chave) | Rótulo pt-BR | Observação |
|---------------|--------------|------------|
| `atestado` | Atestado | Declaração de comparecimento / afastamento. Caso da captura. |
| `prescricao` | Prescrição | Orientações/prescrição clínica. |
| `receita` | Receita | Receituário (medicamentos). Pode subdividir em comum/controlada (inferido). |

### 6.3 Variáveis dinâmicas (`VariavelDocumento`) (inferido)

Representação dos tokens substituíveis. Pode ser uma tabela de referência ou um
catálogo estático no código.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `chave` | string | Token interno (ex.: `paciente.nome_completo`, `clinica.endereco`, `sistema.data_hoje`). |
| `rotulo` | string | Texto legível exibido no chip (ex.: "Nome completo"). |
| `grupo` | enum | paciente / clínica / profissional / atendimento / sistema. |
| `resolvedor` | função/binding | Lógica que resolve o valor real na emissão. |

---

## 7. Regras de negócio

1. **Substituição na emissão:** as variáveis dinâmicas (chips) **não** são resolvidas na
   edição do modelo; permanecem como placeholders. A substituição pelos valores reais
   ocorre **no momento da emissão do documento** durante o atendimento (paciente,
   clínica, profissional e data correntes). (Confirmado pelo design dos chips + inferido o gatilho.)
2. **Modelo obrigatório:** o campo **"Modelo*"** (corpo) é obrigatório; não é possível
   salvar um modelo sem conteúdo.
3. **Ativo controla disponibilidade:** apenas modelos com `ativo = true` ficam
   disponíveis para seleção/emissão no atendimento (inferido).
4. **Multi-tenant:** modelos são isolados por `clinica_id`; cada clínica vê apenas os
   seus modelos.
5. **Vínculo profissional (inferido):** um modelo pode ser **global da clínica**
   (`profissional_id` nulo) ou **vinculado a um profissional** específico. No segundo
   caso, o modelo só aparece para emissão por aquele profissional. As variáveis
   `Nome do profissional` e `Conselho do profissional` são sempre preenchidas com os
   dados do **profissional emissor** no ato da emissão (não necessariamente o autor do
   modelo).
6. **Variáveis de clínica** (`Nome da clínica`, `Endereço da clínica`) puxam de
   Configurações › Dados da Clínica (Tela 51). Se a clínica não tiver esses dados
   preenchidos, o documento sai com lacuna/placeholder vazio (inferido — recomenda-se validação).
7. **Tipo determina contexto de uso:** o `tipo` (atestado/prescrição/receita) define em
   que ponto do atendimento o modelo é ofertado e quais variáveis fazem sentido (ex.:
   `CID` em atestados/prescrições com diagnóstico) (inferido).
8. **Edição não retroativa:** alterar um modelo **não** altera documentos já emitidos
   (os emitidos são "congelados" / versionados em PDF) (inferido).

---

## 8. Endpoints de API (inferido)

Padrão REST sob namespace de configurações multi-tenant. Nomes ilustrativos.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/configuracoes/modelos-documentos` | Lista modelos (suporta `?tipo=`, `?ativo=`, `?search=`, paginação `?page=&per_page=`). |
| `GET` | `/api/configuracoes/modelos-documentos/{id}` | Detalha um modelo (carrega o modal de edição). |
| `POST` | `/api/configuracoes/modelos-documentos` | Cria novo modelo. Body: `nome`, `tipo`, `conteudo`, `conteudo_formato`, `ativo`, `profissional_id?`. |
| `PUT` / `PATCH` | `/api/configuracoes/modelos-documentos/{id}` | Atualiza modelo (ação do botão "Salvar"). |
| `DELETE` | `/api/configuracoes/modelos-documentos/{id}` | Exclui modelo (ação ⋮). |
| `PATCH` | `/api/configuracoes/modelos-documentos/{id}/ativo` | Alterna ativo/inativo (toggle inline). |
| `POST` | `/api/configuracoes/modelos-documentos/{id}/duplicar` | Duplica modelo (ação ⋮, inferido). |
| `GET` | `/api/configuracoes/modelos-documentos/variaveis` | Catálogo de variáveis dinâmicas para a paleta `{}`. |
| `POST` | `/api/atendimentos/{atendimentoId}/documentos` | **Emite** documento a partir de um modelo (resolve variáveis e gera PDF). Body: `modelo_id`, `paciente_id`, `profissional_id`, overrides. |
| `GET` | `/api/atendimentos/{atendimentoId}/documentos/{docId}/pdf` | Baixa/visualiza o PDF gerado. |

**Query string da captura:** `settings_modal_type=medical_document_template` indica que o
modal é controlado por parâmetro de URL (`settings_modal_type`), e provavelmente há um
`settings_modal_id`/`medic...` (truncado) com o ID do modelo em edição.

---

## 9. Fluxo — Criar um novo modelo

1. Usuário acessa **Configurações › Modelos de atestados e prescrições**.
2. Clica no **FAB "+"** (ou botão do empty state) → abre modal **"Novo modelo de atestado"** (ou seletor de tipo, inferido).
3. **(inferido)** Seleciona o **Tipo** (atestado / prescrição / receita).
4. Preenche **"Nome"** (ex.: "Atestado").
5. Mantém/ajusta o toggle **"Ativo"**.
6. Edita o corpo no editor **"Modelo*"**: digita texto, aplica formatação (toolbar) e
   insere **variáveis dinâmicas** via botão `{}` (chips lilás).
7. Clica em **"Cadastrar"** (inferido) / **"Salvar"** → `POST` cria o modelo → modal
   fecha → linha aparece na listagem e o contador incrementa.

---

## 10. Fluxo — Editar um modelo existente

1. Na listagem, abre o menu **⋮** da linha "Atestado" → **"Editar"** (ou clique na linha).
2. URL muda para incluir `?settings_modal_type=medical_document_template&...` e abre o
   modal **"Editar modelo de atestado"** com os dados carregados (`GET .../{id}`).
3. Usuário ajusta **Nome**, **Ativo** e/ou o corpo **Modelo***.
4. Clica em **"Salvar"** → `PUT/PATCH` → modal fecha → listagem reflete a alteração.
5. Fechar sem salvar: botão **"×"** (descarta alterações; recomenda-se confirmação se houver edições — inferido).

---

## 11. Fluxo — Emitir documento no atendimento

1. Durante um **atendimento** ao paciente, o profissional acessa a opção de emitir
   documento (atestado/prescrição/receita) (inferido — fora desta tela).
2. Seleciona um **modelo ativo** do tipo desejado.
3. O sistema **resolve as variáveis**: substitui os chips pelos valores reais do
   **paciente** (Nome completo, etc.), da **clínica** (Nome/Endereço), do **profissional
   emissor** (Nome, Conselho) e do **sistema** (Data de hoje).
4. Gera o documento renderizado (HTML → **PDF**), exibe pré-visualização (inferido).
5. Profissional confirma → documento é **salvo/anexado ao atendimento**, podendo ser
   impresso, baixado ou enviado ao paciente (ex.: via WhatsApp — inferido pela presença
   do widget WhatsApp no app).
6. O documento emitido é **imutável** (snapshot), independente de edições futuras no modelo.

---

## 12. Estados e validações

| Estado | Comportamento |
|--------|---------------|
| **Carregando modal (edição)** | Skeleton/spinner enquanto busca o modelo (inferido). |
| **Modelo vazio** | Botão "Salvar" bloqueado/validação em "Modelo*" (campo obrigatório). |
| **Nome vazio** | Na UI atual sem `*`; recomenda-se exigir (ver §13). |
| **Ativo desligado** | Modelo salvo mas oculto da emissão. |
| **Sem dados de clínica** | Variáveis de clínica saem vazias na emissão (recomenda-se aviso). |
| **Lista vazia** | Empty state "Hmm, está vazio por aqui!" / "Nenhum registro encontrado." (inferido). |
| **Erro de salvamento** | Toast de erro; modal permanece aberto preservando edições (inferido). |

---

## 13. Notas de implementação

- **Editor WYSIWYG:** a toolbar (Texto normal, tamanho de fonte com −/15/+, B/I/U, cor,
  realce, imagem, alinhamentos, listas, `{}`, Tₓ, undo/redo, fullscreen) é compatível
  com bibliotecas como **TipTap (ProseMirror)** ou **Quill**. A presença do botão `{}`
  para inserir variáveis e dos chips inline sugere **nodes/marks customizados** (ex.:
  TipTap "mention"/custom node) que renderizam o placeholder como token visual mas
  serializam uma chave estável (ex.: `{{paciente.nome_completo}}`).
- **Serialização:** persistir `conteudo` como HTML ou como documento estruturado
  (Delta/JSON) + `conteudo_formato`. Os tokens de variáveis devem ser **estáveis** e
  independentes do rótulo exibido (rótulo é apresentação, chave é dado).
- **Resolução de variáveis (emissão):** um **template engine** server-side substitui as
  chaves pelos valores do contexto (paciente, clínica, profissional, sistema). Escapar
  HTML dos valores injetados para evitar XSS. Tratar variáveis ausentes (string vazia ou
  marcador claro).
- **Geração de PDF:** renderizar o HTML resolvido para PDF no backend
  (ex.: **Puppeteer/Chromium headless**, **wkhtmltopdf** ou **WeasyPrint**), garantindo
  fidelidade tipográfica (fontes, tamanho 15, títulos), cabeçalho com logo/dados da
  clínica e rodapé com nome/conselho do profissional. Armazenar o PDF gerado (snapshot
  imutável) vinculado ao atendimento.
- **Segurança/escopo:** todos os endpoints filtram por `clinica_id` (multi-tenant);
  validar que o usuário tem permissão de configuração para criar/editar modelos.
- **Acessibilidade:** rótulos associados aos controles da toolbar (`aria-label`),
  navegação por teclado no editor, e foco preso (focus trap) dentro do modal.

---

## 14. Textos exatos (glossário da tela)

| Contexto | Texto exato |
|----------|-------------|
| Breadcrumb | `Configurações` / `Modelos de atestados e prescrições` |
| Título do card | `Modelos de atestados e prescrições` |
| Contador | `1 registro` |
| Título do modal | `Editar modelo de atestado` |
| Rótulo campo | `Nome` |
| Valor campo Nome | `Atestado` |
| Rótulo toggle | `Ativo` |
| Rótulo editor | `Modelo*` |
| Dropdown de estilo | `Texto normal` |
| Tamanho de fonte | `15` (com `−` e `+`) |
| Título do corpo | `ATESTADO MÉDICO` |
| Texto do corpo | `Atesto, para os devidos fins, que o paciente` `Nome completo` `, esteve sob cuidados médicos na` `Nome da clínica` `.` |
| Linha de local | `Local:` `Endereço da clínica` |
| Chip data | `Data de hoje` |
| Chip profissional (nome) | `Nome do profissional` |
| Chip profissional (conselho) | `Conselho do profissional` |
| Botão de ação | `Salvar` |
| Filtro (inferido) | `+ Adicionar filtro` |
| Busca (inferido) | `Buscar` |

---

## 15. Pendências e inferências a confirmar

- **Tipo do modelo:** confirmar se há um campo/seletor de **Tipo** (atestado/prescrição/receita) no modal e onde aparece (criação vs. edição). Não visível na captura de edição.
- **Coluna "Tipo" na listagem:** confirmar existência e rótulo exato.
- **Variável CID:** confirmar se existe no catálogo (não presente neste modelo).
- **Vínculo a profissional:** confirmar se `profissional_id` existe e como é definido na UI.
- **Texto exato do botão na criação:** "Cadastrar" vs "Salvar".
- **Obrigatoriedade de "Nome":** confirmar se há validação apesar da ausência de `*`.
- **Endpoints e nomes de campos:** todos inferidos; confirmar contra o backend real.
- **Geração/armazenamento de PDF e snapshot do documento emitido:** confirmar tecnologia e política de versionamento.
