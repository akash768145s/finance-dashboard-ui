import { monthKey } from '../utils/format'

/** @typedef {'income' | 'expense'} TxType */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date ISO date (yyyy-mm-dd)
 * @property {number} amount positive number
 * @property {string} category
 * @property {TxType} type
 * @property {string} [note]
 */

/** Category picklist order (must cover every `category` used in seed transactions). */
export const CATEGORIES = Object.freeze([
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Salary',
  'Freelance',
  'Other',
])

/** Opening balance before any listed transactions */
export const INITIAL_OPENING_BALANCE = 4_820.5

/**
 * Coherent demo figures — run `computeDemoSnapshot()` after edits to verify.
 *
 * | Month (key) | Income | Expenses | Net      |
 * |-------------|--------|----------|----------|
 * | 2025-08     | 4,500  | 315.45   | 4,184.55 |
 * | 2025-09     | 4,500  | 438.20   | 4,061.80 |
 * | 2025-10     | 5,150  | 550.58   | 4,599.42 |
 * | 2025-11     | 4,900  | 716.30   | 4,183.70 |
 * | 2025-12     | 5,250  | 775.50   | 4,474.50 |
 * | 2026-01     | 4,500  | 114.19   | 4,385.81 |
 * | 2026-02     | 5,000  | 920.00   | 4,080.00 |
 *
 * All-time: income 33,800.00 · expenses 3,830.22 · net +29,969.78
 * Ending balance: INITIAL_OPENING_BALANCE + net = 34,790.28
 *
 * Runtime: Zustand is hydrated only from FINANCE_DEMO_SEED (this file). All screens
 * read the store — they must not import transaction literals elsewhere.
 */
export const INITIAL_TRANSACTIONS = Object.freeze([
  {
    id: 't0a',
    date: '2025-08-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't0b',
    date: '2025-08-04',
    amount: 118.5,
    category: 'Food',
    type: 'expense',
    note: 'Groceries',
  },
  {
    id: 't0c',
    date: '2025-08-07',
    amount: 52,
    category: 'Transport',
    type: 'expense',
    note: 'Commute',
  },
  {
    id: 't0d',
    date: '2025-08-14',
    amount: 44.95,
    category: 'Shopping',
    type: 'expense',
    note: 'Drugstore',
  },
  {
    id: 't0e',
    date: '2025-08-21',
    amount: 100,
    category: 'Bills',
    type: 'expense',
    note: 'Internet',
  },
  {
    id: 't0f',
    date: '2025-09-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't0g',
    date: '2025-09-03',
    amount: 138.2,
    category: 'Food',
    type: 'expense',
    note: 'Groceries',
  },
  {
    id: 't0h',
    date: '2025-09-06',
    amount: 62,
    category: 'Transport',
    type: 'expense',
    note: 'Parking + fuel',
  },
  {
    id: 't0i',
    date: '2025-09-11',
    amount: 109.5,
    category: 'Shopping',
    type: 'expense',
    note: 'Desk lamp',
  },
  {
    id: 't0j',
    date: '2025-09-18',
    amount: 88,
    category: 'Bills',
    type: 'expense',
    note: 'Phone plan',
  },
  {
    id: 't0k',
    date: '2025-09-24',
    amount: 40.5,
    category: 'Entertainment',
    type: 'expense',
    note: 'Concert ticket',
  },
  {
    id: 't1',
    date: '2025-10-02',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't2',
    date: '2025-10-05',
    amount: 120.4,
    category: 'Food',
    type: 'expense',
    note: 'Groceries',
  },
  {
    id: 't3',
    date: '2025-10-08',
    amount: 45,
    category: 'Transport',
    type: 'expense',
    note: 'Metro pass top-up',
  },
  {
    id: 't4',
    date: '2025-10-12',
    amount: 89.99,
    category: 'Shopping',
    type: 'expense',
    note: 'Online order — household items',
  },
  {
    id: 't5',
    date: '2025-10-15',
    amount: 650,
    category: 'Freelance',
    type: 'income',
    note: 'Design contract',
  },
  {
    id: 't6',
    date: '2025-10-18',
    amount: 210,
    category: 'Bills',
    type: 'expense',
    note: 'Electric bill — October',
  },
  {
    id: 't7',
    date: '2025-10-22',
    amount: 55.2,
    category: 'Food',
    type: 'expense',
    note: 'Coffee & snacks',
  },
  {
    id: 't8',
    date: '2025-10-28',
    amount: 29.99,
    category: 'Entertainment',
    type: 'expense',
    note: 'Streaming subscription',
  },
  {
    id: 't9',
    date: '2025-11-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't10',
    date: '2025-11-04',
    amount: 142.3,
    category: 'Food',
    type: 'expense',
    note: 'Weekly groceries',
  },
  {
    id: 't11',
    date: '2025-11-07',
    amount: 60,
    category: 'Transport',
    type: 'expense',
    note: 'Airport rideshare',
  },
  {
    id: 't12',
    date: '2025-11-10',
    amount: 199,
    category: 'Shopping',
    type: 'expense',
    note: 'Running shoes',
  },
  {
    id: 't13',
    date: '2025-11-14',
    amount: 95,
    category: 'Health',
    type: 'expense',
    note: 'Pharmacy',
  },
  {
    id: 't14',
    date: '2025-11-20',
    amount: 220,
    category: 'Bills',
    type: 'expense',
    note: 'Fiber internet',
  },
  {
    id: 't15',
    date: '2025-11-25',
    amount: 400,
    category: 'Freelance',
    type: 'income',
    note: 'Invoice #1042 — logo draft',
  },
  {
    id: 't16',
    date: '2025-12-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't17',
    date: '2025-12-03',
    amount: 78.5,
    category: 'Food',
    type: 'expense',
    note: 'Team dinner',
  },
  {
    id: 't18',
    date: '2025-12-08',
    amount: 350,
    category: 'Shopping',
    type: 'expense',
    note: 'Holiday gifts',
  },
  {
    id: 't19',
    date: '2025-12-12',
    amount: 125,
    category: 'Bills',
    type: 'expense',
    note: 'Gas & water',
  },
  {
    id: 't20',
    date: '2025-12-18',
    amount: 42,
    category: 'Transport',
    type: 'expense',
    note: 'City parking',
  },
  {
    id: 't21',
    date: '2025-12-22',
    amount: 180,
    category: 'Entertainment',
    type: 'expense',
    note: 'Theater tickets',
  },
  {
    id: 't22',
    date: '2025-12-28',
    amount: 750,
    category: 'Freelance',
    type: 'income',
    note: 'Q4 milestone — dashboard UI',
  },
  {
    id: 't23',
    date: '2026-01-02',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't24',
    date: '2026-01-06',
    amount: 98.2,
    category: 'Food',
    type: 'expense',
    note: 'Weekend takeout',
  },
  {
    id: 't25',
    date: '2026-01-10',
    amount: 15.99,
    category: 'Other',
    type: 'expense',
    note: 'App store purchase',
  },
  {
    id: 't26',
    date: '2026-02-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
    note: 'Monthly payroll',
  },
  {
    id: 't27',
    date: '2026-02-03',
    amount: 198.44,
    category: 'Bills',
    type: 'expense',
    note: 'Renters insurance + mobile plan',
  },
  {
    id: 't28',
    date: '2026-02-04',
    amount: 156.8,
    category: 'Food',
    type: 'expense',
    note: 'Weekly groceries',
  },
  {
    id: 't29',
    date: '2026-02-07',
    amount: 52.1,
    category: 'Food',
    type: 'expense',
    note: 'Coffee & weekday lunches',
  },
  {
    id: 't30',
    date: '2026-02-09',
    amount: 67.25,
    category: 'Transport',
    type: 'expense',
    note: 'Gas fill-up',
  },
  {
    id: 't31',
    date: '2026-02-12',
    amount: 41.99,
    category: 'Entertainment',
    type: 'expense',
    note: 'Streaming bundles',
  },
  {
    id: 't32',
    date: '2026-02-15',
    amount: 94.5,
    category: 'Shopping',
    type: 'expense',
    note: 'Household + drugstore',
  },
  {
    id: 't33',
    date: '2026-02-18',
    amount: 28,
    category: 'Health',
    type: 'expense',
    note: 'Pharmacy — allergy meds',
  },
  {
    id: 't34',
    date: '2026-02-20',
    amount: 320,
    category: 'Freelance',
    type: 'income',
    note: 'Invoice #2011 — auth flow polish',
  },
  {
    id: 't35',
    date: '2026-02-22',
    amount: 73.2,
    category: 'Food',
    type: 'expense',
    note: 'Takeout (busy week)',
  },
  {
    id: 't36',
    date: '2026-02-27',
    amount: 10.99,
    category: 'Other',
    type: 'expense',
    note: 'IDE plugin subscription',
  },
  {
    id: 't37',
    date: '2026-02-25',
    amount: 196.73,
    category: 'Shopping',
    type: 'expense',
    note: 'Winter gear + luggage',
  },
  {
    id: 't38',
    date: '2026-02-28',
    amount: 180,
    category: 'Freelance',
    type: 'income',
    note: 'Logo revision — paid',
  },
])

/**
 * Roll-up of seed transactions + opening balance — same arithmetic the app uses
 * via Zustand + hooks. Does not read persisted storage.
 *
 * @returns {{
 *   openingBalance: number,
 *   allTimeIncome: number,
 *   allTimeExpenses: number,
 *   balance: number,
 *   monthKeys: string[],
 *   latestMonthKey: string | null,
 *   previousMonthKey: string | null,
 *   latest: { income: number, expense: number, net: number } | null,
 *   previous: { income: number, expense: number, net: number } | null,
 *   savingsRateLatestPct: number | null,
 * }}
 */
export function computeDemoSnapshot() {
  let allTimeIncome = 0
  let allTimeExpenses = 0
  /** @type {Map<string, { income: number, expense: number }>} */
  const byMonth = new Map()

  for (const t of INITIAL_TRANSACTIONS) {
    const mk = monthKey(t.date)
    let row = byMonth.get(mk)
    if (!row) {
      row = { income: 0, expense: 0 }
      byMonth.set(mk, row)
    }
    if (t.type === 'income') {
      allTimeIncome += t.amount
      row.income += t.amount
    } else {
      allTimeExpenses += t.amount
      row.expense += t.amount
    }
  }

  const monthKeys = [...byMonth.keys()].sort()
  const latestMonthKey = monthKeys.length ? monthKeys[monthKeys.length - 1] : null
  const previousMonthKey =
    monthKeys.length > 1 ? monthKeys[monthKeys.length - 2] : null

  const latestRow = latestMonthKey ? byMonth.get(latestMonthKey) : null
  const previousRow = previousMonthKey ? byMonth.get(previousMonthKey) : null

  const latest = latestRow
    ? {
        income: latestRow.income,
        expense: latestRow.expense,
        net: latestRow.income - latestRow.expense,
      }
    : null
  const previous = previousRow
    ? {
        income: previousRow.income,
        expense: previousRow.expense,
        net: previousRow.income - previousRow.expense,
      }
    : null

  const savingsRateLatestPct =
    latest && latest.income > 0 ? (latest.net / latest.income) * 100 : null

  return {
    openingBalance: INITIAL_OPENING_BALANCE,
    allTimeIncome,
    allTimeExpenses,
    balance: INITIAL_OPENING_BALANCE + allTimeIncome - allTimeExpenses,
    monthKeys,
    latestMonthKey,
    previousMonthKey,
    latest,
    previous,
    savingsRateLatestPct,
  }
}

/**
 * Single source of truth for demo money data. Dashboard, transactions, insights,
 * charts, and metrics all flow from the store, which is hydrated only from here
 * (plus user edits persisted in localStorage).
 */
export const FINANCE_DEMO_SEED = Object.freeze({
  openingBalance: INITIAL_OPENING_BALANCE,
  transactions: INITIAL_TRANSACTIONS,
  categories: CATEGORIES,
})

/** Mutable deep-ish copy for Zustand — never mutate seed arrays in place. */
export function cloneDemoTransactions() {
  return INITIAL_TRANSACTIONS.map((t) => ({ ...t }))
}

if (import.meta.env?.DEV) {
  for (const t of INITIAL_TRANSACTIONS) {
    if (!CATEGORIES.includes(t.category)) {
      throw new Error(
        `mockData: category "${t.category}" missing from CATEGORIES (id ${t.id})`,
      )
    }
  }
}
