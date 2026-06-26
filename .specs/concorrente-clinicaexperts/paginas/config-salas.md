# Configurações — Salas de atendimento

**Rota:** `/configuracoes/salas-de-atendimento` · form: `/configuracoes/salas-de-atendimento/novo`  ·  **Tipo:** Listagem + form modal  ·  **Screenshots:** `config-salas.png`, `config-salas-form.png`

## Propósito

Cadastro de salas/consultórios físicos. Usadas para alocar agendamentos a um espaço (gestão de ocupação de salas na agenda) e identificá-las por cor.

## Listagem

- Cabeçalho: **Salas de atendimento** + contador.
- **Adicionar filtro** + **Buscar**.
- Estado vazio: "Hmm, está vazio por aqui!" + CTA **"Nova sala de atendimento"**.
- Colunas: **Nome** · **Ativo** (toggle). Menu de linha p/ editar/excluir.
- Paginação "25 por página".
- **FAB (+)** → nova sala.

## Form: Nova sala de atendimento

> Rota: `/configuracoes/salas-de-atendimento/novo` (modal). Obrigatórios: **Nome** e **Cor**.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | text | ✅ | ph "Digite" |
| Cor | select | ✅ | swatches (mesma paleta dos procedimentos: Cinza, Laranja, Amarelo, Limão, Verde, Turquesa, Azul céu, …) |
| Ativo | toggle | — | default ligado (tooltip ?) |

**Botão Salvar.** ✅ Teste criado: **`[DOC-TESTE] Sala 001`** (Nome + Cor Verde) → listagem "1 registro".

## Observações para o Artemise

- Sala como entidade de alocação de recurso na agenda; **Cor obrigatória** mantém código visual consistente com procedimentos (a clínica pode colorir a agenda por sala ou por profissional — ver setting "Cor do agendamento" em Preferências).
- Mínimo viável (Nome + Cor + Ativo). Em produtos mais avançados, salas teriam capacidade, equipamentos vinculados e regras de disponibilidade — oportunidade de diferenciação se o Artemise mirar clínicas multi-sala.
