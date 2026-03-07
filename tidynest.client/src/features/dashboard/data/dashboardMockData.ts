import type { DashboardData } from '../types/dashboard';

// Simple, static mock data representing a cozy household snapshot.
export const dashboardMockData: DashboardData = {
  summary: {
    todayTasksTotal: 7,
    todayTasksCompleted: 3,
    roomsNeedingAttention: 2,
    weeklyProgressPercent: 64,
  },
  rooms: [
    {
      id: 'kitchen',
      name: 'Kitchen',
      status: 'needs_tidy',
      lastCleanedAt: '2026-03-06T18:30:00.000Z',
    },
    {
      id: 'living-room',
      name: 'Living Room',
      status: 'clean',
      lastCleanedAt: '2026-03-06T20:15:00.000Z',
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      status: 'deep_clean',
      lastCleanedAt: '2026-02-28T10:00:00.000Z',
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      status: 'needs_tidy',
      lastCleanedAt: '2026-03-05T21:00:00.000Z',
    },
  ],
  upcomingTasks: [
    {
      id: 'task-1',
      title: 'Empty the dishwasher',
      dueAt: '2026-03-07T19:00:00.000Z',
      roomId: 'kitchen',
      isRecurring: true,
    },
    {
      id: 'task-2',
      title: 'Quick living room reset',
      dueAt: '2026-03-07T20:30:00.000Z',
      roomId: 'living-room',
      isRecurring: false,
    },
    {
      id: 'task-3',
      title: 'Bathroom surfaces wipe-down',
      dueAt: '2026-03-08T09:00:00.000Z',
      roomId: 'bathroom',
      isRecurring: true,
    },
  ],
  familyActivity: [
    {
      id: 'activity-1',
      type: 'task_completed',
      timestamp: '2026-03-07T08:15:00.000Z',
      description: 'Laundry folded and put away',
      actor: 'Alex',
    },
    {
      id: 'activity-2',
      type: 'task_added',
      timestamp: '2026-03-07T09:30:00.000Z',
      description: 'Added "Water the plants" to today',
      actor: 'Jamie',
    },
    {
      id: 'activity-3',
      type: 'note',
      timestamp: '2026-03-06T21:00:00.000Z',
      description: 'Weekend deep clean planned for Sunday morning',
      actor: 'Household',
    },
  ],
};
