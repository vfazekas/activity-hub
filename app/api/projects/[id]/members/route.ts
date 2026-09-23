import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: members, error } = await supabase
    .from("project_members")
    .select(
      `
      id,
      project_id,
      user_id,
      role,
      created_at,
      user:users (
        id,
        name,
        email,
        role,
        active
      )
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("GET project members error:", error);

    return NextResponse.json(
      { error: "Unable to load project members." },
      { status: 500 },
    );
  }

  return NextResponse.json(members);
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUserError || currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await request.json();

  const userId = body?.user_id;
  const role = body?.role ?? "MEMBER";

  if (!userId) {
    return NextResponse.json(
      { error: "user_id is required." },
      { status: 400 },
    );
  }

  const { data: member, error } = await supabase
    .from("project_members")
    .insert({
      project_id: projectId,
      user_id: userId,
      role,
    })
    .select(
      `
      id,
      project_id,
      user_id,
      role,
      created_at,
      user:users (
        id,
        name,
        email,
        role,
        active
      )
    `,
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "User is already a member of this project." },
        { status: 409 },
      );
    }

    console.error("POST project member error:", error);

    return NextResponse.json(
      { error: "Unable to add project member." },
      { status: 500 },
    );
  }

  return NextResponse.json(member, { status: 201 });
}
