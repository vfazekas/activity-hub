import type { StatusProject } from "@/types"

type StatusBadgeProps = {
  value: StatusProject
}

export function StatusBadge({
  value,
}: StatusBadgeProps) {
  const styles: Record<StatusProject, string> = {
    "PLANNING":
      "bg-muted text-muted-foreground",

    "IN_PROGRESS":
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",

    "ON_HOLD":
      "bg-red-500/10 text-red-600 dark:text-red-400",

    "COMPLETED":
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    "CANCELLED":
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