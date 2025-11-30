/**
 * Business Logic Configuration - Centralized Constants
 * 
 * All thresholds, multipliers, and business rules are defined here.
 * This ensures consistency across all calculations and makes
 * business logic easily auditable and configurable.
 */

export const ALERT_THRESHOLDS = {
  INFO: 0.80,
  WARNING: 0.90,
  CRITICAL: 1.00
} as const;

export const MARGIN_THRESHOLDS = {
  TARGET_MIN: 0.20,
  TARGET_MAX: 0.30,
  ALERT: 0.15
} as const;

export const OVERTIME_MULTIPLIER = 1.5;

export const PAYMENT_TERMS_DAYS = 30;

export const CONTRACT_EXPIRY_THRESHOLDS = {
  CRITICAL_DAYS: 7,
  WARNING_DAYS: 30,
  NOTICE_DAYS: 60
} as const;

export const VENDOR_PERFORMANCE = {
  EXCELLENT_ON_TIME: 0.95,
  EXCELLENT_REJECTION: 0.05,
  GOOD_ON_TIME: 0.85,
  GOOD_REJECTION: 0.10,
  FAIR_ON_TIME: 0.70
} as const;

export type AlertSeverity = 'critical' | 'warning' | 'info' | null;
export type AlertColor = 'red' | 'yellow' | 'blue' | 'gray';
export type VendorRating = 'excellent' | 'good' | 'fair' | 'needs_improvement';
export type ExpirationAlertLevel = 'critical' | 'warning' | 'notice' | null;

export const MILLISECONDS_PER_DAY = 86400000;
