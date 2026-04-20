import { useEffect, useState } from 'react'
import { GlassWater, Beef, Zap, X, Plus } from 'lucide-react'
import { useTracker } from '../context/useTracker'
import { ConfirmationModal } from './ConfirmationModal'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { updateDay, currentDate, days, addActivity } = useTracker()
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const [waterAmountToConfirm, setWaterAmountToConfirm] = useState<number | null>(null)
  const [proteinAmountToConfirm, setProteinAmountToConfirm] = useState<number | null>(null)
  const [caloriesAmountToConfirm, setCaloriesAmountToConfirm] = useState<number | null>(null)

  // Handle animation cycle
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const timer = setTimeout(() => setActive(true), 10)
      return () => clearTimeout(timer)
    } else {
      setActive(false)
      const timer = setTimeout(() => setMounted(false), 3000) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  const today = days[currentDate] || { water: 0, protein: 0, calories: 0 }

  const handleAddWater = (ml: number) => {
    const now = new Date()
    const timeStr = now.toTimeString().slice(0, 5)
    
    updateDay(currentDate, { water: (today.water || 0) + ml })
    addActivity(currentDate, {
      type: 'water',
      title: 'Hydration',
      description: `Quick added ${ml}ml of water`,
      time: timeStr,
      value: ml,
      unit: 'ml'
    })
  }

  const handleAddProtein = (g: number) => {
    const now = new Date()
    const timeStr = now.toTimeString().slice(0, 5)

    updateDay(currentDate, { protein: (today.protein || 0) + g })
    addActivity(currentDate, {
      type: 'protein',
      title: 'Protein Add',
      description: `Quick added ${g}g of protein`,
      time: timeStr,
      value: g,
      unit: 'g'
    })
  }

  const handleAddCals = (kcal: number) => {
    const now = new Date()
    const timeStr = now.toTimeString().slice(0, 5)

    updateDay(currentDate, { calories: (today.calories || 0) + kcal })
    addActivity(currentDate, {
      type: 'calories',
      title: 'Calories Add',
      description: `Quick added ${kcal} kcal`,
      time: timeStr,
      value: kcal,
      unit: 'kcal'
    })
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-[#0D0D0F]/90 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-out ${
          active ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{
          boxShadow: '0 0 40px -10px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)'
        }}
      >
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-[80px]" />

        <div className="relative z-10">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Quick Add</h2>
              <p className="text-xs font-medium text-gray-400">Rapid log for {currentDate}</p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="mt-8 space-y-6">
            {/* Water Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <GlassWater className="h-4 w-4" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-400/80">Hydration</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 750].map((ml) => (
                  <button
                    key={ml}
                    onClick={() => setWaterAmountToConfirm(ml)}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] py-3 transition-all hover:bg-blue-500/10 hover:border-blue-500/20 active:scale-95"
                  >
                    <Plus className="mb-1 h-3 w-3 text-gray-500 group-hover:text-blue-400" />
                    <span className="text-sm font-bold text-white">{ml}</span>
                    <span className="text-[10px] text-gray-500">ml</span>
                  </button>
                ))}
              </div>

              <ConfirmationModal
                isOpen={waterAmountToConfirm !== null}
                onClose={() => setWaterAmountToConfirm(null)}
                onConfirm={() => {
                  if (waterAmountToConfirm !== null) {
                    handleAddWater(waterAmountToConfirm)
                  }
                }}
                title="Add Water"
                message={`Are you sure you want to add ${waterAmountToConfirm}ml of water?`}
                confirmText="Yes, Add"
              />
            </section>

            {/* Protein Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Beef className="h-4 w-4" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-teal-400/80">Protein</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 30].map((g) => (
                  <button
                    key={g}
                    onClick={() => setProteinAmountToConfirm(g)}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] py-3 transition-all hover:bg-teal-500/10 hover:border-teal-500/20 active:scale-95"
                  >
                    <Plus className="mb-1 h-3 w-3 text-gray-500 group-hover:text-teal-400" />
                    <span className="text-sm font-bold text-white">{g}</span>
                    <span className="text-[10px] text-gray-500">g</span>
                  </button>
                ))}
              </div>

              <ConfirmationModal
                isOpen={proteinAmountToConfirm !== null}
                onClose={() => setProteinAmountToConfirm(null)}
                onConfirm={() => {
                  if (proteinAmountToConfirm !== null) {
                    handleAddProtein(proteinAmountToConfirm)
                  }
                }}
                title="Add Protein"
                message={`Are you sure you want to add ${proteinAmountToConfirm}g of protein?`}
                confirmText="Yes, Add"
              />
            </section>

            {/* Calories Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-orange-400">
                <Zap className="h-4 w-4" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-orange-400/80">Calories</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[100, 250, 500].map((kcal) => (
                  <button
                    key={kcal}
                    onClick={() => setCaloriesAmountToConfirm(kcal)}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] py-3 transition-all hover:bg-orange-500/10 hover:border-orange-500/20 active:scale-95"
                  >
                    <Plus className="mb-1 h-3 w-3 text-gray-500 group-hover:text-orange-400" />
                    <span className="text-sm font-bold text-white">{kcal}</span>
                    <span className="text-[10px] text-gray-500">kcal</span>
                  </button>
                ))}
              </div>

              <ConfirmationModal
                isOpen={caloriesAmountToConfirm !== null}
                onClose={() => setCaloriesAmountToConfirm(null)}
                onConfirm={() => {
                  if (caloriesAmountToConfirm !== null) {
                    handleAddCals(caloriesAmountToConfirm)
                  }
                }}
                title="Add Calories"
                message={`Are you sure you want to add ${caloriesAmountToConfirm} kcal?`}
                confirmText="Yes, Add"
              />
            </section>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full rounded-2xl bg-white/5 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
