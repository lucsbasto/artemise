"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { weekDays, dayHours, nowLineHour } from "@/lib/mock";
import { useCollection } from "@/lib/data/create-collection";
import { eventosStore } from "@/lib/data/stores";

// Total hours displayed: 08:00–22:00 = 14 slots
const HOUR_HEIGHT = 64; // px per hour
const GRID_START = 8;   // 08:00

function hourToTop(hour: number): number {
  return (hour - GRID_START) * HOUR_HEIGHT;
}

export function WeekGrid({
  onEventClick,
  onSlotClick,
}: { onEventClick?: (id: string) => void; onSlotClick?: () => void } = {}) {
  const { items: eventos } = useCollection(eventosStore);
  return (
    <div className="flex flex-1 overflow-hidden rounded-b-[var(--radius-card)]">
      {/* Hour gutter */}
      <div className="relative w-14 shrink-0 border-r border-border bg-surface">
        {/* Spacer for header row */}
        <div className="h-12 border-b border-border" />
        {/* Hour labels */}
        {dayHours.map((h) => (
          <div
            key={h}
            className="relative flex items-start justify-end pr-2"
            style={{ height: HOUR_HEIGHT }}
          >
            <span className="mt-[-9px] text-[11px] text-muted-2 leading-none">
              {String(h).padStart(2, "0")}:00
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="relative flex flex-1 overflow-x-auto">
        {/* Column grid */}
        <div className="flex flex-1">
          {weekDays.map((day) => (
            <div key={day.num} className="flex flex-1 flex-col border-r border-border last:border-r-0">
              {/* Day header */}
              <div
                className={cn(
                  "flex h-12 shrink-0 flex-col items-center justify-center gap-0.5 border-b border-border",
                  day.hoje && "bg-brand-50/40"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-sm font-semibold leading-none",
                    day.hoje
                      ? "bg-brand text-white"
                      : "text-foreground"
                  )}
                >
                  {day.num}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-muted-2">
                  {day.dow}
                </span>
              </div>

              {/* Hour cells */}
              <div className="relative flex flex-col">
                {dayHours.map((h, idx) => (
                  <div
                    key={h}
                    onClick={() => onSlotClick?.()}
                    className={cn(
                      "border-b border-border cursor-pointer hover:bg-brand-50/40 transition-colors",
                      idx % 2 === 0 ? "bg-surface" : "bg-background/60"
                    )}
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {/* Events for this day */}
                {eventos
                  .filter((ev) => ev.dayNum === day.num)
                  .map((ev) => {
                    const top = hourToTop(ev.start);
                    const height = (ev.end - ev.start) * HOUR_HEIGHT;
                    const startLabel = `${String(Math.floor(ev.start)).padStart(2, "0")}:${String(Math.round((ev.start % 1) * 60)).padStart(2, "0")}`;
                    const endLabel = `${String(Math.floor(ev.end)).padStart(2, "0")}:${String(Math.round((ev.end % 1) * 60)).padStart(2, "0")}`;
                    return (
                      <div
                        key={ev.id}
                        className="absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] border-brand-600 bg-brand px-2 py-1 shadow-sm cursor-pointer hover:brightness-95 transition-[filter]"
                        style={{ top, height: Math.max(height - 2, 20) }}
                        onClick={() => onEventClick?.(ev.id)}
                      >
                        <p className="truncate text-[11px] font-semibold text-white leading-tight">
                          {ev.paciente}
                        </p>
                        <p className="truncate text-[11px] text-brand-100 leading-tight mt-0.5">
                          {ev.procedimento}
                        </p>
                        <p className="text-[10px] text-brand-100/80 leading-tight mt-0.5">
                          {startLabel} - {endLabel}
                        </p>
                      </div>
                    );
                  })}

                {/* Now line — only on today's column */}
                {day.hoje && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-10"
                    style={{ top: hourToTop(nowLineHour) }}
                  >
                    <div className="relative flex items-center">
                      <span className="absolute -left-1 size-2.5 rounded-full bg-danger" />
                      <div className="h-[2px] w-full bg-danger" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
