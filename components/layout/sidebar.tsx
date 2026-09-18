"use client"

import {
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"

import { usePathname, useRouter } from "next/navigation"

import { Avatar } from "@/components/shared/avatar"

type SidebarProps = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

const navigationGroups = [
  {
    label: "Principal",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Atividades",
        icon: ClipboardList,
        href: "/dashboard/activities",
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        label: "Providers",
        icon: ShieldCheck,
        href: "/dashboard/providers",
      },
      {
        label: "Projetos",
        icon: FolderKanban,
        href: "/dashboard/projects",
      },
    ],
  },
  {
    label: "Configurações",
    items: [
      {
        label: "Usuários",
        icon: Users,
        href: "/dashboard/settings/users",
      },
      {
        label: "Configurações",
        icon: Settings,
        href: "/dashboard/settings",
      },
    ],
  },
]

export function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside
      className={`hidden shrink-0 border-r bg-card transition-all duration-200 lg:flex lg:flex-col ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4 fill-current" />
        </div>

        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">
            Gerenciador
            <span className="text-primary">.</span>
          </span>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={
            collapsed
              ? "Expandir menu"
              : "Recolher menu"
          }
        >
          <ChevronLeft
            className={`size-4 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navigationGroups.map((group) => (
          <div
            key={group.label}
            className="mb-6"
          >
            <p
              className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ${
                collapsed ? "sr-only" : ""
              }`}
            >
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon

                const active =
                  pathname === item.href ||
                  (
                    item.href !== "/dashboard" &&
                    pathname.startsWith(item.href)
                  )

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    title={
                      collapsed
                        ? item.label
                        : undefined
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />

                    {!collapsed && (
                      <span>
                        {item.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
        >
          <Avatar initials="VF" />

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">
                  Victor Fazekas
                </span>

                <span className="block text-[11px] text-muted-foreground">
                  Administrador
                </span>
              </span>

              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}