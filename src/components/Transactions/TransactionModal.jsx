import { useEffect, useId, useState } from 'react'
import { FINANCE_DEMO_SEED } from '../../data/mockData'
import { useFinanceStore } from '../../store/useFinanceStore'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {import('../../data/mockData').Transaction | null} props.editing
 */
export function TransactionModal({ open, onClose, editing }) {
  if (!open) return null

  return (
    <TransactionModalInner
      key={editing?.id ?? 'new'}
      editing={editing}
      onClose={onClose}
    />
  )
}

/**
 * @param {object} props
 * @param {import('../../data/mockData').Transaction | null} props.editing
 * @param {() => void} props.onClose
 */
function TransactionModalInner({ editing, onClose }) {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const updateTransaction = useFinanceStore((s) => s.updateTransaction)
  const titleId = useId()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const [form, setForm] = useState(() =>
    editing
      ? {
          date: editing.date,
          amount: String(editing.amount),
          category: editing.category,
          type: editing.type,
          note: editing.note ?? '',
        }
      : {
          date: new Date().toISOString().slice(0, 10),
          amount: '',
          category: 'Food',
          type: /** @type {'income' | 'expense'} */ ('expense'),
          note: '',
        },
  )

  function submit(e) {
    e.preventDefault()
    const amount = parseFloat(form.amount, 10)
    if (Number.isNaN(amount) || amount <= 0) return

    const payload = {
      date: form.date,
      amount,
      category: form.category,
      type: form.type,
      note: form.note.trim() || undefined,
    }

    if (editing) {
      updateTransaction(editing.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div className="dash-modal-root" role="presentation">
      <button
        type="button"
        className="dash-modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="dash-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="dash-modal__title">
          {editing ? 'Edit transaction' : 'Add transaction'}
        </h2>
        <form onSubmit={submit} className="dash-modal__form">
          <label className="dash-field">
            <span className="dash-field__label">Date</span>
            <input
              className="dash-input"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
          <label className="dash-field">
            <span className="dash-field__label">Amount (USD)</span>
            <input
              className="dash-input"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </label>
          <label className="dash-field">
            <span className="dash-field__label">Type</span>
            <select
              className="dash-select"
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: /** @type {'income' | 'expense'} */ (e.target.value),
                }))
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label className="dash-field">
            <span className="dash-field__label">Category</span>
            <select
              className="dash-select"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {FINANCE_DEMO_SEED.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="dash-field">
            <span className="dash-field__label">Note (optional)</span>
            <input
              className="dash-input"
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="e.g. Coffee subscription"
            />
          </label>
          <div className="dash-modal__actions">
            <button type="button" className="dash-btn dash-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dash-btn dash-btn--primary">
              {editing ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
