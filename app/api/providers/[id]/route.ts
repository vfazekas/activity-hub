import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function validateAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      response: NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 },
      ),
    };
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError) {
    console.error("Erro ao verificar permissão:", adminError);

    return {
      supabase,
      response: NextResponse.json(
        { error: "Não foi possível verificar suas permissões." },
        { status: 500 },
      ),
    };
  }

  if (!isAdmin) {
    return {
      supabase,
      response: NextResponse.json(
        {
          error:
            "Você não tem permissão para realizar esta ação. Apenas usuários ADMIN podem gerenciar providers.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabase,
    response: null,
  };
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { supabase, response } = await validateAdmin();

    if (response) {
      return response;
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do provider não informado." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Informe o nome do provider." },
        { status: 400 },
      );
    }

    const { data: provider, error: updateError } = await supabase
      .from("providers")
      .update({
        name,
        description: description || null,
      })
      .eq("id", id)
      .select(
        "id, name, description, logo_url, active, created_at, updated_at",
      )
      .maybeSingle();

    if (updateError) {
      console.error("Erro ao atualizar provider:", updateError);

      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "Já existe um provider com esse nome." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Não foi possível atualizar o provider." },
        { status: 500 },
      );
    }

    if (!provider) {
      return NextResponse.json(
        { error: "Provider não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error("Erro inesperado ao atualizar provider:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { supabase, response } = await validateAdmin();

    if (response) {
      return response;
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do provider não informado." },
        { status: 400 },
      );
    }

    // Confirma que o provider existe
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (providerError) {
      console.error(
        "Erro ao buscar provider antes da exclusão:",
        providerError,
      );

      return NextResponse.json(
        { error: "Não foi possível localizar o provider." },
        { status: 500 },
      );
    }

    if (!provider) {
      return NextResponse.json(
        { error: "Provider não encontrado." },
        { status: 404 },
      );
    }

    // Exclusão
    const { error: deleteError } = await supabase
      .from("providers")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Erro ao excluir provider:", deleteError);

      // Existem registros relacionados ao provider
      if (deleteError.code === "23503") {
        return NextResponse.json(
          {
            error:
              "Não é possível excluir este provider porque existem projetos ou outros registros vinculados a ele.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Não foi possível excluir o provider." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Erro inesperado ao excluir provider:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}