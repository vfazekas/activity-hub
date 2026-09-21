import { createClient } from "@/lib/supabase/server";

import { Projects } from "@/components/projects/projects";
import type { ProjectTableRow } from "@/components/projects/table/columns";

export const instant = false;

export default async function ProjectsPage() {
  const supabase = await createClient();

  const [
    { data: projects, error: projectsError },
    { data: providers, error: providersError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(`
        id,
        provider_id,
        name,
        description,
        status,
        health,
        priority,
        start_date,
        target_date,
        created_at,
        updated_at,
        provider:providers (
          id,
          name
        ),
        project_members (
          id
        )
      `)
      .order("name", { ascending: true }),

    supabase
      .from("providers")
      .select("id, name")
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);


  if (projectsError) {
    console.error("Erro ao carregar projetos:", projectsError);
  }

  if (providersError) {
    console.error("Erro ao carregar providers:", providersError);
  }

  const projectsWithData: ProjectTableRow[] = (
    projects ?? []
  ).map((project) => ({
    id: project.id,
    providerId: project.provider_id,
    name: project.name,
    description: project.description,
    status: project.status,
    health: project.health,
    priority: project.priority,
    startDate: project.start_date,
    targetDate: project.target_date,
    providerName: (project.provider as unknown as { id: number; name: string } | null)?.name ?? "—",
    members: project.project_members?.length ?? 0,
  }));


  return (
    <Projects
      initialProjects={projectsWithData}
      providers={providers ?? []}
    />
  );
}