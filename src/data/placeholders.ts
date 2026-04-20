/** Placeholder data only — no real logic. */

export const dashboardSummary = {
  caloriesToday: 1840,
  proteinToday: 128,
  proteinGoal: 160,
  musclesTrainedToday: ['Chest', 'Shoulders'] as const,
  sleepLastNight: 7.5,
  monthlyTrainedDays: 18,
  monthlyTrainGoal: 22,
}

export const nutritionPlaceholder = {
  calories: 1840,
  caloriesGoal: 2200,
  protein: 128,
  proteinGoal: 160,
}

export const sleepPlaceholder = {
  lastNight: 7.5,
  monthlyHours: [
    6.5, 7.0, 8.0, 7.5, 6.0, 9.0, 7.25,
    7.0, 6.5, 8.5, 7.25, 6.0, 7.5, 8.0,
    7.0, 6.75, 7.5, 8.25, 6.5, 7.0, 7.75,
    8.0, 6.5, 7.25, 7.0, 8.5, 6.75, 7.5,
    7.0, 7.25,
  ] as const,
  average: 7.27,
}

export const progressCharts = {
  weeklyCalories: [
    { day: 'Mon', value: 2100, target: 2200 },
    { day: 'Tue', value: 1950, target: 2200 },
    { day: 'Wed', value: 2200, target: 2200 },
    { day: 'Thu', value: 1840, target: 2200 },
    { day: 'Fri', value: 2050, target: 2200 },
    { day: 'Sat', value: 1900, target: 2200 },
    { day: 'Sun', value: 1840, target: 2200 },
  ],
  weeklyProtein: [
    { day: 'Mon', actual: 140, goal: 160 },
    { day: 'Tue', actual: 135, goal: 160 },
    { day: 'Wed', actual: 162, goal: 160 },
    { day: 'Thu', actual: 128, goal: 160 },
    { day: 'Fri', actual: 145, goal: 160 },
    { day: 'Sat', actual: 130, goal: 160 },
    { day: 'Sun', actual: 128, goal: 160 },
  ],
  weeklyTraining: [
    { day: 'Mon', sessions: 1, type: 'Chest / Shoulders' },
    { day: 'Tue', sessions: 1, type: 'Back / Arms' },
    { day: 'Wed', sessions: 0, type: 'Rest' },
    { day: 'Thu', sessions: 1, type: 'Legs' },
    { day: 'Fri', sessions: 0, type: 'Rest' },
    { day: 'Sat', sessions: 1, type: 'Shoulders / Arms' },
    { day: 'Sun', sessions: 0, type: 'Rest' },
  ],
  weeklySleep: [
    { day: 'Mon', hours: 7.0, quality: 72 },
    { day: 'Tue', hours: 7.5, quality: 80 },
    { day: 'Wed', hours: 6.5, quality: 60 },
    { day: 'Thu', hours: 8.0, quality: 90 },
    { day: 'Fri', hours: 7.0, quality: 74 },
    { day: 'Sat', hours: 7.5, quality: 82 },
    { day: 'Sun', hours: 7.5, quality: 85 },
  ],
}

export const profilePlaceholder = {
  name: 'Alex Morgan',
  weightKg: 78,
  goal: 'Build muscle & track consistency',
}

export const monthDays = Array.from({ length: 30 }, (_, i) => ({
  id: `day-${i + 1}`,
  label: `Day ${i + 1}`,
  short: `${i + 1}`,
}))

export type MonthDayId = (typeof monthDays)[number]['id']

export const muscleGroups = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Arms',
  'Abs',
] as const

const exerciseRotation: [string[], string[]][] = [
  [['Bench press', 'Incline DB press'], ['Chest', 'Shoulders']],
  [['Pull-ups', 'Barbell row'], ['Back', 'Arms']],
  [[], []],
  [['Squat', 'RDL'], ['Legs']],
  [[], []],
  [['OHP', 'Lateral raises'], ['Shoulders', 'Arms']],
  [[], []],
]

export type DayDetail = {
  exercises: string[]
  calories: number
  protein: number
  sleep: number
  muscles: string[]
  completed: boolean
}

export const dayDetailPlaceholder: Record<string, DayDetail> = Object.fromEntries(
  monthDays.map((d, i) => {
    const rot = exerciseRotation[i % exerciseRotation.length]
    const hasWorkout = rot[0].length > 0
    return [
      d.id,
      {
        exercises: [...rot[0]],
        calories: 1700 + Math.round(Math.sin(i) * 200 + 200),
        protein: 110 + Math.round(Math.cos(i) * 25 + 20),
        sleep: sleepPlaceholder.monthlyHours[i] ?? 7,
        muscles: [...rot[1]],
        completed: hasWorkout,
      },
    ]
  }),
)
