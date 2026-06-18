# Security Policy

## Overview

CarbonLens implements defense-in-depth security practices to protect user data and prevent common web vulnerabilities. This document outlines our security measures, best practices, and guidelines for contributors.

## Key Security Practices

### Authentication & Password Management

- **No plaintext password storage**: All passwords are hashed using SHA-256 (production should use bcryptjs with SALT_ROUNDS=10)
- **Secure password verification**: Passwords compared only via hash, never stored in memory longer than necessary
- **Session management via secure user ID storage**: Only non-sensitive user IDs persisted in localStorage
- **No sensitive tokens in localStorage**: Auth tokens and password hashes never stored locally
- **Password reset flow**: Secure OTP-based password reset with time-limited codes

### Input Validation & Sanitization

**All user inputs validated through centralized utilities:**

- **Email validation**: RFC 5322 compliant pattern matching
- **Name validation**: 2-100 characters, no HTML/script injection characters
- **Numeric input validation**: Min/max bounds checked, NaN/Infinity rejected
- **HTML escaping**: Special characters `< > " ' & /` encoded to prevent XSS
- **Form field sanitization**: Whitelist approach - only known-safe patterns accepted
- **Database insertion**: All strings sanitized before write operations

**Validation entry points:**
```typescript
// src/utils/validation.ts
- validateEmail(email)
- validateName(name)
- validatePassword(password)
- validateNumberInput(value, min, max, label)
- validateCity(city)
- sanitizeText(input)
- sanitizeForDisplay(input)
```

### Data Storage Security

- **LocalStorage restrictions**: Only non-sensitive keys allowed (whitelist in `src/services/storage.ts`)
- **IndexedDB usage**: No confidential data (passwords, tokens) ever persisted
- **Cache expiration**: User cache auto-cleared after 60 seconds
- **User ID only**: localStorage contains only `cf_current_user` ID, never password or email
- **Logout cleanup**: All storage cleared on user logout via `clearStorage()`

**Allowed localStorage keys:**
```
- cf_current_user_id
- cf_theme_preference
- cf_language
- cf_tutorial_completed
```

### Error Handling & Information Disclosure

- **User-friendly error messages**: No stack traces exposed to end users
- **Database errors caught**: All IDB errors logged safely without leaking schema info
- **Component error isolation**: ErrorBoundary catches and isolates component failures
- **No sensitive data in errors**: Error messages never contain email, user ID, or calculation details
- **Logging best practices**: Console errors in dev mode only, production uses error tracking service

### Cross-Site Scripting (XSS) Prevention

- **HTML encoding**: All user inputs HTML-escaped before rendering
- **React auto-escaping**: JSX automatically escapes text content
- **Validation regex**: Rejects `< > " ' &` characters in text fields
- **Content Security Policy ready**: Future: CSP headers via deployment config
- **No dangerouslySetInnerHTML**: Never used in codebase

### Cross-Site Request Forgery (CSRF)

- **Form validation**: Email/password verified on submission
- **State-changing ops**: All account modifications require re-authentication
- **Future enhancement**: CSRF tokens for state-changing API calls (when backend added)

### Dependency Security

All dependencies regularly audited and updated:

```bash
npm audit  # Check for vulnerabilities
npm audit fix  # Auto-fix when available
npm outdated  # Check for updates
```

**Key dependencies:**
- **recharts** (^3.8.1): Trusted charting library, actively maintained
- **lucide-react** (^0.344.0): Minimal icon library, no large dependency tree
- **react-router-dom** (^7.17.0): Standard routing, community-vetted

**Excluded from dependency tree:**
- No authentication libraries (using native Web Crypto API)
- No ORM/query builders (IndexedDB used directly for simplicity)
- No external API calls (demo uses mock data)

## Security Checklist

Development & review checklist before commits:

- [ ] No plaintext passwords in code or commits
- [ ] Input validation applied to all form fields
- [ ] HTML encoding on all user-displayed content
- [ ] Error messages don't leak sensitive data
- [ ] localStorage used only for non-sensitive data
- [ ] Password functions hash before storage
- [ ] No credentials in environment variables
- [ ] Tests pass for validation functions
- [ ] Linter passes (no security warnings)
- [ ] No `any` types used (strict TypeScript)

## Authentication Flow

### Sign Up
```
1. User enters: email, password, name, country, city
2. Client-side validation: validateEmail, validateName, validatePassword, validateCity
3. Input sanitization: sanitizeText applied to text fields
4. Password hashing: SHA-256 hash computed
5. Database insert: User record with hash (NOT plaintext)
6. Session: User ID stored in localStorage
```

### Login
```
1. User enters: email, password
2. Lookup: Get user by email from IndexedDB
3. Hash verification: Compare password hash with stored hash
4. Session: Set localStorage with user ID
5. Error: Generic "Invalid email or password" (no user enumeration)
```

### Password Reset
```
1. Enter email → Lookup user
2. Generate OTP: 6-digit code shown (demo mode)
3. Verify OTP: Compare entered code to generated code
4. New password: Validate strength, hash, update database
5. Session: User redirected to login (no auto-login)
```

## Third-Party Security

### Supabase Integration (Future)

When adding Supabase for backend:

- [ ] Use Row Level Security (RLS) on all tables
- [ ] Never expose API keys in frontend code
- [ ] Use service role key only on backend
- [ ] Validate all API responses on client
- [ ] Implement rate limiting
- [ ] Enable audit logging

### API Security (Future)

When building backend API:

- [ ] HTTPS required (no HTTP)
- [ ] CORS configured for frontend origin only
- [ ] Rate limiting on auth endpoints (5 req/min)
- [ ] Input validation server-side (never trust client)
- [ ] SQL injection prevention via parameterized queries
- [ ] Response size limits (prevent DoS)
- [ ] Authentication required for all sensitive endpoints

## Incident Response

### If a vulnerability is discovered:

1. **Do not open a public GitHub issue**
2. **Email security team** (in future, create security@carbonfootprintlens.dev)
3. **Provide details**:
   - Type of vulnerability (XSS, SQL injection, etc.)
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
4. **Timeline**:
   - We'll acknowledge within 24 hours
   - Fix development: 1 week target
   - Public disclosure: After patch release

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://react.dev/learn/security)

## Future Enhancements

- [ ] 2FA via authenticator apps (TOTP)
- [ ] Email verification on signup
- [ ] Account recovery via security questions
- [ ] Activity logs & suspicious login detection
- [ ] Session timeout after 30 minutes
- [ ] Password expiration policy
- [ ] Audit trail for badge/points changes
- [ ] Content Security Policy (CSP) headers
- [ ] Subresource Integrity (SRI) for CDN resources

## Contributors

All contributors must:

1. Follow this security policy
2. Run `npm audit` before commits
3. Use security-focused code review
4. Report vulnerabilities responsibly
5. Keep dependencies updated

**Last Updated:** 2024  
**Version:** 1.0
