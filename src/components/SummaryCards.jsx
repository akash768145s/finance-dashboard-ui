import { formatCurrency } from '../utils/format'
import { useSummary } from '../hooks/useFinanceMetrics'
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'

export function SummaryCards() {
  const { balance, income, expenses } = useSummary()

  return (
    <section className="dash-section" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="dash-section__title">
        <Wallet size={16} />
        Overview
      </h2>
      <div className="dash-cards">
        <article className="dash-card dash-card--balance">
          <span className="dash-card__label">
            <Wallet size={13} />
            Total balance
          </span>
          <p className="dash-card__value">{formatCurrency(balance)}</p>
          <span className="dash-card__hint">After all recorded activity</span>
        </article>
        <article className="dash-card dash-card--income">
          <span className="dash-card__label">
            <ArrowUpCircle size={13} />
            Income
          </span>
          <p className="dash-card__value dash-card__value--income">
            {formatCurrency(income)}
          </p>
          <span className="dash-card__hint">Lifetime inflows</span>
        </article>
        <article className="dash-card dash-card--expense">
          <span className="dash-card__label">
            <ArrowDownCircle size={13} />
            Expenses
          </span>
          <p className="dash-card__value dash-card__value--expense">
            {formatCurrency(expenses)}
          </p>
          <span className="dash-card__hint">Lifetime outflows</span>
        </article>
      </div>
    </section>
  )
}
