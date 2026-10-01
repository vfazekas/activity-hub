import { Activities } from "@/components/activities/activities";

import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function ActivitiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [
    { data: tasks, error: tasksError },
    { data: projects, error: projectsError },
    { data: users, error: usersError },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select(
        `
      id,
      project_id,
      title,
      description,
      status,
      priority,
      assigned_to,
      created_by,
      due_date,
      completed_at,
      created_at,
      updated_at,
      assignee:users!tasks_assigned_to_fkey (
        id,
        name,
        email
      ),
      project:projects!tasks_project_id_fkey (
        id,
        name,
        provider:providers!projects_provider_id_fkey (
          id,
          name
        )
      )
    `,
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select(
        `
      id,
      name,
      provider_id,
      provider:providers!projects_provider_id_fkey (
        id,
        name
      )
    `,
      )
      .order("name", { ascending: true }),

    supabase
      .from("users")
      .select("id, name, email, role, active")
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  if (tasksError) {
    console.error("Activities tasks error:", tasksError);
  }

  if (usersError) {
    console.error("Activities tasks error:", usersError);
  }

  if (projectsError) {
    console.error("Activities projects error:", projectsError);
  }

  const initialTasks = (tasks ?? []).map((task) => {
    const assignee = Array.isArray(task.assignee)
      ? task.assignee[0]
      : task.assignee;

    const project = Array.isArray(task.project)
      ? task.project[0]
      : task.project;

    const provider = Array.isArray(project?.provider)
      ? project.provider[0]
      : project?.provider;

    return {
      id: task.id,
      projectId: task.project_id,
      projectName: project?.name ?? null,
      providerName: provider?.name ?? null,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assigned_to,
      assignedToName: assignee?.name ?? null,
      assignedToEmail: assignee?.email ?? null,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };
  });

  const initialProjects = (projects ?? []).map((project) => {
    const provider = Array.isArray(project.provider)
      ? project.provider[0]
      : project.provider;

    return {
      id: project.id,
      name: project.name,
      provider_id: project.provider_id,
      provider: provider
        ? {
            id: provider.id,
            name: provider.name,
          }
        : null,
    };
  });

  return (
    <Activities
      initialTasks={initialTasks}
      projects={initialProjects}
      users={users ?? []}
    />
  );
}
