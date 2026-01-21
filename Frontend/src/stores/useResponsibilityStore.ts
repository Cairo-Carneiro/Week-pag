 /**
 * Responsibility Store (Zustand)
 * Global state management for responsabilidades
 * Connects UI components with responsibility service
 */

import { create } from 'zustand';
import { Responsabilidade, ResponsibilidadeFormData } from '../types/types';
import * as responsibilityService from '../services/responsibilityService';

// ============================================
// STORE STATE INTERFACE
// ============================================

interface ResponsibilityState {
  // Data
  responsabilidades: Responsabilidade[];
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Filter
  showCompleted: boolean;
  
  // Actions - Data Operations
  fetchResponsabilidades: () => Promise<void>;
  createResponsabilidade: (data: ResponsibilidadeFormData) => Promise<Responsabilidade | null>;
  toggleComplete: (id: string) => Promise<void>;
  updateResponsabilidade: (id: string, data: Partial<Omit<Responsabilidade, 'id' | 'createdAt'>>) => Promise<Responsabilidade | null>;
  deleteResponsabilidade: (id: string) => Promise<boolean>;
  
  // Actions - Filters
  setShowCompleted: (show: boolean) => void;
  
  // Actions - Utility
  resetToMockData: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// ZUSTAND STORE
// ============================================

export const useResponsibilityStore = create<ResponsibilityState>((set, get) => ({
  // Initial State
  responsabilidades: [],
  loading: false,
  error: null,
  showCompleted: true,

  // ============================================
  // DATA OPERATIONS
  // ============================================

  /**
   * Fetch all responsabilidades from service
   */
  fetchResponsabilidades: async () => {
    set({ loading: true, error: null });
    try {
      const responsabilidades = await responsibilityService.getAll();
      set({ responsabilidades, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar responsabilidades',
        loading: false 
      });
    }
  },

  /**
   * Create new responsabilidade
   */
  createResponsabilidade: async (data: ResponsibilidadeFormData) => {
    set({ loading: true, error: null });
    try {
      const newResponsabilidade = await responsibilityService.create(data);
      
      // Add to local state
      set((state) => ({
        responsabilidades: [...state.responsabilidades, newResponsabilidade],
        loading: false,
      }));
      
      return newResponsabilidade;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar responsabilidade',
        loading: false 
      });
      return null;
    }
  },

  /**
   * Toggle complete status of responsabilidade
   */
  toggleComplete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await responsibilityService.toggleComplete(id);
      
      if (updated) {
        // Update in local state
        set((state) => ({
          responsabilidades: state.responsabilidades.map((r) =>
            r.id === id ? updated : r
          ),
          loading: false,
        }));
      } else {
        set({ error: 'Responsabilidade não encontrada', loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar responsabilidade',
        loading: false 
      });
    }
  },

  /**
   * Update responsabilidade
   */
  updateResponsabilidade: async (
    id: string,
    data: Partial<Omit<Responsabilidade, 'id' | 'createdAt'>>
  ) => {
    set({ loading: true, error: null });
    try {
      const updated = await responsibilityService.update(id, data);
      
      if (updated) {
        // Update in local state
        set((state) => ({
          responsabilidades: state.responsabilidades.map((r) =>
            r.id === id ? updated : r
          ),
          loading: false,
        }));
      } else {
        set({ error: 'Responsabilidade não encontrada', loading: false });
      }
      
      return updated;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar responsabilidade',
        loading: false 
      });
      return null;
    }
  },

  /**
   * Delete responsabilidade
   */
  deleteResponsabilidade: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const success = await responsibilityService.deleteResponsabilidade(id);
      
      if (success) {
        // Remove from local state
        set((state) => ({
          responsabilidades: state.responsabilidades.filter((r) => r.id !== id),
          loading: false,
        }));
      } else {
        set({ error: 'Responsabilidade não encontrada', loading: false });
      }
      
      return success;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar responsabilidade',
        loading: false 
      });
      return false;
    }
  },

  // ============================================
  // FILTERS
  // ============================================

  /**
   * Toggle showing completed responsabilidades
   */
  setShowCompleted: (show: boolean) => {
    set({ showCompleted: show });
  },

  // ============================================
  // UTILITY
  // ============================================

  /**
   * Reset to initial mock data (for testing/demo)
   */
  resetToMockData: async () => {
    set({ loading: true, error: null });
    try {
      await responsibilityService.resetToMockData();
      await get().fetchResponsabilidades();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao resetar dados',
        loading: false 
      });
    }
  },

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
 * Get only incomplete responsabilidades
 */
export const useIncompleteResponsabilidades = () => {
  return useResponsibilityStore((state) =>
    state.responsabilidades.filter((r) => !r.completo)
  );
};

/**
 * Get only complete responsabilidades
 */
export const useCompleteResponsabilidades = () => {
  return useResponsibilityStore((state) =>
    state.responsabilidades.filter((r) => r.completo)
  );
};

/**
 * Get critical incomplete responsabilidades
 */
export const useCriticalResponsabilidades = () => {
  return useResponsibilityStore((state) =>
    state.responsabilidades.filter((r) => r.critico && !r.completo)
  );
};

/**
 * Get responsabilidades count
 */
export const useResponsabilidadeCount = () => {
  return useResponsibilityStore((state) => ({
    total: state.responsabilidades.length,
    incomplete: state.responsabilidades.filter((r) => !r.completo).length,
    complete: state.responsabilidades.filter((r) => r.completo).length,
    critical: state.responsabilidades.filter((r) => r.critico && !r.completo).length,
  }));
};

/**
 * Get filtered responsabilidades based on showCompleted setting
 */
export const useFilteredResponsabilidades = () => {
  return useResponsibilityStore((state) => {
    if (state.showCompleted) {
      return state.responsabilidades;
    }
    return state.responsabilidades.filter((r) => !r.completo);
  });
};
