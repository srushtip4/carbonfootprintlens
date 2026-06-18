/**
 * Emissions calculation service.
 *
 * All carbon-footprint math is concentrated here so it can be tested
 * independently of the UI and so the factors are in one discoverable place.
 */
import { QuizAnswers, EmissionBreakdown, LocaleConfig } from '../types';

// ---- Emission factors (could be moved to a JSON/DB for per-country overrides) ----

/** CO2 per km for each transport mode, indexed by q1_transport_mode value. */
const TRANSPORT_MODE_FACTOR: readonly number[] = [1.0, 0.75, 0.5, 0.15, 0.1, 0.0];

/** Weekly rideshare CO2 in kg, indexed by q4_rideshare_frequency value. */
const RIDESHARE_FACTOR: readonly number[] = [0, 0.8, 2.0, 4.5];

/** kg CO2 per passenger-km for short-haul flights. */
const SHORT_FLIGHT_FACTOR = 0.255;

/** kg CO2 per passenger-km for long-haul flights. */
const LONG_FLIGHT_FACTOR = 0.195;

/** Default short-haul flight distance in km. */
const SHORT_HAUL_KM = 800;

/** Default long-haul flight distance in km. */
const LONG_HAUL_KM = 4000;

/** Mile-to-km conversion factor. */
const MILES_TO_KM = 1.609;

/** Short-haul default distance in miles. */
const SHORT_HAUL_MILES = 500;

/** Long-haul default distance in miles. */
const LONG_HAUL_MILES = 2500;

/** Multiplier for each heating fuel type, indexed by q8_heating_fuel. */
const HEATING_FUEL_FACTOR: readonly number[] = [1.0, 0.6, 1.5, 0.05];

/** Heating bill fraction used for gas calculation. */
const HEATING_BILL_FRACTION = 0.3;

/** CO2 per km for each public transit hour saved. */
const PUBLIC_TRANSIT_SAVING_PER_HOUR = 0.5;

/** Weeks per year multiplier. */
const WEEKS_PER_YEAR = 52;

/** Base kg CO2 per year for each diet type, indexed by q10_diet. */
const DIET_FACTOR: readonly number[] = [3.3, 2.5, 1.9, 1.7, 1.5];

/** Multiplier for local food, indexed by q11_local_food. */
const LOCAL_FOOD_FACTOR: readonly number[] = [1.2, 1.0, 0.85];

/** Multiplier for food waste, indexed by q12_food_waste. */
const FOOD_WASTE_FACTOR: readonly number[] = [1.3, 1.0, 0.85];

/** CO2 per garbage bag per year. */
const GARBAGE_BAG_FACTOR = 2.5;

/** Multiplier for recycling, indexed by q14_recycling. */
const RECYCLING_FACTOR: readonly number[] = [1.0, 0.7, 0.4];

/** Base kg CO2 per year for shopping, indexed by q15_shopping. */
const SHOPPING_FACTOR: readonly number[] = [2.5, 1.5, 0.8];

/** Diet factor base multiplier (converts index to kg). */
const DIET_BASE_KG = 1000;

/** Shopping factor base multiplier (converts index to kg). */
const SHOPPING_BASE_KG = 1000;

// ---- Public calculation API ----

/**
 * Calculate a full emission breakdown from quiz answers and locale config.
 *
 * @param answers - The user's 15 quiz answers
 * @param locale  - Country-specific emission factors and units
 * @returns An EmissionBreakdown with transport, flights, energy, food, waste, and total (all in kg CO2/year, rounded)
 */
export function calculateEmissions(answers: QuizAnswers, locale: LocaleConfig): EmissionBreakdown {
  const transport = calcTransport(answers, locale);
  const flights = calcFlights(answers, locale);
  const energy = calcEnergy(answers, locale);
  const food = calcFood(answers);
  const waste = calcWaste(answers);
  const total = transport + flights + energy + food + waste;

  return {
    transport: Math.round(transport),
    flights: Math.round(flights),
    energy: Math.round(energy),
    food: Math.round(food),
    waste: Math.round(waste),
    total: Math.round(total),
  };
}

type EmissionCategory = 'transport' | 'flights' | 'energy' | 'food' | 'waste';

/**
 * Find the category with the highest emission value.
 *
 * @param breakdown - An emission breakdown
 * @returns The category key with the highest value
 */
export function getWorstCategory(breakdown: EmissionBreakdown): EmissionCategory {
  const entries: [EmissionCategory, number][] = [
    ['transport', breakdown.transport],
    ['flights', breakdown.flights],
    ['energy', breakdown.energy],
    ['food', breakdown.food],
    ['waste', breakdown.waste],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

/**
 * Calculate the percentage reduction between a baseline and current value.
 *
 * @param baseline - Original emission value (kg CO2)
 * @param current  - Current emission value (kg CO2)
 * @returns Reduction percentage, clamped to [0, 100]
 */
export function getReductionPct(baseline: number, current: number): number {
  if (baseline <= 0) return 0;
  return Math.max(0, Math.min(100, ((baseline - current) / baseline) * 100));
}

/**
 * Map a reduction percentage to a garden growth level (1-5).
 *
 * @param reductionPct - Emission reduction percentage
 * @returns Garden level from 1 (dormant seed) to 5 (blossoming tree)
 */
export function getGardenLevel(reductionPct: number): 1 | 2 | 3 | 4 | 5 {
  if (reductionPct >= 25) return 5;
  if (reductionPct >= 15) return 4;
  if (reductionPct >= 6) return 3;
  if (reductionPct >= 1) return 2;
  return 1;
}

// ---- Private sub-calculations ----

function calcTransport(answers: QuizAnswers, locale: LocaleConfig): number {
  const modeFactor = TRANSPORT_MODE_FACTOR[answers.q1_transport_mode] ?? 1.0;
  const weeklyDistEmissions = answers.q2_weekly_distance * locale.distFactor * modeFactor;
  const publicTransitSavings = answers.q3_public_transit_hours * PUBLIC_TRANSIT_SAVING_PER_HOUR;
  const rideshareEmissions = RIDESHARE_FACTOR[answers.q4_rideshare_frequency] ?? 0;
  return Math.max(0, (weeklyDistEmissions + rideshareEmissions - publicTransitSavings) * WEEKS_PER_YEAR);
}

function calcFlights(answers: QuizAnswers, locale: LocaleConfig): number {
  const isMiles = locale.distanceUnit === 'miles';
  const shortKm = isMiles
    ? answers.q5_short_flights * SHORT_HAUL_MILES * MILES_TO_KM
    : answers.q5_short_flights * SHORT_HAUL_KM;
  const longKm = isMiles
    ? answers.q6_long_flights * LONG_HAUL_MILES * MILES_TO_KM
    : answers.q6_long_flights * LONG_HAUL_KM;
  return shortKm * SHORT_FLIGHT_FACTOR + longKm * LONG_FLIGHT_FACTOR;
}

function calcEnergy(answers: QuizAnswers, locale: LocaleConfig): number {
  const electricityEmissions = answers.q7_electricity_bill * 12 * locale.electricityFactor;
  const heatingFactor = HEATING_FUEL_FACTOR[answers.q8_heating_fuel] ?? 1.0;
  const heatingEmissions = answers.q7_electricity_bill * HEATING_BILL_FRACTION * 12 * locale.gasFactor * heatingFactor;
  const renewableReduction = 1 - answers.q9_renewable_pct / 100;
  return (electricityEmissions + heatingEmissions) * renewableReduction;
}

function calcFood(answers: QuizAnswers): number {
  const dietBase = (DIET_FACTOR[answers.q10_diet] ?? 2.5) * DIET_BASE_KG;
  const localMult = LOCAL_FOOD_FACTOR[answers.q11_local_food] ?? 1.0;
  const wasteMult = FOOD_WASTE_FACTOR[answers.q12_food_waste] ?? 1.0;
  return dietBase * localMult * wasteMult;
}

function calcWaste(answers: QuizAnswers): number {
  const garbageBase = answers.q13_garbage_bags * WEEKS_PER_YEAR * GARBAGE_BAG_FACTOR;
  const recyclingMult = RECYCLING_FACTOR[answers.q14_recycling] ?? 1.0;
  const shoppingBase = (SHOPPING_FACTOR[answers.q15_shopping] ?? 1.5) * SHOPPING_BASE_KG;
  return garbageBase * recyclingMult + shoppingBase;
}
