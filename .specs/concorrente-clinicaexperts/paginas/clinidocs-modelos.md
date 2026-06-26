# CliniDocs — Modelos de documentos

**Rota:** `/clinidocs/modelos-de-documentos`  ·  **Tipo:** Listagem + editor WYSIWYG  ·  **Screenshot:** `clinidocs-modelos.png`, `clinidocs-modelo-editor.png`, `clinidocs-novo-modelo.png`

## Propósito

Biblioteca de **modelos de documento** reutilizáveis (contratos, termos, consentimentos) com editor de texto rico e **variáveis dinâmicas** (merge tags) que se resolvem com dados do paciente, da clínica e da venda no momento de gerar o documento.

## Listagem (Modelos de documentos)

- Cabeçalho: **Modelos de documentos** + contador (`N registros`).
- **Adicionar filtro** (+) · **Buscar**.
- Tabela — colunas: **Nome** (ordenável) · **Ativo** (toggle) · engrenagem (config de colunas) · menu ⋮ por linha.
- Modelos existentes: `Contrato de prestação de serviço` · `Termo de consentimento para procedimentos (Documento de exemplo)`.
- Paginação 25 por página.
- **FAB (+)** inferior direito: **"Novo modelo de documento"** → `/clinidocs/modelos-de-documentos/selecionar`.

## Criar modelo — seleção de layout

**Rota:** `/clinidocs/modelos-de-documentos/selecionar`  ·  **Screenshot:** `clinidocs-novo-modelo.png`

- Título "Criar modelos de documentos — Comece um documento do zero, use modelos pré-definidos ou deixe a IA redigir um rascunho para você."
- Botão destacado **Criar com IA** (gera rascunho do modelo por IA).
- Cards de layout base: **Documento em branco** (default) · **Documento com cabeçalho** · **Documento com rodapé** · **Documento com cabeçalho e rodapé**.
- Painel de preview à direita.
- Rodapé: **Cancelar** · **Continuar** → abre o editor (mesma tela de "Editar modelo").

## Editor de modelo (Novo/Editar)

**Rota:** `/clinidocs/modelos-de-documentos/<id>/editar`  ·  **Screenshot:** `clinidocs-modelo-editor.png`

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome do modelo | text | ✅ | ph "Digite" |
| Conteúdo | editor rich text (WYSIWYG) | ✅ | toolbar completa (ver abaixo) |

### Toolbar do editor
Estilo de texto ("Texto normal" / títulos) · Fonte (Arial) · Tamanho da fonte (−/15/+) · Zoom (−/100%/+) · **Negrito · Itálico · Sublinhado · Tachado** · Cor do texto · Realce · Linha horizontal · **Inserir** (anexo, imagem, **tabela**) · Espaçamento de linha · Alinhamento (esq/centro/dir/justificado) · **Listas** (com marcador / numerada) · Bloco de código `{}` · Limpar formatação · Desfazer/Refazer · Tela cheia · Copiar.

### Variáveis dinâmicas (merge tags)
Inseridas como "pílulas" destacadas no conteúdo; resolvidas ao gerar o documento. Observadas no modelo "Contrato de prestação de serviço":
- **Dados da pessoa/paciente:** `Nome completo` · `Estado Civil` · `Profissão` · `CPF` · `RG` · `Endereço completo`.
- **Dados da clínica:** `Nome da clínica` · `CNPJ da clínica` · `Endereço da clínica`.
- **Tabelas de venda (blocos dinâmicos):** `Itens da venda (Exemplo)` (Item, Quantidade, Valor unitário, Valor desconto unitário, Total) · `Condições de pagamento da venda (Exemplo)` (Parcela, Método de pagamento, Valor, Vencimento).

### Assistente de IA "Anna"
- Campo "Pesquise ou pergunte algo a Anna" — IA embutida no editor para redigir/ajustar conteúdo.

- Rodapé: **Voltar** · **Cancelar** · **Salvar**.

> Edição de modelo existente dispara confirmação de saída (beforeunload) se houver rascunho de edição não salvo.

## Fluxos testados

- Editor de modelo aberto a partir do "Contrato de prestação de serviço" (id `92918`) — documentado **sem salvar alterações** (modelo real, preservado).
- Criação de novo modelo explorada até a tela de seleção de layout — **não finalizada** (evitar criar registro real; o registro de teste do módulo é o rascunho de documento `707775`).

## Observações para o Artemise

- **Variáveis dinâmicas + blocos de tabela** (itens/condições de pagamento da venda) tornam o mesmo modelo de contrato reutilizável por qualquer venda — referência forte para gerar contratos/recibos automaticamente a partir do orçamento/venda.
- **IA embutida ("Anna")** para redigir modelos e a opção **"Criar com IA"** são diferenciais de produtividade — modelar como "gerar rascunho de documento por IA".
- Layouts base com **cabeçalho/rodapé** facilitam papel timbrado da clínica.
- Modelos com flag **Ativo** permitem manter biblioteca versionada sem excluir.
- Editor WYSIWYG com tabela/imagem/anexo cobre desde termos simples até contratos complexos sem editor externo.
