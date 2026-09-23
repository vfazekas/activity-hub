import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
    memberId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id: projectId, memberId } = await params;

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

  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", memberId)
    .eq("project_id", projectId);

  if (error) {
    console.error("DELETE project member error:", error);

    return NextResponse.json(
      { error: "Unable to remove project member." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
