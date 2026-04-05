import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { formatCurrency, formatMonthLabel } from '../../utils/format'
import { useMonthlyBalanceTrend, useSummary } from '../../hooks/useFinanceMetrics'

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]?.payload
  if (!p) return null

  const netTone = p.net >= 0 ? 'good' : 'bad'

  return (
    <div className="dash-chart-tooltip dash-chart-tooltip--balance">
      <strong>{p.labelFull}</strong>
      <span>Start of month: {formatCurrency(p.monthStartBalance)}</span>
      <span>End of month: {formatCurrency(p.balance)}</span>
      <span className={`dash-balance-tooltip__delta dash-balance-tooltip__delta--${netTone}`}>
        Net: {p.net >= 0 ? '+' : '−'}
        {formatCurrency(Math.abs(p.net))}
      </span>
    </div>
  )
}

function useNarrowViewport(breakpointPx = 640) {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`)
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [breakpointPx])
  return narrow
}

export function BalanceTrend() {
  const monthlyRows = useMonthlyBalanceTrend()
  const { balance: ledgerBalance } = useSummary()
  const narrow = useNarrowViewport(640)

  const data = useMemo(() => {
    const take = narrow ? 6 : 12
    const trimmed = monthlyRows.slice(-take)
    return trimmed.map((row) => ({
      ...row,
      label: row.shortLabel,
      labelFull: formatMonthLabel(row.key),
    }))
  }, [monthlyRows, narrow])

  const latestPoint = data[data.length - 1]
  const previousPoint = data[data.length - 2]
  const averageEnd =
    data.reduce((sum, item) => sum + item.balance, 0) / Math.max(data.length, 1)
  const growthPct =
    previousPoint?.balance > 0
      ? ((latestPoint.balance - previousPoint.balance) / previousPoint.balance) * 100
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
          <p className="dash-panel__desc">
            Month start vs end balance
          </p>
        </div>
        <span className="dash-balance__badge">Live Insights</span>
      </header>

      <div className="dash-balance__meta">
        <div className="dash-balance__stat">
          <span>Current balance</span>
          <strong>{formatCurrency(ledgerBalance)}</strong>
        </div>
        <div className="dash-balance__stat">
          <span>Avg. month-end (shown)</span>
          <strong>{formatCurrency(averageEnd)}</strong>
        </div>
        <div className="dash-balance__stat">
          <span>Change</span>
          <strong
            className={
              growthPct !== null && growthPct < 0 ? 'dash-balance__stat-bad' : ''
            }
            title="Month-over-month change in end-of-month balance"
          >
            {growthPct === null
              ? 'N/A'
              : `${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%`}
          </strong>
        </div>
      </div>

      <div className="dash-balance__legend">
        <span className="dash-balance__legend-item">
          <i className="dash-balance__legend-dot dash-balance__legend-dot--projected" />
          Month start
        </span>
        <span className="dash-balance__legend-item">
          <i className="dash-balance__legend-dot dash-balance__legend-dot--actual" />
          Month end
        </span>
      </div>

      <div
        className={`dash-chart-wrap dash-chart-wrap--bars dash-chart-wrap--bars-revamp${narrow ? ' dash-balance-chart--narrow' : ''}`}
      >
        <ResponsiveContainer width="100%" height={narrow ? 304 : 300}>
          <BarChart
            data={data}
            margin={
              narrow
                ? { top: 10, right: 6, left: 4, bottom: 40 }
                : { top: 12, right: 10, left: 2, bottom: 10 }
            }
            barGap={narrow ? 7 : 6}
            barCategoryGap={narrow ? '12%' : '18%'}
          >
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
              tick={{
                fill: 'var(--muted)',
                fontSize: narrow ? 10 : 12,
                fontWeight: 700,
                ...(narrow
                  ? { angle: -28, textAnchor: 'end' }
                  : {}),
              }}
              tickLine={false}
              axisLine={false}
              interval={narrow ? 0 : 'preserveStartEnd'}
              dy={narrow ? 6 : 8}
            />
            <Tooltip content={<TooltipContent />} />
            <Bar
              dataKey="monthStartBalance"
              fill="url(#dashProjectedBar)"
              radius={narrow ? [10, 10, 0, 0] : [9, 9, 0, 0]}
              maxBarSize={narrow ? 28 : 24}
            />
            <Bar
              dataKey="balance"
              fill="url(#dashActualBar)"
              radius={narrow ? [10, 10, 0, 0] : [9, 9, 0, 0]}
              maxBarSize={narrow ? 28 : 24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
