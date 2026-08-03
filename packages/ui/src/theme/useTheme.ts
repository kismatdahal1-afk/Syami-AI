import { useThemeStore, type ResolvedTheme, type ThemePreference } from './themeStore'

export interface UseThemeResult {
  preference: ThemePreference
  resolved: ResolvedTheme
  isDark: boolean
  setPreference: (preference: ThemePreference) => void
  toggle: () => void
}

export const useTheme = (): UseThemeResult => {
  const preference = useThemeStore((state) => state.preference)
  const resolved = useThemeStore((state) => state.resolved)
  const setPreference = useThemeStore((state) => state.setPreference)
  const toggle = useThemeStore((state) => state.toggle)

  return {
    preference,
    resolved,
    isDark: resolved === 'dark',
    setPreference,
    toggle
  }
}
