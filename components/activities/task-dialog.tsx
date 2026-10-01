"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Priority, Status, User } from "@/types";
import type { TaskTableRow } from "@/types/index";

type Project = {
  id: string;
  name: string;
  provider_id: string;
  provider: {
    id: string;
    name: string;
  } | null;
};

type TaskDialogProps = {
  projects: Project[];
  users: User[];
  task?: TaskTableRow;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const statusOptions: Status[] = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
];

const priorityOptions: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function TaskDialog({
  projects,
  users,
  task,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  trigger,
}: TaskDialogProps) {
  const isEditing = Boolean(task);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState(
    task?.projectId ?? "",
  );

  const open = controlledOpen ?? internalOpen;

  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [title, setTitle] = React.useState(task?.title ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [status, setStatus] = React.useState<Status>(task?.status ?? "TODO");
  const [priority, setPriority] = React.useState<Priority>(
    task?.priority ?? "MEDIUM",
  );
  const [assignedTo, setAssignedTo] = React.useState(task?.assignedTo ?? "");
  const [dueDate, setDueDate] = React.useState(task?.dueDate ?? "");

  React.useEffect(() => {
    if (!open) return;

    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "TODO");
    setPriority(task?.priority ?? "MEDIUM");
    setAssignedTo(task?.assignedTo ?? "");
    setDueDate(task?.dueDate ?? "");
    setSelectedProjectId(task?.projectId ?? "");
    setError("");
  }, [open, task]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!selectedProjectId) {
      setError("Project is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        projectId: selectedProjectId,
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        assigned_to: assignedTo || null,
        due_date: dueDate || null,
      };

      console.log(payload);

      const response = await fetch(
        isEditing
          ? `/api/tasks/${task?.id}`
          : `/api/projects/${selectedProjectId}/tasks`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save task.");
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button>
              <Plus className="mr-2 size-4" />
              New Task
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the task information."
              : "Create a new task for this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Task Title</label>

              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Validate API integration"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Task description..."
                className="min-h-[90px]"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>

              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Responsible</label>

              <Select
                value={assignedTo || "unassigned"}
                onValueChange={(value) =>
                  setAssignedTo(value === "unassigned" ? "" : value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a responsible" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="unassigned">Não atribuído</SelectItem>

                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Project</label>

              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>

                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} — {project.provider?.name ?? "No provider"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>

              <Input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}

              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
