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
  const { id: taskId } = await params;

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

  const { data: updates, error } = await supabase
    .from("task_updates")
    .select(`
      id,
      task_id,
      user_id,
      type,
      content,
      old_value,
      new_value,
      created_at
    `)
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("GET task updates error:", error);

    return NextResponse.json(
      { error: "Unable to load task history." },
      { status: 500 },
    );
  }

  if (!updates || updates.length === 0) {
    return NextResponse.json([]);
  }

  const userIds = [
    ...new Set(
      updates
        .map((update) => update.user_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  let users: {
    id: string;
    name: string | null;
    email: string | null;
  }[] = [];

  if (userIds.length > 0) {
    const { data: userData, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", userIds);

    if (usersError) {
      console.error("GET task update users error:", usersError);

      return NextResponse.json(
        { error: "Unable to load history users." },
        { status: 500 },
      );
    }

    users = userData ?? [];
  }

  const usersMap = new Map(
    users.map((item) => [item.id, item]),
  );

  const history = updates.map((update) => ({
    ...update,
    user: update.user_id
      ? usersMap.get(update.user_id) ?? null
      : null,
  }));

  return NextResponse.json(history);
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  const { id: taskId } = await params;

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

  const content =
    typeof body?.content === "string"
      ? body.content.trim()
      : "";

  if (!content) {
    return NextResponse.json(
      { error: "Comment is required." },
      { status: 400 },
    );
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id")
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return NextResponse.json(
      { error: "Task not found." },
      { status: 404 },
    );
  }

  const { data: update, error: updateError } = await supabase
    .from("task_updates")
    .insert({
      task_id: taskId,
      user_id: user.id,
      type: "COMMENT",
      content,
      old_value: null,
      new_value: null,
    })
    .select(`
      id,
      task_id,
      user_id,
      type,
      content,
      old_value,
      new_value,
      created_at
    `)
    .single();

  if (updateError) {
    console.error("POST task comment error:", updateError);

    return NextResponse.json(
      { error: "Unable to create comment." },
      { status: 500 },
    );
  }

  return NextResponse.json(update, { status: 201 });
}