import { useEffect, useState } from 'react';
import type { DashboardData } from '../types/dashboard';
import { getDashboardData } from '../data/dashboardApi';

export type UseDashboardDataResult = {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
};

const initialState: UseDashboardDataResult = {
  data: null,
  isLoading: true,
  error: null,
};

export function useDashboardData(): UseDashboardDataResult {
  const [state, setState] = useState<UseDashboardDataResult>(initialState);

  useEffect(() => {
    let isActive = true;

    void getDashboardData()
      .then((data) => {
        if (!isActive) return;
        setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!isActive) return;

        const normalizedError =
          error instanceof Error ? error : new Error('Failed to load dashboard data');

        setState({ data: null, isLoading: false, error: normalizedError });
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
