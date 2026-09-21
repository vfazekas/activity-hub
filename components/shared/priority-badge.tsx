import type { Priority } from "@/types"

type PriorityBadgeProps = {
  value: Priority
}

export function PriorityBadge({
  value,
}: PriorityBadgeProps) {
  const className =
    value === "CRITICAL" || value === "HIGH"
      ? "bg-red-400/10 text-red-500 dark:text-red-400"
      : value === "MEDIUM"
        ? "bg-amber-400/10 text-amber-500 dark:text-amber-400"
        : "bg-muted text-muted-foreground"

  return (
    <span
      className={`text-xs rounded-md px-2 py-1 font-medium ${className}`}
    >
      {value}
    </span>
  )
}