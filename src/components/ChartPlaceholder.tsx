type ChartPlaceholderProps = {
  title: string
  values: number[]
  format?: (n: number) => string
  className?: string
}

export function ChartPlaceholder({
  title,
  values,
  format = (n) => String(Math.round(n)),
  className = '',
}: ChartPlaceholderProps) {
  const max = Math.max(...values, 1)
  return (
    <div className={`space-y-3 ${className}`}>
      {title ? (
        <h3 className="text-sm font-medium text-[var(--text-muted)]">{title}</h3>
      ) : null}
      <div className="flex h-36 items-end gap-1.5 sm:gap-2">
        {values.map((v, i) => {
          const h = (v / max) * 100
          return (
            <div
              key={i}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="w-full max-w-[2.5rem] rounded-t-md bg-[var(--text)]/80 transition-all"
                style={{ height: `${Math.max(h, 8)}%` }}
                title={format(v)}
              />
              <span className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                {i + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
