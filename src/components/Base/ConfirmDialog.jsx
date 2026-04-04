import { AlertTriangle } from 'lucide-react'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {string} props.message
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 * @param {string} [props.confirmText]
 * @param {string} [props.cancelText]
 */
export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  if (!open) return null

  return (
    <div className="dash-modal-root" role="presentation">
      <button
        type="button"
        className="dash-modal-backdrop"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        className="dash-modal dash-confirm"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="dash-modal__title dash-confirm__title">
          <AlertTriangle size={18} />
          {title}
        </h2>
        <p className="dash-confirm__message">{message}</p>
        <div className="dash-modal__actions">
          <button
            type="button"
            className="dash-btn dash-btn--ghost"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="dash-btn dash-btn--primary"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
