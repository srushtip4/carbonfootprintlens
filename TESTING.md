# Testing Strategy

## Overview

CarbonLens maintains comprehensive test coverage for all business logic, utilities, and critical user flows. Our testing pyramid prioritizes unit tests for pure functions, followed by integration tests for user journeys.

**Coverage Targets:**
- Services & utilities: **≥90%**
- Components (critical paths): **≥70%**
- Overall repository: **≥85%**

## Testing Framework & Tools

- **Test Runner:** Vitest (fast, Vite-native)
- **Testing Library:** React Testing Library (for component tests)
- **Assertions:** Vitest built-in + React Testing Library matchers
- **Environment:** Happy-DOM (lightweight, fast)
- **Coverage Reporter:** V8 provider with HTML output

## Test Categories

### 1. Unit Tests (Highest Priority)

**Location:** `src/**/__tests__/*.test.ts` or `src/**/*.test.ts`

**Purpose:** Test pure functions in isolation

**Coverage Requirements:**
- All calculation functions (100%)
- All validators (100%)
- All utility functions (95%+)

**Key Unit Test Files:**

```
src/services/__tests__/
├── emissions.test.ts (carbon calculations)
├── checkin.test.ts (weekly check-ins)
├── rankings.test.ts (badge logic)
└── auth.test.ts (password hashing - future)

src/utils/__tests__/
├── validation.test.ts (input validation)
├── locale.test.ts (country configs)
└── sanitization.test.ts (XSS prevention - future)
```

### 2. Integration Tests (Medium Priority)

**Location:** `src/__tests__/integration/`

**Purpose:** Test user flows across multiple components

**Examples:**
- User signup → create account → redirect to dashboard
- Login → quiz completion → points awarded
- Dashboard → weekly checkin → garden level updated

### 3. Component Tests (Lower Priority)

**Location:** `src/components/**/__tests__/*.test.tsx`

**Purpose:** Test component rendering & user interactions

**Focus areas:**
- ProtectedRoute (checks auth)
- ErrorBoundary (error handling)
- Form validation feedback

## Example Unit Tests

### Test: Emissions Calculator

```typescript
// src/services/__tests__/emissions.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateEmissions,
  getWorstCategory,
  getReductionPct,
  getGardenLevel,
} from '../emissions';
import { QuizAnswers, EmissionBreakdown, LocaleConfig } from '../../types';

describe('Emissions Service', () => {
  let mockLocale: LocaleConfig;

  beforeEach(() => {
    mockLocale = {
      distanceUnit: 'miles',
      currencySymbol: '$',
      currencyCode: 'USD',
      emissionSource: 'EPA',
      distFactor: 0.411,
      electricityFactor: 0.85,
      gasFactor: 0.55,
    };
  });

  describe('calculateEmissions', () => {
    it('should calculate transport emissions from weekly distance', () => {
      const answers: QuizAnswers = {
        q1_transport_mode: 0, // car
        q2_weekly_distance: 100,
        q3_public_transit_hours: 0,
        q4_rideshare_frequency: 0,
        q5_short_flights: 0,
        q6_long_flights: 0,
        q7_electricity_bill: 0,
        q8_heating_fuel: 0,
        q9_renewable_pct: 0,
        q10_diet: 0,
        q11_local_food: 0,
        q12_food_waste: 0,
        q13_garbage_bags: 0,
        q14_recycling: 0,
        q15_shopping: 0,
      };

      const result = calculateEmissions(answers, mockLocale);

      // 100 miles/week * 0.411 distFactor * 1.0 car mode * 52 weeks/year
      expect(result.transport).toBe(2137); // Math.round(100 * 0.411 * 52)
    });

    it('should reduce emissions with public transit', () => {
      const answers: QuizAnswers = {
        q1_transport_mode: 0,
        q2_weekly_distance: 100,
        q3_public_transit_hours: 10, // 10 hours reduces emissions
        q4_rideshare_frequency: 0,
        q5_short_flights: 0,
        q6_long_flights: 0,
        q7_electricity_bill: 0,
        q8_heating_fuel: 0,
        q9_renewable_pct: 0,
        q10_diet: 0,
        q11_local_food: 0,
        q12_food_waste: 0,
        q13_garbage_bags: 0,
        q14_recycling: 0,
        q15_shopping: 0,
      };

      const result = calculateEmissions(answers, mockLocale);

      // Should be less than without transit savings
      expect(result.transport).toBeLessThan(2137);
    });

    it('should calculate flight emissions for short-haul', () => {
      const answers: QuizAnswers = {
        q1_transport_mode: 0,
        q2_weekly_distance: 0,
        q3_public_transit_hours: 0,
        q4_rideshare_frequency: 0,
        q5_short_flights: 2, // 2 short flights per year
        q6_long_flights: 0,
        q7_electricity_bill: 0,
        q8_heating_fuel: 0,
        q9_renewable_pct: 0,
        q10_diet: 0,
        q11_local_food: 0,
        q12_food_waste: 0,
        q13_garbage_bags: 0,
        q14_recycling: 0,
        q15_shopping: 0,
      };

      const result = calculateEmissions(answers, mockLocale);

      // 2 flights * 500 miles (default) * 1.609 km/mile * 0.255 kg CO2/km
      expect(result.flights).toBeGreaterThan(0);
    });

    it('should return zero for all zero inputs', () => {
      const answers: QuizAnswers = {
        q1_transport_mode: 0,
        q2_weekly_distance: 0,
        q3_public_transit_hours: 0,
        q4_rideshare_frequency: 0,
        q5_short_flights: 0,
        q6_long_flights: 0,
        q7_electricity_bill: 0,
        q8_heating_fuel: 0,
        q9_renewable_pct: 0,
        q10_diet: 0,
        q11_local_food: 0,
        q12_food_waste: 0,
        q13_garbage_bags: 0,
        q14_recycling: 0,
        q15_shopping: 0,
      };

      const result = calculateEmissions(answers, mockLocale);

      expect(result.total).toBe(0);
    });
  });

  describe('getWorstCategory', () => {
    it('should identify transport as worst category', () => {
      const breakdown: EmissionBreakdown = {
        transport: 5000,
        flights: 100,
        energy: 500,
        food: 1000,
        waste: 200,
        total: 6800,
      };

      expect(getWorstCategory(breakdown)).toBe('transport');
    });

    it('should identify food as worst category', () => {
      const breakdown: EmissionBreakdown = {
        transport: 500,
        flights: 100,
        energy: 500,
        food: 3000,
        waste: 200,
        total: 4300,
      };

      expect(getWorstCategory(breakdown)).toBe('food');
    });
  });

  describe('getReductionPct', () => {
    it('should calculate 50% reduction', () => {
      const baseline = 1000;
      const current = 500;

      expect(getReductionPct(baseline, current)).toBe(50);
    });

    it('should calculate 0% reduction (no change)', () => {
      const baseline = 1000;
      const current = 1000;

      expect(getReductionPct(baseline, current)).toBe(0);
    });

    it('should clamp to max 100%', () => {
      const baseline = 1000;
      const current = 0;

      expect(getReductionPct(baseline, current)).toBe(100);
    });

    it('should return 0% for zero baseline', () => {
      const baseline = 0;
      const current = 500;

      expect(getReductionPct(baseline, current)).toBe(0);
    });
  });

  describe('getGardenLevel', () => {
    it('should return level 1 for 0% reduction', () => {
      expect(getGardenLevel(0)).toBe(1);
    });

    it('should return level 2 for 1% reduction', () => {
      expect(getGardenLevel(1)).toBe(2);
    });

    it('should return level 3 for 6% reduction', () => {
      expect(getGardenLevel(6)).toBe(3);
    });

    it('should return level 4 for 15% reduction', () => {
      expect(getGardenLevel(15)).toBe(4);
    });

    it('should return level 5 for 25%+ reduction', () => {
      expect(getGardenLevel(25)).toBe(5);
      expect(getGardenLevel(50)).toBe(5);
      expect(getGardenLevel(100)).toBe(5);
    });
  });
});
```

### Test: Input Validation

```typescript
// src/utils/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateName,
  validatePassword,
  getPasswordStrength,
  validateNumberInput,
  sanitizeText,
  validateCity,
} from '../validation';

describe('Input Validation', () => {
  describe('validateEmail', () => {
    it('should accept valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.valid).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.valid).toBe(false);
    });

    it('should reject overly long email', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should accept valid name', () => {
      const result = validateName('John Doe');
      expect(result.valid).toBe(true);
    });

    it('should reject name with HTML characters', () => {
      const result = validateName('John <script>');
      expect(result.valid).toBe(false);
    });

    it('should reject name shorter than 2 chars', () => {
      const result = validateName('J');
      expect(result.valid).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = validateName('  Jane Smith  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should accept password >= 6 chars', () => {
      const result = validatePassword('MyPass123!');
      expect(result.valid).toBe(true);
    });

    it('should reject password < 6 chars', () => {
      const result = validatePassword('pass');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('6 characters');
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should rate weak password as score 1', () => {
      const strength = getPasswordStrength('pass123');
      expect(strength.score).toBeLessThanOrEqual(1);
    });

    it('should rate strong password as score 4', () => {
      const strength = getPasswordStrength('MyP@ssw0rd!');
      expect(strength.score).toBeGreaterThanOrEqual(3);
    });

    it('should suggest uppercase if missing', () => {
      const strength = getPasswordStrength('mypassword123!');
      expect(strength.suggestions.some(s => s.toLowerCase().includes('uppercase'))).toBe(true);
    });

    it('should suggest special character if missing', () => {
      const strength = getPasswordStrength('MyPassword123');
      expect(strength.suggestions.some(s => s.toLowerCase().includes('special'))).toBe(true);
    });
  });

  describe('validateNumberInput', () => {
    it('should accept number within range', () => {
      const result = validateNumberInput(50, 0, 100, 'Test');
      expect(result.valid).toBe(true);
    });

    it('should reject number below min', () => {
      const result = validateNumberInput(-10, 0, 100, 'Test');
      expect(result.valid).toBe(false);
    });

    it('should reject number above max', () => {
      const result = validateNumberInput(150, 0, 100, 'Test');
      expect(result.valid).toBe(false);
    });

    it('should reject NaN', () => {
      const result = validateNumberInput(NaN, 0, 100, 'Test');
      expect(result.valid).toBe(false);
    });

    it('should reject undefined', () => {
      const result = validateNumberInput(undefined, 0, 100, 'Test');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should remove HTML characters', () => {
      const result = sanitizeText('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should trim whitespace', () => {
      const result = sanitizeText('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should preserve safe characters', () => {
      const result = sanitizeText('Hello-World_123');
      expect(result).toBe('Hello-World_123');
    });
  });

  describe('validateCity', () => {
    it('should accept valid city', () => {
      const result = validateCity('New York');
      expect(result.valid).toBe(true);
    });

    it('should reject empty city', () => {
      const result = validateCity('');
      expect(result.valid).toBe(false);
    });
  });
});
```

## Running Tests

### Development

```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Run specific test file
npm test emissions.test.ts

# Run tests matching pattern
npm test -- --grep "calculateEmissions"
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html

# Check coverage meets thresholds
npm test -- --coverage
```

### CI/CD

```bash
# Run in CI mode (no watch, exit with code)
npm test -- --run

# Generate coverage for upload
npm run test:coverage
```

## Coverage Thresholds

Current targets in `vite.config.ts`:

```typescript
coverage: {
  thresholds: {
    statements: 90,
    branches: 80,
    functions: 85,
    lines: 90,
  },
}
```

Tests fail if coverage drops below these thresholds.

## Test File Structure

```
src/
├── services/
│   ├── emissions.ts
│   └── __tests__/
│       └── emissions.test.ts
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts
├── hooks/
│   ├── useEmissions.ts
│   └── __tests__/
│       └── useEmissions.test.ts
└── __tests__/
    ├── integration/
    │   └── auth-flow.test.ts
    └── fixtures/
        └── mocks.ts
```

## Best Practices

### Do's ✅

- Test behavior, not implementation details
- Use descriptive test names: `should calculate 50% reduction from baseline`
- Group related tests with `describe()` blocks
- Use `beforeEach()` for common setup
- Mock external dependencies
- Test edge cases (zero, negative, null, undefined)
- Keep tests fast (avoid I/O where possible)
- Aim for 1 assertion per test (or 2-3 related)

### Don'ts ❌

- Don't test React internals (hooks implementation)
- Don't test third-party libraries (recharts, lucide-react)
- Don't leave `skip()` or `only()` in commits
- Don't test private functions directly
- Don't create interdependent tests
- Don't use real APIs in tests (mock everything)

## Mocking Strategies

### Mock User Data

```typescript
// src/test/fixtures/mocks.ts
export const mockUser = {
  id: 'test_user_1',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  name: 'Test User',
  country: 'US' as const,
  city: 'New York',
  createdAt: Date.now(),
};

export const mockQuizAnswers: QuizAnswers = {
  q1_transport_mode: 0,
  q2_weekly_distance: 50,
  // ... all 15 fields
};

export const mockLocale: LocaleConfig = {
  distanceUnit: 'miles',
  currencySymbol: '$',
  currencyCode: 'USD',
  emissionSource: 'EPA',
  distFactor: 0.411,
  electricityFactor: 0.85,
  gasFactor: 0.55,
};
```

### Mock Functions

```typescript
import { vi } from 'vitest';

// Mock database calls
vi.mock('../db/database', () => ({
  createUser: vi.fn().mockResolvedValue(mockUser),
  getUserById: vi.fn().mockResolvedValue(mockUser),
}));
```

## Future Testing Enhancements

- [ ] E2E tests with Playwright (full user flows)
- [ ] Performance benchmarks (render times)
- [ ] Visual regression tests (screenshot diffs)
- [ ] Accessibility tests (a11y compliance)
- [ ] Security scanning (SAST tools)
- [ ] Mutation testing (catch missing assertions)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest API Reference](https://jestjs.io/docs/api) (similar syntax to Vitest)

## Questions?

Run tests and check coverage:
```bash
npm test -- --coverage
npm run test:watch
```

**Last Updated:** 2024  
**Version:** 1.0
