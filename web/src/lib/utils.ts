import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata número como moeda pt-BR. Ex.: 1831 -> "R$ 1.831,00" */
export function brl(value: number, opts?: { sign?: boolean; decimals?: boolean }) {
  const decimals = opts?.decimals ?? true;
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Math.abs(value));
  if (value < 0) return `-${formatted}`;
  if (opts?.sign && value > 0) return `+${formatted}`;
  return formatted;
}
