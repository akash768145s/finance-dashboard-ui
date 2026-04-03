import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { formatCurrency } from '../utils/format'
import { useBalanceTrendPoints } from '../hooks/useFinanceMetrics'

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]?.payload
  if (!p) return null

  const delta = p.value - p.baseline
  const deltaTone = delta >= 0 ? 'good' : 'bad'

  return (
    <div className="dash-chart-tooltip dash-chart-tooltip--balance">
      <strong>{p.label}</strong>
      <span>Projected: {formatCurrency(p.baseline)}</span>
      <span>Actual: {formatCurrency(p.value)}</span>
      <span className={`dash-balance-tooltip__delta dash-balance-tooltip__delta--${deltaTone}`}>
        Variance: {delta >= 0 ? '+' : '-'}
        {formatCurrency(Math.abs(delta))}
      </span>
    </div>
  )
}

export function BalanceTrend() {
  const points = useBalanceTrendPoints()
  const data = useMemo(() => {
    const trimmed = points.slice(-12)
    return trimmed.map((point, index) => {
      const month = new Date(`${point.date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
      })
      const max = Math.max(...trimmed.map((p) => p.balance), 1)
      const baseline = Math.max(point.balance * 1.12, max * 0.35)
      const labelIndex = String(index + 1).padStart(2, '0')

      return {
        month: month.toUpperCase(),
        baseline,
        value: point.balance,
        label: `${month.toUpperCase()} ${labelIndex}`,
      }
    })
  }, [points])

  const latestPoint = data[data.length - 1]
  const previousPoint = data[data.length - 2]
  const averageActual =
    data.reduce((sum, item) => sum + item.value, 0) / Math.max(data.length, 1)
  const growthPct =
    previousPoint?.value > 0
      ? ((latestPoint.value - previousPoint.value) / previousPoint.value) * 100
      : null

  if (data.length === 0) {
    return (
      <section className="dash-panel dash-panel--balance" aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="dash-panel__title">Balance Trend</h2>
        <p className="dash-empty dash-empty--inline">No data to chart yet.</p>
      </section>
    )
  }

  return (
    <section className="dash-panel dash-panel--balance dash-balance" aria-labelledby="trend-heading">
      <header className="dash-panel__head">
        <div>
          <h2 id="trend-heading" className="dash-panel__title">Balance Trend</h2>
          <p className="dash-panel__desc">Projected vs actual movement over recent periods</p>
        </div>
        <span className="dash-balance__badge">Live Insights</span>
      </header>

      <div className="dash-balance__meta">
        <div className="dash-balance__stat">
          <span>Latest Balance</span>
          <strong>{formatCurrency(latestPoint.value)}</strong>
        </div>
        <div className="dash-balance__stat">
          <span>Average</span>
          <strong>{formatCurrency(averageActual)}</strong>
        </div>
        <div className="dash-balance__stat">
          <span>Change</span>
          <strong className={growthPct !== null && growthPct < 0 ? 'dash-balance__stat-bad' : ''}>
            {growthPct === null ? 'N/A' : `${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%`}
          </strong>
        </div>
      </div>

      <div className="dash-balance__legend">
        <span className="dash-balance__legend-item">
          <i className="dash-balance__legend-dot dash-balance__legend-dot--projected" />
          Projected
        </span>
        <span className="dash-balance__legend-item">
          <i className="dash-balance__legend-dot dash-balance__legend-dot--actual" />
          Actual
        </span>
      </div>

      <div className="dash-chart-wrap dash-chart-wrap--bars dash-chart-wrap--bars-revamp">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 12, right: 10, left: 2, bottom: 10 }} barGap={6}>
            <defs>
              <linearGradient id="dashProjectedBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8edf6" />
                <stop offset="100%" stopColor="#cfd7e7" />
              </linearGradient>
              <linearGradient id="dashActualBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2f6de5" />
                <stop offset="100%" stopColor="#0f3f9f" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(123, 143, 178, 0.22)" strokeDasharray="4 5" />
            <XAxis
              dataKey="label"
              stroke="transparent"
              tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <Tooltip content={<TooltipContent />} />
            <Bar
              dataKey="baseline"
              fill="url(#dashProjectedBar)"
              radius={[9, 9, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="value"
              fill="url(#dashActualBar)"
              radius={[9, 9, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
