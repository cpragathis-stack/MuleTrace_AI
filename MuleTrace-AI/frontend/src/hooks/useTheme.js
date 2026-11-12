import { useCallback, useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'muletrace-theme'

const LIGHT_THEME_CLASS = 'light-theme'

function getStoredTheme() {
  if (typeof window === 'undefined') return 'dark'

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light'
      ? 'light'
      : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.toggle(LIGHT_THEME_CLASS, theme === 'light')

  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute(
    'content',
    theme === 'light' ? '#f4f7fb' : '#05080d',
  )
}

export default function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      return
    }
  }, [theme])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== THEME_STORAGE_KEY) return

      setTheme(event.newValue === 'light' ? 'light' : 'dark')
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, isLight: theme === 'light', toggleTheme }
}
