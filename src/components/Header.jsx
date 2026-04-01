import { useFinanceStore } from '../store/useFinanceStore'
import { Moon, ShieldCheck, Sun } from 'lucide-react'
import brandMark from '../assets/logo.png'

export function Header() {
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)
  const theme = useFinanceStore((s) => s.theme)
  const setTheme = useFinanceStore((s) => s.setTheme)

  return (
    <header className="dash-header">
      <div className="dash-header__brand">
        <img className="dash-logo" src={brandMark} alt="Zorvyn brand mark" />
        <div className="dash-header__brand-text">
          <h1 className="dash-header__title">Ledger</h1>
          <p className="dash-header__sub">Personal finance overview</p>
        </div>
      </div>
      <div className="dash-header__actions">
        <div className="dash-header__control">
          <span className="dash-field__label dash-label-icon">
            <ShieldCheck size={13} />
            Role
          </span>
          <label className="dash-header__role">
            <select
              className="dash-select"
              value={role}
              onChange={(e) =>
                setRole(/** @type {'viewer' | 'admin'} */(e.target.value))
              }
              aria-label="Switch role for demo"
            >
              <option value="viewer">Viewer (read-only)</option>
              <option value="admin">Admin (edit)</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--ghost dash-btn--icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-pressed={theme === 'dark'}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}
