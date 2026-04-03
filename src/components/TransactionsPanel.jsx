import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useFinanceStore } from '../store/useFinanceStore'
import { useFilteredTransactions } from '../hooks/useFinanceMetrics'
import { formatCurrency, formatDate, transactionDescription } from '../utils/format'
import { TransactionModal } from './TransactionModal'
import { ConfirmDialog } from './ConfirmDialog'
import { CategoryIcon } from './CategoryIcon'
import { CategoryFilterDropdown } from './CategoryFilterDropdown'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  SquarePen,
  Trash2,
} from 'lucide-react'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function exportCsv(rows) {
  const header = ['date', 'description', 'category', 'type', 'amount']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.date,
        JSON.stringify(transactionDescription(r)),
        JSON.stringify(r.category),
        r.type,
        r.amount,
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
    /** @type {null | import('../data/mockData').Transaction} */(null),
  )
  const [deleteTarget, setDeleteTarget] = useState(
    /** @type {null | import('../data/mockData').Transaction} */(null),
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportMenuRef = useRef(/** @type {HTMLDivElement | null} */(null))
  const pageSizeId = useId()

  const sortOptions = useMemo(
    () => [
      { value: 'date', label: 'Date' },
      { value: 'amount', label: 'Amount' },
      { value: 'category', label: 'Category' },
    ],
    [],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filterCategory, filterType, sortBy, sortDir])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    if (!exportMenuOpen) return
    const onDoc = (e) => {
      const el = exportMenuRef.current
      if (!el || !(e.target instanceof Node)) return
      if (!el.contains(e.target)) setExportMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setExportMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [exportMenuOpen])

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
          <div className="dash-export" ref={exportMenuRef}>
            <button
              type="button"
              className="dash-btn dash-btn--ghost"
              aria-expanded={exportMenuOpen}
              aria-haspopup="menu"
              onClick={() => setExportMenuOpen((o) => !o)}
            >
              <Download size={15} />
              Export
            </button>
            {exportMenuOpen && (
              <div className="dash-export__menu" role="menu" aria-label="Export format">
                <button
                  type="button"
                  className="dash-export__item"
                  role="menuitem"
                  onClick={() => {
                    exportCsv(filtered)
                    setExportMenuOpen(false)
                  }}
                >
                  <Download size={15} aria-hidden />
                  Download CSV
                </button>
                <button
                  type="button"
                  className="dash-export__item"
                  role="menuitem"
                  onClick={() => {
                    exportJson(filtered)
                    setExportMenuOpen(false)
                  }}
                >
                  <FileJson size={15} aria-hidden />
                  Download JSON
                </button>
              </div>
            )}
          </div>
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
        <CategoryFilterDropdown
          value={filterCategory}
          onChange={setFilterCategory}
        />
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
            aria-label="Sort transactions by"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
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
          <>
            <div className="dash-table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col">Type</th>
                    <th scope="col">Amount</th>
                    {isAdmin && <th scope="col">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((t) => (
                    <tr key={t.id}>
                      <td>{formatDate(t.date)}</td>
                      <td className="dash-table__note">
                        {transactionDescription(t)}
                      </td>
                      <td>
                        <span className="dash-table__category">
                          <CategoryIcon category={t.category} size={16} />
                          {t.category}
                        </span>
                      </td>
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
            </div>
            <footer className="dash-pagination" aria-label="Table pagination">
              <p className="dash-pagination__range">
                Showing{' '}
                <strong>
                  {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}
                </strong>{' '}
                of <strong>{filtered.length}</strong> results
              </p>
              <div className="dash-pagination__actions">
                <label className="dash-pagination__rpp" htmlFor={pageSizeId}>
                  <span className="dash-pagination__rpp-label">Rows per page</span>
                  <select
                    id={pageSizeId}
                    className="dash-pagination__rpp-select"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPage(1)
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="dash-pagination__nav" role="group" aria-label="Page navigation">
                  <button
                    type="button"
                    className="dash-pagination__nav-btn dash-pagination__nav-btn--icon"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
                  </button>
                  <span className="dash-pagination__status" aria-live="polite">
                    <span className="dash-pagination__status-part">Page</span>
                    <span className="dash-pagination__status-curr">{page}</span>
                    <span className="dash-pagination__status-part">
                      of {totalPages}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="dash-pagination__nav-btn dash-pagination__nav-btn--icon"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
                  </button>
                </div>
              </div>
            </footer>
          </>
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
