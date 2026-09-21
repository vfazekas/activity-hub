"use client"

import {
  Activity,
  CircleAlert,
  Clock3,
  FolderKanban,
  Plus,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { ActivityTable } from "@/components/activities/activity-table"
import { HealthBadge } from "@/components/shared/health-badge"

import { activities } from "@/lib/mock-data"

export function Dashboard() {

  return (
    <>
      <PageHeader
        title="Bom dia, Victor"
        description="Aqui está um resumo das atividades e projetos que precisam da sua atenção."
        action={
          <button className="hidden items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 sm:flex">
            <Plus className="size-4" />
            Nova atividade
          </button>
        }
      />

      <DashboardStats />

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <MyActivities />

        <ProjectsAttention />
      </div>

      <UpcomingDeadlines />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  STATS                                     */
/* -------------------------------------------------------------------------- */

function DashboardStats() {
  const stats = [
    {
      label: "Projetos ativos",
      value: "8",
      trend: "+2 este mês",
      icon: FolderKanban,
    },
    {
      label: "Atividades atrasadas",
      value: "3",
      trend: "Requer atenção",
      icon: CircleAlert,
      danger: true,
    },
    {
      label: "Vencendo hoje",
      value: "4",
      trend: "2 de alta prioridade",
      icon: Clock3,
      warning: true,
    },
    {
      label: "Em atenção",
      value: "2",
      trend: "Projetos críticos",
      icon: Activity,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>

              <Icon
                className={`size-4 ${
                  stat.danger
                    ? "text-red-500"
                    : stat.warning
                      ? "text-amber-500"
                      : "text-muted-foreground"
                }`}
              />
            </div>

            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold tracking-tight">
                {stat.value}
              </span>

              <span
                className={`text-xs ${
                  stat.danger
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {stat.trend}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              MY ACTIVITIES                                 */
/* -------------------------------------------------------------------------- */

function MyActivities() {
  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">
            Minhas atividades
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Acompanhe o que precisa da sua atenção
          </p>
        </div>

        <button className="text-xs font-medium text-primary hover:underline">
          Ver todas
        </button>
      </div>

      <ActivityTable
        rows={activities.slice(0, 4)}
        compact
      />
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                           PROJECTS ATTENTION                               */
/* -------------------------------------------------------------------------- */

function ProjectsAttention() {

  
  type Health = Parameters<typeof HealthBadge>[0]["value"]

  type Project = {
    name: string
    provider: string
    due: string
    health: Health
  }

  const projects: Project[] = []

  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">
            Projetos em atenção
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Health dos seus projetos
          </p>
        </div>

        <button className="text-xs font-medium text-primary hover:underline">
          Ver todos
        </button>
      </div>


      <div className="divide-y">
        {projects.slice(0, 3).map((project) => (
          <div
            key={project.name}
            className="flex items-center gap-3 px-5 py-4"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <FolderKanban className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {project.name}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {project.provider} · Prazo {project.due}
              </p>
            </div>

            <HealthBadge value={project.health} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                           UPCOMING DEADLINES                               */
/* -------------------------------------------------------------------------- */

function UpcomingDeadlines() {
  return (
    <section className="mt-6 rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">
          Próximos prazos
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Atividades que vencem nos próximos dias
        </p>
      </div>

      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {activities.slice(0, 3).map((activity, index) => (
          <div
            key={activity.title}
            className="flex items-start gap-3 px-5 py-4"
          >
            <div
              className={`mt-1 size-2 rounded-full ${
                index === 0
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
            />

            <div>
              <p className="text-sm font-medium">
                {activity.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {activity.project}
              </p>

              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {activity.due}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}