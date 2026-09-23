import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProjectDetails } from "@/components/projects/project-details";

export const instant = false;

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const [
    { data: project, error: projectError },
    { data: users, error: usersError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(
        `
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
          ),
          members:project_members (
            id,
            user_id,
            role,
            user:users (
              id,
              name,
              email
            )
          )
        `,
      )
      .eq("id", id)
      .single(),

    supabase
      .from("users")
      .select("id, name, email")
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  if (projectError || !project || usersError) {
    notFound();
  }

  const provider = Array.isArray(project.provider)
    ? project.provider[0]
    : project.provider;

  const initialMembers = (project.members ?? []).map((member) => {
    const memberUser = Array.isArray(member.user)
      ? member.user[0]
      : member.user;

    return {
      id: member.id,
      userId: member.user_id,
      name: memberUser?.name ?? "Unknown",
      email: memberUser?.email ?? "",
      role: member.role,
    };
  });

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
        members: initialMembers,
      }}
      users={users ?? []}
    />
  );
}