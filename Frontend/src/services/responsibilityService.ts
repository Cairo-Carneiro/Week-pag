/**
 * Responsibility Service (Mock Implementation)
 * Simulates API calls for CRUD operations on responsabilidades
 * Uses localStorage for data persistence
 * 
 * When backend is ready, replace this with real API calls
 */

import { Responsabilidade, ResponsibilidadeFormData } from '../types/types';
import { mockResponsabilidades } from '../data/mockData';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/localStorage';

// Simulated network delay (in milliseconds)
const MOCK_DELAY = 200;

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
  return `r-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper: Get responsabilidades from storage or use mock data
 */
const getResponsabilidadesFromStorage = (): Responsabilidade[] => {
  const stored = loadFromStorage<Responsabilidade[]>(STORAGE_KEYS.RESPONSABILIDADES);
  if (stored && stored.length > 0) {
    return stored;
  }
  // First time: save mock data to storage
  saveToStorage(STORAGE_KEYS.RESPONSABILIDADES, mockResponsabilidades);
  return mockResponsabilidades;
};

/**
 * Helper: Save responsabilidades to storage
 */
const saveResponsabilidadesToStorage = (responsabilidades: Responsabilidade[]): void => {
  saveToStorage(STORAGE_KEYS.RESPONSABILIDADES, responsabilidades);
};

// ============================================
// SERVICE METHODS
// ============================================

/**
 * Get all responsabilidades
 * @returns Promise with array of all responsabilidades
 */
export const getAll = async (): Promise<Responsabilidade[]> => {
  await delay();
  return getResponsabilidadesFromStorage();
};

/**
 * Get responsabilidade by ID
 * @param id - Responsabilidade ID
 * @returns Promise with responsabilidade or null if not found
 */
export const getById = async (id: string): Promise<Responsabilidade | null> => {
  await delay();
  const responsabilidades = getResponsabilidadesFromStorage();
  return responsabilidades.find((r) => r.id === id) || null;
};

/**
 * Create new responsabilidade
 * @param data - Responsabilidade form data
 * @returns Promise with created responsabilidade
 */
export const create = async (data: ResponsibilidadeFormData): Promise<Responsabilidade> => {
  await delay();
  
  const newResponsabilidade: Responsabilidade = {
    ...data,
    id: generateId(),
    completo: false,
    createdAt: new Date().toISOString(),
  };
  
  const responsabilidades = getResponsabilidadesFromStorage();
  responsabilidades.push(newResponsabilidade);
  saveResponsabilidadesToStorage(responsabilidades);
  
  return newResponsabilidade;
};

/**
 * Toggle complete status of responsabilidade
 * @param id - Responsabilidade ID
 * @returns Promise with updated responsabilidade or null if not found
 */
export const toggleComplete = async (id: string): Promise<Responsabilidade | null> => {
  await delay();
  
  const responsabilidades = getResponsabilidadesFromStorage();
  const index = responsabilidades.findIndex((r) => r.id === id);
  
  if (index === -1) {
    return null;
  }
  
  responsabilidades[index] = {
    ...responsabilidades[index],
    completo: !responsabilidades[index].completo,
  };
  
  saveResponsabilidadesToStorage(responsabilidades);
  return responsabilidades[index];
};

/**
 * Update responsabilidade
 * @param id - Responsabilidade ID
 * @param data - Updated data
 * @returns Promise with updated responsabilidade or null if not found
 */
export const update = async (
  id: string,
  data: Partial<Omit<Responsabilidade, 'id' | 'createdAt'>>
): Promise<Responsabilidade | null> => {
  await delay();
  
  const responsabilidades = getResponsabilidadesFromStorage();
  const index = responsabilidades.findIndex((r) => r.id === id);
  
  if (index === -1) {
    return null;
  }
  
  responsabilidades[index] = {
    ...responsabilidades[index],
    ...data,
  };
  
  saveResponsabilidadesToStorage(responsabilidades);
  return responsabilidades[index];
};

/**
 * Delete responsabilidade
 * @param id - Responsabilidade ID
 * @returns Promise with boolean indicating success
 */
export const deleteResponsabilidade = async (id: string): Promise<boolean> => {
  await delay();
  
  const responsabilidades = getResponsabilidadesFromStorage();
  const filtered = responsabilidades.filter((r) => r.id !== id);
  
  if (filtered.length === responsabilidades.length) {
    return false; // Not found
  }
  
  saveResponsabilidadesToStorage(filtered);
  return true;
};

/**
 * Get only incomplete responsabilidades
 * @returns Promise with array of incomplete responsabilidades
 */
export const getIncomplete = async (): Promise<Responsabilidade[]> => {
  await delay();
  const responsabilidades = getResponsabilidadesFromStorage();
  return responsabilidades.filter((r) => !r.completo);
};

/**
 * Get only complete responsabilidades
 * @returns Promise with array of complete responsabilidades
 */
export const getComplete = async (): Promise<Responsabilidade[]> => {
  await delay();
  const responsabilidades = getResponsabilidadesFromStorage();
  return responsabilidades.filter((r) => r.completo);
};

/**
 * Get critical responsabilidades
 * @returns Promise with array of critical responsabilidades
 */
export const getCritical = async (): Promise<Responsabilidade[]> => {
  await delay();
  const responsabilidades = getResponsabilidadesFromStorage();
  return responsabilidades.filter((r) => r.critico && !r.completo);
};

/**
 * Reset to initial mock data
 * @returns Promise with boolean indicating success
 */
export const resetToMockData = async (): Promise<boolean> => {
  await delay();
  saveResponsabilidadesToStorage(mockResponsabilidades);
  return true;
};

// Export all methods as default object (alternative usage)
export default {
  getAll,
  getById,
  create,
  toggleComplete,
  update,
  delete: deleteResponsabilidade,
  getIncomplete,
  getComplete,
  getCritical,
  resetToMockData,
};
