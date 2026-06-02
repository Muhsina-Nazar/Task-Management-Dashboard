import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a YYYY-MM-DD date string into DD-MM-YYYY format.
 */
export function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  }
  return dateStr;
}

/**
 * Parses a DD-MM-YYYY date string into YYYY-MM-DD format.
 */
export function parseDateFromDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}
