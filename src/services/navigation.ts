import { ROUTES, type Route } from '../constants';

/** Centralized SPA navigation — replaces scattered window.dispatchEvent calls. */
export function navigateTo(page: Route | string): void {
  window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
}

/** Navigate to auth page. */
export function navigateToAuth(): void {
  navigateTo(ROUTES.AUTH);
}

/** Navigate to dashboard. */
export function navigateToDashboard(): void {
  navigateTo(ROUTES.DASHBOARD);
}

/** Navigate to quiz. */
export function navigateToQuiz(): void {
  navigateTo(ROUTES.QUIZ);
}
