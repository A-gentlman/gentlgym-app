import { useState, useRef } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useTracker } from '../context/useTracker'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import { ConfirmationModal } from '../components/ConfirmationModal'

export function Settings() {
  const { signOut } = useAuth()
  const { 
    userName, setUserName, 
    caloriesGoal, setCaloriesGoal, 
    proteinGoal, setProteinGoal,
    waterGoal, setWaterGoal,
    exportData, importData, resetData 
  } = useTracker()

  // Local state for profile settings starts with global context
  const [draftName, setDraftName] = useState(userName)
  const [draftCal, setDraftCal] = useState(caloriesGoal)
  const [draftProt, setDraftProt] = useState(proteinGoal)
  const [draftWater, setDraftWater] = useState(waterGoal)
  
  const [gender, setGender] = useState('Male')
  const [heightValue, setHeightValue] = useState(180)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm')
  const [weightValue, setWeightValue] = useState(82)
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [goal, setGoal] = useState('Build muscle')

  const [saved, setSaved] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const goals = [
    'Build muscle',
    'Lose fat',
    'Increase strength',
    'Improve endurance',
    'Improve flexibility',
    'Stay consistent / track progress'
  ]

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']

  const handleSave = () => {
    // Commit draft values to global state
    setUserName(draftName)
    setCaloriesGoal(draftCal)
    setProteinGoal(draftProt)
    setWaterGoal(draftWater)
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const isDirty = draftName !== userName || 
                  draftCal !== caloriesGoal || 
                  draftProt !== proteinGoal || 
                  draftWater !== waterGoal

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const success = importData(content)
        if (success) {
          alert('Data imported successfully!')
          // Quick hack to force a re-render of draft values based on new global values
          window.location.reload()
        } else {
          alert('Failed to import data. Please ensure the file is valid.')
        }
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResetModalOpen(true)
  }

  const handleConfirmReset = () => {
    resetData()
    window.location.reload()
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between space-y-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
            Settings
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage your personal profile and preferences.
          </p>
        </div>
        
        {(isDirty || saved) && (
          <button
            type="button"
            onClick={handleSave}
            className={[
              'relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-500 animate-in fade-in zoom-in slide-in-from-right-4',
              saved
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.97]',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              {saved ? '✓ Saved!' : 'Save changes'}
            </span>
          </button>
        )}
      </header>

      <GlassCard className="p-5 sm:p-6 space-y-6">
        <h2 className="text-sm font-semibold text-[var(--text)] tracking-wide uppercase">Personal Profile</h2>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Name */}
          <label className="block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Name</span>
            <input
              type="text"
              value={draftName}
              onChange={(e) => {
                setSaved(false)
                setDraftName(e.target.value)
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all"
            />
          </label>

          {/* Gender */}
          <label className="block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Gender</span>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => {
                  setSaved(false)
                  setGender(e.target.value)
                }}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all appearance-none cursor-pointer"
              >
                {genderOptions.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </label>

          {/* Calorie Goal */}
          <label className="block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Daily Calorie Goal (kcal)</span>
            <input
              type="number"
              value={draftCal || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setDraftCal(Number(e.target.value) || 0)
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all"
            />
          </label>

          {/* Protein Goal */}
          <label className="block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Daily Protein Goal (g)</span>
            <input
              type="number"
              value={draftProt || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setDraftProt(Number(e.target.value) || 0)
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all"
            />
          </label>

          {/* Water Goal */}
          <label className="block space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Daily Water Goal (ml)</span>
            <input
              type="number"
              value={draftWater || ''}
              placeholder="0"
              onChange={(e) => {
                setSaved(false)
                setDraftWater(Number(e.target.value) || 0)
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm tabular-nums text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all"
            />
          </label>

          {/* Height */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Height</span>
            <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-1 focus-within:border-[var(--text)]/40 focus-within:ring-1 focus-within:ring-[var(--text)]/20 transition-all">
              <input
                type="number"
                value={heightValue || ''}
                placeholder="0"
                onChange={(e) => {
                  setSaved(false)
                  setHeightValue(Number(e.target.value) || 0)
                }}
                className="w-full bg-transparent px-3 py-1.5 text-sm tabular-nums text-[var(--text)] focus:outline-none"
              />
              <div className="flex shrink-0 rounded-lg p-0.5 border border-[#262626] bg-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false)
                    setHeightUnit('cm')
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${heightUnit === 'cm' ? 'bg-[#333333] text-white shadow' : 'text-[#888888] hover:text-white'}`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false)
                    setHeightUnit('in')
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${heightUnit === 'in' ? 'bg-[#333333] text-white shadow' : 'text-[#888888] hover:text-white'}`}
                >
                  inch
                </button>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Weight</span>
            <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-1 focus-within:border-[var(--text)]/40 focus-within:ring-1 focus-within:ring-[var(--text)]/20 transition-all">
              <input
                type="number"
                value={weightValue || ''}
                placeholder="0"
                onChange={(e) => {
                  setSaved(false)
                  setWeightValue(Number(e.target.value) || 0)
                }}
                className="w-full bg-transparent px-3 py-1.5 text-sm tabular-nums text-[var(--text)] focus:outline-none"
              />
              <div className="flex shrink-0 rounded-lg p-0.5 border border-[#262626] bg-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false)
                    setWeightUnit('kg')
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${weightUnit === 'kg' ? 'bg-[#333333] text-white shadow' : 'text-[#888888] hover:text-white'}`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false)
                    setWeightUnit('lbs')
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${weightUnit === 'lbs' ? 'bg-[#333333] text-white shadow' : 'text-[#888888] hover:text-white'}`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>

          {/* Goal */}
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Primary Goal</span>
            <div className="relative">
              <select
                value={goal}
                onChange={(e) => {
                  setSaved(false)
                  setGoal(e.target.value)
                }}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-3 text-sm text-[var(--text)] focus:border-[var(--text)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/20 transition-all appearance-none cursor-pointer"
              >
                {goals.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </label>
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[var(--text)] tracking-wide uppercase">Data Management</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Export your data for backup, import to restore, or reset entirely.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={exportData}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] backdrop-blur-sm transition-colors hover:bg-[var(--surface-strong)] active:scale-95"
          >
            Export Data
          </button>
          
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] backdrop-blur-sm transition-colors hover:bg-[var(--surface-strong)] active:scale-95"
          >
            Import Data
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 backdrop-blur-sm transition-colors hover:bg-red-500/20 active:scale-95 ml-auto"
          >
            Reset Data
          </button>
        </div>
      </GlassCard>
      <GlassCard className="p-5 sm:p-6 border-red-500/10">
        <h2 className="text-sm font-semibold text-red-400 tracking-wide uppercase flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Account
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Manage your session and account access.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full sm:w-auto rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-500 backdrop-blur-sm transition-all hover:bg-red-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </GlassCard>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset all data?"
        confirmText="Reset"
        type="danger"
        message={
          <div className="space-y-4">
            <p>
              You're about to permanently delete all your personal data and progress, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>Calories and nutrition logs</li>
              <li>Protein tracking</li>
              <li>Hydration records</li>
              <li>Sleep data</li>
              <li>Training sessions and history</li>
              <li>Weekly and monthly progress insights</li>
            </ul>
            <p className="text-gray-400">
              Before continuing, you may want to export or back up your data if you wish to keep a copy.
            </p>
            <p className="font-semibold text-red-400">
              This action is irreversible and cannot be undone.
            </p>
            <p className="text-white font-medium">
              Are you absolutely sure you want to continue?
            </p>
          </div>
        }
      />
    </div>
  )
}
