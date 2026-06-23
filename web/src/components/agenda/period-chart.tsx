"use client";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/**
 * "Agendamentos por período" (spec §5.3): barras verdes (contagem) +
 * linha de média horizontal. Escala 0..max do período.
 */
export function PeriodChart({
  data,
  media,
  height = 220,
}: {
  data: { label: string; valor: number }[];
  media: number;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.valor));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
        />
        <YAxis
          domain={[0, max]}
          ticks={[0, max]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          width={24}
        />
        <ReferenceLine y={media} stroke="#c4b5fd" strokeDasharray="4 4" />
        <Bar dataKey="valor" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={26} />
        <Line
          type="monotone"
          dataKey={() => media}
          stroke="#a78bfa"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** Legenda do card (quadrado verde + linha). */
export function PeriodLegend() {
  return (
    <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-green-500" />
        Agendamentos
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded-full bg-[#a78bfa]" />
        Média
      </span>
    </div>
  );
}
