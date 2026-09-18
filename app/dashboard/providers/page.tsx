import { createClient } from "@/lib/supabase/server";
import { Providers } from "@/components/providers/providers";
import { ProviderFromDatabase } from "@/types";

export const instant = false;

export default async function ProvidersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("providers")
    .select(
      `
      id,
      name,
      description,
      logo_url,
      active,
      created_at,
      updated_at,
      projects:projects(count),
      contacts:contacts(count)
    `,
    )
    .order("name", { ascending: true });
  if (error) {
    console.error("Erro ao carregar providers:", error);
  }
  const providers = (data ?? []) as ProviderFromDatabase[];
  const providersWithCounts = providers.map(
    ({ projects, contacts, ...provider }) => ({
      ...provider,
      projects: projects?.[0]?.count ?? 0,
      contacts: contacts?.[0]?.count ?? 0,
    }),
  );

  return <Providers initialProviders={providersWithCounts} />;
}
