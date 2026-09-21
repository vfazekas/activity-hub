"use client";
import * as React from "react";
import { ProjectsDialog } from "./projects-dialog";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import type { ProjectTableRow } from "./table/columns";
import { useRouter } from "next/navigation";

type Provider = { id: string; name: string };

type ProjectsProps = {
  initialProjects: ProjectTableRow[];
  providers: Provider[];
};

export function Projects({ initialProjects, providers }: ProjectsProps) {
  const [selectedProject, setSelectedProject] =
    React.useState<ProjectTableRow | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const router = useRouter();

  const handleEdit = (project: ProjectTableRow) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const hadleOpen = (project: ProjectTableRow) => {
    router.push(`/dashboard/projects/${project.id}`);
  };

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
          project={selectedProject ?? undefined}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => {
            setDialogOpen(false);
            setSelectedProject(null);
            router.refresh();
          }}
        />
      </div>
      <DataTable
        columns={columns(handleEdit, hadleOpen)}
        data={initialProjects}
      />
    </div>
  );
}
