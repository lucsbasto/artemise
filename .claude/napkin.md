# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Shell & Command Reliability (Highest Priority)
1. **[2026-06-24] Bash tool is Git Bash (POSIX sh), NOT PowerShell — `@'...'@` here-strings leak a literal `@` into the output**
   Do instead: for multi-line commit messages use a real bash heredoc (`git commit -F - <<'EOF' … EOF`) or repeated `-m` flags. Never paste PowerShell `@'…'@` into the Bash tool. After committing, verify subject with `git log --oneline -1`.

## User Directives
1. **[2026-06-24] Merge feat/* direto na main — nunca abrir PR**
   Do instead: commitar/mergear direto na main.
2. **[2026-06-24] Todo spec novo abre git worktree irmão antes de codar**
   Do instead: `git worktree add ../artemise-worktrees/<feature>` antes de implementar (spec/planning pode ser no main).
3. **[2026-06-24] Build não roda em worktree (Turbopack)**
   Do instead: validar com `tsc --noEmit` + eslint no worktree; rodar build só no main pós-merge.

## Domain Behavior Guardrails
1. **[2026-06-24] AGENTS.md: este Next.js tem breaking changes vs treino**
   Do instead: ler guia em `node_modules/next/dist/docs/` antes de escrever código Next novo.
2. **[2026-06-24] App é mock client-side — coleções via `useCollection` + stores em `src/lib/data/stores`; dados em `src/lib/mock.ts`**
   Do instead: ao adicionar entidade, seguir o par store+collection e projetar linha de contato quando aplicável (ver profissionais-view).
