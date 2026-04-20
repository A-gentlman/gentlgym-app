import type { ReactNode } from 'react'

type DashboardGlassCardProps = {
  children: ReactNode
  className?: string
  staggerIndex?: number
  accentColor?: string
}

/** Premium glass panel with top glare, bottom glow line, fade-up stagger, and optional accent glow. */
export function DashboardGlassCard({
  children,
  className = '',
  staggerIndex = 0,
  accentColor,
}: DashboardGlassCardProps) {
  return (
    <div
      className={[
        'dashboard-glass-card relative flex h-full flex-col overflow-hidden rounded-2xl',
        'border border-[var(--glass-border)] bg-[var(--glass-bg)]',
        'backdrop-blur-[16px] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)]',
        'p-6 sm:p-7',
        'dashboard-fade-up',
        'shadow-[var(--card-shadow)]',
        className,
      ].join(' ')}
      style={{ animationDelay: `${staggerIndex * 80}ms` }}
    >
      {/* Top glare line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glow-line-mid)] to-transparent"
        aria-hidden
      />
      {/* Bottom gradient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--glow-line-mid)]/50 to-transparent"
        aria-hidden
      />
      {/* Optional accent glow dot in top-right corner */}
      {accentColor ? (
        <div
          className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.25] lg:blur-2xl"
          style={{ background: accentColor }}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  )
}
