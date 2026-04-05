/**
 * Ledger rollups shared by dashboard charts and Insights (single source of truth).
 * @param {number} openingBalance
 * @param {import('../data/mockData').Transaction[]} transactions
 * @param {string} yearMonth yyyy-mm
 */

/** Balance after all activity strictly before the first day of `yearMonth`. */
export function balanceBeforeMonth(openingBalance, transactions, yearMonth) {
  const start = `${yearMonth}-01`
  let running = openingBalance
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  for (const t of sorted) {
    if (t.date >= start) break
    running += t.type === 'income' ? t.amount : -t.amount
  }
  return running
}

/** Running balance after all transactions on or before the last day of `yearMonth`. */
export function balanceAtEndOfMonth(openingBalance, transactions, yearMonth) {
  const [y, mo] = yearMonth.split('-').map(Number)
  const lastDay = new Date(y, mo, 0).getDate()
  const endStr = `${yearMonth}-${String(lastDay).padStart(2, '0')}`
  let running = openingBalance
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  for (const t of sorted) {
    if (t.date > endStr) break
    running += t.type === 'income' ? t.amount : -t.amount
  }
  return running
}
