import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinanceStore } from '../../store/useFinanceStore'
import {
  formatCurrency,
  formatDate,
  formatShortDate,
  transactionDescription,
} from '../../utils/format'
import { CategoryIcon } from './CategoryIcon'

export function RecentTransactions() {
  const transactions = useFinanceStore((s) => s.transactions)

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 3)
  }, [transactions])

  return (
    <section className="dash-recent" aria-labelledby="recent-transactions-heading">
      <div className="dash-recent__head">
        <h2 id="recent-transactions-heading" className="dash-recent__title">
          Recent Transactions
        </h2>
        <Link to="/transactions" className="dash-recent__view-all">
          View All
        </Link>
      </div>

      <ul className="dash-recent__list">
        {recent.map((tx) => {
          const typeLabel = tx.type === 'income' ? 'Income' : 'Expense'
          return (
            <li
              key={tx.id}
              className={
                tx.type === 'income'
                  ? 'dash-recent__item dash-recent__item--income'
                  : 'dash-recent__item dash-recent__item--expense'
              }
            >
              <span
                className={
                  tx.type === 'income'
                    ? 'dash-recent__icon-wrap dash-recent__icon-wrap--income'
                    : 'dash-recent__icon-wrap dash-recent__icon-wrap--expense'
                }
                aria-hidden="true"
              >
                <CategoryIcon category={tx.category} size={18} />
              </span>

              <div className="dash-recent__body">
                <div className="dash-recent__name-row">
                  <p className="dash-recent__name">{transactionDescription(tx)}</p>
                  <span
                    className={
                      tx.type === 'income'
                        ? 'dash-recent__type-pill dash-recent__type-pill--income'
                        : 'dash-recent__type-pill dash-recent__type-pill--expense'
                    }
                  >
                    {typeLabel}
                  </span>
                </div>
                <p className="dash-recent__meta">
                  <span className="dash-recent__meta-cat">{tx.category}</span>
                  <span className="dash-recent__meta-dot" aria-hidden />
                  <span
                    className="dash-recent__meta-date"
                    title={formatDate(tx.date)}
                  >
                    {formatShortDate(tx.date)}
                  </span>
                </p>
              </div>

              <p
                className={
                  tx.type === 'income'
                    ? 'dash-recent__amount dash-recent__amount--income'
                    : 'dash-recent__amount dash-recent__amount--expense'
                }
              >
                {tx.type === 'income' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </p>
            </li>
          )
        })}
      </ul>

      {recent.length === 0 && (
        <div className="dash-empty dash-empty--inline">
          <p>No transactions yet.</p>
          <Link to="/transactions" className="dash-recent__view-all">
            Go to transactions
          </Link>
        </div>
      )}
    </section>
  )
}
