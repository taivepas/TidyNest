import { useState } from 'react';
import type { TaskItem, UpdateTaskInput } from '../types/tasks';

type TaskRowProps = {
  task: TaskItem;
  isSaving: boolean;
  onSave: (id: number, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

function formatDueAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString();
}

export function TaskRow({ task, isSaving, onSave, onDelete }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueAt, setDueAt] = useState(task.dueAt.slice(0, 16));
  const [isRecurring, setIsRecurring] = useState(task.isRecurring);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  async function handleSave() {
    await onSave(task.id, {
      title: title.trim(),
      dueAt: new Date(dueAt).toISOString(),
      roomId: task.roomId,
      isRecurring,
      isCompleted,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="tasks-list__item tasks-list__item--editing">
        <label className="tasks-list__field">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={500} />
        </label>

        <label className="tasks-list__field">
          <span>Due</span>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
          />
        </label>

        <label className="tasks-list__check">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(event) => setIsRecurring(event.target.checked)}
          />
          <span>Recurring</span>
        </label>

        <label className="tasks-list__check">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(event) => setIsCompleted(event.target.checked)}
          />
          <span>Completed</span>
        </label>

        <div className="tasks-list__actions">
          <button className="tasks-button tasks-button--primary" onClick={handleSave} disabled={isSaving}>
            Save
          </button>
          <button
            className="tasks-button tasks-button--ghost"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="tasks-list__item">
      <div className="tasks-list__main">
        <h3 className="tasks-list__title">{task.title}</h3>
        <p className="tasks-list__meta">
          Due {formatDueAt(task.dueAt)}
          {task.isRecurring ? ' • Recurring' : ''}
          {task.isCompleted ? ' • Completed' : ''}
        </p>
      </div>

      <div className="tasks-list__actions">
        <button className="tasks-button tasks-button--ghost" onClick={() => setIsEditing(true)} disabled={isSaving}>
          Edit
        </button>
        <button className="tasks-button tasks-button--danger" onClick={() => onDelete(task.id)} disabled={isSaving}>
          Delete
        </button>
      </div>
    </li>
  );
}
