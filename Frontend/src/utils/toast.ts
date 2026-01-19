/**
 * Toast Notifications Setup
 * Configures Sonner toast notifications for the app
 * Provides helper functions for showing toasts
 */

import { toast as sonnerToast } from 'sonner';

// ============================================
// TOAST HELPER FUNCTIONS
// ============================================

/**
 * Show success toast
 */
export const showSuccess = (message: string, description?: string) => {
  sonnerToast.success(message, {
    description,
    duration: 3000,
  });
};

/**
 * Show error toast
 */
export const showError = (message: string, description?: string) => {
  sonnerToast.error(message, {
    description,
    duration: 4000,
  });
};

/**
 * Show info toast
 */
export const showInfo = (message: string, description?: string) => {
  sonnerToast.info(message, {
    description,
    duration: 3000,
  });
};

/**
 * Show warning toast
 */
export const showWarning = (message: string, description?: string) => {
  sonnerToast.warning(message, {
    description,
    duration: 3500,
  });
};

/**
 * Show loading toast (returns id for dismissal)
 */
export const showLoading = (message: string) => {
  return sonnerToast.loading(message);
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId: string | number) => {
  sonnerToast.dismiss(toastId);
};

/**
 * Show promise toast (auto handles loading/success/error)
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return sonnerToast.promise(promise, messages);
};

// Export the original toast for advanced usage
export { sonnerToast as toast };
