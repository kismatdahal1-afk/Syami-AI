import { create } from 'zustand'

export const THEME_STORAGE_KEY = 'syami.theme'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  setResolved: (resolved: ResolvedTheme) => void
  toggle: () => void
}

const getOpposite = (preference: ThemePreference): ThemePreference =>
  preference === 'dark' ? 'light' : 'dark'

export const useThemeStore = create<ThemeState>()((set) => ({
  preference: 'system',
  resolved: 'light',
  setPreference: (preference) => set({ preference }),
  setResolved: (resolved) => set({ resolved }),
  toggle: () => set((state) => ({ preference: getOpposite(state.preference) }))
}))
