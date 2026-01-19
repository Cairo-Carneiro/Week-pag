/**
 * Store Index
 * Central export point for all Zustand stores
 * Makes imports cleaner throughout the app
 */

// Export all stores
export { usePalestraStore, usePalestrasByStatus } from './usePalestraStore';
export { 
  useResponsibilityStore,
  useIncompleteResponsabilidades,
  useCompleteResponsabilidades,
  useCriticalResponsabilidades,
  useResponsabilidadeCount,
  useFilteredResponsabilidades,
} from './useResponsibilityStore';
export { 
  useThemeStore, 
  initializeTheme, 
  listenToSystemThemeChanges,
  type Theme,
} from './useThemeStore';
