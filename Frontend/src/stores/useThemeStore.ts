/**
 * Theme Store (Zustand)
 * Global state management for application theme (dark/light mode)
 * Persists theme preference in localStorage
 */

import { create } from 'zustand';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ============================================
// TYPES
// ============================================

export type Theme = 'light' | 'dark';

// ============================================
// STORE STATE INTERFACE
// ============================================

interface ThemeState {
  theme: Theme;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ============================================
// ZUSTAND STORE
// ============================================

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial State - default to light theme
  theme: 'light',

  /**
   * Set theme explicitly
   */
  setTheme: (theme: Theme) => {
    set({ theme });
    // Apply theme to document
    applyThemeToDocument(theme);
    // Save to localStorage
    localStorage.setItem('week-page-theme', theme);
  },

  /**
   * Toggle between light and dark theme
   */
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },
}));

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Apply theme to document (add/remove class)
 */
const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * Initialize theme from localStorage or system preference
 * Call this once when app starts
 */
export const initializeTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('week-page-theme') as Theme | null;
  
  if (savedTheme) {
    useThemeStore.getState().setTheme(savedTheme);
    return;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme: Theme = prefersDark ? 'dark' : 'light';
  
  useThemeStore.getState().setTheme(systemTheme);
};

/**
 * Listen to system theme changes
 * Call this once when app starts
 */
export const listenToSystemThemeChanges = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    // Only update if user hasn't manually set a theme
    const savedTheme = localStorage.getItem('week-page-theme');
    if (!savedTheme) {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      useThemeStore.getState().setTheme(newTheme);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
};
