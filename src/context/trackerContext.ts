import { createContext } from 'react'

export type Meal = {
  id: string
  name: string      // e.g. "Breakfast", "Lunch", "Dinner", "Snack"
  foods: string     // free-text description
  calories: number
  protein: number   // grams
  time: string      // HH:MM
}

export type Activity = {
  id: string
  type: 'meal' | 'water' | 'protein' | 'sleep' | 'workout' | 'calories'
  title: string
  description: string
  time: string
  value?: number
  unit?: string
}

export type DayEntry = {
  date: string // YYYY-MM-DD
  calories: number
  protein: number
  sleep: number
  muscles: string[]
  exercisesCompleted: number
  exercisesTotal: number
  type: string // "Push Day", "Rest Day", etc.
  notes: string
  meals: Meal[]
  water: number // in ml
  activities: Activity[]
}

export type TrackerContextValue = {
  days: Record<string, DayEntry>
  updateDay: (dateString: string, payload: Partial<DayEntry>) => void
  addMeal: (dateString: string, meal: Omit<Meal, 'id'>) => void
  removeMeal: (dateString: string, mealId: string) => void
  editMeal: (dateString: string, mealId: string, mealData: Omit<Meal, 'id'>) => void
  addActivity: (dateString: string, activity: Omit<Activity, 'id'>) => void
  removeActivity: (dateString: string, activityId: string) => void
  currentDate: string // The currently active date YYYY-MM-DD
  setCurrentDate: (date: string) => void
  caloriesGoal: number
  setCaloriesGoal: (goal: number) => void
  proteinGoal: number
  setProteinGoal: (goal: number) => void
  waterGoal: number
  setWaterGoal: (goal: number) => void
  userName: string
  setUserName: (name: string) => void
  exportData: () => void
  importData: (jsonString: string) => boolean
  resetData: () => void
}

export const TrackerContext = createContext<TrackerContextValue | null>(null)
