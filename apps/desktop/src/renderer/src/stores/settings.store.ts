import { create } from 'zustand';
import { DEFAULT_SETTINGS, type AppSettings } from './settings.types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),
}));
