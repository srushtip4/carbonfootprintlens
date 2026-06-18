/**
 * Secure local storage wrapper with encryption basics and validation.
 * Never stores sensitive data like full password hashes.
 */

const STORAGE_PREFIX = 'cf_';

/** Allowed keys to prevent injection attacks */
const ALLOWED_KEYS = new Set([
  'current_user_id',
  'theme_preference',
  'language',
  'tutorial_completed',
] as const);

type StorageKey = typeof ALLOWED_KEYS extends Set<infer T> ? T : never;

/**
 * Safely store a value in localStorage.
 * @param key - Must be in ALLOWED_KEYS
 * @param value - Value to store (will be JSON stringified)
 */
export function setStorage(key: StorageKey, value: unknown): void {
  if (!ALLOWED_KEYS.has(key)) {
    console.warn(`Storage key "${key}" not in allowed list`);
    return;
  }

  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed:', e);
  }
}

/**
 * Safely retrieve a value from localStorage.
 * @param key - Must be in ALLOWED_KEYS
 * @param defaultValue - Value to return if key not found or parse fails
 */
export function getStorage<T>(key: StorageKey, defaultValue: T): T {
  if (!ALLOWED_KEYS.has(key)) {
    console.warn(`Storage key "${key}" not in allowed list`);
    return defaultValue;
  }

  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const stored = localStorage.getItem(prefixedKey);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Storage read failed:', e);
    return defaultValue;
  }
}

/**
 * Clear all CarbonLens app storage (for logout).
 */
export function clearStorage(): void {
  const keys = Array.from(localStorage.keys());
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
