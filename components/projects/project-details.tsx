"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectsDialog } from "./projects-dialog";

import { StatusBadge } from "@/components/shared/status-badge";
import { HealthBadge } from "@/components/shared/health-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";

import type { Health, Priority, ProjectStatus } from "@/types";

type ProjectDetailsData = {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  health: Health;
  priority: Priority;
  startDate: string | null;
  targetDate: string | null;
  provider: {
    id: string;
    name: string;
  } | null;
};

type ProjectDetailsProps = {
  project: ProjectDetailsData;
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not defined";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [editOpen, setEditOpen] = React.useState(false);

  const projectForDialog = {
    id: project.id,
    providerId: project.providerId,
    name: project.name,
    description: project.description,
    status: project.status,
    health: project.health,
    priority: project.priority,
    startDate: project.startDate,
    targetDate: project.targetDate,
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button
          asChild
          variant="ghost"
          className="-ml-3 gap-2 text-muted-foreground"
        >
          <Link href="/dashboard/projects">
            <ArrowLeft className="size-4" />
            Projects
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            {project.provider && (
              <p className="text-sm font-medium text-muted-foreground">
                {project.provider.name}
              </p>
            )}

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {project.name}
              </h1>

              {project.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <ProjectsDialog
            project={projectForDialog}
            providers={project.provider ? [project.provider] : []}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSuccess={() => {
              setEditOpen(false);
              window.location.reload();
            }}
            trigger={
              <Button>
                <Pencil className="mr-2 size-4" />
                Edit Project
              </Button>
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectInfoCard label="Status">
            <StatusBadge value={project.status} />
          </ProjectInfoCard>

          <ProjectInfoCard label="Health">
            <HealthBadge value={project.health} />
          </ProjectInfoCard>

          <ProjectInfoCard label="Priority">
            <PriorityBadge value={project.priority} />
          </ProjectInfoCard>

          <ProjectInfoCard
            label="Deadline"
            icon={<CalendarDays className="size-4" />}
          >
            <span className="text-lg font-semibold">
              {formatDate(project.targetDate)}
            </span>
          </ProjectInfoCard>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Tasks
            </h2>

            <p className="text-sm text-muted-foreground">
              Tasks related to this project will appear here.
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks available yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ProjectInfoCardProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

function ProjectInfoCard({
  label,
  icon,
  children,
}: ProjectInfoCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <div className="mt-3 flex items-center">
        {children}
      </div>
    </div>
  );
}