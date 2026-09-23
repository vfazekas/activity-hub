"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProjectMember, ProjectMemberRole, User } from "@/types";

type AddMemberDialogProps = {
  projectId: string;
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (member: ProjectMember) => void;
};

export function AddMemberDialog({
  projectId,
  users,
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [userId, setUserId] = React.useState("");
  const [role, setRole] =
    React.useState<ProjectMemberRole>("MEMBER");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);

    if (!value) {
      setUserId("");
      setRole("MEMBER");
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/projects/${projectId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ?? "Unable to add project member.",
        );
      }

      const user = users.find((item) => item.id === userId);

      if (!user) {
        throw new Error("User not found.");
      }

      const member: ProjectMember = {
        id: data.id,
        userId: data.user_id,
        name: user.name,
        email: user.email,
        role: data.role,
      };

      onSuccess(member);
      handleOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add project member.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>

          <DialogDescription>
            Add a user to this project and define their role.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              User
            </label>

            <Select
              value={userId}
              onValueChange={setUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>

              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Role
            </label>

            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as ProjectMemberRole)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="OWNER">
                  Owner
                </SelectItem>

                <SelectItem value="MEMBER">
                  Member
                </SelectItem>

                <SelectItem value="VIEWER">
                  Viewer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!userId || loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}