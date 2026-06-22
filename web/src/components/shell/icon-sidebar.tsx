"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  Rocket,
  Home,
  Calendar,
  Users,
  Stethoscope,
  ShoppingCart,
  DollarSign,
  BadgePercent,
  Package,
  MessageSquare,
  ShieldCheck,
  Settings,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { icon: React.ElementType; label: string; href?: string; badge?: boolean };

const TOP: Item[] = [
  { icon: Crown, label: "Planos / Novidades" },
  { icon: Rocket, label: "Atalhos", badge: true },
  { icon: Home, label: "Início", href: "/" },
  { icon: Calendar, label: "Agenda", href: "/agenda" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: Stethoscope, label: "Profissionais" },
  { icon: ShoppingCart, label: "Vendas" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: BadgePercent, label: "Marketing" },
  { icon: Package, label: "Estoque" },
  { icon: MessageSquare, label: "Mensagens" },
  { icon: Target, label: "Integrações", badge: true },
  { icon: ShieldCheck, label: "Segurança" },
];

const BOTTOM: Item[] = [{ icon: Settings, label: "Configurações" }];

function NavIcon({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  const inner = (
    <span
      className={cn(
        "group relative grid size-10 place-items-center rounded-xl transition-colors",
        active ? "bg-brand text-white" : "text-muted-2 hover:bg-brand-50 hover:text-brand"
      )}
    >
      <Icon className="size-[19px]" strokeWidth={2} />
      {item.badge && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-brand" />}
      <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-white group-hover:block">
        {item.label}
      </span>
    </span>
  );
  return item.href ? <Link href={item.href}>{inner}</Link> : <button>{inner}</button>;
}

export function IconSidebar() {
  const pathname = usePathname();
  const isActive = (href?: string) =>
    !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-3">
      {TOP.map((it) => (
        <NavIcon key={it.label} item={it} active={isActive(it.href)} />
      ))}
      <div className="mt-auto">
        {BOTTOM.map((it) => (
          <NavIcon key={it.label} item={it} active={isActive(it.href)} />
        ))}
      </div>
    </nav>
  );
}
