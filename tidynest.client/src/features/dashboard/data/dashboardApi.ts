import type { DashboardData } from '../types/dashboard';

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Dashboard API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [summary, rooms, upcomingTasks, familyActivity] = await Promise.all([
    getJson<DashboardData['summary']>('/api/summary'),
    getJson<DashboardData['rooms']>('/api/rooms'),
    getJson<DashboardData['upcomingTasks']>('/api/tasks/upcoming'),
    getJson<DashboardData['familyActivity']>('/api/activity/recent'),
  ]);

  return { summary, rooms, upcomingTasks, familyActivity };
}
