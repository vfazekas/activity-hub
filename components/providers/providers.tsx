"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  ListFilter,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "../shared/page-header";
import { HealthBadge } from "../shared/health-badge";
import { ProviderDialog } from "./providers-dialog";
import { ProviderWithCounts } from "@/types";
import { getInitial, getProviderColor } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProvidersProps = {
  initialProviders: ProviderWithCounts[];
};

export function Providers({ initialProviders }: ProvidersProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderWithCounts | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] =
    useState<ProviderWithCounts | null>(null);

  const [deleting, setDeleting] = useState(false);

  const providers = initialProviders;

  const filteredProviders = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return providers;
    }

    return providers.filter((provider) =>
      provider.name.toLowerCase().includes(term),
    );
  }, [providers, search]);

  function handleNew() {
    setSelectedProvider(null);
    setDialogOpen(true);
  }

  function handleEdit(provider: ProviderWithCounts) {
    setSelectedProvider(provider);
    setDialogOpen(true);
  }

  function handleDelete(provider: ProviderWithCounts) {
    setProviderToDelete(provider);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!providerToDelete) return;

    setDeleting(true);

    const response = await fetch(`/api/providers/${providerToDelete.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);

      toast.error(result?.error || "Não foi possível excluir o provider.");

      setDeleting(false);
      return;
    }

    toast.success("Provider excluído com sucesso.");

    setDeleting(false);
    setDeleteDialogOpen(false);
    setProviderToDelete(null);

    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Providers"
        description="Fornecedores e parceiros envolvidos nos projetos."
        action={
          <button
            onClick={handleNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Novo provider
          </button>
        }
      />

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
          <Search className="size-4 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar provider"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex rounded-lg border bg-card p-1">
          <button
            type="button"
            onClick={() => setGrid(true)}
            className={`rounded p-1.5 transition-colors ${
              grid ? "bg-muted" : "hover:bg-muted/50"
            }`}
            aria-label="Visualização em grade"
          >
            <LayoutDashboard className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => setGrid(false)}
            className={`rounded p-1.5 transition-colors ${
              !grid ? "bg-muted" : "hover:bg-muted/50"
            }`}
            aria-label="Visualização em lista"
          >
            <ListFilter className="size-4" />
          </button>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-card px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Search className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-semibold">
            {search
              ? "Nenhum provider encontrado"
              : "Nenhum provider cadastrado"}
          </h2>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Tente buscar por outro nome."
              : "Cadastre seu primeiro provider para começar a organizar os projetos."}
          </p>

          {!search && (
            <button
              onClick={handleNew}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Novo provider
            </button>
          )}
        </div>
      ) : grid ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="rounded-xl border bg-card p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-3xl bg-slate-200 dark:bg-slate-500 text-lg font-semibold text-black dark:text-white ${getProviderColor(
                    provider.name,
                  )}`}
                >
                  {getInitial(provider.name)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Ações para ${provider.name}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(provider)}>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleDelete(provider)}>
                      <Trash2 className="size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h2 className="mt-5 font-semibold">{provider.name}</h2>

              <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                <span>
                  {provider.projects}{" "}
                  {provider.projects === 1 ? "projeto" : "projetos"}
                </span>

                <span>
                  {provider.contacts}{" "}
                  {provider.contacts === 1 ? "contato" : "contatos"}
                </span>
              </div>

              <div
                className={`mt-5 flex items-center gap-1.5 text-xs font-medium ${
                  provider.active ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" />

                {provider.active ? "Ativo" : "Inativo"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {filteredProviders.map((provider) => (
            <div className="flex items-center gap-4 p-4" key={provider.id}>
              <span
                className={`flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-white ${getProviderColor(
                  provider.name,
                )}`}
              >
                {getInitial(provider.name)}
              </span>

              <span className="flex-1 text-sm font-medium">
                {provider.name}
              </span>

              <span className="text-xs text-muted-foreground">
                {provider.projects}{" "}
                {provider.projects === 1 ? "projeto" : "projetos"}
              </span>

              <span className="text-xs text-muted-foreground">
                {provider.contacts}{" "}
                {provider.contacts === 1 ? "contato" : "contatos"}
              </span>

              <HealthBadge value={provider.active ? "Verde" : "Vermelho"} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Ações para ${provider.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(provider)}>
                    <Pencil className="size-4" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleDelete(provider)}>
                    <Trash2 className="size-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      <ProviderDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedProvider(null);
          }
        }}
        provider={selectedProvider}
        onSuccess={() => {
          setSelectedProvider(null);
        }}
      />

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          if (!deleting) {
            setDeleteDialogOpen(open);

            if (!open) {
              setProviderToDelete(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir provider?</AlertDialogTitle>

            <AlertDialogDescription>
              Você está prestes a excluir o provider{" "}
              <strong>{providerToDelete?.name}</strong>. Essa ação não poderá
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
