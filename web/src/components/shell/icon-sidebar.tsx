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
  Truck,
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

type Item = { icon: React.ElementType; label: string; href?: string; badge?: boolean; match?: string };

const TOP: Item[] = [
  { icon: Crown, label: "Planos / Novidades" },
  { icon: Rocket, label: "Atalhos", badge: true },
  { icon: Home, label: "Início", href: "/" },
  { icon: Calendar, label: "Agenda", href: "/agenda" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: Stethoscope, label: "Profissionais", href: "/profissionais" },
  { icon: Truck, label: "Fornecedores", href: "/fornecedores" },
  { icon: ShoppingCart, label: "Vendas" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: BadgePercent, label: "Marketing" },
  { icon: Package, label: "Estoque", href: "/estoque/items", match: "/estoque" },
  { icon: MessageSquare, label: "Mensagens", href: "/comunicacao/canais-de-comunicacao", match: "/comunicacao" },
  { icon: Target, label: "Integrações", badge: true },
  { icon: ShieldCheck, label: "Segurança" },
];

const BOTTOM: Item[] = [
  { icon: Settings, label: "Configurações", href: "/configuracoes/procedimentos", match: "/configuracoes" },
];

function NavIcon({
  item,
  active,
  open,
  onNavigate,
}: {
  item: Item;
  active: boolean;
  open: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const dead = !item.href;
  const inner = (
    <span
      className={cn(
        // base = layout expandido (rótulo visível) — usado no drawer do celular e no md+ aberto
        "group relative flex h-10 w-full items-center gap-3 rounded-xl px-2.5 transition-colors",
        // md+ fechado: vira ícone quadrado centralizado (zero regressão desktop)
        !open && "md:size-10 md:w-auto md:justify-center md:gap-0 md:px-0",
        active && "bg-brand text-white",
        !active && !dead && "text-muted-2 hover:bg-brand-50 hover:text-brand",
        dead && "cursor-not-allowed text-muted-2/60 hover:bg-background"
      )}
    >
      <span className="relative grid size-5 shrink-0 place-items-center">
        <Icon className="size-[19px]" strokeWidth={2} />
        {item.badge && <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-brand" />}
      </span>
      {/* rótulo: sempre no celular (drawer); no md+ só quando aberto */}
      <span className={cn("truncate text-sm", !open && "md:hidden")}>
        {item.label}
        {dead && <span className="ml-1 opacity-60">· Em breve</span>}
      </span>
      {/* tooltip só no md+ fechado (ícones) */}
      {!open && (
        <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-white md:group-hover:block">
          {item.label}
          {dead && <span className="ml-1 text-white/50">· Em breve</span>}
        </span>
      )}
    </span>
  );
  return item.href ? (
    <Link href={item.href} onClick={onNavigate} className="w-full">
      {inner}
    </Link>
  ) : (
    <button aria-disabled className="w-full cursor-not-allowed">
      {inner}
    </button>
  );
}

export function IconSidebar({
  open = false,
  onNavigate,
}: {
  open?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (it: Item) => {
    if (it.match) return pathname.startsWith(it.match);
    return !!it.href && (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href));
  };

  return (
    <nav
      className={cn(
        "flex shrink-0 flex-col gap-1 border-r border-border bg-surface py-3",
        // celular: overlay deslizante (sempre largo p/ toque)
        "fixed inset-y-0 left-0 z-40 w-60 px-2 transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full",
        // tablet/desktop: volta ao fluxo, largura por estado (comportamento atual)
        "md:static md:z-auto md:translate-x-0 md:transition-all md:duration-200",
        open ? "md:w-60 md:items-stretch md:px-2" : "md:w-16 md:items-center md:px-0"
      )}
    >
      {TOP.map((it) => (
        <NavIcon key={it.label} item={it} active={isActive(it)} open={open} onNavigate={onNavigate} />
      ))}
      <div className="mt-auto w-full">
        {BOTTOM.map((it) => (
          <NavIcon key={it.label} item={it} active={isActive(it)} open={open} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}
