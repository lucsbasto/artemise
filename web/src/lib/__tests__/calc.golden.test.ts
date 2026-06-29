// Golden tests das libs computadas (M7), portados 1:1 dos `_test.go` do domínio
// Go: backend/internal/domain/financeiro_test.go e comissao_test.go.
//
// Runner: o projeto `web/` NÃO tem vitest/jest configurado. Estes testes usam o
// runner embutido do Node (`node:test`/`node:assert`, zero dependências) para
// não quebrar os gates `tsc`/`eslint`. Para rodar manualmente:
//   npx tsc src/lib/__tests__/calc.golden.test.ts src/lib/*.ts \
//     --outDir .tmp --module commonjs --target es2020 --skipLibCheck \
//     --noEmitOnError false   # (ajustar require de '@/lib/*' p/ caminho relativo)
//   node --test .tmp/lib/__tests__/calc.golden.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { fluxoRows, percentual, totalNode, extratoKPIs } from "@/lib/financeiro-calc";
import { calcComissao } from "@/lib/comissao-calc";
import type { CashflowPoint } from "@/lib/mock";

const cp = (label: string, entradas: number, saidas: number): CashflowPoint => ({
  label, entradas, saidas, entradasPrevistas: 0, saidasPrevistas: 0, saldo: 0, saldoPrevisto: 0,
});

// --- financeiro_test.go: TestFluxoRows (encadeamento de saldo) ---
test("FluxoRows encadeia saldoFinal[n] == saldoInicial[n+1]", () => {
  const rows = fluxoRows([cp("1 Jun", 1000, -400), cp("2 Jun", 500, -200), cp("3 Jun", 0, -100)], 0);
  assert.deepEqual(rows[0], { label: "1 Jun", saldoInicial: 0, entrada: 1000, saida: 400, lucro: 600, saldoFinal: 600 });
  assert.deepEqual(rows[1], { label: "2 Jun", saldoInicial: 600, entrada: 500, saida: 200, lucro: 300, saldoFinal: 900 });
  assert.deepEqual(rows[2], { label: "3 Jun", saldoInicial: 900, entrada: 0, saida: 100, lucro: -100, saldoFinal: 800 });
});

// TestFluxoRowsSaldoInicial
test("FluxoRows propaga saldo inicial na primeira linha", () => {
  const rows = fluxoRows([cp("x", 100, 0)], 250);
  assert.equal(rows[0].saldoInicial, 250);
  assert.equal(rows[0].saldoFinal, 350);
});

// TestPercentual
test("Percentual (sem divisão por zero)", () => {
  assert.equal(percentual(50, 200), 25);
  assert.equal(percentual(0, 0), 0);
  assert.equal(percentual(100, 0), 0);
  assert.equal(percentual(-30, 100), 30);
});

// TestTotalNode
test("TotalNode soma filhos ou usa valor próprio", () => {
  assert.equal(
    totalNode({ nome: "Receitas", valor: 999, cor: "", filhos: [{ nome: "Serviços", valor: 800 }, { nome: "Produtos", valor: 200 }] }),
    1000,
  );
  assert.equal(totalNode({ nome: "Avulso", valor: 350, cor: "" }), 350);
});

// --- comissao_test.go ---
test("CalcComissao percentual / fixo / prioridade / sem regra", () => {
  assert.equal(calcComissao(1000, [{ procedimentoId: null, tipo: "percentual", valor: 40 }], "qualquer"), 400);
  assert.equal(calcComissao(1000, [{ procedimentoId: null, tipo: "fixo", valor: 150 }], "x"), 150);
  const regras = [
    { procedimentoId: null, tipo: "percentual" as const, valor: 10 },
    { procedimentoId: "proc-1", tipo: "percentual" as const, valor: 50 },
  ];
  assert.equal(calcComissao(1000, regras, "proc-1"), 500); // específica vence
  assert.equal(calcComissao(1000, regras, "proc-2"), 100); // fallback padrão
  assert.equal(calcComissao(1000, [], "x"), 0);
});

// --- numeric→number (PostgREST pode devolver numeric como string) ---
test("extratoKPIs coage valor string e separa aberto×realizado", () => {
  const k = extratoKPIs([
    { tipo: "receita", situacao: "Recebido", valor: "1000.00", vencimento: "2026-06-10" },
    { tipo: "receita", situacao: "Em aberto", valor: 500, vencimento: "2026-06-11" },
    { tipo: "despesa", situacao: "Pago", valor: 300, vencimento: "2026-06-12" },
    { tipo: "despesa", situacao: "Em atraso", valor: 200, vencimento: "2026-06-13" },
  ]);
  assert.deepEqual(k, { receitasAbertas: 500, receitasRealizadas: 1000, despesasAbertas: 200, despesasRealizadas: 300, totalPeriodo: 700 });
});
