import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-surface border border-border shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.04)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between gap-2 px-5 pt-5", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  children,
  info,
  ...props
}: React.ComponentProps<"h3"> & { info?: boolean }) {
  return (
    <h3
      className={cn("flex items-center gap-1.5 text-[15px] font-semibold text-foreground", className)}
      {...props}
    >
      {children}
      {info && <Info className="size-3.5 text-muted-2" strokeWidth={2} />}
    </h3>
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5 pt-4", className)} {...props} />;
}

/** ⓘ avulso, usado inline em rótulos */
export function InfoDot({ className }: { className?: string }) {
  return <Info className={cn("inline size-3.5 text-muted-2 align-middle", className)} strokeWidth={2} />;
}
