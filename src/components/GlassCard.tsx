import type { ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

export function GlassCard({ children, className = '', as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag
      className={[
        'rounded-[var(--radius-glass)] border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  )
}
