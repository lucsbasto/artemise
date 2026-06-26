# Ficha de Paciente — Detalhe Dedicado (Specification)

## Problem Statement

A aba **Informações** da ficha de paciente (`/pacientes/[id]/informacoes`) usa um layout
genérico de linhas empilhadas (`aba-informacoes.tsx`), sem a organização por seção em cards
que o profissional já tem em `profissional-detalhe.tsx`. Falta consistência visual entre as
duas fichas e separação semântica (dados pessoais × endereço × histórico). Queremos um
componente **dedicado** ao paciente, espelhando o padrão de cards do profissional, **mantendo**
a sidebar e as 6 abas existentes.

## Goals

- [ ] Novo componente `paciente-detalhe.tsx` estruturado em cards por seção (espelha `profissional-detalhe.tsx`).
- [ ] Vira o conteúdo da aba **Informações**, substituindo o layout plano de `aba-informacoes.tsx`.
- [ ] Reusa primitives existentes: `Card`/`CardHeader`/`CardTitle`/`CardContent` + padrão `Linha` (label/value).
- [ ] Preserva sidebar + 6 abas (carteira, timeline, pacotes, orçamentos, financeiro) — zero mudança de navegação.
- [ ] Zero regressão: `tsc --noEmit` ✅, eslint ✅, build ✅ (no main pós-merge).

## Out of Scope

| Feature | Reason |
| --- | --- |
| Alterar `profissional-detalhe.tsx` | Decisão do usuário: espelhar só no sentido paciente→profissional. |
| Remover/reordenar abas ou sidebar | Decisão: manter abas; só troca o conteúdo da aba Informações. |
| Backend/persistência real | App é mock client-side (`useCollection` + stores); fora desta fase. |
| Campos novos de paciente além dos já existentes no tipo `Patient` | Reusa o schema atual; sem migração de mock. |

---

## User Stories

### P1: Detalhe do paciente em cards por seção ⭐ MVP

**User Story**: Como usuário da clínica, quero ver os dados do paciente organizados em cards
por seção (igual à ficha do profissional), para ler a informação mais rápido e com hierarquia clara.

**Why P1**: É o núcleo da feature — a reorganização visual em cards é o que "espelhar profissional" significa.

**Acceptance Criteria**:

1. WHEN abro `/pacientes/[id]/informacoes` THEN o sistema SHALL renderizar `<PacienteDetalhe>` com cards:
   **Informações pessoais** (Nome, Nascimento+idade, Sexo, CPF, Cadastrado em),
   **Contato** (Telefone com ícone WhatsApp, Email, Notificações),
   **Endereço** (Endereço completo).
2. WHEN um campo opcional do paciente está vazio THEN o sistema SHALL exibir `—` (via padrão `Linha`).
3. WHEN o paciente tem `dataNascimento` válida THEN o sistema SHALL exibir a idade calculada por `idadeFrom()` ao lado da data.
4. WHEN renderiza THEN o sistema SHALL reusar `Card`/`Linha`, sem criar novo primitive de layout.

**Independent Test**: Abrir a ficha do paciente-exemplo (Clara Ribeiro) e ver os 3+ cards
preenchidos com os valores do mock; abrir um paciente recém-criado pelo modal e ver `—` nos campos vazios.

---

### P2: Histórico de agendamentos preservado

**User Story**: Como usuário, quero continuar vendo "Próximos agendamentos" e "Procedimentos
realizados" do paciente dentro do detalhe, para não perder o histórico que já existia.

**Why P2**: Já existe em `aba-informacoes.tsx`; não pode regredir ao trocar de componente. Importante mas não é o foco visual.

**Acceptance Criteria**:

1. WHEN abro o detalhe THEN o sistema SHALL listar eventos futuros (`dayNum >= HOJE`) e realizados (`dayNum < HOJE`) do paciente, filtrados por `e.paciente === p.nome`, ordenados como hoje.
2. WHEN o paciente não tem eventos numa categoria THEN o sistema SHALL exibir o empty state textual ("Nenhum agendamento futuro." / "Nenhum procedimento realizado.").
3. WHEN renderiza o histórico THEN o sistema SHALL manter os cards/estilos atuais (sem regressão visual no bloco de agendamentos).

**Independent Test**: Comparar lado a lado com a aba atual — mesmos eventos, mesma ordenação, mesmos empty states.

---

### P3: Botão "Editar informações" abre o modal pré-preenchido

**User Story**: Como usuário, quero clicar em "Editar informações" e abrir o `PacienteModal`
com os campos já preenchidos, para corrigir dados sem recadastrar.

**Why P3**: Hoje o botão é um stub inerte. Liga o detalhe ao modal já existente; valor real mas não bloqueia o MVP.

**Acceptance Criteria**:

1. WHEN clico em "Editar informações" THEN o sistema SHALL abrir `PacienteModal` com os valores atuais do paciente nos campos.
2. WHEN salvo no modal THEN o sistema SHALL atualizar o paciente via `pacientesStore.update` e o detalhe SHALL refletir reativamente.

**Independent Test**: Editar o telefone do paciente-exemplo, salvar, e ver o card Contato atualizar sem reload.

---

## Edge Cases

- WHEN o `id` da rota não casa com nenhum paciente THEN o sistema SHALL exibir "Paciente não encontrado." + link "Voltar" para `/pacientes` (padrão de `profissional-detalhe`).
- WHEN `endereco` está vazio THEN o card Endereço SHALL exibir `—` (não esconder o card, p/ consistência).
- WHEN o paciente é o seed "exemplo" THEN o sistema SHALL manter o badge "Exemplo" da sidebar (sem duplicar no detalhe).
- WHEN há muitos eventos THEN as listas SHALL rolar com o container da ficha (sem paginação extra nesta fase).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| FPD-01 | P1: cards por seção | Execute | Verified |
| FPD-02 | P1: campos vazios `—` | Execute | Verified |
| FPD-03 | P1: idade via `idadeFrom` | Execute | Verified |
| FPD-04 | P1: reuso Card/Linha | Execute | Verified |
| FPD-05 | P2: histórico futuros/realizados | Execute | Verified |
| FPD-06 | P2: empty states do histórico | Execute | Verified |
| FPD-07 | P3: botão Editar abre modal pré-preenchido | Execute | Verified |
| FPD-08 | P3: update reativo via store | Execute | Verified |

**ID format:** `FPD-[NUMBER]`
**Status values:** Pending → Implementing → Verified
**Coverage:** 8 total, 0 mapped to tasks (Medium scope → tasks inline no Execute).

---

## Success Criteria

- [ ] Aba Informações renderiza `<PacienteDetalhe>` em cards, paridade visual com a ficha do profissional.
- [ ] Histórico de agendamentos idêntico ao atual (futuros + realizados, mesmos empty states).
- [ ] Botão Editar abre `PacienteModal` pré-preenchido e salva reativo (P3).
- [ ] `tsc --noEmit` exit 0, eslint limpo, build OK no main.

---

## Notas de implementação (Execute)

- **Escopo:** Medium (~1 componente novo + rewire da aba + opcional reuso do modal). Design/Tasks inline no Execute.
- **Componente:** `web/src/components/ficha/paciente-detalhe.tsx` (client). A aba `aba-informacoes.tsx`
  passa a renderizar `<PacienteDetalhe />` (ou é substituída na rota `app/pacientes/[id]/informacoes`).
- **Reuso:** `Card`/`CardContent` + helper `Linha` (copiar o padrão de `profissional-detalhe.tsx`),
  `idadeFrom` (mock), `useCollection(pacientesStore)` + `useCollection(eventosStore)`.
- **P3:** `PacienteModal` precisa aceitar valor inicial (`paciente?: Patient`) + modo edição → `onSave` chama `update`.
  Hoje só faz `add`; estender sem quebrar o fluxo de criação.
- **Worktree:** abrir `../artemise-worktrees/ficha-paciente-detalhe` antes de codar (convenção do projeto);
  validar `tsc`+eslint no worktree, buildar no main pós-merge (Turbopack não roda em worktree).
