export type SummaryMetrics = {
  /** Total number of tasks the household is scheduled to handle today. */
  todayTasksTotal: number;
  /** Number of today's tasks that have already been completed. */
  todayTasksCompleted: number;
  /** Count of rooms that currently need attention. */
  roomsNeedingAttention: number;
  /** Weekly completion progress as a percentage (0-100). */
  weeklyProgressPercent: number;
};

export type RoomCleanlinessStatus = 'clean' | 'needs_tidy' | 'deep_clean';

export type RoomStatus = {
  /** Stable numeric identifier for the room. */
  id: number;
  name: string;
  status: RoomCleanlinessStatus;
  /** ISO timestamp string for the last time this room was cleaned. */
  lastCleanedAt: string;
};

export type HouseholdTask = {
  /** Stable numeric identifier for the task. */
  id: number;
  title: string;
  /** ISO timestamp string indicating when the task is due. */
  dueAt: string;
  /** Optional numeric room identifier this task is associated with. */
  roomId: number | null;
  isRecurring: boolean;
};

export type ActivityType = 'task_completed' | 'task_added' | 'note';

export type ActivityItem = {
  /** Stable numeric identifier for the activity item. */
  id: number;
  type: ActivityType;
  /** ISO timestamp string for when the activity occurred. */
  timestamp: string;
  description: string;
  /** Friendly display name for the person or source. */
  actor: string;
};

/**
 * Top-level contract for the cozy home dashboard.
 *
 * This shape is intentionally additive-friendly: future slices such as
 * household members, recurrence details, or notifications can be introduced
 * as new optional properties without breaking existing callers. UI code
 * should prefer to depend on individual slices (e.g. `summary`, `rooms`)
 * rather than the full object where possible.
 */
export type DashboardData = {
  summary: SummaryMetrics;
  rooms: RoomStatus[];
  upcomingTasks: HouseholdTask[];
  familyActivity: ActivityItem[];
};
