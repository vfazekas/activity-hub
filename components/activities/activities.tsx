"use client"

import { activities } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { PageHeader } from "../shared/page-header";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { ActivityTable } from "./activity-table";
import { ActivityHistorySheet } from "../sheet/activity-history-sheet";


export function Activities() {
  const [query, setQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<
    (typeof activities)[number] | undefined
  >();
  const filtered = useMemo(
    () =>
      activities.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <>
      <PageHeader
        title="Atividades"
        description="Acompanhe e organize todas as atividades da operação."
        action={
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-form", { detail: "activity" }),
              )
            }
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="size-4" /> Nova atividade
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar atividade"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {[
          "Provider",
          "Projeto",
          "Status",
          "Prioridade",
          "Responsável",
          "Prazo",
        ].map((f) => (
          <button
            key={f}
            className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
          >
            {f}
            <ChevronDown className="size-3.5" />
          </button>
        ))}
        <button
          className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"
          aria-label="Filtros"
        >
          <SlidersHorizontal className="size-4" />
        </button>
      </div>
      <div className="rounded-xl border bg-card">
        <ActivityTable
          rows={filtered}
          onActivityClick={(activity) => {
            setSelectedActivity(activity);
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Mostrando {filtered.length} de 24 atividades</span>
        <div className="flex items-center gap-1">
          <button className="rounded border p-1.5 hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded bg-primary px-2 py-1.5 text-primary-foreground">
            1
          </span>
          <span className="px-2">2</span>
          <span className="px-2">3</span>
          <button className="rounded border p-1.5 hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <ActivityHistorySheet
        open={!!selectedActivity}
        onOpenChange={(open) => !open && setSelectedActivity(undefined)}
        activity={selectedActivity}
      />
    </>
  );
}
