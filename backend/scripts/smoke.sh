#!/usr/bin/env bash
# Smoke test final do backend (BK-33). Requer Docker DB no ar.
# Uso: bash backend/scripts/smoke.sh
set -euo pipefail

export PATH="$PATH:/c/Program Files/Go/bin"
export DATABASE_URL="${DATABASE_URL:-postgres://app_role:app_secret@localhost:5432/artemise?sslmode=disable}"
JAR="$(mktemp)"
BASE="http://localhost:8080"

cd "$(dirname "$0")/.."

echo "== 1. build + vet =="
go build ./... && go vet ./...

echo "== 2. migrate up (idempotente) =="
go run ./cmd/migrate up

echo "== 3. server (background) =="
go run ./cmd/server &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
# espera o /api/health responder
for i in $(seq 1 30); do
  if curl -sf "$BASE/api/health" >/dev/null 2>&1; then break; fi
  sleep 1
done

echo "== 4. health =="
curl -s "$BASE/api/health"; echo

echo "== 5. login (lucsbasto@gmail.com / senha123) =="
curl -s -X POST "$BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"lucsbasto@gmail.com","senha":"senha123"}' -c "$JAR" -w '\nHTTP %{http_code}\n'

echo "== 6. /api/auth/me =="
curl -s "$BASE/api/auth/me" -b "$JAR" -w '\nHTTP %{http_code}\n'

echo "== 7. pacientes (seed: Clara Ribeiro) =="
curl -s "$BASE/api/pacientes" -b "$JAR" -w '\nHTTP %{http_code}\n'

echo "== 8. dashboard (KPIs computados) =="
curl -s "$BASE/api/dashboard" -b "$JAR" -w '\nHTTP %{http_code}\n'

echo "== 9. RLS sanity: pacientes só da clínica do token (visual) =="
echo "(confira que nenhum paciente de outra clínica aparece)"

echo "== OK: smoke concluído =="
