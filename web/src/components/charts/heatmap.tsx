import { cn } from "@/lib/utils";

/** Heatmap horário×coluna em grid CSS. Só a faixa ativa fica roxa. */
export function Heatmap({
  rows,
  active,
  cols = 6,
}: {
  rows: string[];
  active: string;
  cols?: number;
}) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between py-0.5 text-[10px] text-muted-2">
        {rows.map((r) => (
          <span key={r} className="leading-4">
            {r}
          </span>
        ))}
      </div>
      <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {rows.map((r) =>
          Array.from({ length: cols }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                "h-4 rounded-sm",
                r === active && c === 1 ? "bg-brand/70" : "bg-gray-100"
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}
