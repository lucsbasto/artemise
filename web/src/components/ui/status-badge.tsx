import { cn } from "@/lib/utils";
import type { FinanceStatus } from "@/lib/mock";

const TONES: Record<FinanceStatus, string> = {
  Recebido: "bg-green-50 text-success",
  Pago: "bg-green-50 text-success",
  "Em atraso": "bg-red-50 text-danger",
  "Em aberto": "bg-amber-50 text-warning",
};

export function StatusBadge({ status }: { status: FinanceStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", TONES[status])}>
      {status}
    </span>
  );
}
