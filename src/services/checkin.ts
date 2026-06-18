/**
 * Check-in service — business logic for weekly emission tracking.
 */
import { EmissionBreakdown, WeeklyCheckin } from '../types';
import { getReductionPct, getGardenLevel } from './emissions';
import { CHECKIN_POINTS_AWARD } from '../constants';

/**
 * Compute a new weekly check-in from baseline + reduction answers.
 *
 * @param baseline - The user's baseline emission breakdown
 * @param reductions - Percentage reduction per category (0-50)
 * @param userId - Current user's ID
 * @returns A WeeklyCheckin ready to persist
 */
export function computeCheckin(
  baseline: EmissionBreakdown,
  reductions: { transport: number; energy: number; food: number; waste: number },
  userId: string,
): Omit<WeeklyCheckin, 'id' | 'checkinDate'> {
  const transportEmissions = Math.round(baseline.transport * (1 - reductions.transport / 100));
  const energyEmissions = Math.round(baseline.energy * (1 - reductions.energy / 100));
  const foodEmissions = Math.round(baseline.food * (1 - reductions.food / 100));
  const wasteEmissions = Math.round(baseline.waste * (1 - reductions.waste / 100));
  const totalNetEmissions = transportEmissions + energyEmissions + foodEmissions + wasteEmissions;
  const reductionPct = getReductionPct(baseline.total, totalNetEmissions);
  const gardenLevel = getGardenLevel(reductionPct);

  return {
    userId,
    transportEmissions,
    energyEmissions,
    foodEmissions,
    wasteEmissions,
    totalNetEmissions,
    gardenStateLevel: gardenLevel,
  };
}

/** Points awarded for completing a weekly check-in. */
export function getCheckinPoints(): number {
  return CHECKIN_POINTS_AWARD;
}
