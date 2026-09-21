import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProjectDetails } from "@/components/projects/project-details";

export const instant = false;

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: project, error } = await supabase
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
      provider:providers (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const provider = Array.isArray(project.provider)
    ? project.provider[0]
    : project.provider;

  return (
    <ProjectDetails
      project={{
        id: project.id,
        providerId: project.provider_id,
        name: project.name,
        description: project.description,
        status: project.status,
        health: project.health,
        priority: project.priority,
        startDate: project.start_date,
        targetDate: project.target_date,
        provider: provider
          ? {
              id: provider.id,
              name: provider.name,
            }
          : null,
      }}
    />
  );
}