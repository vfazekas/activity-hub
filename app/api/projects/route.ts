import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || !isAdmin) {
      return NextResponse.json(
        { error: "Sem permissão para criar projetos." },
        { status: 403 },
      );
    }
    const body = await request.json();
    const {
      name,
      provider_id,
      description,
      status,
      health,
      priority,
      start_date,
      target_date,
    } = body;
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "O nome do projeto é obrigatório." },
        { status: 400 },
      );
    }
    if (!provider_id) {
      return NextResponse.json(
        { error: "O provider é obrigatório." },
        { status: 400 },
      );
    }
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: name.trim(),
        provider_id,
        description: description || null,
        status: status || "PLANNING",
        health: health || "GREEN",
        priority: priority || "MEDIUM",
        start_date: start_date || null,
        target_date: target_date || null,
      })
      .select()
      .single();
    if (error) {
      console.error("POST /api/projects:", error);
      return NextResponse.json(
        { error: "Não foi possível criar o projeto." },
        { status: 500 },
      );
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
