import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency, formatMonthLabel } from '../../utils/format'
import { useSpendingByCategoryLatestMonth } from '../../hooks/useFinanceMetrics'

const PIE_COLORS = [
  '#0b3c92',
  '#5ed4a6',
  '#5a6e8d',
  '#cad5f3',
  '#f7b267',
  '#de6e4b',
]

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="dash-chart-tooltip">
      <strong>{name}</strong>
      <span>{formatCurrency(value)}</span>
    </div>
  )
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function SpendingBreakdown() {
  const { monthKey, data } = useSpendingByCategoryLatestMonth()
  const total = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data],
  )

  if (!monthKey || data.length === 0) {
    return (
      <section className="dash-panel" aria-labelledby="spend-heading">
        <h2 id="spend-heading" className="dash-panel__title">Spending by category</h2>
        <p className="dash-empty dash-empty--inline">
          {!monthKey
            ? 'No transactions yet.'
            : 'No spending in the latest month with activity.'}
        </p>
      </section>
    )
  }

  return (
    <section className="dash-panel dash-panel--donut" aria-labelledby="spend-heading">
      <h2 id="spend-heading" className="dash-panel__title">Spending by Category</h2>
      <p className="dash-panel__desc">{formatMonthLabel(monthKey)}</p>
      <div className="dash-chart-wrap dash-chart-wrap--pie-modern">
        <ResponsiveContainer width="100%" height={198} className="dash-donut__chart">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell
                  key={data[i].name}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<TooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="dash-donut__center">
          <span className="dash-donut__value">{formatCompactCurrency(total)}</span>
          <span className="dash-donut__label">TOTAL SPENT</span>
        </div>
      </div>
      <ul className="dash-donut__legend">
        {data.slice(0, 4).map((item, idx) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
          return (
            <li key={item.name} className="dash-donut__legend-item">
              <span className="dash-donut__legend-left">
                <span
                  className="dash-donut__dot"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                {item.name}
              </span>
              <span className="dash-donut__legend-pct">{`${percentage}%`}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
