"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

/** Barras verticais simples roxas (dias movimentados, faturamento, por profissional). */
export function MiniBars({
  data,
  height = 150,
  showY = false,
  yFormatter,
  highlightLast,
}: {
  data: { label: string; valor: number }[];
  height?: number;
  showY?: boolean;
  yFormatter?: (v: number) => string;
  highlightLast?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: showY ? -8 : -28, bottom: 0 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={showY ? { fontSize: 10, fill: "#9ca3af" } : false}
          width={showY ? 40 : 0}
          tickFormatter={yFormatter}
        />
        <Bar dataKey="valor" radius={[4, 4, 0, 0]} barSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={highlightLast && i !== data.length - 1 ? "#ddd6fe" : "#a78bfa"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Barra única horizontal-ish (agendamentos por profissional). */
export function SingleBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-[150px] flex-col items-center justify-end gap-2">
      <div className="flex w-full flex-1 items-end justify-center">
        <div className="w-10 rounded-t-md bg-brand/70" style={{ height: "70%" }} />
      </div>
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-xs text-muted-2">{value}</span>
    </div>
  );
}
