export type FlowLevel = 'light' | 'medium' | 'heavy'

export type PeriodRecord = {
  id: string
  /** ISO date string YYYY-MM-DD (period start) */
  startDate: string
  /** ISO date YYYY-MM-DD inclusive end of bleeding, optional */
  endDate?: string
  flow?: FlowLevel
  notes?: string
}

export type CyclePredictions = {
  /** Average cycle length in days from logged intervals, null if insufficient data */
  avgCycleLength: number | null
  /** Sample size used for average */
  cyclesSampled: number
  /** Last period start from logs */
  lastPeriodStart: string | null
  /** Predicted first day of next period */
  nextPeriodStart: string | null
  /** Estimated ovulation (typically ~14 days before next period) */
  nextOvulationDate: string | null
  /** Approximate fertile window [start, end] ISO dates */
  fertileWindow: { start: string; end: string } | null
  /** 0–1 confidence based on data quantity and regularity */
  confidence: number
  /** Coefficient of variation of cycle lengths (0 = identical), null if N<2 */
  cycleRegularityCv: number | null
}
