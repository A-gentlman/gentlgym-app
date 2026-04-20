import { createContext } from 'react'

export type Theme = 'dark' | 'light'

export const ThemeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
} | null>(null)
