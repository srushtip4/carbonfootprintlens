/** Central application constants — replaces magic numbers across the codebase. */

// ---- Navigation ----
export const ROUTES = {
  AUTH: 'auth',
  EDUCATION: 'education',
  DASHBOARD: 'dashboard',
  QUIZ: 'quiz',
  ACTIONS: 'actions',
  GARDEN: 'garden',
  LEADERBOARD: 'leaderboard',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// ---- Chart Colors ----
export const CHART_COLORS = ['#f97316', '#3b82f6', '#eab308', '#22c55e', '#8b5cf6'] as const;
export const CHART_COLOR_MAP: Record<string, string> = {
  transport: '#f97316',
  flights: '#3b82f6',
  energy: '#eab308',
  food: '#22c55e',
  waste: '#8b5cf6',
};

// ---- Badge System ----
export const BADGE_IDS = ['bronze', 'silver', 'gold', 'platinum'] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

export const BADGE_COLORS: Record<BadgeId, { earned: string; unearned: string }> = {
  bronze: { earned: 'bg-orange-400 text-white', unearned: 'bg-gray-100 text-gray-400' },
  silver: { earned: 'bg-gray-400 text-white', unearned: 'bg-gray-100 text-gray-400' },
  gold: { earned: 'bg-yellow-500 text-white', unearned: 'bg-gray-100 text-gray-400' },
  platinum: { earned: 'bg-emerald-600 text-white', unearned: 'bg-gray-100 text-gray-400' },
};

export const BADGE_LETTERS: Record<BadgeId, string> = {
  bronze: 'B',
  silver: 'S',
  gold: 'G',
  platinum: 'P',
};

export const BADGE_THRESHOLDS = {
  SILVER_POINTS: 500,
  SILVER_STREAK: 3,
  GOLD_POINTS: 1500,
  GOLD_REDUCTION_PCT: 15,
  PLATINUM_RANK: 100,
} as const;

export const DEFAULT_BADGES = [
  { id: 'bronze' as BadgeId, name: 'Bronze', description: 'Complete the initial quiz', earned: false, earnedAt: null },
  { id: 'silver' as BadgeId, name: 'Silver', description: '500 Eco-Points + 3-week streak', earned: false, earnedAt: null },
  { id: 'gold' as BadgeId, name: 'Gold', description: '1500 Eco-Points + 15% reduction', earned: false, earnedAt: null },
  { id: 'platinum' as BadgeId, name: 'Platinum', description: 'Top 100 lowest footprint globally', earned: false, earnedAt: null },
] as const;

// ---- Garden Growth Phases ----
export const GARDEN_PHASES = [
  { level: 1, name: 'Dormant Seed', desc: 'Your journey begins here', minReductionPct: 0 },
  { level: 2, name: 'Green Sprout', desc: 'A tiny sprout breaks through', minReductionPct: 1 },
  { level: 3, name: 'Leafy Sapling', desc: 'Growing stronger with leaves', minReductionPct: 6 },
  { level: 4, name: 'Young Tree', desc: 'A strong young tree with branches', minReductionPct: 15 },
  { level: 5, name: 'Blossoming Eco-Tree', desc: 'A magnificent tree with flowers and fruit!', minReductionPct: 25 },
] as const;

// ---- Validation Limits ----
export const VALIDATION = {
  EMAIL_MAX_LENGTH: 254,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
} as const;

// ---- Quiz ----
export const QUIZ_POINTS_AWARD = 100;
export const CHECKIN_POINTS_AWARD = 50;
export const ACTION_POINTS_AWARD = 10;

// ---- Auth ----
export const AUTH_REDIRECT_DELAY_MS = 2500;
export const OTP_CODE_MIN = 100000;
export const OTP_CODE_MAX = 999999;

// ---- Seed Data ----
export const SEED = {
  MOCK_USER_COUNT: 150,
  DATE_RANGE_DAYS_MIN: 30,
  DATE_RANGE_DAYS_MAX: 365,
  CHECKIN_COUNT_MIN: 1,
  CHECKIN_COUNT_MAX: 8,
  REDUCTION_PCT_MIN: -5,
  REDUCTION_PCT_MAX: 30,
  ECO_POINTS_MIN: 50,
  ECO_POINTS_MAX: 2500,
  STREAK_MIN: 1,
  STREAK_MAX: 12,
} as const;

// ---- Carbon Math Education ----
export const EDUCATION_ACTIVITIES = [
  { factor: 0.21, unit: 'km', defaultVal: 50, max: 2000, color: 'text-orange-500' },
  { factor: 0.255, unit: 'km', defaultVal: 500, max: 2000, color: 'text-blue-500' },
  { factor: 6.61, unit: 'meal', defaultVal: 1, max: 10, color: 'text-red-500' },
  { factor: 0.417, unit: 'kWh', defaultVal: 30, max: 1000, color: 'text-yellow-500' },
] as const;
