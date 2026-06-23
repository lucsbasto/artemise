"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRangePicker, type DateRange } from "@/components/ui/date-picker";

interface PeriodSelectorBaseProps {
  /** Rótulo estático (modo legado). */
  label?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

interface PeriodSelectorRangeProps extends PeriodSelectorBaseProps {
  /** Quando passado, renderiza DateRangePicker no lugar do rótulo. */
  range: DateRange | undefined;
  onRangeChange: (r: DateRange | undefined) => void;
  placeholder?: string;
}

type PeriodSelectorProps = PeriodSelectorBaseProps | PeriodSelectorRangeProps;

function hasRange(p: PeriodSelectorProps): p is PeriodSelectorRangeProps {
  return "range" in p && "onRangeChange" in p;
}

/** Seletor de período: modo legado (‹ rótulo ›) ou modo range (DateRangePicker). */
export function PeriodSelector(props: PeriodSelectorProps) {
  if (hasRange(props)) {
    return (
      <DateRangePicker
        value={props.range}
        onChange={props.onRangeChange}
        placeholder={props.placeholder}
      />
    );
  }

  // Modo legado — mantém retrocompatibilidade total
  const { label = "", onPrev, onNext } = props;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1 py-0.5 text-sm text-foreground">
      <button
        className="grid size-7 place-items-center rounded-full text-muted-2 hover:text-foreground"
        aria-label="Anterior"
        onClick={onPrev}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="px-1 font-medium">{label}</span>
      <button
        className="grid size-7 place-items-center rounded-full text-muted-2 hover:text-foreground"
        aria-label="Próximo"
        onClick={onNext}
      >
        <ChevronRight className="size-4" />
      </button>
    </span>
  );
}
