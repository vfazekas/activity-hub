"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TaskDataTable } from "@/components/activities/table/task-data-table";
import { TaskDialog } from "@/components/activities/task-dialog";
import type { User } from "@/types";
import type { TaskTableRow } from "@/types/index";
import { useRouter } from "next/navigation";
import { TaskHistorySheet } from "@/components/activities/task-history-sheet";

type Project = {
  id: string;
  name: string;
  provider_id: string;
  provider: {
    id: string;
    name: string;
  } | null;
};

type ActivitiesProps = {
  initialTasks: TaskTableRow[];
  projects: Project[];
  users: User[];
};

export function Activities({ initialTasks, projects, users }: ActivitiesProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<TaskTableRow | null>(
    null,
  );
  const [historyOpen, setHistoryOpen] = React.useState(false);

  const router = useRouter();

  function handleNewTask() {
    setSelectedTask(null);
    setDialogOpen(true);
  }

  function handleEditTask(task: TaskTableRow) {
    setSelectedTask(task);
    setDialogOpen(true);
  }

  function handleOpenTask(task: TaskTableRow) {
    setSelectedTask(task);
    setHistoryOpen(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>

          <p className="text-sm text-muted-foreground">
            Manage and track your activities.
          </p>
        </div>

        <Button onClick={handleNewTask}>
          <Plus className="mr-2 size-4" />
          New Task
        </Button>
      </div>

      <TaskDataTable
        data={initialTasks}
        onEdit={handleEditTask}
        onOpen={handleOpenTask}
      />

      {dialogOpen && (
        <TaskDialog
          projects={projects}
          users={users}
          task={selectedTask ?? undefined}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}

      <TaskHistorySheet
        task={selectedTask}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </section>
  );
}
