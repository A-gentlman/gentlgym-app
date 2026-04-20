import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ChevronRight, Dumbbell, Target, User, Activity, Flame, GlassWater, Beef } from 'lucide-react'

const GOALS = ['Build muscle', 'Lose fat', 'Maintain weight', 'Improve performance', 'Stay healthy', 'Increase strength']
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active']
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite']
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

export function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    primary_goal: '',
    activity_level: '',
    training_experience: '',
    daily_calorie_goal: '2500',
    daily_protein_goal: '160',
    daily_water_goal: '2500'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelect = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (step === 1 && (!formData.full_name || !formData.age || !formData.gender)) {
      setError('Please fill out all personal details.')
      return
    }
    if (step === 2 && (!formData.primary_goal || !formData.activity_level || !formData.training_experience)) {
      setError('Please complete your fitness profile.')
      return
    }
    setError('')
    setStep(s => Math.min(s + 1, 3))
  }

  const prevStep = () => {
    setError('')
    setStep(s => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
    if (!user) return
    setIsLoading(true)
    setError('')

    try {
      const heightWithUnit = formData.height ? `${formData.height} ${heightUnit}` : ''
      const weightWithUnit = formData.weight ? `${formData.weight} ${weightUnit}` : ''

      const { error: dbError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        full_name: formData.full_name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        height: heightWithUnit,
        weight: weightWithUnit,
        primary_goal: formData.primary_goal,
        activity_level: formData.activity_level,
        training_experience: formData.training_experience,
        daily_calorie_goal: parseInt(formData.daily_calorie_goal, 10),
        daily_protein_goal: parseInt(formData.daily_protein_goal, 10),
        daily_water_goal: parseInt(formData.daily_water_goal, 10),
        completed_onboarding: true,
      })

      if (dbError) throw dbError

      await refreshProfile()
      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to save profile')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1014] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center p-3 mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)] ring-1 ring-white/20">
            <Dumbbell className="h-full w-full text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Welcome to GentlGYM
          </h2>
          <p className="mt-3 text-[15px] font-medium text-gray-400">
            Let's personalize your tracking experience.
          </p>
        </div>

        <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          <div className="bg-[#121214]/80 backdrop-blur-xl py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/5 ring-1 ring-white/10 relative overflow-hidden">
            
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-400/10 p-4 border border-red-500/20">
                <p className="text-sm text-red-400 font-medium text-center">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Personal Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                      <input
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all focus:outline-none appearance-none"
                      >
                        <option value="">Select...</option>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Height</label>
                      <div className="relative">
                        <input
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl pl-4 pr-[72px] py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all focus:outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-[#1A1A1F] border border-white/10 rounded-lg p-0.5 z-10">
                          <button
                            type="button"
                            onClick={() => setHeightUnit('cm')}
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded-md transition-all active:scale-95 ${heightUnit === 'cm' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            cm
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeightUnit('in')}
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded-md transition-all active:scale-95 ${heightUnit === 'in' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            in
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Weight</label>
                      <div className="relative">
                        <input
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl pl-4 pr-[72px] py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all focus:outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex bg-[#1A1A1F] border border-white/10 rounded-lg p-0.5 z-10">
                          <button
                            type="button"
                            onClick={() => setWeightUnit('kg')}
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded-md transition-all active:scale-95 ${weightUnit === 'kg' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            kg
                          </button>
                          <button
                            type="button"
                            onClick={() => setWeightUnit('lbs')}
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded-md transition-all active:scale-95 ${weightUnit === 'lbs' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            lbs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Fitness Profile */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <Target className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Fitness Profile</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Primary Goal</label>
                    <div className="grid grid-cols-2 gap-3">
                      {GOALS.map(goal => (
                        <button
                          key={goal}
                          onClick={() => handleSelect('primary_goal', goal)}
                          className={`p-3 text-sm font-medium rounded-xl border transition-all active:scale-[0.98] ${
                            formData.primary_goal === goal 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 ring-1 ring-emerald-500/20'
                              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Activity Level</label>
                    <select
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none appearance-none"
                    >
                      <option value="">Select your activity level...</option>
                      {ACTIVITY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Training Experience</label>
                    <div className="flex gap-2 p-1 bg-[#0D0D0F] rounded-xl border border-white/5">
                      {EXPERIENCE_LEVELS.map(level => (
                        <button
                          key={level}
                          onClick={() => handleSelect('training_experience', level)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            formData.training_experience === level
                              ? 'bg-[#1A1A1F] text-white shadow-md ring-1 ring-white/10'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Daily Targets */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                      <Activity className="h-5 w-5 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Daily Targets</h3>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <Flame className="h-4 w-4 text-orange-400" />
                      Calories Goal (kcal)
                    </label>
                    <input
                      name="daily_calorie_goal"
                      type="number"
                      value={formData.daily_calorie_goal}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0F] border border-orange-500/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <Beef className="h-4 w-4 text-teal-400" />
                      Protein Goal (g)
                    </label>
                    <input
                      name="daily_protein_goal"
                      type="number"
                      value={formData.daily_protein_goal}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0F] border border-teal-500/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <GlassWater className="h-4 w-4 text-blue-400" />
                      Water Goal (ml)
                    </label>
                    <input
                      name="daily_water_goal"
                      type="number"
                      value={formData.daily_water_goal}
                      onChange={handleChange}
                      className="w-full bg-[#0D0D0F] border border-blue-500/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="pt-6 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    disabled={isLoading}
                    className="px-6 py-3.5 rounded-2xl bg-white/5 text-sm font-bold text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      'Complete Setup'
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
