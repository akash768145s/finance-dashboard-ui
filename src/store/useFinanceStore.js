import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  INITIAL_OPENING_BALANCE,
  INITIAL_TRANSACTIONS,
} from '../data/mockData'

/**
 * @typedef {'viewer' | 'admin'} Role
 * @typedef {'light' | 'dark'} Theme
 * @typedef {'all' | import('../data/mockData').Transaction['type']} FilterType
 * @typedef {'date' | 'amount' | 'category'} SortBy
 */

const defaultState = {
  openingBalance: INITIAL_OPENING_BALANCE,
  transactions: INITIAL_TRANSACTIONS,
  role: /** @type {Role} */ ('viewer'),
  theme: /** @type {Theme} */ ('dark'),
  filterCategory: 'all',
  filterType: /** @type {FilterType} */ ('all'),
  searchQuery: '',
  sortBy: /** @type {SortBy} */ ('date'),
  sortDir: /** @type {'asc' | 'desc'} */ ('desc'),
}

export const useFinanceStore = create(
  persist(
    (set) => ({
      ...defaultState,

      setRole: (role) => set({ role }),

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.dataset.theme = theme
      },

      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterType: (filterType) => set({ filterType }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSort: (sortBy, sortDir) => set({ sortBy, sortDir }),

      resetFilters: () =>
        set({
          filterCategory: 'all',
          filterType: 'all',
          searchQuery: '',
          sortBy: 'date',
          sortDir: 'desc',
        }),

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...s.transactions,
          ],
        })),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),

      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      resetDemoData: () =>
        set({
          openingBalance: INITIAL_OPENING_BALANCE,
          transactions: [...INITIAL_TRANSACTIONS],
        }),
    }),
    {
      name: 'finance-dashboard',
      partialize: (s) => ({
        openingBalance: s.openingBalance,
        transactions: s.transactions,
        role: s.role,
        theme: s.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.dataset.theme = state.theme
        }
      },
    },
  ),
)

/** Sync theme on first load before rehydrate */
if (typeof document !== 'undefined') {
  const stored = localStorage.getItem('finance-dashboard')
  if (stored) {
    try {
      const t = JSON.parse(stored)?.state?.theme
      if (t === 'light' || t === 'dark') {
        document.documentElement.dataset.theme = t
      }
    } catch {
      /* ignore */
    }
  } else {
    document.documentElement.dataset.theme = 'dark'
  }
}
