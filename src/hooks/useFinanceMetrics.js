import { useMemo } from 'react'
import { monthKey } from '../utils/format'
import { useFinanceStore } from '../store/useFinanceStore'

function compareTx(a, b, sortBy, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  if (sortBy === 'amount') return (a.amount - b.amount) * dir
  if (sortBy === 'category')
    return a.category.localeCompare(b.category) * dir
  return (new Date(a.date) - new Date(b.date)) * dir
}

export function useFilteredTransactions() {
  const transactions = useFinanceStore((s) => s.transactions)
  const filterCategory = useFinanceStore((s) => s.filterCategory)
  const filterType = useFinanceStore((s) => s.filterType)
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortDir = useFinanceStore((s) => s.sortDir)

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = transactions.filter((t) => {
      if (filterCategory !== 'all' && t.category !== filterCategory)
        return false
      if (filterType !== 'all' && t.type !== filterType) return false
      if (q) {
        const hay = `${t.category} ${t.note ?? ''} ${t.type}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    list = [...list].sort((a, b) => compareTx(a, b, sortBy, sortDir))
    return list
  }, [
    transactions,
    filterCategory,
    filterType,
    searchQuery,
    sortBy,
    sortDir,
  ])
}

export function useSummary() {
  const openingBalance = useFinanceStore((s) => s.openingBalance)
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount
      else expenses += t.amount
    }
    const balance = openingBalance + income - expenses
    return { income, expenses, balance, openingBalance }
  }, [openingBalance, transactions])
}

/** Running balance points by transaction for zig-zag trend chart */
export function useBalanceTrendPoints() {
  const openingBalance = useFinanceStore((s) => s.openingBalance)
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )
    const points = []
    let running = openingBalance
    for (const t of sorted) {
      running += t.type === 'income' ? t.amount : -t.amount
      points.push({
        date: t.date,
        balance: running,
        type: t.type,
        category: t.category,
      })
    }
    return points
  }, [openingBalance, transactions])
}

/** Expense totals by category (all time) */
export function useSpendingByCategory() {
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    const map = new Map()
    for (const t of transactions) {
      if (t.type !== 'expense') continue
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])
}

export function useInsights() {
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    const monthSet = new Set(transactions.map((t) => monthKey(t.date)))
    const monthsSorted = [...monthSet].sort()
    const lastM = monthsSorted[monthsSorted.length - 1]
    const prevM = monthsSorted[monthsSorted.length - 2]

    function monthTotals(mk) {
      let income = 0
      let expense = 0
      if (!mk) return { income, expense }
      for (const t of transactions) {
        if (monthKey(t.date) !== mk) continue
        if (t.type === 'income') income += t.amount
        else expense += t.amount
      }
      return { income, expense }
    }

    function expensesByCategoryInMonth(mk) {
      const map = new Map()
      if (!mk) return map
      for (const t of transactions) {
        if (t.type !== 'expense' || monthKey(t.date) !== mk) continue
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
      }
      return map
    }

    const byCatMonth = expensesByCategoryInMonth(lastM)
    let topCat = null
    let topAmt = 0
    for (const [cat, amt] of byCatMonth) {
      if (amt > topAmt) {
        topAmt = amt
        topCat = cat
      }
    }

    const expenseThisTotal = [...byCatMonth.values()].reduce((a, b) => a + b, 0)
    const topPctOfMonth =
      expenseThisTotal > 0 ? (topAmt / expenseThisTotal) * 100 : null
    const otherCategoriesSpend = Math.max(0, expenseThisTotal - topAmt)

    const monthlyExpenses = monthsSorted.map((mk) => monthTotals(mk).expense)

    let spendingPattern = 'unknown'
    if (monthlyExpenses.length >= 2) {
      const nonzero = monthlyExpenses.filter((e) => e > 0)
      if (nonzero.length >= 2) {
        const mean =
          monthlyExpenses.reduce((s, e) => s + e, 0) / monthlyExpenses.length
        if (mean > 0) {
          const variance =
            monthlyExpenses.reduce((s, e) => s + (e - mean) ** 2, 0) /
            monthlyExpenses.length
          const cv = Math.sqrt(variance) / mean
          spendingPattern = cv > 0.35 ? 'uneven' : 'even'
        }
      }
    }

    let positiveMonthsStreak = 0
    for (let i = monthsSorted.length - 1; i >= 0; i--) {
      const { income, expense } = monthTotals(monthsSorted[i])
      if (income - expense > 0) positiveMonthsStreak += 1
      else break
    }

    const cur = monthTotals(lastM)
    const prev = monthTotals(prevM)
    const netThis = cur.income - cur.expense
    const netLast = prev.income - prev.expense
    const monthDelta =
      prevM && netLast !== 0
        ? ((netThis - netLast) / Math.abs(netLast)) * 100
        : null

    const expenseDelta =
      prevM != null ? cur.expense - prev.expense : null

    const savingsRatePct =
      cur.income > 0 ? (netThis / cur.income) * 100 : null

    const monthlyExpenseBars = monthsSorted.map((mk) => {
      const [y, mo] = mk.split('-').map(Number)
      const shortLabel = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(new Date(y, mo - 1, 1))
      return {
        key: mk,
        shortLabel,
        expense: monthTotals(mk).expense,
        isCurrent: mk === lastM,
      }
    })

    let savingsStatus = 'Building'
    if (netThis < 0) savingsStatus = 'Strained'
    else if (savingsRatePct != null && savingsRatePct >= 50) savingsStatus = 'Strong'
    else if (savingsRatePct != null && savingsRatePct >= 25) savingsStatus = 'Solid'
    else if (savingsRatePct != null && savingsRatePct >= 0) savingsStatus = 'Steady'

    return {
      topCategory: topCat,
      topCategoryAmount: topAmt,
      topCategoryPctOfMonth: topPctOfMonth,
      otherCategoriesSpend,
      latestMonthKey: lastM,
      previousMonthKey: prevM,
      incomeThis: cur.income,
      expenseThis: cur.expense,
      netThis,
      incomeLast: prev.income,
      expenseLast: prev.expense,
      netLast,
      expenseDelta,
      monthDeltaPct: monthDelta,
      savingsRatePct,
      spendingPattern,
      positiveMonthsStreak,
      monthsCount: monthsSorted.length,
      monthlyExpenseBars,
      savingsStatus,
    }
  }, [transactions])
}
