import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verifica autenticação
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 },
      );
    }

    // Verifica permissão de administrador
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_admin");

    if (adminError) {
      console.error("Erro ao verificar permissão:", adminError);

      return NextResponse.json(
        { error: "Não foi possível verificar suas permissões." },
        { status: 500 },
      );
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Você não tem permissão para realizar esta ação. Apenas usuários ADMIN podem gerenciar providers.",
        },
        { status: 403 },
      );
    }

    // Lê o body
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    // Validação
    if (!name) {
      return NextResponse.json(
        { error: "Informe o nome do provider." },
        { status: 400 },
      );
    }

    // Criação
    const { data: provider, error: insertError } = await supabase
      .from("providers")
      .insert({
        name,
        description: description || null,
      })
      .select(
        "id, name, description, logo_url, active, created_at, updated_at",
      )
      .single();

    if (insertError) {
      console.error("Erro ao criar provider:", insertError);

      // Nome duplicado
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Já existe um provider com esse nome." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Não foi possível criar o provider." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        provider,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro inesperado na API de providers:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}