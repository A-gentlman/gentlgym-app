import type { CyclePredictions, PeriodRecord } from '../types/cycle'

const MS_PER_DAY = 86400000

/** Normalize to UTC midnight for the given calendar date string */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function formatISODate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(iso: string, days: number): string {
  const t = parseISODate(iso).getTime() + days * MS_PER_DAY
  return formatISODate(new Date(t))
}

/** Inclusive calendar days between two ISO dates (a <= b) */
export function daysBetween(isoA: string, isoB: string): number {
  const a = parseISODate(isoA).getTime()
  const b = parseISODate(isoB).getTime()
  return Math.round((b - a) / MS_PER_DAY)
}

/** Default cycle when only one period is logged */
export const DEFAULT_CYCLE_LENGTH = 28
/** Typical luteal phase length for ovulation estimate (days before next period) */
export const DEFAULT_LUTEAL_DAYS = 14
/** Fertile window: days before ovulation through day after (approximation) */
export const FERTILE_DAYS_BEFORE_OVULATION = 5
export const FERTILE_DAYS_AFTER_OVULATION = 1

function sortedPeriodStarts(periods: PeriodRecord[]): string[] {
  const starts = [...new Set(periods.map((p) => p.startDate))].sort()
  return starts
}

function cycleLengthsBetweenStarts(sortedStarts: string[]): number[] {
  const lengths: number[] = []
  for (let i = 1; i < sortedStarts.length; i++) {
    const len = daysBetween(sortedStarts[i - 1], sortedStarts[i])
    if (len > 0) lengths.push(len)
  }
  return lengths
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0
  const m = mean(nums)
  const v = mean(nums.map((x) => (x - m) ** 2))
  return Math.sqrt(v)
}

/**
 * Predict next period, ovulation, and fertile window from period logs.
 * Ovulation estimate: next_period_start − DEFAULT_LUTEAL_DAYS (common model).
 */
export function computePredictions(periods: PeriodRecord[]): CyclePredictions {
  const starts = sortedPeriodStarts(periods)
  const lastStart = starts.length ? starts[starts.length - 1] : null
  const lengths = cycleLengthsBetweenStarts(starts)

  if (!lastStart) {
    return {
      avgCycleLength: null,
      cyclesSampled: 0,
      lastPeriodStart: null,
      nextPeriodStart: null,
      nextOvulationDate: null,
      fertileWindow: null,
      confidence: 0,
      cycleRegularityCv: null,
    }
  }

  let avgCycle: number
  let sampled: number
  let cv: number | null = null

  if (lengths.length === 0) {
    avgCycle = DEFAULT_CYCLE_LENGTH
    sampled = 0
  } else {
    const recent = lengths.slice(-6)
    avgCycle = Math.round(mean(recent))
    sampled = recent.length
    const sd = stdDev(recent)
    cv = avgCycle > 0 ? sd / avgCycle : null
  }

  const nextPeriod = addDays(lastStart, avgCycle)
  const nextOvulation = addDays(nextPeriod, -DEFAULT_LUTEAL_DAYS)
  const fertileStart = addDays(nextOvulation, -FERTILE_DAYS_BEFORE_OVULATION)
  const fertileEnd = addDays(nextOvulation, FERTILE_DAYS_AFTER_OVULATION)

  let confidence = 0.35
  if (lengths.length >= 1) confidence = 0.55
  if (lengths.length >= 2) confidence = 0.72
  if (lengths.length >= 3) confidence = 0.82
  if (lengths.length >= 4) confidence = 0.88
  if (cv != null && cv < 0.08) confidence = Math.min(0.95, confidence + 0.05)
  if (cv != null && cv > 0.2) confidence = Math.max(0.4, confidence - 0.12)

  return {
    avgCycleLength: lengths.length ? avgCycle : DEFAULT_CYCLE_LENGTH,
    cyclesSampled: sampled,
    lastPeriodStart: lastStart,
    nextPeriodStart: nextPeriod,
    nextOvulationDate: nextOvulation,
    fertileWindow: { start: fertileStart, end: fertileEnd },
    confidence,
    cycleRegularityCv: lengths.length >= 2 ? cv : null,
  }
}

export function isDateInRange(iso: string, start: string, end: string): boolean {
  return iso >= start && iso <= end
}

export function todayISODate(): string {
  return formatISODate(new Date())
}
