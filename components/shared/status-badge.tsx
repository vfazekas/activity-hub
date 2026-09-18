import type { Status } from "@/types"

type StatusBadgeProps = {
  value: Status
}

export function StatusBadge({
  value,
}: StatusBadgeProps) {
  const styles: Record<Status, string> = {
    "A fazer":
      "bg-muted text-muted-foreground",

    "Em andamento":
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",

    Bloqueada:
      "bg-red-500/10 text-red-600 dark:text-red-400",

    Concluída:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    Cancelada:
      "bg-muted text-muted-foreground line-through",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${styles[value]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />

      {value}
    </span>
  )
}