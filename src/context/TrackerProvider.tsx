import { useCallback, useMemo, useState, useEffect, type ReactNode } from 'react'
import { TrackerContext, type DayEntry, type Meal, type Activity } from './trackerContext'
import { useAuth } from './AuthContext'

// Generate 7 days of realistic mock data
function generateMockHistory(): Record<string, DayEntry> {
  const result: Record<string, DayEntry> = {}
  const today = new Date()
  
  const mockParams = [
    { type: 'Rest Day', cal: 1850, pro: 130, sleep: 8.2, exCompleted: 0, exTotal: 0, m: [], meals: [
      { id: 'a1', name: 'Breakfast', foods: 'Oats, banana, milk', calories: 450, protein: 18, time: '08:00' },
      { id: 'a2', name: 'Lunch', foods: 'Grilled chicken, rice, salad', calories: 720, protein: 55, time: '13:00' },
      { id: 'a3', name: 'Dinner', foods: 'Salmon, sweet potato, broccoli', calories: 680, protein: 57, time: '19:30' },
    ]},
    { type: 'Trained', cal: 2150, pro: 165, sleep: 7.0, exCompleted: 5, exTotal: 5, m: ['Back', 'Biceps'], meals: [
      { id: 'b1', name: 'Breakfast', foods: 'Eggs scrambled, toast, OJ', calories: 500, protein: 28, time: '07:30' },
      { id: 'b2', name: 'Pre-Workout', foods: 'Banana, peanut butter', calories: 250, protein: 7, time: '11:30' },
      { id: 'b3', name: 'Lunch', foods: 'Turkey wrap, veggies', calories: 680, protein: 48, time: '14:00' },
      { id: 'b4', name: 'Dinner', foods: 'Steak, roasted veggies, quinoa', calories: 720, protein: 82, time: '19:00' },
    ]},
    { type: 'Trained', cal: 2200, pro: 170, sleep: 6.5, exCompleted: 6, exTotal: 6, m: ['Chest', 'Shoulders', 'Triceps'], meals: [
      { id: 'c1', name: 'Breakfast', foods: 'Greek yogurt, granola, berries', calories: 420, protein: 22, time: '08:00' },
      { id: 'c2', name: 'Lunch', foods: 'Chicken breast, pasta, tomato sauce', calories: 780, protein: 58, time: '13:00' },
      { id: 'c3', name: 'Snack', foods: 'Protein shake', calories: 180, protein: 30, time: '16:00' },
      { id: 'c4', name: 'Dinner', foods: 'Tuna steak, mixed veg, brown rice', calories: 820, protein: 60, time: '19:30' },
    ]},
    { type: 'Trained', cal: 2400, pro: 180, sleep: 7.5, exCompleted: 5, exTotal: 5, m: ['Legs', 'Core'], meals: [
      { id: 'd1', name: 'Breakfast', foods: 'Protein pancakes, maple syrup', calories: 600, protein: 35, time: '08:30' },
      { id: 'd2', name: 'Lunch', foods: 'Beef burger, fries, salad', calories: 850, protein: 52, time: '12:30' },
      { id: 'd3', name: 'Post-Workout', foods: 'Protein shake, apple', calories: 230, protein: 30, time: '17:00' },
      { id: 'd4', name: 'Dinner', foods: 'Grilled shrimp, quinoa, asparagus', calories: 720, protein: 63, time: '20:00' },
    ]},
    { type: 'Rest Day', cal: 1950, pro: 140, sleep: 9.0, exCompleted: 0, exTotal: 0, m: [], meals: [
      { id: 'e1', name: 'Breakfast', foods: 'Avocado toast, poached eggs', calories: 520, protein: 22, time: '09:00' },
      { id: 'e2', name: 'Lunch', foods: 'Caesar salad, grilled chicken', calories: 650, protein: 55, time: '13:30' },
      { id: 'e3', name: 'Dinner', foods: 'Lamb chops, roasted potatoes', calories: 780, protein: 63, time: '19:00' },
    ]},
    { type: 'Trained', cal: 2100, pro: 160, sleep: 7.0, exCompleted: 4, exTotal: 5, m: ['Chest', 'Back', 'Arms'], meals: [
      { id: 'f1', name: 'Breakfast', foods: 'Smoothie bowl, seeds, fruit', calories: 480, protein: 20, time: '07:45' },
      { id: 'f2', name: 'Lunch', foods: 'Salmon sushi bowl, edamame', calories: 700, protein: 52, time: '13:00' },
      { id: 'f3', name: 'Snack', foods: 'Cottage cheese, almonds', calories: 280, protein: 24, time: '16:30' },
      { id: 'f4', name: 'Dinner', foods: 'Chicken tikka masala, basmati rice', calories: 640, protein: 64, time: '19:30' },
    ]},
    { type: 'Skipped Day', cal: 1980, pro: 155, sleep: 7.5, exCompleted: 0, exTotal: 0, m: [], meals: [
      { id: 'g1', name: 'Breakfast', foods: 'Cereal, whole milk, orange', calories: 420, protein: 14, time: '08:30' },
      { id: 'g2', name: 'Lunch', foods: 'BLT sandwich, chips', calories: 680, protein: 28, time: '13:00' },
      { id: 'g3', name: 'Snack', foods: 'Protein bar', calories: 220, protein: 20, time: '15:30' },
      { id: 'g4', name: 'Dinner', foods: 'Pasta bolognese, garlic bread', calories: 660, protein: 93, time: '19:00' },
    ]},
  ]

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const p = mockParams[6 - i]
    
    result[dateStr] = {
      date: dateStr,
      calories: p.cal,
      protein: p.pro,
      sleep: p.sleep,
      muscles: p.m,
      exercisesCompleted: p.exCompleted,
      exercisesTotal: p.exTotal,
      type: p.type,
      notes: '',
      meals: p.meals as Meal[],
      water: Math.floor(Math.random() * 2000), // Mock some water data
      activities: (p.meals as Meal[]).map(m => ({
        id: crypto.randomUUID(),
        type: 'meal',
        title: m.name,
        description: `${m.foods} (${m.calories} kcal)`,
        time: m.time,
        value: m.calories,
        unit: 'kcal'
      }))
    }
  }
  return result
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  
  const STORAGE_KEY_DAYS = 'gentlgym_days'
  const STORAGE_KEY_USER = 'gentlgym_user'

  const [days, setDays] = useState<Record<string, DayEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAYS)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migrate old entries missing meals or water field
        Object.keys(parsed).forEach(k => {
          if (!parsed[k].meals) parsed[k].meals = []
          if (parsed[k].water === undefined) parsed[k].water = 0
          if (!parsed[k].activities) parsed[k].activities = []
        })
        return parsed
      }
      return generateMockHistory()
    } catch (e) {
      console.error('Failed to load GentlGYM history:', e)
      return generateMockHistory()
    }
  })

  const [currentDate, setCurrentDate] = useState<string>(() => new Date().toISOString().split('T')[0])

  const [caloriesGoal, setCaloriesGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      if (saved) return JSON.parse(saved).caloriesGoal || 2200
    } catch (e) {}
    return 2200
  })

  const [proteinGoal, setProteinGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      if (saved) return JSON.parse(saved).proteinGoal || 160
    } catch (e) {}
    return 160
  })

  const [waterGoal, setWaterGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      if (saved) return JSON.parse(saved).waterGoal || 2000
    } catch (e) {}
    return 2000
  })

  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      if (saved) return JSON.parse(saved).userName || 'Alex'
    } catch (e) {}
    return 'Alex'
  })

  useEffect(() => {
    if (profile) {
      if (profile.full_name) setUserName(profile.full_name.split(' ')[0])
      if (profile.daily_calorie_goal) setCaloriesGoal(profile.daily_calorie_goal)
      if (profile.daily_protein_goal) setProteinGoal(profile.daily_protein_goal)
      if (profile.daily_water_goal) setWaterGoal(profile.daily_water_goal)
    }
  }, [profile])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days)) } catch (e) {}
  }, [days])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({ userName, caloriesGoal, proteinGoal, waterGoal }))
    } catch (e) {}
  }, [userName, caloriesGoal, proteinGoal, waterGoal])

  const updateDay = useCallback((dateString: string, payload: Partial<DayEntry>) => {
    setDays((prev) => {
      const existing = prev[dateString] || {
        date: dateString, calories: 0, protein: 0, sleep: 0, muscles: [],
        exercisesCompleted: 0, exercisesTotal: 0, type: 'Rest Day', notes: '', meals: [], water: 0, activities: []
      }
      return { ...prev, [dateString]: { ...existing, ...payload } }
    })
  }, [])

  const addMeal = useCallback((dateString: string, meal: Omit<Meal, 'id'>) => {
    setDays((prev) => {
      const existing = prev[dateString] || {
        date: dateString, calories: 0, protein: 0, sleep: 0, muscles: [],
        exercisesCompleted: 0, exercisesTotal: 0, type: 'Rest Day', notes: '', meals: [], water: 0, activities: []
      }
      const newMeal: Meal = { ...meal, id: crypto.randomUUID() }
      const newMeals = [...(existing.meals || []), newMeal]
      const totalCal = newMeals.reduce((s, m) => s + m.calories, 0)
      const totalPro = newMeals.reduce((s, m) => s + m.protein, 0)
      
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        type: 'meal',
        title: newMeal.name,
        description: `${newMeal.foods} (${newMeal.calories} kcal)`,
        time: newMeal.time,
        value: newMeal.calories,
        unit: 'kcal'
      }

      return { 
        ...prev, 
        [dateString]: { 
          ...existing, 
          meals: newMeals, 
          calories: totalCal, 
          protein: totalPro,
          activities: [...(existing.activities || []), newActivity]
        } 
      }
    })
  }, [])

  const removeMeal = useCallback((dateString: string, mealId: string) => {
    setDays((prev) => {
      const existing = prev[dateString]
      if (!existing) return prev
      const newMeals = (existing.meals || []).filter(m => m.id !== mealId)
      const totalCal = newMeals.reduce((s, m) => s + m.calories, 0)
      const totalPro = newMeals.reduce((s, m) => s + m.protein, 0)
      return { ...prev, [dateString]: { ...existing, meals: newMeals, calories: totalCal, protein: totalPro } }
    })
  }, [])

  const editMeal = useCallback((dateString: string, mealId: string, mealData: Omit<Meal, 'id'>) => {
    setDays((prev) => {
      const existing = prev[dateString]
      if (!existing) return prev
      const newMeals = (existing.meals || []).map(m => m.id === mealId ? { ...mealData, id: mealId } : m)
      const totalCal = newMeals.reduce((s, m) => s + m.calories, 0)
      const totalPro = newMeals.reduce((s, m) => s + m.protein, 0)
      
      // Update activity description if it exists
      const newActivities = (existing.activities || []).map(a => 
        (a.type === 'meal' && a.id === mealId) ? {
          ...a,
          title: mealData.name,
          description: `${mealData.foods} (${mealData.calories} kcal)`,
          value: mealData.calories
        } : a
      )

      return { ...prev, [dateString]: { ...existing, meals: newMeals, calories: totalCal, protein: totalPro, activities: newActivities } }
    })
  }, [])

  const addActivity = useCallback((dateString: string, activity: Omit<Activity, 'id'>) => {
    setDays((prev) => {
      const existing = prev[dateString] || {
        date: dateString, calories: 0, protein: 0, sleep: 0, muscles: [],
        exercisesCompleted: 0, exercisesTotal: 0, type: 'Rest Day', notes: '', meals: [], water: 0, activities: []
      }
      const newActivity: Activity = { ...activity, id: crypto.randomUUID() }
      return { ...prev, [dateString]: { ...existing, activities: [...(existing.activities || []), newActivity] } }
    })
  }, [])

  const removeActivity = useCallback((dateString: string, activityId: string) => {
    setDays((prev) => {
      const existing = prev[dateString]
      if (!existing) return prev
      return { ...prev, [dateString]: { ...existing, activities: existing.activities.filter(a => a.id !== activityId) } }
    })
  }, [])

  const exportData = useCallback(() => {
    const data = {
      days,
      user: { userName, caloriesGoal, proteinGoal, waterGoal }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gentlgym_backup.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [days, userName, caloriesGoal, proteinGoal])

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.days) setDays(data.days)
      if (data.user) {
        if (data.user.userName) setUserName(data.user.userName)
        if (data.user.caloriesGoal) setCaloriesGoal(data.user.caloriesGoal)
        if (data.user.proteinGoal) setProteinGoal(data.user.proteinGoal)
        if (data.user.waterGoal) setWaterGoal(data.user.waterGoal)
      }
      return true
    } catch (e) {
      console.error('Failed to import data:', e)
      return false
    }
  }, [])

  const resetData = useCallback(() => {
    setDays({})
    setUserName('Alex')
    setCaloriesGoal(2200)
    setProteinGoal(160)
    setWaterGoal(2000)
  }, [])

  const value = useMemo(() => ({
    days, updateDay, addMeal, removeMeal, editMeal, addActivity, removeActivity,
    currentDate, setCurrentDate,
    caloriesGoal, setCaloriesGoal,
    proteinGoal, setProteinGoal,
    waterGoal, setWaterGoal,
    userName, setUserName,
    exportData, importData, resetData
  }), [days, updateDay, addMeal, removeMeal, editMeal, addActivity, removeActivity, currentDate, caloriesGoal, proteinGoal, waterGoal, userName, exportData, importData, resetData])

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}
