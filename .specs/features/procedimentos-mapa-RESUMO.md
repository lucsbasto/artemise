# Procedimentos + Mapa de Injetáveis — Resumo das 2 specs

Documento único pra leitura. Junta as duas specs:
- **A) Mapa de Injetáveis** (`.specs/features/mapa-injetaveis/spec.md`) — já **implementado** (MVP).
- **B) Aba Procedimentos + caminho até o mapa** (`.specs/features/procedimentos-aba/spec.md`) — **a fazer**.

O objetivo final é o caminho:

```
Pacientes → [Paciente] → aba "Procedimentos"
   → "Novo procedimento" → escolhe um procedimento estético do catálogo
       → se for injetável/facial de injeção: abre o MAPA do rosto (marca produto + local)
   → na lista, procedimento injetável reabre o mapa pela ação "Mapa"
```

---

# A) Mapa de Injetáveis  ✅ JÁ FEITO (MVP)

Componente onde o profissional marca **o que** injetou e **onde** no rosto.

### Status
- Implementado e na main (commit `b67126a`). Rota demo: `/mapa-injetaveis`.
- Hoje é **demo solta** (sem menu, estado local, não persiste). A spec B integra ele de verdade.

### O que faz
- **Escolher produto/substância**: Toxina botulínica, Ácido hialurônico, Fio de PDO (cor/ícone, total em "ui" por substância).
- **Escolher o local no rosto** — 2 modos, com **toggle** pro profissional escolher:
  - **Mão livre**: clica em qualquer ponto do rosto.
  - **Selecionável**: clica em regiões anatômicas pré-definidas (glabela, malar, pés-de-galinha, nasolabial, lábios, mento…).
- Cada ponto pede **unidades (ui)** (popover ✓/✕); soma o total por substância.
- **Editar/remover** ponto (clica nele).
- **Rastreabilidade POR substância**: marca, lote, data de diluição, volume, validade (corrige a limitação do concorrente, que usa um bloco único).
- Toggle **Exibir quantidades** (badges on/off).
- Imagem base: rosto frontal CC0 (`/mapa-injetaveis/face-frontal.svg`).

### Decisões aplicadas (suas anotações)
- **Regiões de botox pesquisadas** (entram no seed selecionável, spec A · P3):
  - *Toxina:* testa, glabela, pés-de-galinha E/D, cauda da sobrancelha E/D, bunny lines, masseter E/D, DAO E/D, sorriso gengival, mento.
  - *Preenchimento (ácido):* malar E/D, sulco nasolabial E/D, lábios/código de barras, olheiras E/D.
- **Estoque: ENTRA** — substâncias vêm do catálogo de Estoque e **baixam por ui** (spec A · P6).
- **Vistas de perfil:** pós-MVP (V2).
- **Mapa abre como MODAL** sobre a ficha (decisão travada).

### Falta (follow-up, na spec A)
- CRUD de regiões pela clínica (hoje são seed; agora com a lista pesquisada acima).
- Persistência em store + vínculo a um atendimento/registro real.

---

# B) Aba Procedimentos + caminho até o mapa  ⬜ A FAZER

### Problema
O mapa não tem caminho na navegação (só por URL). Falta a aba na ficha do paciente que leva até ele.

> Base já existe: `aba-procedimentos.tsx` (lista por status + botão "Registrar procedimento" + modal). A spec B **reusa** e completa.

### O que adicionar
1. **Catálogo seed** de procedimentos estéticos comuns (pesquisa abaixo), cada um com **categoria** e flag **`usaMapa`**.
2. **Aba Procedimentos** (reusa): seção com procedimentos **já feitos** (Realizado) + **agendados**, e botão **Novo procedimento**.
3. **Caminho pro mapa**: procedimento da categoria **Injetáveis** → botão **"Abrir mapa"** no modal e ação **"Mapa"** na linha → abre o `<MapaInjetaveis>` vinculado àquele registro.

### Procedimentos estéticos mais comuns (pesquisado — Brasil 2025/26)

| Procedimento | Categoria | Abre mapa? |
|---|---|---|
| Harmonização Facial (combo) | Injetáveis | ✅ |
| Toxina Botulínica (Botox) | Injetáveis | ✅ |
| Preenchimento c/ Ácido Hialurônico | Injetáveis | ✅ |
| Bioestimulador de Colágeno | Injetáveis | ✅ |
| Fios de PDO (lifting) | Injetáveis | ✅ |
| Skinbooster | Injetáveis | ✅ |
| Limpeza de Pele Profunda | Facial | — |
| Microagulhamento | Facial | — |
| Peeling Químico | Facial | — |
| Tratamento de Acne | Facial | — |
| Radiofrequência Facial | Facial | — |
| Laser / Luz Intensa Pulsada (IPL) | Facial | — |
| Criolipólise | Corporal | — |
| Radiofrequência / Drenagem Corporal | Corporal | — |

> Regra: **categoria Injetáveis → abre o mapa**. As outras abrem só o registro de texto.

### User stories (resumo)
- **P1** — Catálogo seed classificado (categoria + `usaMapa`). Ao abrir "Novo procedimento", o select mostra os comuns.
- **P2** — Aba Procedimentos: lista feitos + agendados do paciente; botão Novo procedimento.
- **P3** — Procedimento injetável → "Abrir mapa" → `<MapaInjetaveis>` do registro; pontos persistem no registro (sessão); procedimento não-injetável **não** mostra a ação de mapa.

### Modelo de dados (extensão do mock)
```ts
type CategoriaProc = "Facial" | "Corporal" | "Injetáveis" | "Estética";
type Procedimento = {
  id: string; nome: string;
  categoria: CategoriaProc | null;   // hoje null → preencher no seed
  duracaoMin: number; valor: number; ativo: boolean;
  usaMapa: boolean;                  // NOVO — Injetáveis = true
};
type RegistroProcedimento = {
  /* …atual (procedimento, profissional, data, status, valor, observacoes)… */
  usaMapa?: boolean;
  mapa?: FichaInjetaveis;            // estado do mapa quando injetável
};
```

### Decisões travadas
- Mapa abre como **modal** sobre a ficha (não rota própria).
- Estoque **entra** (substâncias do catálogo + baixa por ui).

### Fora de escopo (B)
- Módulo Procedimentos top-level (fora da ficha) — usa a aba existente.
- Backend/persistência real, vistas de perfil — follow-ups.

---

## Resumo do que falta codar (spec B)
1. Seed do catálogo `procedimentos` com categoria + `usaMapa` (mock.ts).
2. Estender modal Novo procedimento: ação "Abrir mapa" quando `usaMapa`.
3. Ação "Mapa" na linha da lista p/ registros injetáveis.
4. Montar `<MapaInjetaveis>` como controlado (value/onChange) e persistir no registro.
5. Verificação: tsc + eslint + build.

Fontes da pesquisa: Versatilis, Dermomed, Adoxy, AppHealth (procedimentos estéticos mais procurados no Brasil, 2025–2026).
