// =============================================================================
// Input Validation & Sanitization Utilities
// =============================================================================
// Lightweight, zero-dependency validation helpers for API route handlers.

/**
 * Strips control characters, trims whitespace, and enforces a max length.
 */
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Basic email format validation.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Basic phone number validation — allows digits, spaces, dashes, parens, and leading +.
 */
export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,20}$/.test(phone);
}

/**
 * Checks that all required fields are present and non-empty strings in the body.
 * Returns a list of missing field names (empty array = all valid).
 */
export function getMissingFields(
  requiredFields: string[],
  body: Record<string, unknown>
): string[] {
  return requiredFields.filter((field) => {
    const value = body[field];
    if (typeof value === 'string') return value.trim().length === 0;
    if (typeof value === 'number') return false; // numbers are acceptable
    return value === undefined || value === null;
  });
}

/**
 * Checks that a value is one of the allowed values.
 */
export function isOneOf<T>(value: T, allowed: T[]): boolean {
  return allowed.includes(value);
}

/**
 * Validates that a value is a positive number.
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && isFinite(value);
}
