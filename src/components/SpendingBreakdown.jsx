import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency } from '../utils/format'
import { useSpendingByCategory } from '../hooks/useFinanceMetrics'
import { PieChartIcon } from 'lucide-react'

const PIE_COLORS = [
  '#0d9488',
  '#e11d48',
  '#7c3aed',
  '#ea580c',
  '#2563eb',
  '#ca8a04',
  '#059669',
  '#db2777',
  '#64748b',
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

export function SpendingBreakdown() {
  const data = useSpendingByCategory()
  const total = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data],
  )

  if (data.length === 0) {
    return (
      <section className="dash-panel" aria-labelledby="spend-heading">
        <h2 id="spend-heading" className="dash-panel__title">
          <PieChartIcon size={16} />
          Spending by category
        </h2>
        <p className="dash-empty dash-empty--inline">
          No expense transactions yet.
        </p>
      </section>
    )
  }

  return (
    <section className="dash-panel" aria-labelledby="spend-heading">
      <h2 id="spend-heading" className="dash-panel__title">
        <PieChartIcon size={16} />
        Spending by category
      </h2>
      <p className="dash-panel__desc">
        Share of total expenses · {formatCurrency(total)} overall
      </p>
      <div className="dash-chart-wrap dash-chart-wrap--pie">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
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
            <Legend
              verticalAlign="bottom"
              formatter={(value) => (
                <span className="dash-legend-label">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
