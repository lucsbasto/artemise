# Configurações — Categorias de procedimentos

**Rota:** `/configuracoes/categorias-de-procedimentos`  ·  **Tipo:** Listagem + form modal  ·  **Screenshots:** `config-categorias.png`, `config-categorias-form.png`

## Propósito

Taxonomia para agrupar procedimentos/serviços (ex.: "Estética facial", "Avaliações", "Consultas"). Usada como filtro/relatório e selecionável no cadastro de procedimento.

## Listagem

- Cabeçalho: **Categorias de procedimentos** + contador (`N registro(s)`) + **Ações em lote ▾** + **Exportar ▾**.
- **Adicionar filtro** + **Buscar**.
- Estado vazio: "Hmm, está vazio por aqui! Nenhum registro encontrado." + CTA **"Adicionar nova categoria de procedimento"**.
- Colunas: checkbox · **Categoria** (nome) · **Procedimentos** (contagem de procedimentos na categoria) · **Ativo** (toggle).
- Paginação "25 por página".
- **FAB (+)** → "Nova categoria".

## Form: Nova categoria de procedimento

> Deep-link: `?settings_modal_type=consultation_type_category&settings_modal_mode=new`

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | text | ✅ | max 60 chars, ph "Digite" |
| Ativo | checkbox/toggle | — | default ligado |

**Botão Cadastrar.** ✅ Teste criado: **`[DOC-TESTE] Categoria 001`** → modal fecha, listagem passa a "1 registro".

## Observações para o Artemise

- Padrão de deep-link de modais via query (`settings_modal_type` + `settings_modal_mode=new`) é consistente em toda a área de Configurações — facilita reabertura/edição por URL. Vale adotar para modais de CRUD simples.
- Coluna "Procedimentos" mostra contagem de uso → ajuda a impedir exclusão de categorias em uso e dá visão de distribuição do catálogo.
- Entidade lookup mínima (Nome + Ativo) — manter simples; o valor está no vínculo com procedimento, agenda e relatórios.
