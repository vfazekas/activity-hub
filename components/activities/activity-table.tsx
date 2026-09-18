"use client"

import {
  MoreHorizontal,
} from "lucide-react"

import type { Activity } from "@/types"

import { Avatar } from "@/components/shared/avatar"
import { PriorityBadge } from "@/components/shared/priority-badge"
import { StatusBadge } from "@/components/shared/status-badge"

type ActivityTableProps = {
  rows: Activity[]
  compact?: boolean
  onActivityClick?: (
    activity: Activity
  ) => void
}

export function ActivityTable({
  rows,
  compact = false,
  onActivityClick,
}: ActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="w-10 px-5 py-3">
              <input
                type="checkbox"
                aria-label="Selecionar todas"
              />
            </th>

            <th className="min-w-[230px] px-2 py-3">
              Atividade
            </th>

            <th className="px-2 py-3">
              Projeto
            </th>

            <th className="px-2 py-3">
              Responsável
            </th>

            <th className="px-2 py-3">
              Prioridade
            </th>

            <th className="px-2 py-3">
              Status
            </th>

            <th className="px-2 py-3">
              Prazo
            </th>

            <th className="w-12 px-3 py-3" />
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.map((activity) => (
            <tr
              key={activity.title}
              className="group hover:bg-muted/40"
            >
              <td className="px-5 py-3">
                <input
                  type="checkbox"
                  aria-label={`Selecionar ${activity.title}`}
                />
              </td>

              <td className="px-2 py-3">
                <button
                  type="button"
                  onClick={() =>
                    onActivityClick?.(activity)
                  }
                  className="text-left"
                >
                  <p className="text-sm font-medium hover:text-primary">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.provider}
                  </p>
                </button>
              </td>

              <td className="px-2 py-3 text-xs text-muted-foreground">
                {activity.project}
              </td>

              <td className="px-2 py-3">
                <span className="flex items-center gap-2 text-xs">
                  <Avatar
                    initials={activity.initials}
                    className="size-6 text-[9px]"
                  />

                  {!compact && activity.owner}
                </span>
              </td>

              <td className="px-2 py-3">
                <PriorityBadge
                  value={activity.priority}
                />
              </td>

              <td className="px-2 py-3">
                <StatusBadge
                  value={activity.status}
                />
              </td>

              <td className="whitespace-nowrap px-2 py-3 text-xs text-muted-foreground">
                {activity.due}
              </td>

              <td className="px-3 py-3">
                <button
                  className="rounded p-1 text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100"
                  aria-label="Mais ações"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}