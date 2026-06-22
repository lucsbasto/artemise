import { AlertTriangle } from "lucide-react";

export function EmptyState({
  title = "Não há nada aqui!",
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 py-6">
      <AlertTriangle className="size-7 text-amber-400" strokeWidth={1.75} />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-sm text-muted-2">{subtitle}</p>}
    </div>
  );
}
