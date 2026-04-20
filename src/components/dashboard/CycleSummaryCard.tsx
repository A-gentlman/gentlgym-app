import { Link } from 'react-router-dom'
import { useCycle } from '../../context/useCycle'
import { OvulationTracker } from '../tracker/OvulationTracker'
import { formatISODateShort } from '../../lib/formatDate'
import { IconSoftWrap } from './DashboardIcons'
import { DashboardGlassCard } from './DashboardGlassCard'

function IconCycle() {
  return (
    <IconSoftWrap>
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </IconSoftWrap>
  )
}

export function CycleSummaryCard({ staggerIndex = 2 }: { staggerIndex?: number }) {
  const { predictions } = useCycle()

  return (
    <Link
      to="/tracker"
      className="group dashboard-card-hover block rounded-2xl outline-none"
    >
      <DashboardGlassCard staggerIndex={staggerIndex}>
        <div className="flex items-start gap-4">
          <IconCycle />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dashboard-subtitle)]">
              Cycle & ovulation
            </p>
            <p className="mt-1 text-sm text-[var(--dashboard-subtitle)]">
              Log periods · AI-style insights · ovulation estimate
            </p>
          </div>
        </div>
        <div className="mt-6">
          <OvulationTracker compact />
        </div>
        {predictions.nextPeriodStart ? (
          <p className="mt-4 text-xs text-[var(--dashboard-subtitle)]">
            Next period (est.):{' '}
            <span className="font-medium text-[var(--text)]">
              {formatISODateShort(predictions.nextPeriodStart)}
            </span>
            {predictions.avgCycleLength ? (
              <span className="ml-2 opacity-80">
                · ~{predictions.avgCycleLength} day cycle
              </span>
            ) : null}
          </p>
        ) : (
          <p className="mt-4 text-xs text-[var(--dashboard-subtitle)]">
            Open Tracker to log your first period.
          </p>
        )}
        <p className="mt-4 text-xs font-medium text-[var(--dashboard-subtitle)] opacity-0 transition-opacity group-hover:opacity-100">
          Open Tracker →
        </p>
      </DashboardGlassCard>
    </Link>
  )
}
