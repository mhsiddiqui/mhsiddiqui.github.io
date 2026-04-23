const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function yearsSince(startDate) {
  const [year, month] = startDate.split('-').map(Number)
  const start = new Date(year, (month || 1) - 1)
  const now = new Date()
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.floor(years)
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  const parts = dateStr.split('-')
  if (parts.length === 1) return parts[0]
  const [year, month] = parts.map(Number)
  return `${MONTHS[month - 1]} ${year}`
}

export function formatDuration(start, end) {
  return `${formatDate(start)} – ${formatDate(end)}`
}
