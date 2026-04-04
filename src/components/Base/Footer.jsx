import { useState } from 'react'
import { useFinanceStore } from '../../store/useFinanceStore'
import { RefreshCcw } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

export function Footer() {
  const role = useFinanceStore((s) => s.role)
  const resetDemoData = useFinanceStore((s) => s.resetDemoData)
  const [confirmReset, setConfirmReset] = useState(false)
  const year = new Date().getFullYear()

  return (
    <footer className="dash-footer">
      {role === 'admin' && (
        <button
          type="button"
          className="dash-btn dash-btn--ghost dash-btn--small dash-footer__reset"
          onClick={() => setConfirmReset(true)}
        >
          <RefreshCcw size={14} />
          Reset demo data
        </button>
      )}
      <div className="dash-footer__brand">
        <div className="dash-footer__strip">
          <p className="dash-footer__text">
            <span className="dash-footer__meta">
              <span className="dash-footer__mark" aria-hidden="true">
                ©
              </span>
              <time className="dash-footer__year" dateTime={String(year)}>
                {year}
              </time>
              <span className="dash-footer__entity">
                <span className="dash-footer__name">Zorvyn</span>
                <span className="dash-footer__suffix">Fintech</span>
              </span>
            </span>
            <span className="dash-footer__rule" aria-hidden="true" />
            <span className="dash-footer__legal">All rights reserved.</span>
          </p>
        </div>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data"
        message="This will restore the original mock transactions and overwrite your current edits."
        confirmText="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData()
          setConfirmReset(false)
        }}
      />
    </footer>
  )
}
