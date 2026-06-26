# Aba Procedimentos + caminho para o Mapa de Injetáveis (Specification)

## Problem Statement

Hoje o mapa de injetáveis (`<MapaInjetaveis>`, rota demo `/mapa-injetaveis`) **não tem
caminho na navegação** — só via URL. O usuário quer o fluxo:

> **Pacientes → [paciente] → aba Procedimentos → Novo procedimento → [procedimento facial/injetável] → "Mapa"**

Já existe a base: a aba **Procedimentos** na ficha do paciente
(`/pacientes/[id]/procedimentos`, `aba-procedimentos.tsx`) com lista por status
(realizado/agendado/cancelado), botão **Registrar procedimento** e modal
(`registro-procedimento-modal.tsx`). Faltam 3 coisas:

1. Um **catálogo seed** de procedimentos estéticos comuns (hoje só 4 itens sem categoria).
2. Marcar quais procedimentos **usam mapa** (injetáveis/faciais) e classificá-los por categoria.
3. O **vínculo**: a partir de um procedimento facial/injetável, abrir o `<MapaInjetaveis>`.

## Goals

- [ ] Seed do catálogo `procedimentos` com os procedimentos estéticos mais comuns (pesquisa abaixo), cada um com **categoria** e flag **`usaMapa`**.
- [ ] No catálogo `Procedimento`: campos `categoria` (Facial/Corporal/Injetáveis/Estética) e `usaMapa: boolean`.
- [ ] Aba **Procedimentos** (reusa a existente): lista de feitos + agendados, botão **Novo procedimento**.
- [ ] No modal de Novo/Editar procedimento: ao escolher um procedimento `usaMapa`, exibir ação **"Abrir mapa"**.
- [ ] Na linha da lista: procedimento `usaMapa` ganha ação **"Mapa"** (menu/atalho) que abre o `<MapaInjetaveis>` daquele registro.
- [ ] `<MapaInjetaveis>` recebe contexto (pacienteId, registroId) e renderiza embutido (modal/rota), não mais só demo solta.
- [ ] Zero regressão: `tsc --noEmit` ✅, eslint ✅, build ✅ (no main pós-merge).

## Out of Scope

| Feature | Reason |
| --- | --- |
| Módulo **Procedimentos top-level** (fora da ficha do paciente) | MVP usa a aba existente na ficha. Entrada top-level = follow-up se necessário. |
| Persistência real / backend | App é mock client-side (`useCollection`); estado de sessão. |
| ~~Estoque~~ | Decisão do usuário: **entra** — substâncias do mapa vêm do Estoque e baixam por ui. Detalhe na spec `mapa-injetaveis` (P6). |
| Vistas de perfil no mapa | V2 (ver spec `mapa-injetaveis`). |
| CRUD de regiões faciais pela clínica | Follow-up (regiões hoje são seed). |

---

## Pesquisa — procedimentos estéticos mais comuns (Brasil)

Fontes ao final. Classificados por categoria e se usam o **mapa de injetáveis**.

| Procedimento | Categoria | Usa mapa | Notas |
|---|---|---|---|
| **Harmonização Facial** | Injetáveis | ✅ | Combo (toxina + preenchimento + bioestimulador). Mais procurado. |
| **Toxina Botulínica (Botox)** | Injetáveis | ✅ | Rugas testa/glabela/periocular. Dura 3–6 meses. |
| **Preenchimento c/ Ácido Hialurônico** | Injetáveis | ✅ | Lábios, malar, mento, sulcos. 6–18 meses. |
| **Bioestimulador de Colágeno** | Injetáveis | ✅ | Flacidez; resultado gradual. |
| **Fios de PDO (lifting)** | Injetáveis | ✅ | Sustentação/lifting. |
| **Skinbooster** | Injetáveis | ✅ | Hidratação injetável (micropuntura). |
| **Limpeza de Pele Profunda** | Facial | — | (já no catálogo) |
| **Microagulhamento** | Facial | — | (já no catálogo) Indução de colágeno / drug delivery. |
| **Peeling Químico** | Facial | — | (já no catálogo) Renovação celular. |
| **Tratamento de Acne** | Facial | — | (já no catálogo) |
| **Radiofrequência Facial** | Facial | — | Flacidez/colágeno não invasivo. |
| **Laser / Luz Intensa Pulsada (IPL)** | Facial | — | Manchas, vasos, rejuvenescimento. |
| **Criolipólise** | Corporal | — | Gordura localizada. |
| **Radiofrequência / Drenagem Corporal** | Corporal | — | Flacidez/edema corporal. |

> Regra: `usaMapa = true` para a categoria **Injetáveis** (aplicação por pontos no rosto). As demais abrem só o registro/ficha de texto.

---

## Modelo de dados (extensão do mock)

```ts
// Catálogo (config) — estende o tipo Procedimento atual
type CategoriaProc = "Facial" | "Corporal" | "Injetáveis" | "Estética";
type Procedimento = {
  id: string;
  nome: string;
  categoria: CategoriaProc | null; // hoje null → preencher
  duracaoMin: number;
  valor: number;
  ativo: boolean;
  usaMapa: boolean;                // NOVO — injetáveis abrem o MapaInjetaveis
};

// Registro na ficha do paciente — ganha vínculo opcional ao mapa
type RegistroProcedimento = {
  // …campos atuais (procedimento, profissional, data, status, valor, observacoes)…
  usaMapa?: boolean;               // derivado do catálogo no momento do registro
  mapa?: FichaInjetaveis;          // estado do mapa (ver spec mapa-injetaveis), quando aplicável
};
```

---

## User Stories

### P1: Catálogo seed + classificação ⭐ MVP

**User Story**: Como usuário, ao registrar um procedimento, quero escolher entre os procedimentos
estéticos mais comuns já cadastrados, organizados por categoria.

**Acceptance Criteria**:
1. WHEN abro o seletor de procedimento (modal Novo) THEN o sistema SHALL listar o catálogo seed
   (tabela da pesquisa), com os ativos.
2. WHEN um procedimento é da categoria **Injetáveis** THEN o catálogo SHALL marcá-lo `usaMapa = true`.
3. The system SHALL preencher `categoria` em todos os itens seed (sem `null`).

**Independent Test**: Abrir Novo procedimento → ver "Toxina Botulínica", "Preenchimento…", "Harmonização Facial" etc. no select.

---

### P2: Aba Procedimentos — lista feitos + agendados (reusa existente)

**User Story**: Como usuário, quero ver na ficha do paciente os procedimentos já realizados e os
agendados, e adicionar um novo.

**Why P2**: Já existe (`aba-procedimentos.tsx`); a spec só garante que não regride e integra os itens abaixo.

**Acceptance Criteria**:
1. WHEN abro `/pacientes/[id]/procedimentos` THEN o sistema SHALL listar os registros do paciente
   com colunas Procedimento, Profissional, Data, Status, Valor + ações.
2. The list SHALL incluir status **Realizado** e **Agendado** (feitos e marcados pra fazer).
3. WHEN clico **Registrar procedimento** THEN o sistema SHALL abrir o modal de novo procedimento.

**Independent Test**: Abrir a aba do paciente-exemplo, registrar um agendado e um realizado, ver ambos na lista.

---

### P3: Caminho para o Mapa (procedimento injetável → MapaInjetaveis) ⭐ MVP

**User Story**: Como profissional, ao registrar/abrir um procedimento injetável (ex.: Toxina,
Preenchimento, Harmonização), quero acessar o **mapa do rosto** para marcar produto + local.

**Why P3**: É o caminho que faltava — conecta a aba ao `<MapaInjetaveis>`.

**Acceptance Criteria**:
1. WHEN o procedimento selecionado tem `usaMapa = true` THEN o modal SHALL exibir o botão/ação **"Abrir mapa"**.
2. WHEN aciono **"Abrir mapa"** (no modal ou na linha da lista) THEN o sistema SHALL abrir o
   `<MapaInjetaveis>` vinculado àquele registro (modal cheio ou rota `/pacientes/[id]/procedimentos/[registroId]/mapa`).
3. WHEN marco pontos no mapa e fecho THEN o estado do mapa SHALL ficar associado ao registro (na sessão).
4. WHEN reabro o mesmo registro THEN o mapa SHALL exibir os pontos previamente marcados.
5. IF o procedimento NÃO usa mapa THEN a ação "Mapa" NÃO SHALL aparecer.

**Independent Test**: Registrar "Toxina Botulínica" → botão "Abrir mapa" aparece → abre o mapa → marcar 2 pontos → fechar → reabrir o registro → pontos persistem (na sessão). Registrar "Peeling Químico" → sem ação de mapa.

---

## UX / Caminho final (o que o usuário pediu)

```
Pacientes → [Paciente] → aba "Procedimentos"
  → [Registrar procedimento]
      → escolhe procedimento estético (catálogo)
      → se Injetáveis: botão "Abrir mapa" → <MapaInjetaveis> (marca produto + local no rosto)
  → na lista, registro injetável tem ação "Mapa" para reabrir
```

## Decisões técnicas

- **Reusar** `aba-procedimentos.tsx` + `registro-procedimento-modal.tsx`; só estender (catálogo, `usaMapa`, ação Mapa).
- Mapa embutido: **modal** (`<Modal size="xl">`) acionado do registro (decisão travada). Rota dedicada fica como opção futura.
- `<MapaInjetaveis>` recebe `value`/`onChange` (estado controlado) para persistir no registro via `useCollection`.
- Seed do catálogo em `web/src/lib/mock.ts` (`procedimentos`), preenchendo `categoria` + `usaMapa`.

## Referências

- Spec do mapa: `.specs/features/mapa-injetaveis/spec.md`.
- Doc concorrente: `.specs/concorrente-clinicaexperts/paginas/atendimentos.md`, `prontuario-ficha-injetaveis.md`.
- Componentes atuais: `web/src/components/ficha/aba-procedimentos.tsx`, `registro-procedimento-modal.tsx`.
- Pesquisa procedimentos comuns: Versatilis, Dermomed, Adoxy, AppHealth (2025–2026).

## Tasks

A gerar após aprovação (`tasks.md`).
