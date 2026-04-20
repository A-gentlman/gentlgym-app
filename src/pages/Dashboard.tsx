import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircularMetricRing } from '../components/dashboard/CircularMetricRing'
import { DashboardGlassCard } from '../components/dashboard/DashboardGlassCard'
import { useCountUp } from '../hooks/useCountUp'
import { useTracker } from '../context/useTracker'
import {
  Brain,
  Dumbbell,
  Zap,
  ChevronRight,
  Droplets,
  MoonStar,
  Coffee,
  Utensils,
  Beef,
  GlassWater,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { QuickAddModal } from '../components/QuickAddModal'

// Basic layout for timeline
type TimelineEvent = {
  id: string
  time: string
  title: string
  icon: React.ReactNode
  colorClass: string
  description?: string
}

export function Dashboard() {
  const { days, currentDate, caloriesGoal, proteinGoal, waterGoal, userName } = useTracker()
  const todayEntry = days[currentDate] || {
    date: currentDate, calories: 0, protein: 0, sleep: 0, water: 0, muscles: [],
    exercisesCompleted: 0, exercisesTotal: 0, type: 'Rest Day', notes: ''
  }

  // Live state
  const calories = todayEntry.calories
  const protein = todayEntry.protein
  const sleepHours = todayEntry.sleep
  const water = todayEntry.water || 0
  
  // Animated counters
  const calCount = useCountUp(calories, 1300, 0)
  const protCount = useCountUp(protein, 1300, 0)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  const proteinGap = Math.max(0, proteinGoal - protein)

  const aiMessage = useMemo(() => {
    if (sleepHours > 0 && sleepHours < 6) return `You only slept ${sleepHours} hours last night. Avoid heavy compound lifts today to prevent injury. Focus on lighter accessories or active recovery.`
    if (proteinGap > 0) return `You are ${proteinGap}g below your daily protein target. A small chicken or egg-based meal soon will optimize your muscle synthesis today.`
    if (todayEntry.type === 'Trained') return `Great session today! Focus on hydration and quality protein intake for muscle recovery.`
    if (todayEntry.type === 'Skipped Day') return `Consistency is key, but life happens. Try to get a short walk or some light movement in today if you can!`
    if (sleepHours >= 7.5) return `Excellent recovery last night (${sleepHours}h). Your CNS is primed — you can push harder on your top sets today! 💪`
    return `You're tracking well. Stay consistent and log your upcoming meals.`
  }, [proteinGap, sleepHours, todayEntry.type])

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const activities = todayEntry.activities || []
    
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
    }).sort((a, b) => b.time.localeCompare(a.time)) // Newest first
  }, [todayEntry.activities])


  return (
    <div className="space-y-8 sm:space-y-10 pb-10">
      <header className="dashboard-fade-up flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Hey {userName}, every step counts!
          </h1>
          <p className="mt-1.5 text-[15px] font-medium text-[var(--text-muted)]">
            Track your progress and stay consistent
          </p>
        </div>
        
        {/* Quick Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0D0D0F]/40 px-4 py-2.5 backdrop-blur-md transition-all hover:bg-[#0D0D0F]/60 hover:border-white/10 group active:scale-95 shadow-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
            <Plus className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-left sm:pr-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/80">Quick Add</p>
            <p className="text-[13px] font-bold text-white tabular-nums">Log stats</p>
          </div>
        </button>
      </header>

      {/* AI Intelligence Card */}
      <section aria-label="AI Coach" className="w-full">
        <div className="dashboard-card-hover block rounded-2xl outline-none">
          <DashboardGlassCard staggerIndex={0} accentColor="rgba(99,102,241,0.2)" className="ai-shimmer">
            <div className="flex gap-4">
              <div className="flex z-10 h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-soft-bg)] ring-1 ring-[var(--glass-border)] shadow-inner">
                <Brain className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
              <div className="z-10">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  AI Coach
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--text)]">
                  {aiMessage}
                </p>
              </div>
            </div>
          </DashboardGlassCard>
        </div>
      </section>

      {/* Layout Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Rings & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Calories Card */}
            <Link to="/nutrition" className="group dashboard-card-hover block h-full rounded-2xl outline-none">
              <DashboardGlassCard staggerIndex={1} accentColor="rgba(249,115,22,0.15)">
                <div className="flex flex-col items-center justify-center gap-6 py-2">
                  <div className="w-full flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                      <Zap className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Calories</p>
                  </div>
                  <CircularMetricRing
                    value={calories}
                    max={caloriesGoal}
                    size={150}
                    strokeWidth={10}
                    gradientFrom="#F97316"
                    gradientTo="#FB923C"
                    glowColor="#F97316"
                  >
                    <span className="text-3xl font-bold tabular-nums tracking-tight text-[var(--text)] drop-shadow-md">
                      {calCount.toLocaleString()}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-400/80">
                      / {caloriesGoal} kcal
                    </span>
                  </CircularMetricRing>
                </div>
              </DashboardGlassCard>
            </Link>

            {/* Protein Card */}
            <Link to="/nutrition" className="group dashboard-card-hover block h-full rounded-2xl outline-none">
              <DashboardGlassCard staggerIndex={2} accentColor="rgba(45,212,191,0.15)">
                <div className="flex flex-col items-center justify-center gap-6 py-2">
                  <div className="w-full flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20">
                      <Beef className="h-5 w-5 text-teal-400" />
                    </div>
                    <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Protein</p>
                  </div>
                  <CircularMetricRing
                    value={protein}
                    max={proteinGoal}
                    size={150}
                    strokeWidth={10}
                    gradientFrom="#2DD4BF"
                    gradientTo="#14B8A6"
                    glowColor="#2DD4BF"
                  >
                    <span className="text-3xl font-bold tabular-nums tracking-tight text-[var(--text)] drop-shadow-md">
                      {protCount}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-400/80">
                      / {proteinGoal} g
                    </span>
                  </CircularMetricRing>
                </div>
              </DashboardGlassCard>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Hydration Today */}
            <Link to="/nutrition" className="group dashboard-card-hover block h-full rounded-2xl outline-none">
              <DashboardGlassCard staggerIndex={3} accentColor="rgba(59,130,246,0.15)">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                      <GlassWater className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        Hydration
                      </p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-4xl font-extrabold tabular-nums tracking-tight text-[var(--text)]">
                          {water}
                        </p>
                        <span className="text-lg font-bold text-blue-400/80">ml</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-blue-400/60">
                         Goal: {waterGoal} ml
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto h-2 w-full rounded-full bg-[var(--surface-strong)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                      style={{ width: `${Math.min(100, (water / (waterGoal || 2000)) * 100)}%` }} 
                    />
                  </div>
                </div>
              </DashboardGlassCard>
            </Link>

            {/* Sleep Last Night */}
            <Link to="/sleep" className="group dashboard-card-hover block h-full rounded-2xl outline-none">
              <DashboardGlassCard staggerIndex={4} accentColor="rgba(129,140,248,0.15)">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                      <MoonStar className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        Sleep Last Night
                      </p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-4xl font-extrabold tabular-nums tracking-tight text-[var(--text)]">
                          {sleepHours || '--'}
                        </p>
                        {sleepHours > 0 && <span className="text-lg font-bold text-indigo-400/80">hours</span>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto h-2 w-full rounded-full bg-[var(--surface-strong)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                      style={{ width: `${Math.min(100, (sleepHours / 8) * 100)}%` }} 
                    />
                  </div>
                </div>
              </DashboardGlassCard>
            </Link>
          </div>
        </div>

        {/* Right Column: History Logs */}
        <div className="h-full">
          <DashboardGlassCard staggerIndex={5} className="h-full flex flex-col">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6">
              History Logs
            </h3>
            
            {timelineEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-strong)]/50 ring-1 ring-[var(--border)]">
                  <Zap className="h-6 w-6 text-[var(--text-muted)] opacity-50" />
                </div>
                <p className="text-sm font-medium text-[var(--text-muted)]">No logs for today yet.</p>
              </div>
            ) : (
              <>
                <div className="relative pl-4 space-y-8 flex-1">
                  {/* Vertical line */}
                  <div className="absolute left-[27px] top-4 bottom-4 w-px bg-[var(--border)]" />
                  
                  {(showAllHistory ? timelineEvents : timelineEvents.slice(0, 3)).map((event, idx) => (
                    <div key={event.id} className="relative z-10 flex gap-4 dashboard-fade-up" style={{ animationDelay: `${(idx + 1) * 75}ms` }}>
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
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 text-xs font-bold text-[var(--text)] transition-all hover:bg-[var(--surface-strong)] active:scale-95"
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
              </>
            )}
          </DashboardGlassCard>
        </div>
      </div>
      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
