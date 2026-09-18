"use client";

import { ChevronRight, Menu } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { ThemeSwitcher } from "../theme-switcher";

type TopbarProps = {
  onMenu: () => void;
};

export function Topbar({ onMenu }: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-5 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenu}
          className="rounded-md p-2 hover:bg-muted lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span>Workspace</span>

          <ChevronRight className="size-3" />

          <span className="text-foreground">Operação</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}

        {/* Theme */}
        <ThemeSwitcher />
        {/* Avatar */}
        <Avatar initials="VF" />
      </div>
    </header>
  );
}
