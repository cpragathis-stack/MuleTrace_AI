const LOCALE = 'en-US'

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : null
}

function toDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatNumber(value, options = {}) {
  const number = toNumber(value)
  if (number === null) return '—'

  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 2,
    ...options,
  }).format(number)
}

export function formatCompactNumber(value) {
  return formatNumber(value, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
}

export function formatCurrency(value, currency = 'USD', options = {}) {
  const number = toNumber(value)
  if (number === null) return '—'

  try {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      ...options,
    }).format(number)
  } catch {
    return `${currency} ${formatNumber(number, options)}`
  }
}

export function formatPercent(value, options = {}) {
  const number = toNumber(value)
  if (number === null) return '—'
  return `${formatNumber(number, options)}%`
}

export function formatDate(value, options = {}) {
  const date = toDate(value)
  if (!date) return '—'

  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value, options = {}) {
  const date = toDate(value)
  if (!date) return '—'

  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(date)
}

const RELATIVE_DIVISIONS = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

export function formatRelativeTime(value) {
  const date = toDate(value)
  if (!date) return '—'

  const formatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })
  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return formatDate(date)
}

export function humanize(value) {
  if (value === null || value === undefined || value === '') return '—'

  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function truncate(value, maxLength = 18) {
  if (value === null || value === undefined) return '—'
  const text = String(value)
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`
}
