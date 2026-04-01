const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const monthFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
})

const shortDateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export function formatCurrency(value) {
  return currencyFmt.format(value)
}

export function formatDate(isoDate) {
  return dateFmt.format(new Date(isoDate + 'T12:00:00'))
}

export function formatMonthLabel(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  return monthFmt.format(new Date(y, m - 1, 1))
}

export function formatShortDate(isoDate) {
  return shortDateFmt.format(new Date(isoDate + 'T12:00:00'))
}

/** @param {string} iso yyyy-mm-dd */
export function monthKey(iso) {
  return iso.slice(0, 7)
}
