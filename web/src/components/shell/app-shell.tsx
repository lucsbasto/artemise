"use client";
import * as React from "react";
import { Header } from "./header";
import { IconSidebar } from "./icon-sidebar";
import { FloatingWidgets } from "./floating-widgets";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onToggleSidebar={() => setSidebarExpanded((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <IconSidebar expanded={sidebarExpanded} />
        <main className="scroll-thin flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
      <FloatingWidgets />
    </div>
  );
}
