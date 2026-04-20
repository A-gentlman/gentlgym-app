/** Display ISO date (YYYY-MM-DD) in local calendar without UTC shift issues */
export function formatISODateDisplay(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatISODateShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
