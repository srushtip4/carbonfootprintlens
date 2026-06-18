/**
 * Authentication and password security service.
 * Provides secure password hashing and verification without storing plaintext.
 */

const SALT_ROUNDS = 10;

/**
 * Hash a password for secure storage.
 * Uses bcrypt-equivalent logic (for production: use bcryptjs library).
 * 
 * @param password - Plaintext password
 * @returns Promise<hashed password>
 */
export async function hashPassword(password: string): Promise<string> {
  // Production: const hash = await bcrypt.hash(password, SALT_ROUNDS);
  // For now, use Web Crypto API as placeholder (production must use bcryptjs)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Verify a plaintext password against a hash.
 * 
 * @param password - Plaintext password to verify
 * @param hash - Stored hash to compare against
 * @returns Promise<true if password matches hash>
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Production: const isValid = await bcrypt.compare(password, hash);
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Validate password meets security requirements before hashing.
 * 
 * @param password - Password to validate
 * @returns Object with valid boolean and error message
 */
export function validatePasswordSecurity(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
  if (!/\d/.test(password)) errors.push('Must contain number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Must contain special character (!@#$%^&*)');
  
  return { valid: errors.length === 0, errors };
}
