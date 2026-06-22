"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function Donut({
  color = "#22c55e",
  centerValue,
  centerLabel,
  size = 170,
  segments,
}: {
  color?: string;
  centerValue: string | number;
  centerLabel: string;
  size?: number;
  segments?: { value: number; color: string }[];
}) {
  const data = segments ?? [{ value: 1, color }];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">{centerValue}</span>
        <span className="text-xs text-muted-2">{centerLabel}</span>
      </div>
    </div>
  );
}

/** Pizza cheia (sem furo) — usado em Categorias do Financeiro. */
export function Pie100({
  segments,
  size = 170,
}: {
  segments: { nome: string; valor: number; cor: string }[];
  size?: number;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={segments} dataKey="valor" outerRadius="100%" startAngle={90} endAngle={-270} stroke="#fff" strokeWidth={2}>
            {segments.map((s, i) => (
              <Cell key={i} fill={s.cor} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
