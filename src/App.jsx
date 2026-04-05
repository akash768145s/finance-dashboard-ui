import './dashboard.css'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
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
import { Header } from './components/Base/Header'
import { ThemeSync } from './components/Base/ThemeSync'
import { SummaryCards } from './components/Dashboard/SummaryCards'
import { BalanceTrend } from './components/Dashboard/BalanceTrend'
import { SpendingBreakdown } from './components/Insights/SpendingBreakdown'
import { Insights } from './components/Insights/Insights'
import { TransactionsPanel } from './components/Transactions/TransactionsPanel'
import { RecentTransactions } from './components/Dashboard/RecentTransactions'
import { Footer } from './components/Base/Footer'

function isOnNavRoute(pathname, item) {
  if (item.end) return pathname === item.to
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

function SideNav({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { pathname } = useLocation()
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
              onClick={() => {
                if (!isOnNavRoute(pathname, item)) onClose()
              }}
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
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  useLayoutEffect(() => {
    setIsNavOpen(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const openOnDesktop = () => {
      if (mediaQuery.matches) setIsNavOpen(true)
    }

    mediaQuery.addEventListener('change', openOnDesktop)
    return () => mediaQuery.removeEventListener('change', openOnDesktop)
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
          <div key={location.pathname} className="dash-main__route">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
