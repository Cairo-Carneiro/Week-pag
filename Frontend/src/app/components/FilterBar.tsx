/**
 * Filter Bar Component
 * Search and filter controls for palestras
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { usePalestraStore } from '@/stores';
import { useDebounce } from '@/hooks/useDebounce';
import { StatusType } from '@/types/types';

export function FilterBar() {
  const { filters, setFilters, clearFilters, applyFilters, palestras } = usePalestraStore();
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');
  const debouncedSearch = useDebounce(searchInput, 500);
  const isFirstRender = useRef(true);

  // Update store when debounced search changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFilters({ searchQuery: debouncedSearch });
    applyFilters(); // Manually apply filters after setting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleStatusChange = (status: StatusType | 'todos') => {
    setFilters({ status });
    applyFilters(); // Manually apply filters after setting
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
  };

  const hasActiveFilters =
    filters.status !== 'todos' || (filters.searchQuery && filters.searchQuery.length > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar por título, local ou público..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter size={16} />
          <span className="font-medium">Status:</span>
        </div>

        <button
          onClick={() => handleStatusChange('todos')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.status === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => handleStatusChange('confirmado')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.status === 'confirmado'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmado
        </button>

        <button
          onClick={() => handleStatusChange('atenção')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.status === 'atenção'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Atenção
        </button>

        <button
          onClick={() => handleStatusChange('pendente')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.status === 'pendente'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendente
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <X size={16} />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{palestras.length}</span>{' '}
        {palestras.length === 1 ? 'palestra encontrada' : 'palestras encontradas'}
      </div>
    </div>
  );
}
