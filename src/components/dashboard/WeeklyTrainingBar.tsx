import { useAnimatedProgress } from '../../hooks/useAnimatedProgress'

type WeeklyTrainingBarProps = {
  trained: number
  goal: number
  className?: string
}

export function WeeklyTrainingBar({ trained, goal, className = '' }: WeeklyTrainingBarProps) {
  const pct = goal > 0 ? Math.min(100, (trained / goal) * 100) : 0
  const animated = useAnimatedProgress(pct / 100, 1100)

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative h-4 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div
          className="dashboard-training-bar-fill absolute left-0 top-0 h-full rounded-full bg-[var(--text)]"
          style={{ width: `${animated * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm tabular-nums">
        <span className="text-[var(--dashboard-subtitle)]">Sessions logged</span>
        <span className="font-semibold text-[var(--text)]">
          {trained} / {goal} days
        </span>
      </div>
    </div>
  )
}
