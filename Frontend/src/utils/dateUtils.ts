/**
 * Date Utility Functions
 * Helper functions for working with dates throughout the application
 * Uses native JavaScript Date API (date-fns is available if needed)
 */

/**
 * Format a date to DD/MM format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "13/01")
 */
export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

/**
 * Format a date to full format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "13 de Janeiro de 2026")
 */
export const formatDateFull = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return d.toLocaleDateString('pt-BR', options);
};

/**
 * Get day of week name in Portuguese
 * @param date - Date object or ISO string
 * @returns Day name (e.g., "Segunda-feira")
 */
export const getDayOfWeek = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const dayName = d.toLocaleDateString('pt-BR', options);
  // Capitalize first letter
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
};

/**
 * Check if a date is today
 * @param date - Date object or ISO string
 * @returns true if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates are on the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

/**
 * Get all days in a week starting from a given date
 * @param startDate - Starting date (defaults to today)
 * @returns Array of 7 dates representing the week
 */
export const getWeekDays = (startDate: Date = new Date()): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  
  // Get to Monday (day 1)
  const dayOfWeek = start.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday is 0, Monday is 1
  start.setDate(start.getDate() + diff);
  
  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  
  return days;
};

/**
 * Get all days in a month
 * @param date - Any date in the target month (defaults to today)
 * @returns Array of dates representing all days in the month
 */
export const getMonthDays = (date: Date = new Date()): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
};

/**
 * Get calendar grid for a month (including padding days from prev/next month)
 * @param date - Any date in the target month
 * @returns Array of dates representing a full calendar grid (usually 35 or 42 days)
 */
export const getCalendarGrid = (date: Date = new Date()): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const grid: Date[] = [];
  
  // Add padding days from previous month
  const firstDayOfWeek = firstDay.getDay();
  const paddingStart = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday = 0
  
  for (let i = paddingStart; i > 0; i--) {
    const paddingDate = new Date(year, month, 1 - i);
    grid.push(paddingDate);
  }
  
  // Add current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    grid.push(new Date(year, month, day));
  }
  
  // Add padding days from next month to complete the grid
  const remainingDays = 42 - grid.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    grid.push(new Date(year, month + 1, i));
  }
  
  return grid;
};

/**
 * Parse DD/MM format to Date object
 * Assumes current year if not provided
 * @param dateStr - Date string in DD/MM format
 * @returns Date object
 */
export const parseDateShort = (dateStr: string): Date => {
  const [day, month] = dateStr.split('/').map(Number);
  const year = new Date().getFullYear();
  return new Date(year, month - 1, day);
};

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns true if date is before today
 */
export const isPast = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns true if date is after today
 */
export const isFuture = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d > today;
};
