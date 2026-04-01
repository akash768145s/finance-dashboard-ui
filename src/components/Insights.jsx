import { formatCurrency, formatMonthLabel } from '../utils/format'
import { useInsights } from '../hooks/useFinanceMetrics'
import { Lightbulb, Sparkles, TrendingUp } from 'lucide-react'

export function Insights() {
  const ins = useInsights()

  const deltaStr =
    ins.monthDeltaPct == null
      ? 'Not enough months to compare.'
      : `${ins.monthDeltaPct >= 0 ? '+' : ''}${ins.monthDeltaPct.toFixed(1)}% net vs prior month`

  return (
    <section className="dash-section" aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="dash-section__title">
        <Sparkles size={16} />
        Insights
      </h2>
      <ul className="dash-insights">
        <li className="dash-insight">
          <span className="dash-insight__label">
            <Lightbulb size={13} />
            Highest spend category
          </span>
          {ins.topCategory ? (
            <>
              <strong className="dash-insight__value">{ins.topCategory}</strong>
              <span className="dash-insight__meta">
                {formatCurrency(ins.topCategoryAmount)} total expenses
              </span>
            </>
          ) : (
            <span className="dash-insight__meta">No expense data yet.</span>
          )}
        </li>
        <li className="dash-insight">
          <span className="dash-insight__label">
            <TrendingUp size={13} />
            Monthly comparison
          </span>
          {ins.latestMonthKey && ins.previousMonthKey ? (
            <>
              <strong className="dash-insight__value">
                {formatMonthLabel(ins.latestMonthKey)} vs{' '}
                {formatMonthLabel(ins.previousMonthKey)}
              </strong>
              <span className="dash-insight__meta">
                Net {formatCurrency(ins.netThis)} this period ·{' '}
                {formatCurrency(ins.netLast)} prior · {deltaStr}
              </span>
            </>
          ) : (
            <span className="dash-insight__meta">
              Add transactions across two months to unlock comparison.
            </span>
          )}
        </li>
        <li className="dash-insight">
          <span className="dash-insight__label">
            <Sparkles size={13} />
            Observation
          </span>
          <span className="dash-insight__meta">
            {ins.expenseThis > ins.incomeThis
              ? 'Latest month: expenses exceeded income — worth reviewing discretionary categories.'
              : 'Latest month: income covers expenses with positive net — healthy cash flow.'}
          </span>
        </li>
      </ul>
    </section>
  )
}
