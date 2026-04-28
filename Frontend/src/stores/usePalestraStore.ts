/**
 * Palestra Store (Zustand)
 * Global state management for palestras
 * Connects UI components with palestra service
 */

import { create } from "zustand";
import {
  Palestra,
  PalestraFormData,
  PalestraFilters,
  ViewMode,
  StatusType,
} from "../types/types";
import * as palestraService from "../services/palestraService";

// Helper function to sort palestras chronologically ascending
const sortPalestrasChronologically = (palestras: Palestra[]) => {
  return [...palestras].sort((a, b) => {
    // Parse data "DD/MM"
    const [dayA, monthA] = (a.data || '').split('/').map(Number);
    const [dayB, monthB] = (b.data || '').split('/').map(Number);

    const mA = monthA || 0;
    const mB = monthB || 0;
    if (mA !== mB) return mA - mB; // crescente

    const dA = dayA || 0;
    const dB = dayB || 0;
    if (dA !== dB) return dA - dB; // crescente

    // Parse horario "HH:mm - HH:mm"
    const startTimeA = (a.horario || '').split('-')[0]?.trim() || '';
    const startTimeB = (b.horario || '').split('-')[0]?.trim() || '';

    const [hourA, minA] = startTimeA.split(':').map(Number);
    const [hourB, minB] = startTimeB.split(':').map(Number);

    const hA = hourA || 0;
    const hB = hourB || 0;
    if (hA !== hB) return hA - hB; // crescente

    const minPartA = minA || 0;
    const minPartB = minB || 0;
    return minPartA - minPartB; // crescente
  });
};

// ============================================
// STORE STATE INTERFACE
// ============================================

interface PalestraState {
  // Data
  palestras: Palestra[];
  selectedPalestra: Palestra | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters & View
  filters: PalestraFilters;
  viewMode: ViewMode;
  searchQuery: string;

  // Actions - Data Operations
  fetchPalestras: () => Promise<void>;
  fetchPalestraById: (id: string) => Promise<void>;
  createPalestra: (data: PalestraFormData) => Promise<Palestra | null>;
  updatePalestra: (
    id: string,
    data: Partial<PalestraFormData>,
  ) => Promise<Palestra | null>;
  deletePalestra: (id: string) => Promise<boolean>;

  // Actions - Filters & Search
  setFilters: (filters: Partial<PalestraFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => Promise<void>;

  // Actions - View Mode
  setViewMode: (mode: ViewMode) => void;

  // Actions - Selection
  selectPalestra: (palestra: Palestra | null) => void;

  // Actions - Utility

  clearError: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialFilters: PalestraFilters = {
  status: "todos",
  searchQuery: "",
};

// ============================================
// ZUSTAND STORE
// ============================================

export const usePalestraStore = create<PalestraState>((set, get) => ({
  // Initial State
  palestras: [],
  selectedPalestra: null,
  loading: false,
  error: null,
  filters: initialFilters,
  viewMode: "list",
  searchQuery: "",

  // ============================================
  // DATA OPERATIONS
  // ============================================

  /**
   * Fetch all palestras from service
   */
  fetchPalestras: async () => {
    set({ loading: true, error: null });
    try {
      const palestras = await palestraService.getAll();
      
      // Ordenação cronológica (Crescente: mais antiga/próxima primeiro)
      const sortedPalestras = sortPalestrasChronologically(palestras);

      set({ palestras: sortedPalestras, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar palestras",
        loading: false,
      });
    }
  },

  /**
   * Fetch single palestra by ID
   */
  fetchPalestraById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const palestra = await palestraService.getById(id);
      set({ selectedPalestra: palestra, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar palestra",
        loading: false,
      });
    }
  },

  /**
   * Create new palestra
   */
  createPalestra: async (data: PalestraFormData) => {
    set({ loading: true, error: null });
    try {
      const newPalestra = await palestraService.create(data);

      // Add to local state
      set((state) => ({
        palestras: [...state.palestras, newPalestra],
        loading: false,
      }));

      return newPalestra;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao criar palestra",
        loading: false,
      });
      return null;
    }
  },

  /**
   * Update existing palestra
   */
  updatePalestra: async (id: string, data: Partial<PalestraFormData>) => {
    set({ loading: true, error: null });
    try {
      const updatedPalestra = await palestraService.update(id, data);

      if (updatedPalestra) {
        // Update in local state
        set((state) => ({
          palestras: state.palestras.map((p) =>
            p.id === id ? updatedPalestra : p,
          ),
          selectedPalestra:
            state.selectedPalestra?.id === id
              ? updatedPalestra
              : state.selectedPalestra,
          loading: false,
        }));
      } else {
        set({ error: "Palestra não encontrada", loading: false });
      }

      return updatedPalestra;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao atualizar palestra",
        loading: false,
      });
      return null;
    }
  },

  /**
   * Delete palestra
   */
  deletePalestra: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const success = await palestraService.deletePalestra(id);

      if (success) {
        // Remove from local state
        set((state) => ({
          palestras: state.palestras.filter((p) => p.id !== id),
          selectedPalestra:
            state.selectedPalestra?.id === id ? null : state.selectedPalestra,
          loading: false,
        }));
      } else {
        set({ error: "Palestra não encontrada", loading: false });
      }

      return success;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao deletar palestra",
        loading: false,
      });
      return false;
    }
  },

  // ============================================
  // FILTERS & SEARCH
  // ============================================

  /**
   * Update filters (partial update)
   */
  setFilters: (newFilters: Partial<PalestraFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // Note: applyFilters() is NOT called automatically to prevent infinite loops
    // Components should call applyFilters() manually when needed
  },

  /**
   * Clear all filters
   */
  clearFilters: () => {
    set({
      filters: initialFilters,
      searchQuery: "",
    });
    // Apply filters (which will fetch all palestras since filters are cleared)
    get().applyFilters();
  },

  /**
   * Set search query
   */
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // Update filters with search query
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    }));
  },

  /**
   * Apply current filters to palestras
   */
  applyFilters: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const filteredPalestras = await palestraService.filterPalestras(filters);
      const sortedFiltered = sortPalestrasChronologically(filteredPalestras);
      set({ palestras: sortedFiltered, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao filtrar palestras",
        loading: false,
      });
    }
  },

  // ============================================
  // VIEW MODE
  // ============================================

  /**
   * Change view mode (list, calendar-week, calendar-month)
   */
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  // ============================================
  // SELECTION
  // ============================================

  /**
   * Select a palestra (for viewing details, editing, etc.)
   */
  selectPalestra: (palestra: Palestra | null) => {
    set({ selectedPalestra: palestra });
  },

  // ============================================
  // UTILITY
  // ============================================

  /**
   * Reset to initial mock data (for testing/demo)
   */

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));

// ============================================
// SELECTOR HOOKS (Optional - for better performance)
// ============================================

/**
 * Get palestras filtered by status
 */
export const usePalestrasByStatus = (status: StatusType) => {
  return usePalestraStore((state) =>
    state.palestras.filter((p) => p.status === status),
  );
};
