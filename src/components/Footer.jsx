import { useState } from 'react'
import { useFinanceStore } from '../store/useFinanceStore'
import { RefreshCcw } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'
import brandWordmark from '../assets/logo2.png'

export function Footer() {
  const role = useFinanceStore((s) => s.role)
  const resetDemoData = useFinanceStore((s) => s.resetDemoData)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <footer className="dash-footer">
      <div className="dash-footer__brand">
        <img
          className="dash-footer__logo"
          src={brandWordmark}
          alt="Zorvyn fintech"
        />
        <p className="dash-footer__text">
          © {new Date().getFullYear()} Zorvyn Fintech. All rights reserved.
        </p>
      </div>
      {role === 'admin' && (
        <button
          type="button"
          className="dash-btn dash-btn--ghost dash-btn--small"
          onClick={() => setConfirmReset(true)}
        >
          <RefreshCcw size={14} />
          Reset demo data
        </button>
      )}
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
