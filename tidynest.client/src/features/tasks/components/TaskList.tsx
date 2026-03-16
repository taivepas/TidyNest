import type { TaskItem, UpdateTaskInput } from '../types/tasks';
import { TaskRow } from './TaskRow';

type TaskListProps = {
  tasks: TaskItem[];
  isSaving: boolean;
  onUpdate: (id: number, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function TaskList({ tasks, isSaving, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="tasks-empty" role="status">
        No tasks yet. Add your first household task to get started.
      </p>
    );
  }

  return (
    <ul className="tasks-list" aria-label="Tasks list">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} isSaving={isSaving} onSave={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
