import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const { data: tasks, error } = await supabase
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
        )
      `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET project tasks error:", error);

    return NextResponse.json(
      { error: "Unable to load project tasks." },
      { status: 500 },
    );
  }

  return NextResponse.json(tasks);
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const body = await request.json();

  const title =
    typeof body?.title === "string"
      ? body.title.trim()
      : "";

  const description =
    typeof body?.description === "string"
      ? body.description.trim()
      : null;

  const status = body?.status ?? "TODO";
  const priority = body?.priority ?? "MEDIUM";
  const assignedTo = body?.assigned_to ?? null;
  const dueDate = body?.due_date ?? null;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 },
    );
  }

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      project_id: projectId,
      title,
      description: description || null,
      status,
      priority,
      assigned_to: assignedTo,
      created_by: user.id,
      due_date: dueDate,
    })
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
        )
      `,
    )
    .single();

  if (error) {
    console.error("POST project task error:", error);

    return NextResponse.json(
      { error: "Unable to create task." },
      { status: 500 },
    );
  }

  const { error: updateError } = await supabase
    .from("task_updates")
    .insert({
      task_id: task.id,
      user_id: user.id,
      type: "CREATED",
      content: null,
      old_value: null,
      new_value: null,
    });

  if (updateError) {
    console.error("POST task created update error:", updateError);

    return NextResponse.json(
      { error: "Task created, but unable to create task history." },
      { status: 500 },
    );
  }

  return NextResponse.json(task, { status: 201 });
}