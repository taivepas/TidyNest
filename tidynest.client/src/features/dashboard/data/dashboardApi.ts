import type { DashboardData } from '../types/dashboard';
import { dashboardMockData } from './dashboardMockData';

/**
 * Mock async API for fetching dashboard data.
 *
 * This serves as the single typed boundary for the dashboard feature.
 * When a real backend is introduced, keep this function's return type
 * stable and evolve {@link DashboardData} additively so that UI
 * components continue to work without large refactors.
 *
 * The small timeout simulates a real network roundtrip so loading
 * states and transitions can be exercised.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardMockData), 250);
  });
}
