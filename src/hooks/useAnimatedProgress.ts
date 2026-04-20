import { useEffect, useState } from 'react'

/** Animates from 0 to `target` (0–1) over `durationMs`. */
export function useAnimatedProgress(target: number, durationMs = 1200) {
  const [t, setT] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let frame: number
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)

    const step = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / durationMs)
      setT(ease(p) * target)
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])

  return t
}
