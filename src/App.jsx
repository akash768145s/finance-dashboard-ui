import './dashboard.css'
import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  CircleHelp,
  LayoutGrid,
  LineChart,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
  WalletCards,
} from 'lucide-react'
import { Header } from './components/Header'
import { ThemeSync } from './components/ThemeSync'
import { SummaryCards } from './components/SummaryCards'
import { BalanceTrend } from './components/BalanceTrend'
import { SpendingBreakdown } from './components/SpendingBreakdown'
import { Insights } from './components/Insights'
import { TransactionsPanel } from './components/TransactionsPanel'
import { RecentTransactions } from './components/RecentTransactions'
import { Footer } from './components/Footer'

function SideNav({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const navItems = [
    { to: '/', label: 'Dashboard', end: true, icon: LayoutGrid },
    { to: '/transactions', label: 'Transactions', icon: WalletCards },
    { to: '/insights', label: 'Insights', icon: LineChart },
  ]

  return (
    <>
      <button
        type="button"
        className={isOpen ? 'dash-sidenav__overlay dash-sidenav__overlay--show' : 'dash-sidenav__overlay'}
        aria-label="Close navigation menu"
        onClick={onClose}
      />
      <aside
        className={
          isOpen
            ? 'dash-sidenav dash-sidenav--open'
            : 'dash-sidenav'
        }
        aria-label="Main navigation"
      >
        <div className="dash-sidenav__top">
          <h2 className="dash-sidenav__title">Menu</h2>
          <div className="dash-sidenav__top-actions">
            <button
              type="button"
              className="dash-sidenav__icon-btn dash-sidenav__icon-btn--desktop"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <button
              type="button"
              className="dash-sidenav__icon-btn dash-sidenav__icon-btn--mobile"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <nav className="dash-sidenav__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'dash-sidenav__link dash-sidenav__link--active'
                  : 'dash-sidenav__link'
              }
              onClick={onClose}
            >
              <item.icon size={21} strokeWidth={2.1} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="dash-sidenav__footer">
          <div className="dash-sidenav__divider" />
          <div className="dash-sidenav__subnav">
            <button type="button" className="dash-sidenav__subnav-item">
              <Settings size={22} />
              <span>Settings</span>
            </button>
            <button type="button" className="dash-sidenav__subnav-item">
              <CircleHelp size={22} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function DashboardPage() {
  return (
    <div className="dash-dashboard-page">
      <SummaryCards />
      <div className="dash-grid dash-grid--charts">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  )
}

function TransactionsPage() {
  return <TransactionsPanel />
}

function InsightsPage() {
  return <Insights />
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const syncNavWithViewport = (event) => {
      setIsNavOpen(event.matches)
    }

    setIsNavOpen(mediaQuery.matches)
    mediaQuery.addEventListener('change', syncNavWithViewport)
    return () => mediaQuery.removeEventListener('change', syncNavWithViewport)
  }, [])

  return (
    <>
      <ThemeSync />
      <div className={isNavCollapsed ? 'dash-app dash-app--nav-collapsed' : 'dash-app'}>
        <button
          type="button"
          className="dash-nav-toggle"
          onClick={() => setIsNavOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={isNavOpen}
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>
        <SideNav
          isOpen={isNavOpen}
          isCollapsed={isNavCollapsed}
          onClose={() => setIsNavOpen(false)}
          onToggleCollapse={() => setIsNavCollapsed((prev) => !prev)}
        />
        <Header />
        <main className="dash-main">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}
