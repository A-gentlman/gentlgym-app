type ProgressBarProps = {
  label: string
  current: number
  goal: number
  unit?: string
}

export function ProgressBar({ label, current, goal, unit = '' }: ProgressBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-medium tabular-nums text-[var(--text)]">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div
          className="h-full rounded-full bg-[var(--text)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
