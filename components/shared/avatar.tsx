type AvatarProps = {
  initials: string
  className?: string
}

export function Avatar({
  initials,
  className = "",
}: AvatarProps) {
  return (
    <span
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ${className}`}
    >
      {initials}
    </span>
  )
}