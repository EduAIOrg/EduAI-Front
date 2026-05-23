'use client';

import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Store Zustand pour la gestion du thème clair/sombre.
 * Persiste la préférence dans localStorage.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  theme:
    typeof window !== 'undefined'
      ? (localStorage.getItem('eduai_theme') as Theme) ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'dark',

  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('eduai_theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
      return { theme: next };
    }),

  setTheme: (theme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduai_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
}));
