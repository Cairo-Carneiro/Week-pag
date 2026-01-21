/**
 * View Mode Toggle Component
 * Toggle between list and calendar views
 */

import { List, Calendar } from 'lucide-react';
import { usePalestraStore } from '@/stores';
import { ViewMode } from '@/types/types';

export function ViewModeToggle() {
  const { viewMode, setViewMode } = usePalestraStore();

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
      <button
        onClick={() => setViewMode('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-emerald-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Visualização em lista"
      >
        <List size={18} />
        <span className="text-sm font-medium">Lista</span>
      </button>

      <button
        onClick={() => setViewMode('calendar-week')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'calendar-week'
            ? 'bg-emerald-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Calendário semanal"
      >
        <Calendar size={18} />
        <span className="text-sm font-medium">Calendário</span>
      </button>
    </div>
  );
}
