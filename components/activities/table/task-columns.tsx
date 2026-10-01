"use client";

import {
  ArrowUpDown,
  MoreHorizontal,
  SquareArrowOutUpRight,
  SquarePen,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StatusBadge } from "@/components/shared/status-badge-task";
import { PriorityBadge } from "@/components/shared/priority-badge";

import type { TaskTableRow } from "@/types";
import type { DataTableFeatures } from "@/components/projects/table/data-table-features";

const columnHelper = createColumnHelper<DataTableFeatures, TaskTableRow>();

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T00:00:00`));
}

export const columns = (
  onEdit: (task: TaskTableRow) => void,
  onOpen: (task: TaskTableRow) => void,
) =>
  columnHelper.columns([
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0 max-w-[320px]">
          <div className="truncate font-medium">{row.original.title}</div>

          {row.original.description && (
            <div className="truncate text-xs text-muted-foreground">
              {row.original.description}
            </div>
          )}
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />,
    }),

    columnHelper.accessor("priority", {
      header: "Prioridade",
      cell: ({ row }) => <PriorityBadge value={row.original.priority} />,
    }),

    columnHelper.accessor("assignedToName", {
      header: "Responsável",
      cell: ({ row }) => {
        const task = row.original;

        if (!task.assignedToName) {
          return (
            <span className="text-xs text-muted-foreground">Não atribuído</span>
          );
        }

        return (
          <div className="min-w-[150px]">
            <div className="text-sm font-medium">{task.assignedToName}</div>

            {task.assignedToEmail && (
              <div className="truncate text-xs text-muted-foreground">
                {task.assignedToEmail}
              </div>
            )}
          </div>
        );
      },
      filterFn: "includesString",
    }),

    columnHelper.accessor("providerName", {
      header: "Provider",
      cell: ({ row }) => {
        const task = row.original;

        if (!task.providerName) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }

        return (
          <div className="min-w-[140px]">
            <div className="text-sm font-medium">{task.providerName}</div>

            {task.projectName && (
              <div className="truncate text-xs text-muted-foreground">
                {task.projectName}
              </div>
            )}
          </div>
        );
      },
    }),

    columnHelper.accessor("dueDate", {
      header: "Prazo",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.dueDate)}
        </span>
      ),
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(task);
                }}
              >
                <SquareArrowOutUpRight className="text-blue-600" />
                Abrir task
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(task);
                }}
              >
                <SquarePen className="text-blue-600" />
                Editar task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
