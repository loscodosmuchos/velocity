import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with commas every 3 digits, no decimals
 * Example: 1234567 → "1,234,567"
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-US');
}

/**
 * Format a currency value with $ prefix, commas, no cents
 * Example: 1234567.89 → "$1,234,567"
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '$0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0';
  return '$' + Math.round(num).toLocaleString('en-US');
}

/**
 * Format a currency value with $ prefix, commas, AND cents (2 decimal places)
 * Example: 1234567.89 → "$1,234,567.89"
 */
export function formatCurrencyWithCents(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '$0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * Format large currency values with K/M/B suffixes
 * Example: 2540000 → "$2.54M"
 */
export function formatCurrencyCompact(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '$0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0';
  
  if (num >= 1000000000) {
    return '$' + (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return '$' + (num / 1000).toFixed(0) + 'K';
  }
  return '$' + Math.round(num).toLocaleString('en-US');
}

/**
 * Format a percentage value, no decimals
 * Example: 75.5 → "76%"
 */
export function formatPercent(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0%';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  return Math.round(num) + '%';
}

/**
 * Normalize status string for case-insensitive comparison
 * Trims whitespace and converts to lowercase
 * Example: " Active " → "active", "PENDING" → "pending"
 */
export function normalizeStatus(status: string | null | undefined): string {
  if (!status) return '';
  return String(status).trim().toLowerCase();
}

/**
 * Check if status matches (case-insensitive)
 * Example: isStatus("Active", "active") → true
 */
export function isStatus(actual: string | null | undefined, expected: string): boolean {
  return normalizeStatus(actual) === normalizeStatus(expected);
}

/**
 * Safely convert a value to a number for currency calculations
 * Falls back through multiple fields if needed
 * Treats explicit 0 as valid (only skips null/undefined/empty/NaN)
 * Example: asCurrencyNumber(invoice.actualAmount, invoice.requestedAmount, invoice.amount)
 */
export function asCurrencyNumber(...values: (number | string | null | undefined)[]): number {
  for (const val of values) {
    if (val === null || val === undefined || val === '') continue;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (!isNaN(num)) return num; // Accept 0 as valid
  }
  return 0;
}

/**
 * Safely calculate a percentage, guarding against NaN and division by zero
 */
export function safePercent(numerator: number | null | undefined, denominator: number | null | undefined): number {
  const num = asCurrencyNumber(numerator);
  const den = asCurrencyNumber(denominator);
  if (den === 0) return 0;
  const result = (num / den) * 100;
  return isNaN(result) ? 0 : Math.min(100, Math.max(0, result));
}
