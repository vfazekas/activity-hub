export type Status =
  | "A fazer"
  | "Em andamento"
  | "Bloqueada"
  | "Concluída"
  | "Cancelada"

export type Priority =
  | "Baixa"
  | "Média"
  | "Alta"
  | "Crítica"

export type Health =
  | "Verde"
  | "Amarelo"
  | "Vermelho"

export type Activity = {
  title: string
  project: string
  provider: string
  owner: string
  initials: string
  priority: Priority
  status: Status
  due: string
}

export type Project = {
  name: string
  provider: string
  health: Health
  due: string
  progress: number
  priority: Priority
  members: number
}







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