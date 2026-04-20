import { useEffect, useState } from 'react'

/** Counts from 0 to `end` over `durationMs` with cubic ease-out. */
export function useCountUp(end: number, durationMs = 1200, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let frame: number
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)

    const step = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / durationMs)
      const raw = ease(p) * end
      setValue(decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [end, durationMs, decimals])

  return value
}
