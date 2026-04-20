import { useCallback, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { useTracker } from '../context/useTracker'
import { muscleGroups } from '../data/placeholders'
import { MuscleBodyMap } from '../components/dashboard/MuscleBodyMap'
import { GlassWater, Droplets, Utensils, Beef, MoonStar, Dumbbell, Zap, ChevronDown, ChevronUp } from 'lucide-react'

export function MonthlyTracker() {
  const { dayId } = useParams()
  
  if (dayId) {
    return <DayDetail key={dayId} dayId={dayId} />
  }

  return <MonthOverview />
}

function MonthOverview() {
  const { days, currentDate } = useTracker()

  // Generate last 30 days
  const last30Days = useMemo(() => {
    const list = []
    const current = new Date(currentDate)
    for (let i = 29; i >= 0; i--) {
      const d = new Date(current)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const shortLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      list.push({ id: dateStr, short: shortLabel })
    }
    return list
  }, [currentDate])

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          Monthly Log
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Past 30 days. Select a day for exercises, nutrition, and sleep.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10">
        {last30Days.map((d) => {
          const detail = days[d.id]
          const hasNotes = detail?.notes?.trim()
          const status = detail?.type || 'Rest Day'
          
          let colorClass = ''
          let label = 'Rest'
          let labelColor = 'text-[var(--text-muted)]'

          if (status === 'Trained') {
            colorClass = 'ring-1 ring-emerald-500/40 bg-emerald-500/5'
            label = 'Trained'
            labelColor = 'text-emerald-400'
          } else if (status === 'Rest Day') {
            colorClass = 'ring-1 ring-blue-500/40 bg-blue-500/5'
            label = 'Rest'
            labelColor = 'text-blue-400'
          } else if (status === 'Skipped Day') {
            colorClass = 'ring-1 ring-orange-500/40 bg-orange-500/5'
            label = 'Skipped'
            labelColor = 'text-orange-400'
          }
          
          return (
            <Link key={d.id} to={`/monthly/${d.id}`} className="group block">
              <GlassCard
                className={[
                  'flex min-h-[90px] flex-col p-3 transition-all duration-200 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-[var(--text)]/30',
                  colorClass,
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--text)]">{d.short}</span>
                  {hasNotes ? (
                    <span className="text-[10px] text-amber-400" title="Has notes">📝</span>
                  ) : null}
                </div>
                <div className="mt-auto pt-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor}`}>
                    {label}
                  </span>
                </div>
              </GlassCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function DayDetail({ dayId }: { dayId: string }) {
  const { days, updateDay, addActivity } = useTracker()
  const dayData = days[dayId]
  const dayLabel = new Date(dayId).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const [year, month, day] = dayId.split('-').map(Number)
  const prevObj = new Date(year, month - 1, day - 1)
  const prevDayId = `${prevObj.getFullYear()}-${String(prevObj.getMonth() + 1).padStart(2, '0')}-${String(prevObj.getDate()).padStart(2, '0')}`
  const nextObj = new Date(year, month - 1, day + 1)
  const nextDayId = `${nextObj.getFullYear()}-${String(nextObj.getMonth() + 1).padStart(2, '0')}-${String(nextObj.getDate()).padStart(2, '0')}`

  // Local state mirrors context — save commits back
  const [muscles, setMuscles] = useState<string[]>(() => [...(dayData?.muscles ?? [])])
  const [type, setType] = useState(dayData?.type ?? 'Rest Day')
  const [notes, setNotes] = useState(dayData?.notes ?? '')
  const [calories, setCalories] = useState(dayData?.calories ?? 0)
  const [protein, setProtein] = useState(dayData?.protein ?? 0)
  const [water, setWater] = useState(dayData?.water ?? 0)
  const [sleep, setSleep] = useState(dayData?.sleep ?? 0)
  const exCompleted = dayData?.exercisesCompleted ?? 0
  const exTotal = dayData?.exercisesTotal ?? 0

  // Save feedback
  const [saved, setSaved] = useState(false)

  const toggleMuscle = (m: string) => {
    setSaved(false)
    setMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    )
  }

  const handleSave = useCallback(() => {
    updateDay(dayId, {
      muscles: type === 'Trained' ? [...muscles] : [], // Clear muscles if not trained
      type,
      notes,
      calories,
      protein,
      water,
      sleep,
      // Reset exercise counts if they were set previously
      exercisesCompleted: type === 'Trained' ? exCompleted : 0,
      exercisesTotal: type === 'Trained' ? exTotal : 0,
    })

    // Log Activity if status changed to Trained or if muscles updated on a Trained day
    if (type === 'Trained') {
      const wasTrained = dayData?.type === 'Trained'
      const musclesChanged = JSON.stringify(muscles) !== JSON.stringify(dayData?.muscles ?? [])
      
      if (!wasTrained || musclesChanged) {
        addActivity(dayId, {
          type: 'workout',
          title: 'Gym Session',
          description: muscles.length > 0 ? `Trained ${muscles.join(', ')}` : 'Workout completed',
          time: new Date().toTimeString().slice(0, 5)
        })
      }
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [dayId, muscles, type, notes, calories, protein, water, sleep, exCompleted, exTotal, updateDay, addActivity, dayData])

  const isDirty = type !== (dayData?.type ?? 'Rest Day') ||
                  JSON.stringify(muscles) !== JSON.stringify(dayData?.muscles ?? []) ||
                  notes !== (dayData?.notes ?? '') ||
                  calories !== (dayData?.calories ?? 0) ||
                  protein !== (dayData?.protein ?? 0) ||
                  water !== (dayData?.water ?? 0) ||
                  sleep !== (dayData?.sleep ?? 0)

  const [showAllHistory, setShowAllHistory] = useState(false)

  const timelineEvents = useMemo(() => {
    const activities = dayData?.activities || []
    
    return activities.map(activity => {
      let icon = <Utensils className="h-4 w-4 text-amber-500" />
      let colorClass = 'bg-amber-500/10 ring-amber-500/20'

      switch (activity.type) {
        case 'water':
          icon = <GlassWater className="h-4 w-4 text-blue-400" />
          colorClass = 'bg-blue-500/10 ring-blue-500/20'
          break
        case 'protein':
          icon = <Beef className="h-4 w-4 text-teal-400" />
          colorClass = 'bg-teal-500/10 ring-teal-500/20'
          break
        case 'sleep':
          icon = <MoonStar className="h-4 w-4 text-indigo-400" />
          colorClass = 'bg-indigo-500/10 ring-indigo-500/20'
          break
        case 'workout':
          icon = <Dumbbell className="h-4 w-4 text-emerald-400" />
          colorClass = 'bg-emerald-500/10 ring-emerald-500/20'
          break
        case 'calories':
          icon = <Zap className="h-4 w-4 text-orange-500" />
          colorClass = 'bg-orange-500/10 ring-orange-500/20'
          break
        case 'meal':
          icon = <Utensils className="h-4 w-4 text-amber-500" />
          colorClass = 'bg-amber-500/10 ring-amber-500/20'
          break
      }

      return {
        id: activity.id,
        time: activity.time,
        title: activity.title,
        description: activity.description,
        icon,
        colorClass
      }
    }).sort((a, b) => b.time.localeCompare(a.time))
  }, [dayData?.activities])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/monthly"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            ← Month
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <h1 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">{dayLabel}</h1>
          
          <div className="ml-2 flex items-center gap-1.5 sm:ml-4">
            <Link 
              to={`/monthly/${prevDayId}`} 
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)] transition-all"
            >
              ← Prev
            </Link>
            <Link 
              to={`/monthly/${nextDayId}`} 
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)] transition-all"
            >
              Next →
            </Link>
          </div>
        </div>

        {/* Save button */}
        {(isDirty || saved) && (
          <button
            type="button"
            onClick={handleSave}
            className={[
              'relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-500 animate-in fade-in zoom-in slide-in-from-right-4',
              saved
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.97]',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              {saved ? '✓ Saved!' : 'Save changes'}
            </span>
          </button>
        )}
      </div>

      <GlassCard className="space-y-6 p-5 sm:p-6">
        
        {/* Day Status */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Day Status</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'Trained', label: 'Trained', active: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/50' },
              { id: 'Rest Day', label: 'Rest Day', active: 'bg-blue-500/20 text-blue-400 ring-blue-500/50' },
              { id: 'Skipped Day', label: 'Skip Day', active: 'bg-orange-500/20 text-orange-400 ring-orange-500/50' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSaved(false)
                  setType(s.id)
                }}
                className={[
                  'rounded-xl px-5 py-3 text-sm font-bold transition-all border ring-1 ring-inset',
                  type === s.id 
                    ? `${s.active} border-transparent shadow-[0_0_20px_rgba(0,0,0,0.2)]` 
                    : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)]'
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Muscles */}
        {type === 'Trained' && (
          <section className="dashboard-fade-up space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text)]">Muscles trained</h2>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Interactive Body Map */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/30 p-4">
                <MuscleBodyMap selectedMuscles={muscles} onToggleMuscle={toggleMuscle} />
              </div>

              {/* Muscle Buttons */}
              <div className="flex flex-wrap gap-2 content-start">
                {muscleGroups.map((m) => {
                  const on = muscles.includes(m)
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMuscle(m)}
                      className={[
                        'rounded-full border px-4 py-2 text-xs font-bold transition-all',
                        on
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)]',
                      ].join(' ')}
                    >
                      {m}
                    </button>
                  )
                })}
                <p className="mt-4 w-full text-[11px] leading-relaxed text-[var(--text-muted)] italic">
                  Tip: You can also click the body parts on the map to toggle muscle groups.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Calories / Protein / Water / Sleep */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Calories</span>
            <input
              type="number"
              value={calories || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setCalories(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Protein (g)</span>
            <input
              type="number"
              value={protein || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setProtein(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">Hydration (ml)</span>
            <input
              type="number"
              value={water || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setWater(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Sleep (hours)</span>
            <input
              type="number"
              step="0.25"
              value={sleep || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setSleep(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
        </section>

        {/* Notes */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text)]">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => {
              setSaved(false)
              setNotes(e.target.value)
            }}
            placeholder="e.g. Felt strong today, increased bench press by 5kg..."
            rows={4}
            className="mt-3 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm leading-relaxed text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
          />
        </section>

        {/* History Logs */}
        <div className="pt-6 border-t border-[var(--border)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-6">
            History Logs
          </h3>
          
          {timelineEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-[var(--bg-elevated)]/30 rounded-2xl border border-dashed border-[var(--border)]">
              <Zap className="h-6 w-6 text-[var(--text-muted)] opacity-50 mb-2" />
              <p className="text-sm font-medium text-[var(--text-muted)]">No activity logs for this day.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative pl-4 space-y-8">
                {/* Vertical line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-px bg-[var(--border)]" />
                
                {(showAllHistory ? timelineEvents : timelineEvents.slice(0, 3)).map((event, idx) => (
                  <div key={event.id} className="relative z-10 flex gap-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] shadow-sm ring-1 ${event.colorClass}`}>
                      {event.icon}
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-bold text-[var(--text-muted)] opacity-80">{event.time}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--text)]">{event.title}</p>
                      {event.description && (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {timelineEvents.length > 3 && (
                <button
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 py-2.5 text-xs font-bold text-[var(--text)] transition-all hover:bg-[var(--surface-strong)] active:scale-95"
                >
                  {showAllHistory ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Show More ({timelineEvents.length - 3})
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

      </GlassCard>

    </div>
  )
}
