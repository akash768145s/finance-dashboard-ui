import { useEffect } from 'react'
import { useFinanceStore } from '../../store/useFinanceStore'

/** Applies theme class to document root from persisted store */
export function ThemeSync() {
  const theme = useFinanceStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return null
}
