import { useState } from 'react';
import type { CreateTaskInput } from '../types/tasks';

type TaskFormProps = {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  isSaving: boolean;
};

const initialDueAt = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

export function TaskForm({ onSubmit, isSaving }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState(initialDueAt);
  const [isRecurring, setIsRecurring] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    await onSubmit({
      title: trimmedTitle,
      dueAt: new Date(dueAt).toISOString(),
      roomId: null,
      isRecurring,
    });

    setTitle('');
    setIsRecurring(false);
  }

  return (
    <form className="tasks-form" onSubmit={handleSubmit}>
      <label className="tasks-form__field">
        <span className="tasks-form__label">Task title</span>
        <input
          className="tasks-form__input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={500}
          placeholder="e.g., Wipe kitchen counters"
          required
        />
      </label>

      <label className="tasks-form__field">
        <span className="tasks-form__label">Due date</span>
        <input
          className="tasks-form__input"
          type="datetime-local"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          required
        />
      </label>

      <label className="tasks-form__checkbox-row">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(event) => setIsRecurring(event.target.checked)}
        />
        <span>Recurring task</span>
      </label>

      <button className="tasks-button tasks-button--primary" type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add task'}
      </button>
    </form>
  );
}
