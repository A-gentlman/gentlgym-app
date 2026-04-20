import { useState } from 'react'
import { useCycle } from '../../context/useCycle'
import type { FlowLevel } from '../../types/cycle'
import { todayISODate } from '../../lib/cycleMath'

const flows: { value: FlowLevel; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
]

export function PeriodLogForm() {
  const { addPeriod } = useCycle()
  const [startDate, setStartDate] = useState(todayISODate())
  const [endDate, setEndDate] = useState('')
  const [flow, setFlow] = useState<FlowLevel | ''>('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = addPeriod({
      startDate,
      endDate: endDate || undefined,
      flow: flow || undefined,
      notes: notes || undefined,
    })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
    setEndDate('')
    setFlow('')
    setNotes('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-[12px] transition-shadow duration-300 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
    >
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]">Log period</h2>
        <p className="mt-1 text-sm text-[var(--dashboard-subtitle)]">
          Record the first day of bleeding for best predictions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-xs font-medium text-[var(--dashboard-subtitle)]">Start date *</span>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-medium text-[var(--dashboard-subtitle)]">Last day of bleeding</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
          />
        </label>
      </div>

      <div>
        <span className="text-xs font-medium text-[var(--dashboard-subtitle)]">Flow (optional)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {flows.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFlow((cur) => (cur === f.value ? '' : f.value))}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                flow === f.value
                  ? 'border-[var(--text)] bg-[var(--surface-strong)] text-[var(--text)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-[var(--dashboard-subtitle)]">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Symptoms, training notes…"
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--text)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
        />
      </label>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {savedFlash ? (
        <p className="text-sm font-medium text-emerald-400/90 transition-opacity duration-300">
          Saved to your device.
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--text)] py-3 text-sm font-semibold text-[var(--bg)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] sm:w-auto sm:px-8"
      >
        Save period
      </button>
    </form>
  )
}
