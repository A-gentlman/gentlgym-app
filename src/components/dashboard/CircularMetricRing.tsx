import type { ReactNode } from 'react'
import { useAnimatedProgress } from '../../hooks/useAnimatedProgress'

type CircularMetricRingProps = {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  gradientFrom?: string
  gradientTo?: string
  glowColor?: string
  /** Center content (e.g. animated count + unit) */
  children?: ReactNode
}

let gradientIdCounter = 0

export function CircularMetricRing({
  value,
  max,
  size = 128,
  strokeWidth = 7,
  gradientFrom = '#818CF8',
  gradientTo = '#6366F1',
  glowColor,
  children,
}: CircularMetricRingProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const animated = useAnimatedProgress(pct / 100, 1400)

  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - animated)

  const gId = `ring-grad-${gradientFrom.replace('#', '')}-${(gradientIdCounter++).toString(36)}`
  const resolvedGlow = glowColor || gradientFrom

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ background: resolvedGlow }}
        aria-hidden
      />
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        aria-hidden
      >
        <defs>
          <linearGradient id={gId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Value arc with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${resolvedGlow}40)`,
            transition: 'stroke-dashoffset 0.3s ease-out',
          }}
        />
      </svg>
      {children ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          {children}
        </div>
      ) : null}
    </div>
  )
}
