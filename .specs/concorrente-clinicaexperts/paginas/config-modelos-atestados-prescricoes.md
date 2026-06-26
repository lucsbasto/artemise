# Configurações — Modelos de atestados e prescrições

**Rota:** `/configuracoes/modelos-de-atestados-e-prescricoes`  ·  **Tipo:** Listagem + editor de documento (rich text + variáveis)  ·  **Screenshots:** `config-modelos.png`, `config-modelos-form.png`

## Propósito

Biblioteca de **modelos de documentos médicos** (atestados e prescrições) com texto formatado e **variáveis dinâmicas** (merge tags) preenchidas automaticamente ao emitir o documento no atendimento. Reduz retrabalho e padroniza documentos da clínica.

## Listagem

- Cabeçalho: **Modelos de atestados e prescrições** + contador.
- **Adicionar filtro** + **Buscar**.
- Colunas: **Nome** · **Tipo** (Atestado / Prescrição) · **Ativo** (toggle) · menu **⋮** (**Editar / Excluir**).
- Modelo de fábrica: "Atestado" (tipo Atestado).
- **FAB (+)** → 2 ações: **Adicionar atestado** · **Adicionar prescrição**.

## Form: Novo/Editar modelo (atestado ou prescrição)

> Deep-link: `?settings_modal_type=medical_document_template&medical_document_template_type=certificate&settings_modal_mode=new|edit&medical_document_template_uuid=...`. Internamente: `medical_document_template` com `type` (certificate = atestado; prescription = prescrição).

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | text | ✅ | ph "Digite" |
| Ativo | toggle | — | default ligado |
| Modelo | **rich text (WYSIWYG)** | ✅ | editor completo |

### Editor de Modelo (toolbar)
Estilo de parágrafo (Texto normal / títulos) · tamanho de fonte (− 15 +) · **B** / *I* / U · cor do texto · marca-texto · **inserir imagem** · alinhamento (esq/centro/dir/justif) · lista não ordenada · lista ordenada · **bloco de código `{}`** · limpar formatação · undo/redo · **tela cheia**.

### Variáveis dinâmicas (merge tags) — pills no corpo
No modelo "Atestado" de fábrica: **Nome completo** (paciente) · **Nome da clínica** · **Endereço da clínica** · **Data de hoje** · **Nome do profissional** · **Conselho do profissional** (CRM/registro). São substituídas pelos dados reais na emissão. (O bloco de código `{}` na toolbar provavelmente insere essas variáveis.)

**Botão Salvar** (desabilitado até Nome + Modelo preenchidos).

## Fluxos testados
- **Editar "Atestado"** (real): abri via ⋮ → Editar; visualizei o template com variáveis; **não salvei**.
- ✅ **Novo atestado**: criei **`[DOC-TESTE] Atestado 001`** (Nome + corpo de texto) → aparece na listagem.

## Observações para o Artemise

- **Templates de documento com variáveis de interpolação** (paciente, clínica, profissional, data) são essenciais para emissão rápida de atestados/receitas no atendimento. Modelar `template` (rich HTML) + dicionário de placeholders.
- Dois tipos no mesmo CRUD (atestado/prescrição) compartilham editor — diferem só por `type` e pela função no atendimento. Reúso de engine.
- Editor WYSIWYG completo (com imagem e fullscreen) permite papel timbrado/assinatura visual. Complementa a Assinatura Digital (plano Essencial+).
- Integração externa de prescrição existe em paralelo via widget **Prescrição Memed** nas fichas (ver config-fichas) — aqui são modelos próprios; lá é integração com sistema externo de receituário.
