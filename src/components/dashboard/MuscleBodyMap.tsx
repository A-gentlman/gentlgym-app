import { useCallback } from 'react'
import Model from 'react-body-highlighter'

interface MuscleBodyMapProps {
  selectedMuscles: string[]
  onToggleMuscle: (muscle: string) => void
}

const OUR_TO_PACKAGE: Record<string, string[]> = {
  Chest: ['chest'],
  Back: ['upper-back', 'lower-back', 'trapezius'],
  Legs: ['quadriceps', 'hamstring', 'calves', 'gluteal', 'adductor', 'abductors'],
  Shoulders: ['front-deltoids', 'back-deltoids'],
  Biceps: ['biceps'],
  Triceps: ['triceps'],
  Arms: ['biceps', 'triceps', 'forearm'],
  Abs: ['abs', 'obliques']
}

// Convert package muscle IDs back to our groups when clicked
const PACKAGE_TO_OUR: Record<string, string> = {
  'chest': 'Chest',
  'upper-back': 'Back',
  'lower-back': 'Back',
  'trapezius': 'Back',
  'quadriceps': 'Legs',
  'hamstring': 'Legs',
  'calves': 'Legs',
  'gluteal': 'Legs',
  'adductor': 'Legs',
  'abductors': 'Legs',
  'front-deltoids': 'Shoulders',
  'back-deltoids': 'Shoulders',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearm': 'Arms',
  'abs': 'Abs',
  'obliques': 'Abs'
}

export function MuscleBodyMap({ selectedMuscles, onToggleMuscle }: MuscleBodyMapProps) {
  // Convert current standard muscle groups to the specific IDs react-body-highlighter uses
  const activePackageMuscles = selectedMuscles.flatMap(m => OUR_TO_PACKAGE[m] || [])

  // The package expects an array of exercises (we just mock one called 'Selected', and list all active muscles)
  const data = [
    {
      name: 'Selected',
      muscles: activePackageMuscles as any
    }
  ]

  const handleClick = useCallback((stats: any) => {
    // stats.muscle is the raw ID like "quadriceps"
    const clickedGroup = PACKAGE_TO_OUR[stats.muscle]
    if (clickedGroup) {
      onToggleMuscle(clickedGroup)
    }
  }, [onToggleMuscle])

  return (
    <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12 py-4">
      {/* FRONT VIEW */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Front</span>
        <div className="svg-drop-shadow transition-all duration-300">
          <Model
            data={data}
            type="anterior"
            style={{ width: '12rem', cursor: 'pointer' }}
            bodyColor="#262626"
            highlightedColors={['#10b981']}
            onClick={handleClick}
          />
        </div>
      </div>

      {/* BACK VIEW */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Back</span>
        <div className="svg-drop-shadow transition-all duration-300">
          <Model
            data={data}
            type="posterior"
            style={{ width: '12rem', cursor: 'pointer' }}
            bodyColor="#262626"
            highlightedColors={['#10b981']}
            onClick={handleClick}
          />
        </div>
      </div>
      
      {/* Add drop shadow for SVGs to give a premium glow */}
      <style>{`
        .svg-drop-shadow svg path[fill="#10b981"] {
          filter: drop-shadow(0px 0px 8px rgba(16,185,129,0.4));
          transition: fill 0.3s ease-in-out;
        }
        .svg-drop-shadow svg path:hover {
          fill: #10b981;
          opacity: 0.5;
        }
        .svg-drop-shadow svg {
          overflow: visible;
        }
      `}</style>
    </div>
  )
}
