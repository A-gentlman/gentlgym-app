import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        throw error
      }
      
      if (data?.session) {
        // Auto sign-in happened
        navigate('/')
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign up.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1014] flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Background ambient light */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-xl">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h1>
            <p className="text-white/50 text-sm">
              Start your fitness journey with GentlGYM today
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* subtle inner reflection */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/[0.02]" />

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
              <p className="text-white/60 text-sm">
                We've sent a confirmation link to <strong>{email}</strong>. Please click the link to verify your account.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailSignUp} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium focus-within:text-white text-white/70 transition-colors block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-base sm:text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium focus-within:text-white text-white/70 transition-colors block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-base sm:text-sm"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent rounded-2xl py-3.5 px-4 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 mb-6 flex items-center justify-center space-x-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Or continue with</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <button
                onClick={handleGoogleSignUp}
                type="button"
                className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] rounded-2xl py-3.5 px-4 font-medium text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.549L20.0303 3.124C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.609L5.27028 9.704C6.21528 6.86 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                Google
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-white/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
