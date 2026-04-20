import type { ReactNode } from 'react'

export function NavIcon({
  children,
  className = 'h-5 w-5',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      {children}
    </svg>
  )
}
