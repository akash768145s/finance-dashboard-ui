import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { FINANCE_DEMO_SEED } from '../../data/mockData'
import { CategoryIcon } from '../Dashboard/CategoryIcon'

/**
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 * }} props
 */
export function CategoryFilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(/** @type {HTMLDivElement | null} */(null))
  const labelId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      const el = rootRef.current
      if (!el || !(e.target instanceof Node)) return
      if (!el.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (v) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div className="dash-field dash-field--category-filter" ref={rootRef}>
      <span className="dash-field__label" id={labelId}>
        Category
      </span>
      <div className="dash-cat-select">
        <button
          type="button"
          className="dash-select dash-cat-select__trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="dash-cat-select__value">
            {value === 'all' ? (
              <>
                <LayoutGrid
                  size={16}
                  strokeWidth={2}
                  className="dash-cat-select__lead-icon"
                  aria-hidden
                />
                All
              </>
            ) : (
              <>
                <CategoryIcon
                  category={value}
                  size={16}
                  className="dash-cat-select__lead-icon"
                />
                {value}
              </>
            )}
          </span>
          <ChevronDown
            size={16}
            className={`dash-cat-select__chev ${open ? 'dash-cat-select__chev--open' : ''}`}
            aria-hidden
          />
        </button>
        {open && (
          <ul
            className="dash-cat-select__menu"
            role="listbox"
            aria-label="Filter by category"
          >
            <li role="none">
              <button
                type="button"
                role="option"
                aria-selected={value === 'all'}
                className="dash-cat-select__option"
                onClick={() => pick('all')}
              >
                <LayoutGrid size={16} strokeWidth={2} aria-hidden />
                <span>All</span>
              </button>
            </li>
            {FINANCE_DEMO_SEED.categories.map((c) => (
              <li key={c} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === c}
                  className="dash-cat-select__option"
                  onClick={() => pick(c)}
                >
                  <CategoryIcon category={c} size={16} />
                  <span>{c}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
