import type { Health } from "@/types"

type HealthBadgeProps = {
  value: Health
}

export function HealthBadge({
  value,
}: HealthBadgeProps) {
  const colors: Record<Health, string> = {
    Verde: "text-emerald-500",
    Amarelo: "text-amber-500",
    Vermelho: "text-red-500",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${colors[value]}`}
    >
      <span className="size-2 rounded-full bg-current" />

      {value}
    </span>
  )
}