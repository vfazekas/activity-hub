"use client"

import { MoreHorizontal, Plus } from "lucide-react";
import { Avatar } from "../shared/avatar";
import { PageHeader } from "../shared/page-header";

export function Users() {
  const users = [
    ["Victor Fazekas", "victor@empresa.com", "Administrador", "Hoje"],
    ["João Silva", "joao@empresa.com", "Usuário", "Hoje"],
    ["Maria Souza", "maria@empresa.com", "Usuário", "Ontem"],
    ["Carlos Santos", "carlos@empresa.com", "Usuário", "12/09/2026"],
  ];

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Gerencie usuários da plataforma"
        action={
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-form", { detail: "activity" }),
              )
            }
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="size-4" /> Novo usuário
          </button>
        }
      />

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Usuário</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Função</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Último acesso</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((u, i) => (
              <tr key={u[0]} className="hover:bg-muted/40">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Avatar
                      initials={u[0]
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    />
                    {u[0]}
                  </span>
                </td>
                <td className="px-3 py-4 text-xs text-muted-foreground">
                  {u[1]}
                </td>

                <td className="px-3 py-4 text-xs">{u[2]}</td>

                <td className="px-3 py-4">
                  <span
                    className={`text-xs font-medium \${i === 3 ? 'text-muted-foreground' : 'text-emerald-600'}`}
                  >
                    {i === 3 ? "Inativo" : "Ativo"}
                  </span>
                </td>

                <td className="px-3 py-4 text-xs text-muted-foreground">
                  {u[3]}
                </td>

                <td className="px-3 py-4">
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
