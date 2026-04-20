import { useMemo, useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell,
} from 'recharts'
import { useWeeklyStats } from '../context/useTracker'
import { Flame, Beef, Dumbbell, MoonStar } from 'lucide-react'

// Premium Card Component
const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 ${className}`}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      {/* Subtle top glare */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glow-line-mid)] to-transparent" />
      {children}
    </div>
  )
}

// Custom Tooltips
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <p className="text-sm font-semibold tracking-tight text-[var(--text)]">
              {entry.value} {entry.unit}
              <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">{entry.name}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const ProteinTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">{label}</p>
        <p className="text-sm font-semibold tracking-tight text-[var(--text)] mb-1">
          {data.actual}g <span className="text-xs font-normal text-[var(--text-muted)]">Actual</span>
        </p>
        <p className="text-sm font-semibold tracking-tight text-[#4FD1C5]">
          {data.goal}g <span className="text-xs font-normal text-[#4FD1C5]/80">Goal</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;
  if (value === payload.target) return null; // Or logic for peak
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill={stroke} />
      <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.3} className="animate-pulse" />
    </g>
  );
};

const PeakSleepDot = (props: any) => {
  const { cx, cy, value, index, data } = props;
  
  // Checking if this is a peak (higher than neighbors)
  const isPeak = index > 0 && index < data.length - 1 && 
                 value.hours > data[index - 1].hours && 
                 value.hours > data[index + 1].hours;
  
  // Or if it's the absolute max
  const isMax = value.hours === Math.max(...data.map((d: any) => d.hours));
  
  if (isPeak || isMax) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#818CF8" />
        <circle cx={cx} cy={cy} r={12} fill="#818CF8" fillOpacity={0.2} className="animate-pulse" />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#A5B4FC" fontSize="10" fontWeight="bold">
          Zzz
        </text>
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill="#4F46E5" />;
};

export function Progress() {
  const [mounted, setMounted] = useState(false)
  const { last7Days, avgCalories, avgProtein, avgSleep, trainedDays, restDays, skippedDays } = useWeeklyStats()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Transforming last7Days into specific chart data formats
  const weeklyCalories = useMemo(() => last7Days.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: d.calories
  })), [last7Days])

  const proteinData = useMemo(() => {
    return last7Days.map(d => {
      const goal = 160 // static goal for now, or from context
      return {
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        actual: d.protein,
        goal: goal,
        achieved: Math.min(d.protein, goal),
        missed: Math.max(0, goal - d.protein),
        isMet: d.protein >= goal
      }
    })
  }, [last7Days])

  const trainingData = useMemo(() => {
    return last7Days.map(d => {
      const isCompleted = d.type !== 'Rest Day' && (d.type !== 'Skipped Day') && (d.muscles.length > 0 || d.exercisesCompleted > 0)
      
      let statusColor = '#333'
      let gradientId = 'gradDefault'
      
      if (isCompleted) {
        statusColor = '#10B981' // Emerald 500 (Matches Monthly Trained)
        gradientId = 'gradTrained'
      } else if (d.type === 'Rest Day') {
        statusColor = '#3B82F6' // Blue 500 (Matches Monthly Rest)
        gradientId = 'gradRest'
      } else if (d.type === 'Skipped Day') {
        statusColor = '#F97316' // Orange 500 (Matches Monthly Skipped)
        gradientId = 'gradSkipped'
      }

      return {
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: 1,
        fill: statusColor,
        gradientId: `url(#${gradientId})`,
        type: d.type,
        isCompleted
      }
    })
  }, [last7Days])

  const weeklySleep = useMemo(() => last7Days.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: d.sleep
  })), [last7Days])

  if (!mounted) return null // Prevent hydration mismatch / render flashes

  return (
    <div className="min-h-full rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border)] p-2 font-sans sm:p-6 lg:p-8">
      <header className="mb-8 space-y-2">
        <h1 className="bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Weekly Progress
        </h1>
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Your real-time performance metrics, visualized.
        </p>
      </header>

      {/* 2x2 Responsive Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        
        {/* Card A: Calorie Intake */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <Flame className="h-5 w-5 text-orange-500" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Calorie Intake</h2>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--text)]">{avgCalories.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-orange-500/80">Avg kcal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyCalories} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <ReferenceLine y={2200} stroke="#666" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="" 
                  unit="kcal" 
                  stroke="#F97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCalories)" 
                  activeDot={<CustomDot stroke="#F97316" />}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Card B: Protein Intake Trends */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4FD1C5]/10 shadow-[0_0_15px_rgba(79,209,197,0.15)]">
                <Beef className="h-5 w-5 text-[#4FD1C5]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Protein Intake</h2>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--text)]">{avgProtein}g</span>
                  <span className="text-xs font-semibold text-[#4FD1C5]/80">Avg daily</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proteinData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <RechartsTooltip content={<ProteinTooltip />} cursor={{ fill: '#262626', opacity: 0.4 }} />
                <ReferenceLine y={160} stroke="#666" strokeDasharray="3 3" />
                <Bar dataKey="achieved" stackId="a" radius={[0, 0, 4, 4]} animationDuration={1500}>
                  {proteinData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={_entry.isMet ? '#4FD1C5' : '#4FD1C5'} opacity={_entry.isMet ? 1 : 0.7} />
                  ))}
                </Bar>
                <Bar dataKey="missed" stackId="a" radius={[4, 4, 0, 0]} animationDuration={1500}>
                  {proteinData.map((_entry, index) => (
                    <Cell key={`cell-miss-${index}`} fill="#333333" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Card C: Weekly Training Consistency */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Dumbbell className="h-5 w-5 text-emerald-400" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Training Consistency</h2>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-emerald-400">{trainedDays}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-400/70">Trained</span>
                  </div>
                  <div className="h-6 w-px bg-[var(--border)]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-blue-400">{restDays}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-400/70">Rest</span>
                  </div>
                  <div className="h-6 w-px bg-[var(--border)]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-orange-400">{skippedDays}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-orange-400/70">Skipped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={28} barGap={8}>
                <defs>
                  {/* Trained - Rich emerald multi-stop */}
                  <linearGradient id="gradTrained" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                    <stop offset="40%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#064E3B" stopOpacity={0.15} />
                  </linearGradient>
                  {/* Rest - Deep blue multi-stop */}
                  <linearGradient id="gradRest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                    <stop offset="40%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1E3A5F" stopOpacity={0.15} />
                  </linearGradient>
                  {/* Skipped - Warm orange multi-stop */}
                  <linearGradient id="gradSkipped" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB923C" stopOpacity={1} />
                    <stop offset="40%" stopColor="#F97316" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7C2D12" stopOpacity={0.15} />
                  </linearGradient>
                  {/* Default - Subtle gray */}
                  <linearGradient id="gradDefault" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#525252" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#262626" stopOpacity={0.1} />
                  </linearGradient>
                  {/* Inner highlight overlay for sheen effect */}
                  <linearGradient id="barSheen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.12} />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity={0.03} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  {/* Glow filters */}
                  <filter id="glowTrained" x="-30%" y="-10%" width="160%" height="120%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#10B981" floodOpacity="0.25" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glowRest" x="-30%" y="-10%" width="160%" height="120%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#3B82F6" floodOpacity="0.25" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glowSkipped" x="-30%" y="-10%" width="160%" height="120%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#F97316" floodOpacity="0.25" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }} dy={10} />
                <YAxis hide domain={[0, 1]} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ payload, active }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3 shadow-xl backdrop-blur-md">
                          <p className="text-xs font-medium text-[var(--text-muted)]">{data.day}</p>
                          <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                            {data.type}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.fill }} />
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              {data.isCompleted ? 'Target Hit' : (data.type === 'Rest Day' ? 'Recovery' : 'Missed')}
                            </p>
                          </div>
                        </div>
                      )
                    }
                    return null;
                  }} 
                />
                {/* Sheen overlay bar (rendered behind) */}
                <Bar dataKey="value" animationDuration={1500} radius={[8, 8, 4, 4]} isAnimationActive={true}>
                  {trainingData.map((entry, index) => {
                    const filterMap: Record<string, string> = {
                      'url(#gradTrained)': 'url(#glowTrained)',
                      'url(#gradRest)': 'url(#glowRest)',
                      'url(#gradSkipped)': 'url(#glowSkipped)',
                    }
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.gradientId} 
                        filter={filterMap[entry.gradientId] || undefined}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={1}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Card D: Sleep Trends */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <MoonStar className="h-5 w-5 text-indigo-400" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Sleep Trends</h2>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--text)]">{avgSleep}</span>
                  <span className="text-xs font-semibold text-indigo-400/80">Avg hours</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySleep} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4338CA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis dataKey="hours" domain={[4, 10]} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <RechartsTooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} 
                />
                <Area 
                  type="natural" 
                  dataKey="hours" 
                  name="" 
                  unit="h" 
                  stroke="#818CF8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSleep)" 
                  activeDot={{ r: 6, fill: "#818CF8", stroke: "#1E1B4B", strokeWidth: 2 }}
                  dot={(props: any) => <PeakSleepDot {...props} data={weeklySleep} />}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  )
}
