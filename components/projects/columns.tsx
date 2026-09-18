"use client";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

import { StatusBadge } from "@/components/shared/status-badge";
import { HealthBadge } from "@/components/shared/health-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";

import type { Health, Priority, ProjectStatus } from "@/types";
import { type DataTableFeatures } from "./data-table-features";

export type ProjectTableRow = {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  health: Health;
  priority: Priority;
  startDate: string | null;
  targetDate: string | null;
  providerName: string;
  members: number;
};

const columnHelper = createColumnHelper<DataTableFeatures, ProjectTableRow>();

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T00:00:00`));
}

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Projeto
        <ArrowUpDown className="ml-2 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[280px] truncate font-medium">
        {row.original.name}
      </div>
    ),
  }),

  columnHelper.accessor("providerName", {
    header: "Provider",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.providerName}
      </span>
    ),
    filterFn: "includesString",
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  }),

  columnHelper.accessor("health", {
    header: "Health",
    cell: ({ row }) => <HealthBadge value={row.original.health} />,
  }),

  columnHelper.accessor("priority", {
    header: "Prioridade",
    cell: ({ row }) => <PriorityBadge value={row.original.priority} />,
  }),

  columnHelper.accessor("members", {
    header: "Responsáveis",
    cell: ({ row }) => {
      const members = row.original.members;

      return (
        <span className="text-xs text-muted-foreground">
          {members} {members === 1 ? "membro" : "membros"}
        </span>
      );
    },
  }),

  columnHelper.accessor("targetDate", {
    header: "Prazo",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.original.targetDate)}
      </span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                console.log("Projeto:", project.id);
              }}
            >
              Abrir projeto
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                console.log("Editar projeto:", project.id);
              }}
            >
              Editar projeto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
]);
