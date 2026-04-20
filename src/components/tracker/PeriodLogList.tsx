import { useCycle } from '../../context/useCycle'
import { daysBetween } from '../../lib/cycleMath'
import { formatISODateDisplay } from '../../lib/formatDate'

export function PeriodLogList() {
  const { periods, removePeriod } = useCycle()

  if (periods.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-6 py-12 text-center">
        <p className="text-sm text-[var(--dashboard-subtitle)]">No periods logged yet.</p>
      </div>
    )
  }

  const reversed = [...periods].reverse()

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[var(--text)]">History</h2>
      <ul className="space-y-2">
        {reversed.map((p) => {
          const len =
            p.endDate && daysBetween(p.startDate, p.endDate) >= 0
              ? daysBetween(p.startDate, p.endDate) + 1
              : null
          return (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--surface)]/50"
            >
              <div>
                <p className="font-medium text-[var(--text)]">{formatISODateDisplay(p.startDate)}</p>
                <p className="text-xs text-[var(--dashboard-subtitle)]">
                  {p.flow ? `${p.flow} flow` : 'Flow not set'}
                  {len != null ? ` · ${len} day${len === 1 ? '' : 's'}` : ''}
                </p>
                {p.notes ? <p className="mt-1 text-sm text-[var(--text-muted)]">{p.notes}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removePeriod(p.id)}
                className="shrink-0 rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-red-400/50 hover:text-red-400"
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
