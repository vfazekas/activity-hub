"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flag,
  MessageSquare,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { TaskTableRow } from "@/types";
import { formatDate, formatDueDate } from "@/lib/utils";

type TaskUpdateType =
  | "CREATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNEE_CHANGED"
  | "DUE_DATE_CHANGED"
  | "COMMENT";

type TaskUpdateUser = {
  id: string;
  name: string | null;
  email: string | null;
};

type TaskUpdate = {
  id: string;
  task_id: string;
  user_id: string;
  type: TaskUpdateType;
  content: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  user: TaskUpdateUser | null;
};

type TaskHistorySheetProps = {
  task: TaskTableRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatStatus(value: string | null) {
  const labels: Record<string, string> = {
    TODO: "A fazer",
    IN_PROGRESS: "Em andamento",
    BLOCKED: "Bloqueada",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };

  return value ? (labels[value] ?? value) : "-";
}

function formatPriority(value: string | null) {
  const labels: Record<string, string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };

  return value ? (labels[value] ?? value) : "-";
}

function getUpdateTitle(update: TaskUpdate) {
  switch (update.type) {
    case "CREATED":
      return "Task criada";

    case "STATUS_CHANGED":
      return "Status alterado";

    case "PRIORITY_CHANGED":
      return "Prioridade alterada";

    case "ASSIGNEE_CHANGED":
      return "Responsável alterado";

    case "DUE_DATE_CHANGED":
      return "Prazo alterado";

    case "COMMENT":
      return "Comentário";

    default:
      return "Atualização";
  }
}

function getUpdateDescription(update: TaskUpdate) {
  const userName = update.user?.name ?? update.user?.email ?? "Usuário";

  switch (update.type) {
    case "CREATED":
      return `${userName} criou esta task.`;

    case "STATUS_CHANGED":
      return `${userName} alterou o status.`;

    case "PRIORITY_CHANGED":
      return `${userName} alterou a prioridade.`;

    case "ASSIGNEE_CHANGED":
      return `${userName} alterou o responsável.`;

    case "DUE_DATE_CHANGED":
      return `${userName} alterou o prazo.`;

    case "COMMENT":
      return `${userName} adicionou um comentário.`;

    default:
      return `${userName} atualizou esta task.`;
  }
}

function getUpdateIcon(type: TaskUpdateType) {
  switch (type) {
    case "CREATED":
      return <CheckCircle2 className="size-4 text-green-500" />;

    case "STATUS_CHANGED":
      return <CircleDot className="size-4 text-blue-500" />;

    case "PRIORITY_CHANGED":
      return <Flag className="size-4 text-orange-500" />;

    case "ASSIGNEE_CHANGED":
      return <UserRound className="size-4 text-purple-500" />;

    case "DUE_DATE_CHANGED":
      return <Calendar className="size-4 text-yellow-500" />;

    case "COMMENT":
      return <MessageSquare className="size-4 text-slate-500" />;

    default:
      return <Clock3 className="size-4 text-muted-foreground" />;
  }
}

function UpdateDetails({ update }: { update: TaskUpdate }) {
  switch (update.type) {
    case "STATUS_CHANGED":
      return (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-md bg-muted px-2 py-1">
            {formatStatus(update.old_value)}
          </span>

          <span className="text-muted-foreground">→</span>

          <span className="rounded-md bg-muted px-2 py-1 font-medium">
            {formatStatus(update.new_value)}
          </span>
        </div>
      );

    case "PRIORITY_CHANGED":
      return (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-md bg-muted px-2 py-1">
            {formatPriority(update.old_value)}
          </span>

          <span className="text-muted-foreground">→</span>

          <span className="rounded-md bg-muted px-2 py-1 font-medium">
            {formatPriority(update.new_value)}
          </span>
        </div>
      );

    case "ASSIGNEE_CHANGED":
      return (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Responsável alterado</span>
        </div>
      );

    case "DUE_DATE_CHANGED":
      return (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-md bg-muted px-2 py-1">
            {formatDueDate(update.old_value)}
          </span>

          <span className="text-muted-foreground">→</span>

          <span className="rounded-md bg-muted px-2 py-1 font-medium">
            {formatDueDate(update.new_value)}
          </span>
        </div>
      );

    case "COMMENT":
      return (
        <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-sm">
          {update.content}
        </div>
      );

    default:
      return null;
  }
}

export function TaskHistorySheet({
  task,
  open,
  onOpenChange,
}: TaskHistorySheetProps) {
  const [updates, setUpdates] = React.useState<TaskUpdate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const loadHistory = React.useCallback(async () => {
    if (!task?.id) {
      setUpdates([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}/updates`);

      if (!response.ok) {
        throw new Error("Unable to load task history.");
      }

      const data = (await response.json()) as TaskUpdate[];

      setUpdates(data);
    } catch (error) {
      console.error("Load task history error:", error);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  }, [task?.id]);

  React.useEffect(() => {
    if (open) {
      void loadHistory();
    }
  }, [open, loadHistory]);

  async function handleAddComment() {
    const content = comment.trim();

    if (!content || !task?.id || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };

        throw new Error(data.error ?? "Unable to create comment.");
      }

      setComment("");

      await loadHistory();
    } catch (error) {
      console.error("Create task comment error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader className="space-y-3">
          <div>
            <SheetTitle className="text-lg leading-tight">
              {task?.title ?? "Task History"}
            </SheetTitle>

            <SheetDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{task?.projectName}</span>

              <span className="text-muted-foreground">•</span>

              <span>{task?.providerName}</span>
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Carregando histórico...
            </div>
          ) : updates.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Nenhuma atualização encontrada.
            </div>
          ) : (
            <div className="relative space-y-6 py-4">
              <div className="absolute bottom-0 left-[15px] top-0 w-px bg-border" />

              {updates.map((update) => (
                <div key={update.id} className="relative flex gap-3">
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                    {getUpdateIcon(update.type)}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium">
                        {getUpdateTitle(update)}
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {formatDate(update.created_at)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {getUpdateDescription(update)}
                    </p>

                    <UpdateDetails update={update} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t pt-4">
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Adicionar um comentário..."
            rows={3}
            disabled={submitting}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!comment.trim() || submitting}
            >
              {submitting ? "Enviando..." : "Adicionar comentário"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
