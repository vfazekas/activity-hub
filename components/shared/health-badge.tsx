import type { Health } from "@/types"

type HealthBadgeProps = {
  value: Health
}

export function HealthBadge({
  value,
}: HealthBadgeProps) {
  const colors: Record<Health, string> = {
    GREEN: "bg-emerald-400/10 text-emerald-500 dark:text-emerald-400",
    YELLOW: "bg-amber-400/10 text-amber-500 dark:text-amber-400",
    RED: "bg-red-500/10 text-red-600 dark:text-red-400",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${colors[value]}`}
    >
      <span className="size-2 rounded-full bg-current" />

      {value}
    </span>
  )
}