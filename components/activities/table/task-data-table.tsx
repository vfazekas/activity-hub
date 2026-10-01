"use client";

import * as React from "react";

import {
  flexRender,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  features,
  type DataTableFeatures,
} from "@/components/projects/table/data-table-features";

import { columns } from "./task-columns";
import { TaskTableRow } from "@/types/index";

type TaskDataTableProps = {
  data: TaskTableRow[];
  onEdit: (task: TaskTableRow) => void;
  onOpen: (task: TaskTableRow) => void;
};

export function TaskDataTable({ data, onEdit, onOpen }: TaskDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});

  const taskColumns = React.useMemo(
    () => columns(onEdit, onOpen),
    [onEdit, onOpen],
  );

  const table = useTable<DataTableFeatures, TaskTableRow>({
    features,
    data,
    columns: taskColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const statusColumn = table.getColumn("status");
  const priorityColumn = table.getColumn("priority");
  const assignedToColumn = table.getColumn("assignedToName");

  const assignees = React.useMemo(
    () =>
      data
        .filter((task) => task.assignedToName)
        .map((task) => ({
          id: task.assignedTo,
          name: task.assignedToName,
        }))
        .filter(
          (
            user,
          ): user is {
            id: string;
            name: string;
          } => Boolean(user.id && user.name),
        )
        .filter(
          (user, index, array) =>
            array.findIndex((item) => item.id === user.id) === index,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [data],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar task..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-9 w-full sm:max-w-sm"
        />

        <Select
          value={(statusColumn?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            statusColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="TODO">A fazer</SelectItem>
            <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
            <SelectItem value="BLOCKED">Bloqueada</SelectItem>
            <SelectItem value="COMPLETED">Concluída</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(priorityColumn?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            priorityColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="LOW">Baixa</SelectItem>
            <SelectItem value="MEDIUM">Média</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="CRITICAL">Crítica</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(assignedToColumn?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            assignedToColumn?.setFilterValue(
              value === "all" ? undefined : value,
            )
          }
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos os responsáveis</SelectItem>

            {assignees.map((user) => (
              <SelectItem key={user.id} value={user.id ?? ""}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9">
              Colunas
              <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id === "assignedToName"
                    ? "Responsável"
                    : column.id === "dueDate"
                      ? "Prazo"
                      : column.id === "providerName"
                        ? "Provider"
                        : column.id === "title"
                          ? "Task"
                          : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => onOpen(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  Nenhuma task encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} task(s)
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {table.state.pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
