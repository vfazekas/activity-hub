"use client";
import * as React from "react";
import { ProjectsDialog } from "./projects-dialog";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { ProjectTableRow } from "./columns";

type Provider = { id: string; name: string };

type ProjectsProps = {
  initialProjects: ProjectTableRow[];
  providers: Provider[];
};

export function Projects({ initialProjects, providers }: ProjectsProps) {
  const [projects] = React.useState(initialProjects);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os projetos e acompanhe seu andamento.
          </p>
        </div>
        <ProjectsDialog
          providers={providers}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      </div>
      <DataTable columns={columns} data={projects} />
    </div>
  );
}
