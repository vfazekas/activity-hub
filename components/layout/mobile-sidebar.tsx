"use client"

import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react"

import { usePathname, useRouter } from "next/navigation"

import { Avatar } from "@/components/shared/avatar"

type MobileSidebarProps = {
  open: boolean
  onClose: () => void
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
        href: "/activities",
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        label: "Providers",
        icon: ShieldCheck,
        href: "/providers",
      },
      {
        label: "Projetos",
        icon: FolderKanban,
        href: "/projects",
      },
    ],
  },
  {
    label: "Configurações",
    items: [
      {
        label: "Usuários",
        icon: Users,
        href: "/settings/users",
      },
      {
        label: "Configurações",
        icon: Settings,
        href: "/settings",
      },
    ],
  },
]

export function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  if (!open) {
    return null
  }

  function navigate(href: string) {
    router.push(href)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fechar menu"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-72 flex-col bg-card shadow-xl">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4 fill-current" />
            </div>

            <span className="text-sm font-semibold tracking-tight">
              Gerenciador
              <span className="text-primary">.</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navigationGroups.map((group) => (
            <div
              key={group.label}
              className="mb-6"
            >
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
                      onClick={() => navigate(item.href)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />

                      {item.label}
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

            <span className="min-w-0">
              <span className="block truncate text-xs font-medium">
                Victor Fazekas
              </span>

              <span className="block text-[11px] text-muted-foreground">
                Administrador
              </span>
            </span>
          </button>
        </div>
      </aside>
    </div>
  )
}