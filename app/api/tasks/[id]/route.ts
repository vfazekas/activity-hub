import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type TaskUpdateInsert = {
  task_id: string;
  user_id: string;
  type:
    | "STATUS_CHANGED"
    | "PRIORITY_CHANGED"
    | "ASSIGNEE_CHANGED"
    | "DUE_DATE_CHANGED";
  old_value: string | null;
  new_value: string | null;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id: taskId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();

  const title = typeof body?.title === "string" ? body.title.trim() : "";

  const description =
    typeof body?.description === "string" ? body.description.trim() : null;

  const status = body?.status ?? "TODO";
  const priority = body?.priority ?? "MEDIUM";
  const assignedTo = body?.assigned_to ?? null;
  const dueDate = body?.due_date ?? null;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  // ---------------------------------------------------------
  // GET CURRENT TASK
  // ---------------------------------------------------------

  const { data: currentTask, error: currentTaskError } = await supabase
    .from("tasks")
    .select(
      `
        id,
        status,
        priority,
        assigned_to,
        due_date
      `,
    )
    .eq("id", taskId)
    .single();

  if (currentTaskError || !currentTask) {
    console.error("GET current task error:", currentTaskError);

    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  // ---------------------------------------------------------
  // DETECT CHANGES
  // ---------------------------------------------------------

  const updates: TaskUpdateInsert[] = [];

  if (currentTask.status !== status) {
    updates.push({
      task_id: taskId,
      user_id: user.id,
      type: "STATUS_CHANGED",
      old_value: currentTask.status,
      new_value: status,
    });
  }

  if (currentTask.priority !== priority) {
    updates.push({
      task_id: taskId,
      user_id: user.id,
      type: "PRIORITY_CHANGED",
      old_value: currentTask.priority,
      new_value: priority,
    });
  }

  if (currentTask.assigned_to !== assignedTo) {
    updates.push({
      task_id: taskId,
      user_id: user.id,
      type: "ASSIGNEE_CHANGED",
      old_value: currentTask.assigned_to,
      new_value: assignedTo,
    });
  }

  if (currentTask.due_date !== dueDate) {
    updates.push({
      task_id: taskId,
      user_id: user.id,
      type: "DUE_DATE_CHANGED",
      old_value: currentTask.due_date,
      new_value: dueDate,
    });
  }

  // ---------------------------------------------------------
  // UPDATE TASK
  // ---------------------------------------------------------

  const updateData = {
    title,
    description: description || null,
    status,
    priority,
    assigned_to: assignedTo,
    due_date: dueDate,
    updated_at: new Date().toISOString(),
    ...(status === "COMPLETED"
      ? { completed_at: new Date().toISOString() }
      : { completed_at: null }),
  };

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", taskId)
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

  if (taskError) {
    console.error("PATCH task error:", taskError);

    return NextResponse.json(
      { error: "Unable to update task." },
      { status: 500 },
    );
  }

  // ---------------------------------------------------------
  // INSERT HISTORY
  // ---------------------------------------------------------

  if (updates.length > 0) {
    const { error: updatesError } = await supabase
      .from("task_updates")
      .insert(updates);

    if (updatesError) {
      console.error("INSERT task updates error:", updatesError);

      return NextResponse.json(
        {
          error: "Task was updated, but the history could not be recorded.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id: taskId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("DELETE task error:", error);

    return NextResponse.json(
      { error: "Unable to delete task." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
