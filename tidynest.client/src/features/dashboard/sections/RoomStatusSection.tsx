import type { RoomStatus } from '../types/dashboard';
import { SectionHeading } from '../components/SectionHeading';
import { StatusBadge } from '../components/StatusBadge';

type RoomStatusSectionProps = {
  rooms: RoomStatus[];
};

function formatLastCleanedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Last cleaned: unknown';
  }

  return `Last cleaned: ${date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}`;
}

export function RoomStatusSection({ rooms }: RoomStatusSectionProps) {
  return (
    <section
      id="dashboard-room-status"
      className="dashboard-section"
      aria-label="Room status overview"
    >
      <SectionHeading eyebrow="Around the house">Room status</SectionHeading>

      <div className="dashboard-rooms-grid" role="list">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="dashboard-room-card"
            role="listitem"
          >
            <div className="dashboard-room-card__header">
              <h3 className="dashboard-room-card__name">{room.name}</h3>
              <StatusBadge status={room.status} />
            </div>
            <p className="dashboard-room-card__meta">
              {formatLastCleanedLabel(room.lastCleanedAt)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
