export type AppLanguage = 'en' | 'ne' | 'auto';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: AppLanguage;
  temperature: number;
  preferredModel: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  temperature: 0.7,
  preferredModel: null,
};

export { DEFAULT_SETTINGS };
