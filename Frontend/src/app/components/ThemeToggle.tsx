/**
 * Theme Toggle Button Component
 * Button to switch between light and dark mode
 */

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-white" />
      ) : (
        <Sun size={18} className="text-white" />
      )}
      <span className="text-sm font-medium text-white">
        {theme === 'light' ? 'Escuro' : 'Claro'}
      </span>
    </button>
  );
}
