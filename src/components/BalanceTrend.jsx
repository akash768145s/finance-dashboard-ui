import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatDate, formatShortDate } from '../utils/format'
import { useBalanceTrendPoints } from '../hooks/useFinanceMetrics'
import { TrendingUp } from 'lucide-react'

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="dash-chart-tooltip">
      <strong>{formatDate(p.date)}</strong>
      <span>
        {p.type === 'income' ? 'Income' : 'Expense'} · {p.category}
      </span>
      <span>{formatCurrency(p.balance)}</span>
    </div>
  )
}

export function BalanceTrend() {
  const points = useBalanceTrendPoints()

  if (points.length === 0) {
    return (
      <section className="dash-panel" aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="dash-panel__title">
          <TrendingUp size={16} />
          Balance trend
        </h2>
        <p className="dash-empty dash-empty--inline">No data to chart yet.</p>
      </section>
    )
  }

  return (
    <section className="dash-panel" aria-labelledby="trend-heading">
      <h2 id="trend-heading" className="dash-panel__title">
        <TrendingUp size={16} />
        Balance trend
      </h2>
      <p className="dash-panel__desc">
        Running balance after each transaction (naturally moves up and down).
      </p>
      <div className="dash-chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-line)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-line)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(iso) => formatShortDate(iso)}
              stroke="var(--chart-axis)"
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              tickLine={false}
              minTickGap={22}
            />
            <YAxis
              tickFormatter={(v) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
              }
              stroke="var(--chart-axis)"
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<TooltipContent />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--chart-line)"
              strokeWidth={2}
              fill="url(#balFill)"
              dot={{ r: 3, fill: 'var(--chart-line)' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
