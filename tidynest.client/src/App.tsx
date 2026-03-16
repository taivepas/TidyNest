import { useState } from 'react';
import './App.css';
import { DashboardPage } from '@/features/dashboard';
import { TasksPage } from '@/features/tasks';

function App() {
  const [view, setView] = useState<'dashboard' | 'tasks'>('dashboard');

  return (
    <main className="app-shell">
      <div className="app-shell__content">
        <nav className="app-nav" aria-label="Primary navigation">
          <button
            className={`app-nav__button${view === 'dashboard' ? ' app-nav__button--active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`app-nav__button${view === 'tasks' ? ' app-nav__button--active' : ''}`}
            onClick={() => setView('tasks')}
          >
            Tasks
          </button>
        </nav>

        {view === 'dashboard' ? (
          <DashboardPage />
        ) : (
          <TasksPage onBackToDashboard={() => setView('dashboard')} />
        )}
      </div>
    </main>
  );
}

export default App;
