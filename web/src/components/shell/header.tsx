"use client";
import Link from "next/link";
import { Menu, Search, HelpCircle, Bell, MessageCircle } from "lucide-react";
import { currentUser } from "@/lib/mock";

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface px-4">
      <button
        onClick={onToggleSidebar}
        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-background"
        aria-label="Alternar menu"
      >
        <Menu className="size-5" />
      </button>

      <Link href="/" className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full border-2 border-brand text-brand">
          <span className="block size-2.5 rounded-full border-2 border-brand" />
        </span>
        <span className="text-[15px] tracking-tight text-foreground">
          clínica<span className="font-bold">experts</span>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <button className="grid size-9 place-items-center rounded-full bg-pink-50 text-green-500 hover:bg-pink-100" aria-label="WhatsApp">
          <MessageCircle className="size-[18px]" />
        </button>
        <button className="grid size-9 place-items-center rounded-lg text-muted hover:bg-background" aria-label="Buscar">
          <Search className="size-[18px]" />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-background">
          <HelpCircle className="size-[18px]" />
          <span className="hidden sm:inline">Ajuda</span>
        </button>
        <button className="grid size-9 place-items-center rounded-lg text-muted hover:bg-background" aria-label="Notificações">
          <Bell className="size-[18px]" />
        </button>
        <button className="ml-1 grid size-9 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand ring-2 ring-green-400/60">
          {currentUser.iniciais}
        </button>
      </div>
    </header>
  );
}
