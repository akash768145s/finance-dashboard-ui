import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/mockData'
import { useFinanceStore } from '../store/useFinanceStore'
import { useFilteredTransactions } from '../hooks/useFinanceMetrics'
import { formatCurrency, formatDate } from '../utils/format'
import { TransactionModal } from './TransactionModal'
import { ConfirmDialog } from './ConfirmDialog'
import {
  ArrowUpDown,
  Download,
  FileJson,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  SquarePen,
  Trash2,
} from 'lucide-react'

function exportCsv(rows) {
  const header = ['date', 'amount', 'category', 'type', 'note']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.date,
        r.amount,
        JSON.stringify(r.category),
        r.type,
        JSON.stringify(r.note ?? ''),
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

function exportJson(rows) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: 'application/json',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function TransactionsPanel() {
  const role = useFinanceStore((s) => s.role)
  const isAdmin = role === 'admin'
  const filterCategory = useFinanceStore((s) => s.filterCategory)
  const setFilterCategory = useFinanceStore((s) => s.setFilterCategory)
  const filterType = useFinanceStore((s) => s.filterType)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortDir = useFinanceStore((s) => s.sortDir)
  const setSort = useFinanceStore((s) => s.setSort)
  const resetFilters = useFinanceStore((s) => s.resetFilters)
  const removeTransaction = useFinanceStore((s) => s.removeTransaction)
  const allTransactions = useFinanceStore((s) => s.transactions)

  const filtered = useFilteredTransactions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(
    /** @type {null | import('../data/mockData').Transaction} */ (null),
  )
  const [deleteTarget, setDeleteTarget] = useState(
    /** @type {null | import('../data/mockData').Transaction} */ (null),
  )

  const sortOptions = useMemo(
    () => [
      { value: 'date', label: 'Date' },
      { value: 'amount', label: 'Amount' },
      { value: 'category', label: 'Category' },
    ],
    [],
  )

  return (
    <section className="dash-section" aria-labelledby="tx-heading">
      <div className="dash-section__head">
        <h2 id="tx-heading" className="dash-section__title">
          <ListFilter size={16} />
          Transactions
        </h2>
        <div className="dash-toolbar">
          {isAdmin && (
            <button
              type="button"
              className="dash-btn dash-btn--primary"
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
            >
              <Plus size={15} />
              Add transaction
            </button>
          )}
          <button
            type="button"
            className="dash-btn dash-btn--ghost"
            onClick={() => exportCsv(filtered)}
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            type="button"
            className="dash-btn dash-btn--ghost"
            onClick={() => exportJson(filtered)}
          >
            <FileJson size={15} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="dash-filters">
        <label className="dash-field dash-field--grow">
          <span className="dash-field__label dash-label-icon">
            <Search size={13} />
            Search
          </span>
          <input
            className="dash-input"
            type="search"
            placeholder="Category, note, type…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
          />
        </label>
        <label className="dash-field">
          <span className="dash-field__label">Category</span>
          <select
            className="dash-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field__label">Type</span>
          <select
            className="dash-select"
            value={filterType}
            onChange={(e) =>
              setFilterType(
                /** @type {'all' | 'income' | 'expense'} */(e.target.value),
              )
            }
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field__label dash-label-icon">
            <ArrowUpDown size={13} />
            Sort by
          </span>
          <select
            className="dash-select"
            value={sortBy}
            onChange={(e) =>
              setSort(
                /** @type {'date' | 'amount' | 'category'} */(e.target.value),
                sortDir,
              )
            }
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field__label">Order</span>
          <select
            className="dash-select"
            value={sortDir}
            onChange={(e) =>
              setSort(
                sortBy,
                /** @type {'asc' | 'desc'} */(e.target.value),
              )
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
        <button
          type="button"
          className="dash-btn dash-btn--ghost dash-btn--align-end"
          onClick={resetFilters}
        >
          <RotateCcw size={15} />
          Reset filters
        </button>
      </div>

      <div className="dash-table-wrap">
        {allTransactions.length === 0 ? (
          <div className="dash-empty">
            <p>No transactions yet.</p>
            {isAdmin && (
              <button
                type="button"
                className="dash-btn dash-btn--primary"
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}
              >
                <Plus size={15} />
                Add your first transaction
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            <p>No transactions match your filters.</p>
            <button
              type="button"
              className="dash-btn dash-btn--ghost"
              onClick={resetFilters}
            >
              <RotateCcw size={15} />
              Clear filters
            </button>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col">Note</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td
                    className={
                      t.type === 'income'
                        ? 'dash-num dash-num--income'
                        : 'dash-num dash-num--expense'
                    }
                  >
                    {t.type === 'income' ? '+' : '−'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td>{t.category}</td>
                  <td>
                    <span
                      className={
                        t.type === 'income'
                          ? 'dash-badge dash-badge--income'
                          : 'dash-badge dash-badge--expense'
                      }
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="dash-table__note">{t.note ?? '—'}</td>
                  {isAdmin && (
                    <td className="dash-table__actions">
                      <button
                        type="button"
                        className="dash-link-btn"
                        onClick={() => {
                          setEditing(t)
                          setModalOpen(true)
                        }}
                      >
                        <SquarePen size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="dash-link-btn dash-link-btn--danger"
                        onClick={() => setDeleteTarget(t)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        editing={editing}
      />
      <ConfirmDialog
        open={deleteTarget != null}
        title="Delete transaction"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.category} (${formatCurrency(deleteTarget.amount)}) on ${formatDate(deleteTarget.date)}?`
            : ''
        }
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeTransaction(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </section>
  )
}
