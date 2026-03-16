export type TaskItem = {
  id: number;
  title: string;
  dueAt: string;
  roomId: number | null;
  isRecurring: boolean;
  isCompleted: boolean;
  completedAt: string | null;
};

export type CreateTaskInput = {
  title: string;
  dueAt: string;
  roomId: number | null;
  isRecurring: boolean;
};

export type UpdateTaskInput = {
  title: string;
  dueAt: string;
  roomId: number | null;
  isRecurring: boolean;
  isCompleted: boolean;
};
