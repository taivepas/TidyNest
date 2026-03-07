import type { HouseholdTask, RoomStatus } from '../types/dashboard';
import { SectionHeading } from '../components/SectionHeading';

type UpcomingTasksSectionProps = {
  tasks: HouseholdTask[];
  rooms: RoomStatus[];
};

function formatDueLabel(isoDate: string): string {
  const due = new Date(isoDate);
  if (Number.isNaN(due.getTime())) {
    return 'Due soon';
  }

  const now = new Date();

  const isSameDay =
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    due.getFullYear() === tomorrow.getFullYear() &&
    due.getMonth() === tomorrow.getMonth() &&
    due.getDate() === tomorrow.getDate();

  const timePart = due.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isSameDay) {
    return `Today, ${timePart}`;
  }

  if (isTomorrow) {
    return `Tomorrow, ${timePart}`;
  }

  const datePart = due.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return `${datePart}, ${timePart}`;
}

function getRoomName(roomId: string | undefined, rooms: RoomStatus[]): string {
  if (!roomId) {
    return 'Whole home';
  }

  const found = rooms.find((room) => room.id === roomId);
  return found ? found.name : 'Whole home';
}

export function UpcomingTasksSection({
  tasks,
  rooms,
}: UpcomingTasksSectionProps) {
  return (
    <section
      id="dashboard-upcoming-tasks"
      className="dashboard-section"
      aria-label="Upcoming tasks"
    >
      <SectionHeading eyebrow="Next up">Upcoming tasks</SectionHeading>

      <ul className="dashboard-task-list">
        {tasks.map((task) => (
          <li key={task.id} className="dashboard-task-list__item">
            <div className="dashboard-task-list__main">
              <p className="dashboard-task-list__title">{task.title}</p>
              <p className="dashboard-task-list__meta">
                <span className="dashboard-task-list__room">
                  {getRoomName(task.roomId, rooms)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="dashboard-task-list__due">
                  {formatDueLabel(task.dueAt)}
                </span>
              </p>
            </div>
            {task.isRecurring ? (
              <span className="dashboard-task-list__badge">Repeats</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
