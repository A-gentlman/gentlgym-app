import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { NutritionTracker } from './pages/NutritionTracker'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { SleepTracker } from './pages/SleepTracker'
import { MonthlyTracker } from './pages/MonthlyTracker'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { AuthCallback } from './pages/AuthCallback'
import { Onboarding } from './pages/Onboarding'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route path="onboarding" element={<Onboarding />} />
        
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="monthly" element={<MonthlyTracker />} />
          <Route path="monthly/:dayId" element={<MonthlyTracker />} />
          <Route path="nutrition" element={<NutritionTracker />} />
          <Route path="sleep" element={<SleepTracker />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
