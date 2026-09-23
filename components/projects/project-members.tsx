"use client";

import * as React from "react";
import { MoreHorizontal, Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AddMemberDialog } from "./add-member-dialog";

import type { ProjectMember, User } from "@/types";

type ProjectMembersProps = {
  projectId: string;
  initialMembers: ProjectMember[];
  users: User[];
};

function roleLabel(role: ProjectMember["role"]) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "VIEWER":
      return "Viewer";
    default:
      return "Member";
  }
}

export function ProjectMembers({
  projectId,
  initialMembers,
  users,
}: ProjectMembersProps) {
  const [members, setMembers] =
    React.useState<ProjectMember[]>(initialMembers);

  const [addMemberOpen, setAddMemberOpen] = React.useState(false);
  const [removingId, setRemovingId] =
    React.useState<string | null>(null);

  const availableUsers = React.useMemo(() => {
    const memberIds = new Set(
      members.map((member) => member.userId),
    );

    return users.filter((user) => !memberIds.has(user.id));
  }, [members, users]);

  const handleMemberAdded = (member: ProjectMember) => {
    setMembers((current) => [...current, member]);
    setAddMemberOpen(false);
  };

  const handleRemove = async (memberId: string) => {
    try {
      setRemovingId(memberId);

      const response = await fetch(
        `/api/projects/${projectId}/members/${memberId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data?.error ?? "Failed to remove member.",
        );
      }

      setMembers((current) =>
        current.filter((member) => member.id !== memberId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <section className="border-t pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="size-5" />

              <h2 className="text-xl font-semibold tracking-tight">
                Members
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              People responsible for this project.
            </p>
          </div>

          <Button
            onClick={() => setAddMemberOpen(true)}
            disabled={availableUsers.length === 0}
          >
            <Plus className="mr-2 size-4" />
            Add Member
          </Button>
        </div>

        <div className="mt-6 rounded-xl border">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="rounded-full border p-3">
                <Users className="size-5 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">No members yet</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add people responsible for this project.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setAddMemberOpen(true)}
                disabled={availableUsers.length === 0}
              >
                <Plus className="mr-2 size-4" />
                Add Member
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary">
                      {roleLabel(member.role)}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        >
                          <span className="sr-only">
                            Open member actions
                          </span>

                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={removingId === member.id}
                          onClick={() => handleRemove(member.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AddMemberDialog
        projectId={projectId}
        users={availableUsers}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onSuccess={handleMemberAdded}
      />
    </>
  );
}