import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import {
  dayDetailPlaceholder,
  muscleGroups,
  type WeekDayId,
  weekDays,
} from '../data/placeholders'

function isWeekDayId(id: string | undefined): id is WeekDayId {
  return weekDays.some((d) => d.id === id)
}

export function WeeklyTracker() {
  const { dayId } = useParams()
  const navigate = useNavigate()

  if (dayId && !isWeekDayId(dayId)) {
    navigate('/weekly', { replace: true })
    return null
  }

  if (dayId && isWeekDayId(dayId)) {
    return <DayDetail dayId={dayId} />
  }

  return <WeekOverview />
}

function WeekOverview() {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          Weekly tracker
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Monday → Sunday. Select a day for exercises, nutrition, and sleep (placeholder fields).
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((d) => {
          const detail = dayDetailPlaceholder[d.id]
          return (
            <Link key={d.id} to={`/weekly/${d.id}`} className="group block">
              <GlassCard className="flex min-h-[120px] flex-col p-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-[var(--text)]/30">
                <span className="text-xs font-medium text-[var(--text-muted)]">{d.short}</span>
                <span className="mt-1 text-sm font-semibold text-[var(--text)]">{d.label}</span>
                <span className="mt-auto pt-3 text-xs text-[var(--text-muted)]">
                  {detail.completed ? 'Completed' : 'Open'}
                </span>
              </GlassCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function DayDetail({ dayId }: { dayId: WeekDayId }) {
  const initial = dayDetailPlaceholder[dayId]
  const dayLabel = weekDays.find((d) => d.id === dayId)?.label ?? dayId

  const [muscles, setMuscles] = useState<string[]>(() => [...initial.muscles])
  const [completed, setCompleted] = useState(initial.completed)
  const [exerciseRows, setExerciseRows] = useState(() => {
    const rows = initial.exercises.map((name, i) => ({ id: `ex-${i}`, name }))
    return rows.length ? rows : [{ id: 'ex-0', name: '' }]
  })

  const toggleMuscle = (m: string) => {
    setMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    )
  }

  const addExerciseRow = () => {
    setExerciseRows((rows) => [...rows, { id: `ex-${Date.now()}`, name: '' }])
  }

  const summary = useMemo(
    () => ({
      calories: initial.calories,
      protein: initial.protein,
      sleep: initial.sleep,
    }),
    [initial],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/weekly"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          ← Week
        </Link>
        <span className="text-[var(--text-muted)]">/</span>
        <h1 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">{dayLabel}</h1>
      </div>

      <GlassCard className="space-y-6 p-5 sm:p-6">
        <section>
          <h2 className="text-sm font-semibold text-[var(--text)]">Muscles trained</h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Tap to toggle (local preview only).</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {muscleGroups.map((m) => {
              const on = muscles.includes(m)
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMuscle(m)}
                  className={[
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    on
                      ? 'border-[var(--text)] bg-[var(--surface-strong)] text-[var(--text)]'
                      : 'border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
                  ].join(' ')}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-[var(--text)]">Exercises</h2>
            <button
              type="button"
              onClick={addExerciseRow}
              className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface)]"
            >
              + Add row
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {exerciseRows.map((row, idx) => (
              <input
                key={row.id}
                type="text"
                defaultValue={row.name}
                placeholder={`Exercise ${idx + 1}`}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Calories</span>
            <input
              type="number"
              defaultValue={summary.calories}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Protein (g)</span>
            <input
              type="number"
              defaultValue={summary.protein}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Sleep (hours)</span>
            <input
              type="number"
              step="0.25"
              defaultValue={summary.sleep}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
        </section>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          <span className="text-sm font-medium text-[var(--text)]">Mark day as completed</span>
        </label>
      </GlassCard>
    </div>
  )
}
