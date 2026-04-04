import { formatCurrency } from '../../utils/format'
import { useInsights, useSummary } from '../../hooks/useFinanceMetrics'
import {
  ArrowDown,
  ArrowUp,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react'

export function SummaryCards() {
  const { balance, income, expenses } = useSummary()
  const {
    incomeThis,
    expenseThis,
    incomeLast,
    expenseLast,
    netThis,
    monthDeltaPct,
  } = useInsights()
  const netCash = income - expenses
  const savingsRateThisMonth =
    incomeThis > 0 ? (netThis / incomeThis) * 100 : null
  const incomePct =
    incomeLast > 0 ? ((incomeThis - incomeLast) / incomeLast) * 100 : null
  const expensePct =
    expenseLast > 0 ? ((expenseThis - expenseLast) / expenseLast) * 100 : null

  const buildTrend = (pct, kind) => {
    if (pct === null) {
      return {
        text: 'No previous month data',
        isUp: true,
        tone: 'neutral',
      }
    }

    const isUp = pct >= 0
    const pctText = `${Math.abs(pct).toFixed(1)}% from last month`
    const tone =
      kind === 'income' ? (isUp ? 'good' : 'bad') : isUp ? 'bad' : 'good'

    return { text: pctText, isUp, tone }
  }

  const incomeTrend = buildTrend(incomePct, 'income')
  const expenseTrend = buildTrend(expensePct, 'expense')
  const netTrend = buildTrend(monthDeltaPct, 'income')

  return (
    <section className="dash-overview" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="dash-overview__title">
        Financial Overview
      </h2>
      <div className="dash-overview__cards">
        <article className="dash-overview-card dash-overview-card--networth">
          <div className="dash-overview-card__head">
            <span className="dash-overview-card__label dash-overview-card__label--caps dash-overview-card__label--networth">
              Available Funds
            </span>
            <span className="dash-overview-card__icon dash-overview-card__icon--networth">
              <Landmark size={22} />
            </span>
          </div>
          <p className="dash-overview-card__value">{formatCurrency(balance)}</p>
          <span className="dash-overview-card__pill">
            <TrendingUp size={13} />
            {savingsRateThisMonth != null
              ? `${savingsRateThisMonth >= 0 ? '+' : ''}${savingsRateThisMonth.toFixed(1)}% of income (this month)`
              : 'Add this month’s data for savings rate'}
          </span>
        </article>
        <article className="dash-overview-card dash-overview-card--metric">
          <div className="dash-overview-card__head">
            <span className="dash-overview-card__label dash-overview-card__label--caps">
              Total Income
            </span>
            <span className="dash-overview-card__icon dash-overview-card__icon--income">
              <ArrowDown size={16} />
            </span>
          </div>
          <p className="dash-overview-card__value dash-overview-card__value--income">
            +{formatCurrency(income)}
          </p>
          <p
            className={`dash-overview-card__delta dash-overview-card__delta--${incomeTrend.tone}`}
          >
            {incomePct !== null && (
              <span className="dash-overview-card__delta-icon">
                <ArrowUp size={15} strokeWidth={2.8} />
              </span>
            )}
            {incomeTrend.text}
          </p>
        </article>
        <article className="dash-overview-card dash-overview-card--metric">
          <div className="dash-overview-card__head">
            <span className="dash-overview-card__label dash-overview-card__label--caps">
              Total Expenses
            </span>
            <span className="dash-overview-card__icon dash-overview-card__icon--expense">
              <ArrowUp size={16} />
            </span>
          </div>
          <p className="dash-overview-card__value dash-overview-card__value--expense">
            -{formatCurrency(expenses)}
          </p>
          <p
            className={`dash-overview-card__delta dash-overview-card__delta--${expenseTrend.tone}`}
          >
            {expensePct !== null && (
              <span className="dash-overview-card__delta-icon">
                <ArrowDown size={15} strokeWidth={2.8} />
              </span>
            )}
            {expenseTrend.text}
          </p>
        </article>
        <article className="dash-overview-card dash-overview-card--metric">
          <div className="dash-overview-card__head">
            <span className="dash-overview-card__label dash-overview-card__label--caps">
              Net Cash Flow
            </span>
            <span className="dash-overview-card__icon dash-overview-card__icon--net">
              <Wallet size={16} />
            </span>
          </div>
          <p
            className={
              netCash >= 0
                ? 'dash-overview-card__value dash-overview-card__value--income'
                : 'dash-overview-card__value dash-overview-card__value--expense'
            }
          >
            {netCash >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(netCash))}
          </p>
          <p
            className={`dash-overview-card__delta dash-overview-card__delta--${netTrend.tone}`}
          >
            {monthDeltaPct !== null && (
              <span className="dash-overview-card__delta-icon">
                {netTrend.tone === 'bad' ? (
                  <ArrowDown size={15} strokeWidth={2.8} />
                ) : (
                  <ArrowUp size={15} strokeWidth={2.8} />
                )}
              </span>
            )}
            {netTrend.text}
          </p>
        </article>
      </div>
    </section>
  )
}
