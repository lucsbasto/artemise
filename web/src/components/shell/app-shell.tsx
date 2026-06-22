"use client";
import * as React from "react";
import { Header } from "./header";
import { IconSidebar } from "./icon-sidebar";
import { FloatingWidgets } from "./floating-widgets";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <div className={cn("transition-all duration-200", sidebarOpen ? "w-16" : "w-0 overflow-hidden")}>
          <IconSidebar />
        </div>
        <main className="scroll-thin flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
      <FloatingWidgets />
    </div>
  );
}
