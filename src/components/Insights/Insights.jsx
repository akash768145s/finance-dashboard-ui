import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../../utils/format'
import { useInsights } from '../../hooks/useFinanceMetrics'
import { useFinanceStore } from '../../store/useFinanceStore'
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  HeartPulse,
  Minus,
  PieChart,
  Wallet,
} from 'lucide-react'

/** Lucide arrows for spend delta (matches 15×15 / stroke 2.8 spec for ↑) */
function ExpenseDeltaArrow({ delta }) {
  if (delta == null) return null
  const iconProps = {
    className: 'insh-delta-icon',
    size: 15,
    strokeWidth: 2.8,
    'aria-hidden': true,
  }
  if (delta < 0) return <ArrowDown {...iconProps} />
  if (delta > 0) return <ArrowUp {...iconProps} />
  return <Minus {...iconProps} />
}

function PanelHead({ icon: Icon, label }) {
  return (
    <div className="insh-panel__head">
      <span className="insh-panel__glyph" aria-hidden>
        <Icon size={18} strokeWidth={2} />
      </span>
      <p className="insh-panel__label">{label}</p>
    </div>
  )
}

function SpendingDonut({ pct, stopHigh, stopLow }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `insh-donut-${uid}`
  const cx = 54
  const cy = 54
  const r = 44
  const sw = 10
  const c = 2 * Math.PI * r
  const p = Math.min(100, Math.max(0, Number(pct) || 0))
  const arcLen = (p / 100) * c

  return (
    <div
      className="insh-donut"
      role="img"
      aria-label={`${p} percent in top category`}
    >
      <svg
        className="insh-donut__svg"
        viewBox="0 0 108 108"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={stopHigh} />
            <stop offset="100%" stopColor={stopLow} />
          </linearGradient>
        </defs>
        <circle
          className="insh-donut__track"
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          strokeWidth={sw}
        />
        {p > 0 ? (
          <circle
            className="insh-donut__arc"
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${c}`}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ) : null}
      </svg>
      <div className="insh-donut__center">
        <span className="insh-donut__pct tabular-nums">{p}%</span>
        <span className="insh-donut__pct-sub">Top category</span>
      </div>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

function AnimatedCurrency({ value, reducedMotion, duration = 1000 }) {
  const [v, setV] = useState(reducedMotion ? value : 0)
  useEffect(() => {
    if (reducedMotion) {
      setV(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setV(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, reducedMotion])
  const cents = Math.round(v * 100) / 100
  return formatCurrency(cents)
}

function heroMicrocopy(expenseDelta, expenseLast) {
  if (expenseDelta == null || expenseLast == null)
    return 'Add a prior month to benchmark this period.'
  const rel =
    expenseLast > 0 ? Math.abs(expenseDelta) / expenseLast : Math.abs(expenseDelta) > 0
  if (expenseDelta < 0 && rel > 0.2)
    return 'You spent less than last month — strong control.'
  if (expenseDelta < 0)
    return 'Spending eased versus last month — room to compound savings.'
  if (expenseDelta > 0 && rel > 0.2)
    return 'Spending rose — a good moment to see what moved.'
  return 'Steady versus last month — predictable rhythm.'
}

function comparisonMicrocopy(expenseDelta, expenseLast) {
  if (expenseDelta == null || expenseLast == null) return ''
  const rel =
    expenseLast > 0 ? Math.abs(expenseDelta) / expenseLast : Math.abs(expenseDelta) > 0
  if (expenseDelta < 0 && rel > 0.25)
    return 'Your spending dropped sharply — positive shift.'
  if (expenseDelta < 0)
    return 'You’re trending down — momentum is on your side.'
  if (expenseDelta > 0 && rel > 0.25)
    return 'This month ran hotter — worth a quick category pass.'
  return 'Roughly flat month to month.'
}

function healthMicrocopy(netThis, savingsRatePct) {
  if (savingsRatePct != null && savingsRatePct >= 50 && netThis >= 0)
    return 'You are saving most of your income — keep this momentum.'
  if (netThis >= 0 && savingsRatePct != null && savingsRatePct >= 25)
    return 'Solid cushion after spending — keep steering intentionally.'
  if (netThis >= 0)
    return 'Cash flow is positive — protect the gap you’ve opened.'
  return 'Outflow exceeded income — small cuts compound fast here.'
}

function spendingMicrocopy(category) {
  return `You mostly spent on ${category} this month.`
}

function patternWord(pattern) {
  if (pattern === 'uneven') return 'Uneven'
  if (pattern === 'even') return 'Steady'
  return 'Unclear'
}

/**
 * Running balance after all transactions on or before the last day of `yearMonth`.
 * @param {number} openingBalance
 * @param {import('../../data/mockData').Transaction[]} transactions
 * @param {string} yearMonth
 */
function balanceAtEndOfMonth(openingBalance, transactions, yearMonth) {
  const [y, mo] = yearMonth.split('-').map(Number)
  const lastDay = new Date(y, mo, 0).getDate()
  const endStr = `${y}-${String(mo).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  let running = openingBalance
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  for (const t of sorted) {
    if (t.date > endStr) break
    running += t.type === 'income' ? t.amount : -t.amount
  }
  return running
}

function SpendingBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div className="insh-chart-tooltip" role="tooltip">
      <p className="insh-chart-tooltip__month">{row.shortLabel}</p>
      <dl className="insh-chart-tooltip__dl">
        <div className="insh-chart-tooltip__pair">
          <dt>Spending</dt>
          <dd className="tabular-nums">{formatCurrency(row.expense)}</dd>
        </div>
        <div className="insh-chart-tooltip__pair">
          <dt>Balance</dt>
          <dd className="tabular-nums">{formatCurrency(row.endingBalance)}</dd>
        </div>
      </dl>
    </div>
  )
}

export function Insights() {
  const ins = useInsights()
  const theme = useFinanceStore((s) => s.theme)
  const openingBalance = useFinanceStore((s) => s.openingBalance)
  const transactions = useFinanceStore((s) => s.transactions)
  const reducedMotion = usePrefersReducedMotion()
  const barGradId = `insh-bar-${useId().replace(/:/g, '')}`

  const heroReveal = useReveal()
  const spendReveal = useReveal()
  const compareReveal = useReveal()
  const healthReveal = useReveal()

  const pctRounded =
    ins.topCategoryPctOfMonth != null
      ? Math.round(ins.topCategoryPctOfMonth)
      : null

  const expenseDeltaAbs =
    ins.expenseDelta != null ? Math.abs(ins.expenseDelta) : null

  const savingsRateRounded =
    ins.savingsRatePct != null ? Math.round(ins.savingsRatePct) : null

  const compareLine = comparisonMicrocopy(ins.expenseDelta, ins.expenseLast)

  const savingsTone =
    ins.savingsStatus === 'Strong'
      ? 'pos'
      : ins.savingsStatus === 'Strained'
        ? 'neg'
        : 'neutral'

  const hasSpendSplit =
    ins.topCategory &&
    ins.expenseThis > 0 &&
    pctRounded != null

  const barHiStops = useMemo(
    () =>
      theme === 'dark'
        ? { a: '#c4b5fd', b: '#7c3aed' }
        : { a: '#a5b4fc', b: '#4f46e5' },
    [theme],
  )

  const spendingChartData = useMemo(() => {
    const bars = ins.monthlyExpenseBars
    if (!bars.length) return []
    return bars.map((b) => ({
      ...b,
      endingBalance: balanceAtEndOfMonth(openingBalance, transactions, b.key),
    }))
  }, [ins.monthlyExpenseBars, openingBalance, transactions])

  return (
    <div className="insh">
      <header className="insh__masthead">
        <p className="insh__eyebrow">Financial insights</p>
        <h2 id="fi-page-title" className="insh__title">
          What your money is telling you
        </h2>
      </header>

      <div className="insh__grid">
        <article
          ref={heroReveal.ref}
          className={`insh-panel insh-panel--hero insh-reveal ${heroReveal.visible ? 'insh-reveal--on' : ''}`}
          style={{ '--insh-reveal-delay': '0ms' }}
        >
          {ins.latestMonthKey ? (
            <>
              <PanelHead
                icon={Wallet}
                label="Money left after spending"
              />
              <div className="insh-hero__body">
                <div className="insh-hero__primary">
                  <p
                    className={`insh-hero__figure ${ins.netThis >= 0 ? 'insh-hero__figure--pos' : 'insh-hero__figure--neg'}`}
                  >
                    <span className="insh-hero__sign">
                      {ins.netThis >= 0 ? '+' : '−'}
                    </span>
                    <AnimatedCurrency
                      value={Math.abs(ins.netThis)}
                      reducedMotion={reducedMotion}
                      duration={1000}
                    />
                  </p>
                  <p className="insh-hero__hint">
                    Net after income and spending this month
                  </p>
                </div>
                <div className="insh-hero__stats">
                  <div className="insh-stat">
                    <span className="insh-stat__k">Total spending</span>
                    <span className="insh-stat__v tabular-nums">
                      <AnimatedCurrency
                        value={ins.expenseThis}
                        reducedMotion={reducedMotion}
                        duration={800}
                      />
                    </span>
                  </div>
                  {ins.previousMonthKey != null && ins.expenseDelta != null ? (
                    <div
                      className={`insh-stat ${ins.expenseDelta > 0 ? 'insh-stat--callout' : ''}`}
                    >
                      <span className="insh-stat__k">Vs last month</span>
                      <span
                        className={`insh-stat__v tabular-nums insh-stat__v--delta ${ins.expenseDelta <= 0 ? 'insh-stat__v--good' : 'insh-stat__v--warn'}`}
                      >
                        <ExpenseDeltaArrow delta={ins.expenseDelta} />
                        <AnimatedCurrency
                          value={expenseDeltaAbs ?? 0}
                          reducedMotion={reducedMotion}
                          duration={850}
                        />
                      </span>
                    </div>
                  ) : (
                    <div className="insh-stat insh-stat--ghost">
                      <span className="insh-stat__k">Vs last month</span>
                      <span className="insh-stat__v insh-stat__v--muted">—</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="insh-panel__insight insh-panel__insight--flow">
                {heroMicrocopy(ins.expenseDelta, ins.expenseLast)}
              </p>
            </>
          ) : (
            <>
              <PanelHead icon={Wallet} label="Money left after spending" />
              <p className="insh-panel__empty">
                Add transactions to unlock your summary.
              </p>
            </>
          )}
        </article>

        <article
          ref={spendReveal.ref}
          className={`insh-panel insh-panel--spend insh-reveal ${spendReveal.visible ? 'insh-reveal--on' : ''}`}
          style={{ '--insh-reveal-delay': '50ms' }}
        >
          <PanelHead icon={PieChart} label="Where it went" />
          {hasSpendSplit ? (
            <>
              <div className="insh-spend">
                <div className="insh-spend__visual">
                  <SpendingDonut
                    pct={pctRounded}
                    stopHigh={barHiStops.a}
                    stopLow={barHiStops.b}
                  />
                </div>
                <ul className="insh-spend__list">
                  <li className="insh-spend__item insh-spend__item--lead">
                    <span className="insh-spend__dot insh-spend__dot--lead" />
                    <div>
                      <span className="insh-spend__name">{ins.topCategory}</span>
                      <span className="insh-spend__val tabular-nums">
                        {formatCurrency(ins.topCategoryAmount)}
                        <span className="insh-spend__pct-tag">
                          {' '}
                          ({pctRounded}%)
                        </span>
                      </span>
                    </div>
                  </li>
                  {ins.otherCategoriesSpend > 0 ? (
                    <li className="insh-spend__item">
                      <span className="insh-spend__dot insh-spend__dot--rest" />
                      <div>
                        <span className="insh-spend__name">Others</span>
                        <span className="insh-spend__val tabular-nums">
                          {formatCurrency(ins.otherCategoriesSpend)}
                        </span>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
              <p className="insh-panel__insight insh-panel__insight--data">
                {spendingMicrocopy(ins.topCategory)}
              </p>
            </>
          ) : (
            <p className="insh-panel__empty">
              No spending this month — your split appears here.
            </p>
          )}
        </article>

        <article
          ref={compareReveal.ref}
          className={`insh-panel insh-panel--chart insh-reveal ${compareReveal.visible ? 'insh-reveal--on' : ''}`}
          style={{ '--insh-reveal-delay': '90ms' }}
        >
          <PanelHead icon={BarChart3} label="Spending over time" />
          {ins.monthlyExpenseBars.length > 0 ? (
            <>
              <div className="insh-chart insh-chart--well">
                <ResponsiveContainer width="100%" height={196}>
                  <BarChart
                    data={spendingChartData}
                    margin={{ top: 14, right: 8, left: 0, bottom: 4 }}
                    barCategoryGap="28%"
                  >
                    <defs>
                      <linearGradient
                        id={barGradId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={barHiStops.a} />
                        <stop offset="100%" stopColor={barHiStops.b} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="shortLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: 'var(--insh-muted)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      dy={10}
                    />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip
                      content={<SpendingBarTooltip />}
                      cursor={{
                        fill: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                      }}
                    />
                    <Bar
                      dataKey="expense"
                      radius={[11, 11, 5, 5]}
                      maxBarSize={36}
                      isAnimationActive={!reducedMotion}
                      animationDuration={reducedMotion ? 0 : 1100}
                      animationEasing="cubic-bezier(0.22, 1, 0.36, 1)"
                    >
                      {spendingChartData.map((d) => (
                        <Cell
                          key={d.key}
                          fill={`url(#${barGradId})`}
                          fillOpacity={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {ins.previousMonthKey != null ? (
                <dl className="insh-fig-rows">
                  <div className="insh-fig-rows__row">
                    <dt>This month</dt>
                    <dd className="tabular-nums">
                      {formatCurrency(ins.expenseThis)}
                    </dd>
                  </div>
                  <div className="insh-fig-rows__row">
                    <dt>Last month</dt>
                    <dd className="tabular-nums">
                      {formatCurrency(ins.expenseLast)}
                    </dd>
                  </div>
                  <div className="insh-fig-rows__row insh-fig-rows__row--emph">
                    <dt>Difference</dt>
                    <dd
                      className={`tabular-nums insh-fig-rows__dd--delta ${ins.expenseDelta != null && ins.expenseDelta <= 0 ? 'insh-fig-rows__dd--down' : 'insh-fig-rows__dd--up'}`}
                    >
                      {ins.expenseDelta != null ? (
                        <>
                          <ExpenseDeltaArrow delta={ins.expenseDelta} />
                          {formatCurrency(expenseDeltaAbs ?? 0)}
                        </>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>
                </dl>
              ) : null}
              {compareLine ? (
                <p className="insh-panel__insight insh-panel__insight--data">
                  {compareLine}
                </p>
              ) : null}
            </>
          ) : (
            <p className="insh-panel__empty">Timeline needs more months.</p>
          )}
        </article>

        <article
          ref={healthReveal.ref}
          className={`insh-panel insh-panel--health insh-reveal ${healthReveal.visible ? 'insh-reveal--on' : ''}`}
          style={{ '--insh-reveal-delay': '130ms' }}
        >
          <PanelHead icon={HeartPulse} label="Financial health" />
          {ins.latestMonthKey ? (
            <>
              <dl className="insh-fig-rows">
                <div
                  className={`insh-fig-rows__row insh-fig-rows__row--tone-${savingsTone}`}
                >
                  <dt>Savings status</dt>
                  <dd
                    className={`insh-fig-rows__status insh-fig-rows__status--${savingsTone}`}
                  >
                    {ins.savingsStatus}
                  </dd>
                </div>
                <div className="insh-fig-rows__row">
                  <dt>Consistency</dt>
                  <dd className="tabular-nums">
                    {ins.positiveMonthsStreak} positive month
                    {ins.positiveMonthsStreak !== 1 ? 's' : ''}
                  </dd>
                </div>
                <div className="insh-fig-rows__row">
                  <dt>Spending pattern</dt>
                  <dd>{patternWord(ins.spendingPattern)}</dd>
                </div>
                <div className="insh-fig-rows__row insh-fig-rows__row--emph">
                  <dt>Savings rate</dt>
                  <dd className="tabular-nums insh-fig-rows__rate">
                    {savingsRateRounded != null ? `${savingsRateRounded}%` : '—'}
                  </dd>
                </div>
              </dl>
              <p className="insh-panel__insight insh-panel__insight--flow">
                {healthMicrocopy(ins.netThis, ins.savingsRatePct)}
              </p>
            </>
          ) : (
            <p className="insh-panel__empty">
              Add activity to see health signals.
            </p>
          )}
        </article>
      </div>
    </div>
  )
}
