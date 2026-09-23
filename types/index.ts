export type Status =
  | "TODO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "COMPLETED"
  | "CANCELLED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Health = "GREEN" | "YELLOW" | "RED";

export type UserRole = "ADMIN" | "USER";

export type StatusProject =
  | "PLANNING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type ProjectStatus = StatusProject;

export type ProjectMemberRole = "OWNER" | "MEMBER" | "VIEWER";

export type Activity = {
  title: string;
  project: string;
  provider: string;
  owner: string;
  initials: string;
  priority: Priority;
  status: StatusProject;
  due: string;
};

export type Project = {
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
  members: number;
};

//PROVIDERS

export type Provider = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProviderWithCounts = Provider & {
  projects: number;
  contacts: number;
};

export type ProviderFromDatabase = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  projects?: {
    count: number;
  }[];
  contacts?: {
    count: number;
  }[];
};

//MEMBERS

export type ProjectMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER" | "VIEWER";
};

//USER

export type User = {
  id: string;
  name: string;
  email: string;
};
