import './dashboard.css'
import { Header } from './components/Header'
import { ThemeSync } from './components/ThemeSync'
import { SummaryCards } from './components/SummaryCards'
import { BalanceTrend } from './components/BalanceTrend'
import { SpendingBreakdown } from './components/SpendingBreakdown'
import { Insights } from './components/Insights'
import { TransactionsPanel } from './components/TransactionsPanel'
import { Footer } from './components/Footer'
import { useFinanceStore } from './store/useFinanceStore'

function RoleBanner() {
  const role = useFinanceStore((s) => s.role)
  return (
    <p className="dash-role-banner" role="status">
      {role === 'viewer'
        ? 'You are viewing as Viewer — transactions are read-only.'
        : 'You are viewing as Admin — you can add, edit, or delete transactions.'}
    </p>
  )
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <div className="dash-app">
        <Header />
        <RoleBanner />
        <main className="dash-main">
          <SummaryCards />
          <div className="dash-grid dash-grid--charts">
            <BalanceTrend />
            <SpendingBreakdown />
          </div>
          <Insights />
          <TransactionsPanel />
        </main>
        <Footer />
      </div>
    </>
  )
}
