import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useTasksData } from '../hooks/useTasksData';
import '../styles/tasks.css';

type TasksPageProps = {
  onBackToDashboard: () => void;
};

export function TasksPage({ onBackToDashboard }: TasksPageProps) {
  const { tasks, isLoading, isSaving, error, create, update, remove, reload } = useTasksData();

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <button className="tasks-button tasks-button--ghost" onClick={onBackToDashboard}>
          Back to dashboard
        </button>
        <h1 className="tasks-title">Task manager</h1>
        <p className="tasks-subtitle">Create, edit, and track your home routine tasks.</p>
      </header>

      <section className="tasks-content" aria-label="Task management">
        <TaskForm onSubmit={create} isSaving={isSaving} />

        {isLoading && (
          <p className="tasks-loading" role="status" aria-live="polite">
            Loading tasks...
          </p>
        )}

        {!isLoading && error && (
          <div className="tasks-error" role="alert">
            <p>Something went wrong while loading tasks.</p>
            <button className="tasks-button tasks-button--ghost" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <TaskList tasks={tasks} isSaving={isSaving} onUpdate={update} onDelete={remove} />
        )}
      </section>
    </div>
  );
}
