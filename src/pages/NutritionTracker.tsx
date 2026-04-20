import { useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { ProgressBar } from '../components/ProgressBar'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { useTracker } from '../context/useTracker'
import { Plus, Trash2, Clock, Flame, Utensils, Edit2, X, Droplets, GlassWater } from 'lucide-react'

export function NutritionTracker() {
  const {
    days,
    currentDate,
    caloriesGoal,
    proteinGoal,
    waterGoal,
    updateDay,
    addMeal,
    removeMeal,
    editMeal,
    addActivity
  } = useTracker()
  
  const todayEntry = days[currentDate] || { calories: 0, protein: 0, water: 0, meals: [] }
  const calories = todayEntry.calories
  const protein = todayEntry.protein
  const water = todayEntry.water || 0
  const meals = todayEntry.meals || []

  const [newMealName, setNewMealName] = useState('Breakfast')
  const [newMealFoods, setNewMealFoods] = useState('')
  const [newMealCalories, setNewMealCalories] = useState('')
  const [newMealProtein, setNewMealProtein] = useState('')
  const [newMealTime, setNewMealTime] = useState(() => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  })
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [waterAmountToConfirm, setWaterAmountToConfirm] = useState<number | null>(null)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMealFoods || !newMealCalories) return

    if (editingMealId) {
      editMeal(currentDate, editingMealId, {
        name: newMealName,
        foods: newMealFoods,
        calories: Number(newMealCalories),
        protein: Number(newMealProtein) || 0,
        time: newMealTime || '12:00'
      })
      setEditingMealId(null)
    } else {
      addMeal(currentDate, {
        name: newMealName,
        foods: newMealFoods,
        calories: Number(newMealCalories),
        protein: Number(newMealProtein) || 0,
        time: newMealTime || '12:00'
      })
    }

    setNewMealFoods('')
    setNewMealCalories('')
    setNewMealProtein('')
  }
  
  const startEditing = (meal: any) => {
    setEditingMealId(meal.id)
    setNewMealName(meal.name)
    setNewMealFoods(meal.foods)
    setNewMealCalories(String(meal.calories))
    setNewMealProtein(String(meal.protein))
    setNewMealTime(meal.time)
    
    // Smooth scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditing = () => {
    setEditingMealId(null)
    setNewMealName('Breakfast')
    setNewMealFoods('')
    setNewMealCalories('')
    setNewMealProtein('')
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          Nutrition
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Real-time intake for {currentDate}. Log your meals below to update your daily totals.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Summary */}
        <GlassCard className="p-5 sm:p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" /> Today's Summary
            </h2>
            <div className="mt-6 space-y-6">
              <ProgressBar
                label="Calories"
                current={calories}
                goal={caloriesGoal}
                unit=" kcal"
              />
              <ProgressBar label="Protein" current={protein} goal={proteinGoal} unit="g" />
              <ProgressBar label="Hydration" current={water} goal={waterGoal} unit=" ml" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[var(--border)]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Remaining Cal</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--text)]">
                {Math.max(0, caloriesGoal - calories)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Remaining Pro</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--text)]">
                {Math.max(0, proteinGoal - protein)}<span className="text-sm text-[var(--text-muted)] font-normal">g</span>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Hydration Card */}
        <GlassCard className="p-5 sm:p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
            <GlassWater className="h-4 w-4 text-blue-400" /> Hydration
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[var(--border)]"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (Math.min(1, water / (waterGoal || 2000))) * 264}
                  strokeLinecap="round"
                  className="text-blue-500 transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-[var(--text)] tabular-nums">{water}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest">ml</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Goal: {waterGoal} ml</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2">
            <button
              onClick={() => setWaterAmountToConfirm(250)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 transition-all hover:bg-[var(--surface-strong)] active:scale-95"
            >
              <span className="text-[13px] font-bold text-[var(--text)]">+250</span>
              <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest">ml</span>
            </button>
            <button
              onClick={() => setWaterAmountToConfirm(500)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 transition-all hover:bg-[var(--surface-strong)] active:scale-95"
            >
              <span className="text-[13px] font-bold text-[var(--text)]">+500</span>
              <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest">ml</span>
            </button>
            <button
              onClick={() => setWaterAmountToConfirm(750)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 transition-all hover:bg-[var(--surface-strong)] active:scale-95"
            >
              <span className="text-[13px] font-bold text-[var(--text)]">+750</span>
              <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest">ml</span>
            </button>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="mt-4 w-full rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors"
          >
            Reset Hydration
          </button>
        </GlassCard>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={waterAmountToConfirm !== null}
          onClose={() => setWaterAmountToConfirm(null)}
          onConfirm={() => {
            if (waterAmountToConfirm !== null) {
              const now = new Date()
              const timeStr = now.toTimeString().slice(0, 5)
              
              updateDay(currentDate, { water: water + waterAmountToConfirm })
              addActivity(currentDate, {
                type: 'water',
                title: 'Hydration',
                description: `Drank ${waterAmountToConfirm}ml of water`,
                time: timeStr,
                value: waterAmountToConfirm,
                unit: 'ml'
              })
            }
          }}
          title="Add Water"
          message={`Are you sure you want to add ${waterAmountToConfirm}ml of water?`}
          confirmText="Yes, Add"
        />

        <ConfirmationModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            const now = new Date()
            const timeStr = now.toTimeString().slice(0, 5)

            updateDay(currentDate, { water: 0 })
            addActivity(currentDate, {
              type: 'water',
              title: 'Hydration Reset',
              description: 'Reset daily water intake',
              time: timeStr
            })
          }}
          title="Reset Hydration"
          message="This will clear all water intake for today. Are you sure?"
          confirmText="Yes, Reset"
          type="warning"
        />

        {/* Log Meal Form and Meal List */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
              <Utensils className="h-4 w-4 text-emerald-400" /> {editingMealId ? 'Edit Meal' : 'Log Meal'}
            </h2>
            
            <form onSubmit={handleAddMeal} className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Meal Type</span>
                <select 
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                  <option>Pre-Workout</option>
                  <option>Post-Workout</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Time</span>
                <input
                  type="time"
                  value={newMealTime}
                  onChange={(e) => setNewMealTime(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
                />
              </label>

              <label className="block space-y-2 sm:col-span-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Foods</span>
                <input
                  type="text"
                  placeholder="e.g., Chicken breast, rice, broccoli"
                  value={newMealFoods}
                  onChange={(e) => setNewMealFoods(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Calories (kcal)</span>
                <input
                  type="number"
                  placeholder="0"
                  value={newMealCalories}
                  onChange={(e) => setNewMealCalories(e.target.value)}
                  required
                  min="0"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Protein (g)</span>
                <input
                  type="number"
                  placeholder="0"
                  value={newMealProtein}
                  onChange={(e) => setNewMealProtein(e.target.value)}
                  min="0"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20"
                />
              </label>

              <div className="sm:col-span-2 pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  {editingMealId ? (
                    <>
                      <Utensils className="h-4 w-4" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Meal
                    </>
                  )}
                </button>
                {editingMealId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                )}
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-5 sm:p-6 min-h-[250px]">
             <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Today's Meals</h2>
             
             {meals.length === 0 ? (
               <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)]/30">
                 <p className="text-sm text-[var(--text-muted)]">No meals logged yet today.</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {[...meals].sort((a, b) => a.time.localeCompare(b.time)).map((meal) => (
                   <div key={meal.id} className="group relative flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]">
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">{meal.name}</span>
                         <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]"><Clock className="h-3 w-3" /> {meal.time}</span>
                       </div>
                       <p className="text-sm text-[var(--text-muted)] pr-8">{meal.foods}</p>
                     </div>
                     <div className="flex flex-col items-end pl-4 border-l border-[var(--border)]">
                       <span className="text-sm font-bold text-[var(--text)] tabular-nums">{meal.calories} <span className="text-[10px] font-normal text-[var(--text-muted)]">kcal</span></span>
                       <span className="text-sm font-bold text-[var(--text)] tabular-nums">{meal.protein} <span className="text-[10px] font-normal text-[var(--text-muted)]">g</span></span>
                     </div>
                     <div className="absolute -right-2 -top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                       <button
                         onClick={() => startEditing(meal)}
                         className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white shadow-sm"
                         title="Edit meal"
                       >
                         <Edit2 className="h-3.5 w-3.5" />
                       </button>
                       <button
                         onClick={() => removeMeal(currentDate, meal.id)}
                         className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white shadow-sm"
                         title="Delete meal"
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
