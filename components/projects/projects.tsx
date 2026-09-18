import { ChevronDown, Plus, Search } from "lucide-react";
import { PageHeader } from "../shared/page-header";
import { projects } from "@/lib/mock-data";
import { StatusBadge } from "../shared/status-badge";
import { HealthBadge } from "../shared/health-badge";
import { PriorityBadge } from "../shared/priority-badge";

export function Projects() {
  return (
    <>
      <PageHeader
        title="Projetos"
        description="Acompanhe o andamento e a saúde dos seus projetos."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground">
            <Plus className="size-4" /> Novo projeto
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Buscar projeto"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {["Provider", "Status", "Health", "Prioridade"].map((f) => (
          <button
            key={f}
            className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground"
          >
            {f}
            <ChevronDown className="size-3.5" />
          </button>
        ))}
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Projeto</th>
              <th className="px-3 py-3">Provider</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Health</th>
              <th className="px-3 py-3">Prioridade</th>
              <th className="px-3 py-3">Responsáveis</th>
              <th className="px-3 py-3">Prazo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p) => (
              <tr className="hover:bg-muted/40" key={p.name}>
                <td className="px-5 py-4 text-sm font-medium">{p.name}</td>
                <td className="px-3 py-4 text-xs text-muted-foreground">
                  {p.provider}
                </td>
                <td className="px-3 py-4">
                  <StatusBadge value="Em andamento" />
                </td>
                <td className="px-3 py-4">
                  <HealthBadge value={p.health} />
                </td>
                <td className="px-3 py-4">
                  <PriorityBadge value={p.priority} />
                </td>
                <td className="px-3 py-4 text-xs text-muted-foreground">
                  {p.members} membros
                </td>
                <td className="px-3 py-4 text-xs text-muted-foreground">
                  {p.due}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
