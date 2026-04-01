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

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Salary',
  'Freelance',
  'Other',
]

/** Opening balance before any listed transactions */
export const INITIAL_OPENING_BALANCE = 4_820.5

/** Seed dataset — varied months and categories */
export const INITIAL_TRANSACTIONS = [
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
  },
  {
    id: 't4',
    date: '2025-10-12',
    amount: 89.99,
    category: 'Shopping',
    type: 'expense',
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
  },
  {
    id: 't7',
    date: '2025-10-22',
    amount: 55.2,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 't8',
    date: '2025-10-28',
    amount: 29.99,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: 't9',
    date: '2025-11-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 't10',
    date: '2025-11-04',
    amount: 142.3,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 't11',
    date: '2025-11-07',
    amount: 60,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: 't12',
    date: '2025-11-10',
    amount: 199,
    category: 'Shopping',
    type: 'expense',
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
  },
  {
    id: 't15',
    date: '2025-11-25',
    amount: 400,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: 't16',
    date: '2025-12-01',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 't17',
    date: '2025-12-03',
    amount: 78.5,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 't18',
    date: '2025-12-08',
    amount: 350,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: 't19',
    date: '2025-12-12',
    amount: 125,
    category: 'Bills',
    type: 'expense',
  },
  {
    id: 't20',
    date: '2025-12-18',
    amount: 42,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: 't21',
    date: '2025-12-22',
    amount: 180,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: 't22',
    date: '2025-12-28',
    amount: 750,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: 't23',
    date: '2026-01-02',
    amount: 4_500,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 't24',
    date: '2026-01-06',
    amount: 98.2,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 't25',
    date: '2026-01-10',
    amount: 15.99,
    category: 'Other',
    type: 'expense',
  },
]
