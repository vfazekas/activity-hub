import type { Priority } from "@/types"

type PriorityBadgeProps = {
  value: Priority
}

export function PriorityBadge({
  value,
}: PriorityBadgeProps) {
  const className =
    value === "Crítica" || value === "Alta"
      ? "text-red-500"
      : value === "Média"
        ? "text-amber-500"
        : "text-muted-foreground"

  return (
    <span
      className={`text-xs font-medium ${className}`}
    >
      {value}
    </span>
  )
}