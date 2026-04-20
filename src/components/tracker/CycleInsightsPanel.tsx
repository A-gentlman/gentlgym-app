import { useCycle } from '../../context/useCycle'

const toneRing: Record<string, string> = {
  info: 'ring-[var(--border)] bg-[var(--surface)]/60',
  tip: 'ring-emerald-500/20 bg-emerald-500/5',
  attention: 'ring-amber-500/25 bg-amber-500/5',
}

export function CycleInsightsPanel() {
  const { insights } = useCycle()

  return (
    <section aria-label="Insights" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]">AI-style insights</h2>
        <p className="mt-1 text-xs text-[var(--dashboard-subtitle)]">
          On-device estimates from your logs — not medical advice. Consult a clinician for health concerns.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((ins, i) => (
          <article
            key={ins.id}
            className={[
              'rounded-2xl border p-4 ring-1 transition-transform duration-300 hover:-translate-y-0.5',
              toneRing[ins.tone] ?? toneRing.info,
            ].join(' ')}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dashboard-subtitle)]">
              {ins.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">{ins.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
