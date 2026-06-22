"use client";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CashflowPoint } from "@/lib/mock";

export function CashflowChart({
  data,
  height = 260,
}: {
  data: CashflowPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef0f4" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickFormatter={(v: number) =>
            v === 0 ? "R$ 0" : `${v < 0 ? "-" : ""}R$ ${Math.abs(v) >= 1000 ? Math.abs(v) / 1000 + "k" : Math.abs(v)}`
          }
        />
        <ReferenceLine y={0} stroke="#e5e7eb" />
        <Bar dataKey="entradas" stackId="real" fill="#22c55e" radius={[3, 3, 0, 0]} barSize={18} />
        <Bar dataKey="entradasPrevistas" stackId="prev" fill="#bbf7d0" radius={[3, 3, 0, 0]} barSize={18} />
        <Bar dataKey="saidas" stackId="real" fill="#ef4444" radius={[0, 0, 3, 3]} barSize={18} />
        <Bar dataKey="saidasPrevistas" stackId="prev" fill="#fecaca" radius={[0, 0, 3, 3]} barSize={18} />
        <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
        <Line
          type="monotone"
          dataKey="saldoPrevisto"
          stroke="#93c5fd"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const SERIES = [
  { label: "Entradas", color: "#22c55e" },
  { label: "Entradas previstas", color: "#bbf7d0" },
  { label: "Saídas", color: "#ef4444" },
  { label: "Saídas previstas", color: "#fecaca" },
  { label: "Saldo", color: "#3b82f6", line: true },
  { label: "Saldo previsto", color: "#93c5fd", line: true, dashed: true },
];

export function CashflowLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
      {SERIES.map((s) => (
        <span key={s.label} className="flex items-center gap-1.5">
          {s.line ? (
            <span
              className="inline-block h-0.5 w-4 rounded-full"
              style={{ background: s.color, opacity: s.dashed ? 0.7 : 1 }}
            />
          ) : (
            <span className="inline-block size-2.5 rounded-sm" style={{ background: s.color }} />
          )}
          {s.label}
        </span>
      ))}
    </div>
  );
}
