/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 48,
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={sizes[size]} className="animate-spin text-emerald-600" />
    </div>
  );
}

/**
 * Full Page Loading Component
 */
export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}
