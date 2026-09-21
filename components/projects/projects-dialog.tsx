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

import type { Health, Priority, ProjectStatus } from "@/types";

type Provider = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  health: Health;
  priority: Priority;
  startDate: string | null;
  targetDate: string | null;
};

type ProjectsDialogProps = {
  providers: Provider[];
  project?: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const statusOptions: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const healthOptions: Health[] = ["GREEN", "YELLOW", "RED"];

const priorityOptions: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function ProjectsDialog({
  providers,
  project,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  trigger,
}: ProjectsDialogProps) {
  const isEditing = Boolean(project);

  const [internalOpen, setInternalOpen] = React.useState(false);

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

  const [name, setName] = React.useState(project?.name ?? "");
  const [providerId, setProviderId] = React.useState(project?.providerId ?? "");
  const [description, setDescription] = React.useState(
    project?.description ?? "",
  );
  const [status, setStatus] = React.useState<ProjectStatus>(
    project?.status ?? "PLANNING",
  );
  const [health, setHealth] = React.useState<Health>(
    project?.health ?? "GREEN",
  );
  const [priority, setPriority] = React.useState<Priority>(
    project?.priority ?? "MEDIUM",
  );
  const [startDate, setStartDate] = React.useState(project?.startDate ?? "");
  const [targetDate, setTargetDate] = React.useState(project?.targetDate ?? "");

  React.useEffect(() => {
    if (!open) return;

    setName(project?.name ?? "");
    setProviderId(project?.providerId ?? "");
    setDescription(project?.description ?? "");
    setStatus(project?.status ?? "PLANNING");
    setHealth(project?.health ?? "GREEN");
    setPriority(project?.priority ?? "MEDIUM");
    setStartDate(project?.startDate ?? "");
    setTargetDate(project?.targetDate ?? "");
    setError("");
  }, [open, project]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!providerId) {
      setError("Provider is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: name.trim(),
        provider_id: providerId,
        description: description.trim() || null,
        status,
        health,
        priority,
        start_date: startDate || null,
        target_date: targetDate || null,
      };

      const response = await fetch(
        isEditing ? `/api/projects/${project?.id}` : "/api/projects",
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
        throw new Error(data?.error || "Unable to save project.");
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the project.",
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
              New Project
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "New Project"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the project information."
              : "Create a new project and link it to a provider."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Project Name</label>

              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Repair Order Hub"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Provider</label>

              <Select
                value={providerId}
                onValueChange={setProviderId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>

                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Project description..."
                className="min-h-[90px]"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProjectStatus)}
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
              <label className="text-sm font-medium">Health</label>

              <Select
                value={health}
                onValueChange={(value) => setHealth(value as Health)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {healthOptions.map((option) => (
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>

              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Date</label>

              <Input
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
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

              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
