/**
 * Palestra Service (Mock Implementation)
 * Simulates API calls for CRUD operations on palestras
 * Uses localStorage for data persistence
 * 
 * When backend is ready, replace this with real API calls
 */

import { Palestra, PalestraFormData, PalestraFilters } from '../types/types';
import { mockPalestras } from '../data/mockData';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/localStorage';

// Simulated network delay (in milliseconds)
const MOCK_DELAY = 300;

/**
 * Helper: Simulate async operation with delay
 */
const delay = (ms: number = MOCK_DELAY): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Helper: Generate unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper: Get palestras from storage or use mock data
 */
const getPalestrasFromStorage = (): Palestra[] => {
  const stored = loadFromStorage<Palestra[]>(STORAGE_KEYS.PALESTRAS);
  if (stored && stored.length > 0) {
    return stored;
  }
  // First time: save mock data to storage
  saveToStorage(STORAGE_KEYS.PALESTRAS, mockPalestras);
  return mockPalestras;
};

/**
 * Helper: Save palestras to storage
 */
const savePalestrasToStorage = (palestras: Palestra[]): void => {
  saveToStorage(STORAGE_KEYS.PALESTRAS, palestras);
};

// ============================================
// SERVICE METHODS
// ============================================

/**
 * Get all palestras
 * @returns Promise with array of all palestras
 */
export const getAll = async (): Promise<Palestra[]> => {
  await delay();
  return getPalestrasFromStorage();
};

/**
 * Get palestra by ID
 * @param id - Palestra ID
 * @returns Promise with palestra or null if not found
 */
export const getById = async (id: string): Promise<Palestra | null> => {
  await delay();
  const palestras = getPalestrasFromStorage();
  return palestras.find((p) => p.id === id) || null;
};

/**
 * Create new palestra
 * @param data - Palestra form data (without id)
 * @returns Promise with created palestra
 */
export const create = async (data: PalestraFormData): Promise<Palestra> => {
  await delay();
  
  const newPalestra: Palestra = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const palestras = getPalestrasFromStorage();
  palestras.push(newPalestra);
  savePalestrasToStorage(palestras);
  
  return newPalestra;
};

/**
 * Update existing palestra
 * @param id - Palestra ID
 * @param data - Updated palestra data
 * @returns Promise with updated palestra or null if not found
 */
export const update = async (id: string, data: Partial<PalestraFormData>): Promise<Palestra | null> => {
  await delay();
  
  const palestras = getPalestrasFromStorage();
  const index = palestras.findIndex((p) => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  palestras[index] = {
    ...palestras[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  savePalestrasToStorage(palestras);
  return palestras[index];
};

/**
 * Delete palestra
 * @param id - Palestra ID
 * @returns Promise with boolean indicating success
 */
export const deletePalestra = async (id: string): Promise<boolean> => {
  await delay();
  
  const palestras = getPalestrasFromStorage();
  const filtered = palestras.filter((p) => p.id !== id);
  
  if (filtered.length === palestras.length) {
    return false; // Not found
  }
  
  savePalestrasToStorage(filtered);
  return true;
};

/**
 * Filter palestras by criteria
 * @param filters - Filter options
 * @returns Promise with filtered palestras
 */
export const filterPalestras = async (filters: PalestraFilters): Promise<Palestra[]> => {
  await delay();
  
  let palestras = getPalestrasFromStorage();
  
  // Filter by status
  if (filters.status && filters.status !== 'todos') {
    palestras = palestras.filter((p) => p.status === filters.status);
  }
  
  // Filter by search query (title)
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const query = filters.searchQuery.toLowerCase();
    palestras = palestras.filter((p) =>
      p.titulo.toLowerCase().includes(query)
    );
  }
  
  // Filter by date range (simplified - comparing DD/MM format)
  if (filters.dataInicio) {
    palestras = palestras.filter((p) => p.data >= filters.dataInicio!);
  }
  
  if (filters.dataFim) {
    palestras = palestras.filter((p) => p.data <= filters.dataFim!);
  }
  
  return palestras;
};

/**
 * Search palestras by title
 * @param query - Search query
 * @returns Promise with matching palestras
 */
export const searchByTitle = async (query: string): Promise<Palestra[]> => {
  await delay();
  
  if (!query || query.trim() === '') {
    return getPalestrasFromStorage();
  }
  
  const palestras = getPalestrasFromStorage();
  const lowerQuery = query.toLowerCase();
  
  return palestras.filter((p) =>
    p.titulo.toLowerCase().includes(lowerQuery) ||
    p.local.toLowerCase().includes(lowerQuery) ||
    p.publico.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get palestras by status
 * @param status - Status type
 * @returns Promise with palestras of given status
 */
export const getByStatus = async (status: Palestra['status']): Promise<Palestra[]> => {
  await delay();
  
  const palestras = getPalestrasFromStorage();
  return palestras.filter((p) => p.status === status);
};

/**
 * Reset to initial mock data
 * Useful for testing/demo purposes
 * @returns Promise with boolean indicating success
 */
export const resetToMockData = async (): Promise<boolean> => {
  await delay();
  savePalestrasToStorage(mockPalestras);
  return true;
};

// Export all methods as default object (alternative usage)
export default {
  getAll,
  getById,
  create,
  update,
  delete: deletePalestra,
  filter: filterPalestras,
  searchByTitle,
  getByStatus,
  resetToMockData,
};
