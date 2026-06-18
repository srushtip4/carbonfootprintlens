/**
 * Comprehensive input sanitization and XSS prevention.
 * All user inputs flow through these functions before processing.
 */

/** HTML entity encoding map for XSS prevention */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

/**
 * Encode HTML special characters to prevent XSS attacks.
 * @param str - Raw string potentially containing HTML
 * @returns HTML-safe string with entities encoded
 */
export function encodeHtml(str: string): string {
  return str.replace(/[&<>"'\/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Validate and sanitize form field value.
 * @param value - Raw input value
 * @param fieldType - 'email' | 'text' | 'number' | 'url'
 * @returns Sanitized value or null if invalid
 */
export function sanitizeFieldValue(value: unknown, fieldType: string): string | number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  
  const str = String(value).trim();
  if (!str) return null;

  switch (fieldType) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str) ? str : null;
    case 'url':
      try {
        new URL(str);
        return str;
      } catch {
        return null;
      }
    case 'number':
      const num = parseFloat(str);
      return isFinite(num) ? num : null;
    default:
      return encodeHtml(str);
  }
}
