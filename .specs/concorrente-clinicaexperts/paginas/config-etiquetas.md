# Configurações — Etiquetas (Tags)

**Rota:** `/configuracoes/etiquetas` · form: `/configuracoes/etiquetas/novo`  ·  **Tipo:** Listagem + form modal  ·  **Screenshots:** `config-etiquetas.png`, `config-etiquetas-form.png`

## Propósito

Tags reutilizáveis aplicáveis a contatos/pacientes (e provavelmente outras entidades) para segmentação, filtros e campanhas de marketing. Já aparece como campo "Etiquetas" no cadastro de contato.

## Listagem

- Cabeçalho: **Etiquetas** + **Ações em lote ▾** (bulk).
- **Buscar**.
- Estado vazio: "Hmm, está vazio por aqui!" + CTA **"Adicionar etiqueta"**.
- Colunas: checkbox · **Nome** · **Cor** · (menu de linha editar/excluir).
- Paginação "25 por página".
- **FAB (+)** → nova etiqueta.

## Form: Nova tag

> Rota: `/configuracoes/etiquetas/novo` (modal "Nova tag"). Obrigatório: **Nome**. Cor já vem pré-selecionada (Cinza).

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | text | ✅ | ph "Digite" |
| Cor | select | — | default **Cinza** (paleta padrão de cores) |

**Botão Salvar.** ✅ Teste criado: **`[DOC-TESTE] Etiqueta 001`** (Cor Cinza) → listagem "1 registro".

## Observações para o Artemise

- Tag colorida = mecanismo leve de segmentação cross-entidade. No Clínica Experts alimenta filtros de contatos e públicos de Marketing.
- Cor com default sensato (não obrigatória) reduz fricção — bom padrão vs. Salas/Procedimentos que exigem Cor. Inconsistência de UX entre módulos (oportunidade de padronizar no Artemise).
- "Ações em lote" na listagem de tags sugere operações de massa (ativar/excluir várias) — útil quando o volume de tags cresce.
