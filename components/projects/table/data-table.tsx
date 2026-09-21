"use client";
import * as React from "react";
import {
  flexRender,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
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
import { features, type DataTableFeatures } from "./data-table-features";
import type { ProjectTableRow } from "./columns";
import { useRouter } from "next/navigation";
interface DataTableProps<TData extends RowData & ProjectTableRow> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
}
export function DataTable<TData extends RowData & ProjectTableRow>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const router = useRouter();

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  });
  const providerColumn = table.getColumn("providerName");
  const statusColumn = table.getColumn("status");
  const healthColumn = table.getColumn("health");
  const priorityColumn = table.getColumn("priority");
  const providers = Array.from(
    new Set(
      data
        .map((project) => project.providerName)
        .filter((provider) => provider !== "—"),
    ),
  ).sort();

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar projeto..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-9 w-full sm:max-w-sm"
        />

        {/* Provider */}
        <Select
          value={(providerColumn?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            providerColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos os providers</SelectItem>

            {providers.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
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

        {/* Health */}
        <Select
          value={(healthColumn?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            healthColumn?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Health" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>

            <SelectItem value="GREEN">Verde</SelectItem>

            <SelectItem value="YELLOW">Amarelo</SelectItem>

            <SelectItem value="RED">Vermelho</SelectItem>
          </SelectContent>
        </Select>

        {/* Prioridade */}
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

        {/* Visibilidade */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9">
              Colunas <ChevronDown className="ml-2 size-4" />
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
                  className="capitalize"
                >
                  {column.id === "providerName"
                    ? "Provider"
                    : column.id === "targetDate"
                      ? "Prazo"
                      : column.id === "members"
                        ? "Responsáveis"
                        : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela */}
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(`/dashboard/projects/${row.original.id}`);
                      }}
                    >
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
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} projeto(s)
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
