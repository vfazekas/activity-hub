"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Provider = {
  id: string;
  name: string;
  description: string | null;
};

type ProviderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  provider?: Provider | null;
};

export function ProviderDialog({
  open,
  onOpenChange,
  onSuccess,
  provider,
}: ProviderDialogProps) {
  const router = useRouter();

  const isEditing = !!provider;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(provider?.name ?? "");
      setDescription(provider?.description ?? "");
      setError("");
    }
  }, [open, provider]);

  function resetForm() {
    setName("");
    setDescription("");
    setError("");
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const providerName = name.trim();
    const providerDescription = description.trim();
    if (!providerName) {
      setError("Informe o nome do provider.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        isEditing && provider
          ? `/api/providers/${provider.id}`
          : "/api/providers",
        {
          method: isEditing && provider ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: providerName,
            description: providerDescription || null,
          }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(
          result?.error ||
            (isEditing
              ? "Não foi possível atualizar o provider."
              : "Não foi possível criar o provider."),
        );
        setLoading(false);
        return;
      }
      resetForm();
      setLoading(false);
      onOpenChange(false);
      toast.success(
        isEditing
          ? "Provider atualizado com sucesso."
          : "Provider criado com sucesso.",
      );
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Não foi possível atualizar o provider."
          : "Não foi possível criar o provider.",
      );
      setLoading(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value && !loading) {
      resetForm();
    }

    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar provider" : "Novo provider"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Atualize as informações do provider."
              : "Cadastre um fornecedor ou parceiro que participa dos projetos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="provider-name">Nome</Label>

            <Input
              id="provider-name"
              placeholder="Ex.: Mobato"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider-description">Descrição</Label>

            <Textarea
              id="provider-description"
              placeholder="Descreva brevemente o provider..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="size-4 animate-spin" />}

              {loading
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Criar provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
