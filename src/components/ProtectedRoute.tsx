import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user, profile, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1014] flex items-center justify-center">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Handle Onboarding Flow
  const isOnboardingRoute = location.pathname === '/onboarding'
  
  if (!profile?.completed_onboarding && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />
  }

  if (profile?.completed_onboarding && isOnboardingRoute) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
