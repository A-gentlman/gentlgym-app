import { useContext } from 'react'
import { TrackerContext } from './trackerContext'

export function useTracker() {
  const context = useContext(TrackerContext)
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider')
  }
  return context
}

export function useWeeklyStats() {
  const { days, currentDate } = useTracker()

  // Helper to generate the last 7 days array based on currentDate
  const last7Days: DayEntry[] = []
  
  // Basic date math without external libraries
  const current = new Date(currentDate)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(current)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    // Provide safe defaults if the day hasn't been instantiated
    last7Days.push(days[dateStr] || {
      date: dateStr,
      calories: 0,
      protein: 0,
      sleep: 0,
      muscles: [],
      exercisesCompleted: 0,
      exercisesTotal: 0,
      type: 'Rest Day',
      notes: ''
    })
  }

  // Calculate Averages
  const activeDays = last7Days.filter(d => d.calories > 0 || d.sleep > 0)
  const avgCalories = activeDays.length ? Math.round(activeDays.reduce((sum, d) => sum + d.calories, 0) / activeDays.length) : 0
  const avgProtein = activeDays.length ? Math.round(activeDays.reduce((sum, d) => sum + d.protein, 0) / activeDays.length) : 0
  const avgSleep = activeDays.length ? Number((activeDays.reduce((sum, d) => sum + d.sleep, 0) / activeDays.length).toFixed(1)) : 0
  
  // Training Consistency breakdown
  const trainedDays = last7Days.filter(d => 
    d.type !== 'Rest Day' && d.type !== 'Skipped Day' && (d.muscles.length > 0 || d.exercisesCompleted > 0)
  ).length
  const skippedDays = last7Days.filter(d => d.type === 'Skipped Day').length
  const restDays = last7Days.filter(d => d.type === 'Rest Day').length

  return {
    last7Days,
    avgCalories,
    avgProtein,
    avgSleep,
    trainedDays,
    skippedDays,
    restDays,
    sessions: trainedDays // backwards compatibility for any other components
  }
}

// Since we separated useTracker into its own file, we must also export DayEntry locally 
// or import it properly from Context.
import { type DayEntry } from './trackerContext'
