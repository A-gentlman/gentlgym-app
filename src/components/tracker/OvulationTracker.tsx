import { useMemo } from 'react'
import { useCycle } from '../../context/useCycle'
import { daysBetween, todayISODate } from '../../lib/cycleMath'
import { formatISODateDisplay, formatISODateShort } from '../../lib/formatDate'
import { useAnimatedProgress } from '../../hooks/useAnimatedProgress'

export function OvulationTracker({ compact = false }: { compact?: boolean }) {
  const { predictions } = useCycle()
  const today = todayISODate()

  const { label, sub, pctUntilOv, daysUntil } = useMemo(() => {
    const o = predictions.nextOvulationDate
    if (!o) {
      return {
        label: 'Log periods to estimate ovulation',
        sub: 'Add at least one period start — a second cycle improves accuracy.',
        pctUntilOv: 0,
        daysUntil: null as number | null,
      }
    }
    const d = daysBetween(today, o)
    if (d === 0) {
      return {
        label: 'Estimated ovulation: today',
        sub: 'Fertility estimates vary by person and cycle.',
        pctUntilOv: 1,
        daysUntil: 0,
      }
    }
    if (d > 0) {
      return {
        label: `Next estimated ovulation`,
        sub: formatISODateDisplay(o),
        pctUntilOv: Math.min(1, 14 / (d + 14)),
        daysUntil: d,
      }
    }
    const past = daysBetween(o, today)
    return {
      label: 'Last estimated ovulation passed',
      sub: `${formatISODateShort(o)} · ~${past} day${past === 1 ? '' : 's'} ago`,
      pctUntilOv: 0.4,
      daysUntil: d,
    }
  }, [predictions.nextOvulationDate, today])

  const ringAnim = useAnimatedProgress(compact ? pctUntilOv * 0.85 : pctUntilOv, 1000)

  const rCompact = 36
  const cCompact = 2 * Math.PI * rCompact
  const offsetCompact = cCompact * (1 - ringAnim)

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg className="-rotate-90" width={96} height={96} viewBox="0 0 96 96" aria-hidden>
            <circle
              cx={48}
              cy={48}
              r={rCompact}
              fill="none"
              className="stroke-[var(--glass-border)]"
              strokeWidth={8}
            />
            <circle
              cx={48}
              cy={48}
              r={rCompact}
              fill="none"
              className="stroke-[var(--text)]"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={cCompact}
              strokeDashoffset={offsetCompact}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {daysUntil != null && daysUntil > 0 ? (
              <>
                <span className="text-xl font-bold tabular-nums text-[var(--text)]">{daysUntil}</span>
                <span className="text-[9px] font-medium uppercase text-[var(--dashboard-subtitle)]">
                  days
                </span>
              </>
            ) : (
              <span className="text-[10px] font-semibold text-[var(--text)]">~O</span>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
          <p className="mt-1 text-xs text-[var(--dashboard-subtitle)]">{sub}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 backdrop-blur-[12px]">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"
          aria-hidden
        />
        <div className="relative flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dashboard-subtitle)]">
            Next estimated ovulation
          </p>
          <div className="relative mt-6 h-44 w-44">
            <svg className="-rotate-90" width={176} height={176} viewBox="0 0 176 176" aria-hidden>
              <circle
                cx={88}
                cy={88}
                r={76}
                fill="none"
                className="stroke-[var(--glass-border)]"
                strokeWidth={10}
              />
              <circle
                cx={88}
                cy={88}
                r={76}
                fill="none"
                className="stroke-[var(--text)]"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 76}
                strokeDashoffset={2 * Math.PI * 76 * (1 - ringAnim)}
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {predictions.nextOvulationDate ? (
                <>
                  {daysUntil != null && daysUntil > 0 ? (
                    <>
                      <span className="text-4xl font-bold tabular-nums text-[var(--text)]">{daysUntil}</span>
                      <span className="text-sm text-[var(--dashboard-subtitle)]">days to go</span>
                    </>
                  ) : daysUntil === 0 ? (
                    <span className="text-lg font-semibold text-[var(--text)]">Today</span>
                  ) : (
                    <span className="text-sm font-medium text-[var(--dashboard-subtitle)]">See date below</span>
                  )}
                </>
              ) : (
                <span className="px-4 text-sm text-[var(--dashboard-subtitle)]">—</span>
              )}
            </div>
          </div>
          {predictions.nextOvulationDate ? (
            <p className="mt-6 text-2xl font-bold text-[var(--text)]">
              {formatISODateDisplay(predictions.nextOvulationDate)}
            </p>
          ) : (
            <p className="mt-6 text-lg text-[var(--dashboard-subtitle)]">Waiting for your data</p>
          )}
          <p className="mt-3 max-w-md text-sm text-[var(--dashboard-subtitle)]">
            Modeled as ~14 days before your predicted next period. Your body may differ — use this as a
            planning hint, not a diagnosis.
          </p>
        </div>
      </div>

      {predictions.fertileWindow && predictions.nextOvulationDate ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6">
          <p className="text-sm font-semibold text-[var(--text)]">Approximate fertile window</p>
          <p className="mt-2 text-sm text-[var(--dashboard-subtitle)]">
            {formatISODateDisplay(predictions.fertileWindow.start)} —{' '}
            {formatISODateDisplay(predictions.fertileWindow.end)}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
            {(() => {
              const total = daysBetween(predictions.fertileWindow.start, predictions.fertileWindow.end) + 1
              let pos = 0
              if (today < predictions.fertileWindow.start) pos = 0
              else if (today > predictions.fertileWindow.end) pos = 100
              else {
                pos =
                  ((daysBetween(predictions.fertileWindow.start, today) + 0.5) / total) * 100
              }
              return (
                <div
                  className="h-full rounded-full bg-[var(--text)]/80 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, pos))}%` }}
                />
              )
            })()}
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Bar shows rough position within this window (not clinical-grade timing).
          </p>
        </div>
      ) : null}
    </div>
  )
}
