import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AuthCallback() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // If we've finished loading and we have a user, Auth was successful.
    if (!isLoading) {
      if (user) {
        navigate('/', { replace: true })
      } else {
        // If not successful or error, perhaps send back to login
        navigate('/login', { replace: true })
      }
    }
  }, [user, isLoading, navigate])

  return (
    <div className="min-h-screen bg-[#0F1014] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
        <p className="text-white/60 text-sm">Authenticating...</p>
      </div>
    </div>
  )
}
