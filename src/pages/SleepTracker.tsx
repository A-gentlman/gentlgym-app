import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ReferenceDot
} from 'recharts'
import { GlassCard } from '../components/GlassCard'
import { useTracker, useWeeklyStats } from '../context/useTracker'

// Custom Tooltip
const SleepTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">{label}</p>
        <p className="text-sm font-semibold tracking-tight text-[var(--text)]">
          {payload[0].value}h <span className="text-xs font-normal text-[var(--text-muted)]">slept</span>
        </p>
      </div>
    )
  }
  return null
}

// Custom dot that highlights the best sleep night
const BestSleepDot = (props: any) => {
  const { cx, cy, value, index, data } = props
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map((d: any) => d.hours))
  if (value !== max || max === 0) return <circle cx={cx} cy={cy} r={3} fill="#818CF8" />
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#818CF8" />
      <circle cx={cx} cy={cy} r={10} fill="#818CF8" fillOpacity={0.2} className="animate-pulse" />
      <text x={cx} y={cy - 14} textAnchor="middle" fill="#A5B4FC" fontSize="10" fontWeight="bold">
        Best
      </text>
    </g>
  )
}

export function SleepTracker() {
  const { days, currentDate, updateDay, addActivity } = useTracker()
  const { last7Days, avgSleep } = useWeeklyStats()

  const todayEntry = days[currentDate] || { sleep: 0 }
  const sleepHours = todayEntry.sleep
  
  // Local state for explicit saving
  const [localSleep, setLocalSleep] = useState(sleepHours)
  const [saved, setSaved] = useState(false)

  // Sync local state if context changes externally (e.g. from Monthly Log)
  useEffect(() => {
    setLocalSleep(sleepHours)
  }, [sleepHours])

  const handleSave = () => {
    updateDay(currentDate, { sleep: localSleep })
    addActivity(currentDate, {
      type: 'sleep',
      title: 'Sleep Record',
      description: `Logged ${localSleep} hours of sleep`,
      time: new Date().toTimeString().slice(0, 5),
      value: localSleep,
      unit: 'hrs'
    })
    setSaved(true)
    // Hide the "Saved!" button after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const isDirty = localSleep !== sleepHours

  const chartData = last7Days.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: d.sleep,
  }))

  const maxSleep = Math.max(...chartData.map(d => d.hours), 0)
  const bestDayIndex = chartData.findIndex(d => d.hours === maxSleep && maxSleep > 0)

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 space-y-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">Sleep</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Review and log your recovery hours for {currentDate}.
          </p>
        </div>
        
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
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Today's sleep input */}
        <GlassCard className="p-5 sm:p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--text)]">Last night</h2>
          <p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-[var(--text)]">
            {localSleep}
            <span className="text-lg font-medium text-[var(--text-muted)]"> h</span>
          </p>
          <label className="mt-6 block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Hours slept (today's entry)</span>
            <input
              type="number"
              step="0.25"
              value={localSleep || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setLocalSleep(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </label>
        </GlassCard>

        {/* Right: Weekly overview chart */}
        <GlassCard className="p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text)]">Weekly sleep overview</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Hours slept per night over the last 7 days.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Average</p>
              <p className="text-lg font-semibold tabular-nums text-[var(--text)]">{avgSleep.toFixed(1)} h</p>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#818CF8" stopOpacity={0.45} />
                    <stop offset="60%" stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.4} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 11 }}
                  domain={[0, 12]}
                  tickCount={5}
                />
                <RechartsTooltip
                  content={<SleepTooltip />}
                  cursor={{ stroke: '#4338CA', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                {avgSleep > 0 && (
                  <ReferenceLine
                    y={avgSleep}
                    stroke="#818CF8"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                    label={{ value: 'avg', fill: '#818CF8', fontSize: 10, position: 'insideTopRight' }}
                  />
                )}
                {maxSleep > 0 && bestDayIndex >= 0 && (
                  <ReferenceDot
                    x={chartData[bestDayIndex].day}
                    y={maxSleep}
                    r={0}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#818CF8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sleepGrad)"
                  animationDuration={1200}
                  dot={(props: any) => <BestSleepDot {...props} data={chartData} />}
                  activeDot={{ r: 6, fill: '#818CF8', stroke: '#1E1B4B', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
