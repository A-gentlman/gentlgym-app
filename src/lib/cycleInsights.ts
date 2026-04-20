import type { CyclePredictions } from '../types/cycle'
import { daysBetween, todayISODate } from './cycleMath'

export type CycleInsight = {
  id: string
  title: string
  body: string
  tone: 'info' | 'tip' | 'attention'
}

/**
 * Rule-based insight generator (on-device). Not a substitute for medical advice.
 */
export function generateCycleInsights(p: CyclePredictions): CycleInsight[] {
  const insights: CycleInsight[] = []
  const today = todayISODate()

  if (!p.lastPeriodStart) {
    insights.push({
      id: 'start-logging',
      title: 'Get started',
      body: 'Log your period start date to unlock predictions for your next period and estimated ovulation.',
      tone: 'tip',
    })
    return insights
  }

  if (p.cyclesSampled < 2 && p.avgCycleLength) {
    insights.push({
      id: 'more-data',
      title: 'Stronger predictions ahead',
      body: `After one more full cycle, we'll personalize your average length (currently using a typical ${p.avgCycleLength}-day cycle as a starting point).`,
      tone: 'info',
    })
  }

  if (p.cycleRegularityCv != null && p.cycleRegularityCv > 0.18) {
    insights.push({
      id: 'variability',
      title: 'Cycle variability',
      body: 'Your logged cycles vary more than average. If this is new for you, consider mentioning it at your next check-up — training load and stress can affect rhythm.',
      tone: 'attention',
    })
  }

  if (p.nextPeriodStart) {
    const untilPeriod = daysBetween(today, p.nextPeriodStart)
    if (untilPeriod >= 0 && untilPeriod <= 3) {
      insights.push({
        id: 'period-soon',
        title: 'Period may be near',
        body: 'Recovery-friendly training and extra sleep can help if you feel fatigued. Hydration and iron-rich foods matter more this week.',
        tone: 'tip',
      })
    }
  }

  if (p.nextOvulationDate) {
    const untilOv = daysBetween(today, p.nextOvulationDate)
    if (untilOv >= 0 && untilOv <= 2) {
      insights.push({
        id: 'ovulation-window',
        title: 'Estimated ovulation window',
        body: 'Some people feel a short energy peak mid-cycle — if you do, it can be a good window for skill work or moderate intensity if it feels right.',
        tone: 'tip',
      })
    }
    if (untilOv < 0 && p.nextPeriodStart) {
      const daysPastOv = daysBetween(p.nextOvulationDate, today)
      if (daysPastOv >= 0 && daysPastOv <= 14) {
        insights.push({
          id: 'luteal',
          title: 'Luteal phase',
          body: 'After ovulation, progesterone rises — some athletes notice slightly higher effort or temperature. Consider autoregulating volume and intensity.',
          tone: 'info',
        })
      }
    }
  }

  if (p.fertileWindow && p.nextOvulationDate) {
    const fwEnd = p.fertileWindow.end
    if (today >= p.fertileWindow.start && today <= fwEnd) {
      insights.push({
        id: 'fertile-now',
        title: 'Fertile window (estimate)',
        body: `Based on your logs, today may fall within your approximate fertile window (through ${fwEnd}). Estimates are not medical advice.`,
        tone: 'info',
      })
    }
  }

  if (p.nextPeriodStart && insights.length < 4) {
    insights.push({
      id: 'prediction-range',
      title: 'Forecast accuracy',
      body: `Next period ~${p.nextPeriodStart}; ovulation modeled ~14 days earlier. Real cycles vary — log each start to refine estimates.`,
      tone: 'info',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'keep-logging',
      title: 'Keep logging',
      body: 'Regular updates improve forecast accuracy. Mark period start on day one of bleeding for best results.',
      tone: 'tip',
    })
  }

  return insights.slice(0, 6)
}
