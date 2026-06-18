/**
 * Rankings / leaderboard utilities.
 */
import { Badge } from '../types';
import { BADGE_COLORS, BADGE_LETTERS, type BadgeId } from '../constants';

/** Get CSS classes for a badge based on earned status. */
export function getBadgeStyle(id: BadgeId, earned: boolean): string {
  const colors = BADGE_COLORS[id];
  return earned ? colors.earned : colors.unearned;
}

/** Get the display letter for a badge. */
export function getBadgeLetter(id: BadgeId): string {
  return BADGE_LETTERS[id];
}

/** Build an accessible label string for a badge. */
export function getBadgeLabel(badge: Badge): string {
  return `${badge.name} badge${badge.earned ? ' - earned' : ' - not yet earned'}`;
}

/** Get CSS classes for a leaderboard rank row. */
export function getRankStyle(rank: number): string {
  if (rank === 1) return 'bg-yellow-50 border-yellow-300';
  if (rank === 2) return 'bg-gray-50 border-gray-300';
  if (rank === 3) return 'bg-orange-50 border-orange-300';
  return 'bg-white border-gray-100';
}
