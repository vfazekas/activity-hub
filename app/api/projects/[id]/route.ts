import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };


async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      supabase,
      response: NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 },
      ),
    };
  }
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    return {
      supabase,
      response: NextResponse.json({ error: "Sem permissão." }, { status: 403 }),
    };
  }
  return { supabase, response: null };
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, response } = await checkAdmin();
    if (response) {
      return response;
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
      .update({
        name: name.trim(),
        provider_id,
        description: description || null,
        status,
        health,
        priority,
        start_date: start_date || null,
        target_date: target_date || null,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error(`PATCH /api/projects/${id}:`, error);
      return NextResponse.json(
        { error: "Não foi possível atualizar o projeto." },
        { status: 500 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("PATCH /api/projects:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}


export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, response } = await checkAdmin();
    if (response) {
      return response;
    }
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error(`DELETE /api/projects/${id}:`, error);
      return NextResponse.json(
        {
          error:
            "Não foi possível excluir o projeto. Verifique se existem atividades vinculadas.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
