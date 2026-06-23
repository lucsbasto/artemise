"use client";
import * as React from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export type { DateRange };

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const fmtMonth = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const fmtWeekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

/** pt-BR sem depender de date-fns/locale. */
const ptFormatters = {
  formatCaption: (date: Date) => {
    const s = fmtMonth.format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  formatWeekdayName: (date: Date) => fmtWeekday.format(date).replace(".", ""),
};

export function fmtDate(d?: Date): string {
  return d ? fmt.format(d) : "";
}

/** Wrapper de popover com botão-gatilho + calendário on-brand. */
function PickerPopover({
  label,
  open,
  setOpen,
  children,
  width = "w-auto",
}: {
  label: React.ReactNode;
  open: boolean;
  setOpen: (v: boolean) => void;
  children: React.ReactNode;
  width?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-foreground hover:border-brand"
      >
        <Calendar className="size-4 text-muted-2" />
        {label}
      </button>
      {open && (
        <div
          className={cn(
            "absolute left-0 top-11 z-50 rounded-xl border border-border bg-surface p-2 shadow-lg",
            width
          )}
          style={
            {
              "--rdp-accent-color": "var(--brand)",
              "--rdp-accent-background-color": "var(--brand-50)",
              "--rdp-day-width": "2.25rem",
              "--rdp-day-height": "2.25rem",
              "--rdp-day_button-width": "2.25rem",
              "--rdp-day_button-height": "2.25rem",
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
}: {
  value?: Date;
  onChange: (d: Date | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <PickerPopover
      open={open}
      setOpen={setOpen}
      label={value ? fmtDate(value) : <span className="text-muted-2">{placeholder}</span>}
    >
      <DayPicker
        mode="single"
        selected={value}
        onSelect={(d) => {
          onChange(d);
          setOpen(false);
        }}
        formatters={ptFormatters}
      />
    </PickerPopover>
  );
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Selecione o período",
}: {
  value?: DateRange;
  onChange: (r: DateRange | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const label =
    value?.from && value?.to ? (
      `${fmtDate(value.from)} – ${fmtDate(value.to)}`
    ) : value?.from ? (
      `${fmtDate(value.from)} – …`
    ) : (
      <span className="text-muted-2">{placeholder}</span>
    );
  return (
    <PickerPopover open={open} setOpen={setOpen} label={label}>
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        numberOfMonths={2}
        formatters={ptFormatters}
      />
    </PickerPopover>
  );
}
