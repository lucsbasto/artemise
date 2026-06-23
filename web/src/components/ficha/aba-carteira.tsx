import { CreditCard } from "lucide-react";
import { brl, cn } from "@/lib/utils";
import { carteira } from "@/lib/mock";
import { EmptyData } from "./ficha-empty";
import { Pagination } from "./pagination";

function SaldoCard({
  tone,
  label,
  valor,
  footer,
}: {
  tone: "brand" | "green" | "white";
  label: string;
  valor: number;
  footer: React.ReactNode;
}) {
  const dark = tone !== "white";
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col gap-6 overflow-hidden rounded-[var(--radius-card)] p-5 shadow-sm",
        tone === "brand" && "bg-brand text-white",
        tone === "green" && "bg-green-500 text-white",
        tone === "white" && "border border-border bg-surface text-foreground"
      )}
    >
      <div>
        <p className={cn("text-xs", dark ? "text-white/80" : "text-muted")}>{label}</p>
        <p className="mt-1 text-2xl font-semibold">{brl(valor)}</p>
      </div>
      {footer}
      <CreditCard
        className={cn(
          "absolute right-4 top-4 size-6",
          dark ? "text-white/40" : "text-muted-2"
        )}
      />
    </div>
  );
}

export function AbaCarteira() {
  return (
    <div className="flex flex-col gap-5">
      {/* cards de saldo */}
      <div className="flex flex-wrap gap-4">
        <SaldoCard
          tone="brand"
          label="Saldo"
          valor={carteira.saldo}
          footer={<p className="font-mono text-sm tracking-widest text-white/80">{carteira.numeroMascarado}</p>}
        />
        <SaldoCard
          tone="green"
          label="Cashback"
          valor={carteira.cashback}
          footer={<p className="font-mono text-sm tracking-widest text-white/80">{carteira.numeroMascarado}</p>}
        />
        <SaldoCard
          tone="white"
          label="Total na carteira"
          valor={carteira.total}
          footer={
            <button className="inline-flex h-9 w-fit items-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand/90">
              Adicionar saldo
            </button>
          }
        />
      </div>

      {/* extrato */}
      <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
        <div className="px-5 pt-5">
          <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        </div>
        <EmptyData />
        <Pagination perPage={10} />
      </div>
    </div>
  );
}
