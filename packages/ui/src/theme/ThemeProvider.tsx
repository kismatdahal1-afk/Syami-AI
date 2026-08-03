import { useEffect, useLayoutEffect, useState } from 'react'
import { THEME_STORAGE_KEY, useThemeStore, type ResolvedTheme } from './themeStore'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

const readStoredPreference = (): 'light' | 'dark' | 'system' => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Storage unavailable - fall through to system preference
  }
  return 'system'
}

const resolvePreference = (
  preference: 'light' | 'dark' | 'system',
  media: MediaQueryList
): ResolvedTheme => {
  if (preference === 'system') {
    return media.matches ? 'dark' : 'light'
  }
  return preference
}

const applyThemeClass = (resolved: ResolvedTheme): void => {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const resolved = useThemeStore((state) => state.resolved)
  const setResolved = useThemeStore((state) => state.setResolved)
  const [media] = useState(() => window.matchMedia(MEDIA_QUERY))

  useEffect(() => {
    setPreference(readStoredPreference())
  }, [setPreference])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  }, [preference])

  useEffect(() => {
    const sync = (): void => {
      setResolved(resolvePreference(preference, media))
    }

    sync()

    if (preference === 'system') {
      media.addEventListener('change', sync)
      return () => {
        media.removeEventListener('change', sync)
      }
    }
  }, [preference, media, setResolved])

  useLayoutEffect(() => {
    applyThemeClass(resolved)
  }, [resolved])

  return <>{children}</>
}
