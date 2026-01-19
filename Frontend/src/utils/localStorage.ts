/**
 * LocalStorage Utility Functions
 * Provides safe and typed access to browser localStorage
 * Handles errors gracefully and provides fallbacks
 */

/**
 * Storage keys used in the application
 * Centralized to avoid typos and make refactoring easier
 */
export const STORAGE_KEYS = {
  PALESTRAS: 'week-page-palestras',
  RESPONSABILIDADES: 'week-page-responsabilidades',
  THEME: 'week-page-theme',
  USER: 'week-page-user',
} as const;

/**
 * Save data to localStorage
 * Automatically stringifies objects to JSON
 * 
 * @param key - Storage key
 * @param data - Data to save (will be JSON stringified)
 * @returns boolean - true if successful, false if error
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage
 * Automatically parses JSON back to objects
 * 
 * @param key - Storage key
 * @returns Parsed data or null if not found/error
 */
export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Remove specific item from localStorage
 * 
 * @param key - Storage key to remove
 * @returns boolean - true if successful, false if error
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all application data from localStorage
 * Removes all keys defined in STORAGE_KEYS
 * 
 * @returns boolean - true if successful, false if any error
 */
export const clearAllStorage = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * Some browsers/modes (private browsing) may not support it
 * 
 * @returns boolean - true if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage size (approximate)
 * Useful for debugging and monitoring storage usage
 * 
 * @returns number - approximate size in bytes
 */
export const getStorageSize = (): number => {
  let total = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error('Error calculating storage size:', error);
  }
  return total;
};
