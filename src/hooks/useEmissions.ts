/**
 * Custom hook for memoized emission calculations.
 * Prevents recalculation when inputs haven't changed.
 */
import { useMemo } from 'react';
import { QuizAnswers, EmissionBreakdown, LocaleConfig } from '../types';
import { calculateEmissions } from '../services/emissions';

export function useEmissions(
  answers: QuizAnswers | null,
  locale: LocaleConfig | null,
): EmissionBreakdown | null {
  return useMemo(() => {
    if (!answers || !locale) return null;
    return calculateEmissions(answers, locale);
  }, [answers, locale]);
}

export function useMemoizedValue<T>(value: T, dependencies: unknown[]): T {
  return useMemo(() => value, dependencies);
}
