import type { ActivityItem } from '../types/dashboard';
import { SectionHeading } from '../components/SectionHeading';

type FamilyActivitySectionProps = {
  activity: ActivityItem[];
};

function formatActivityTimeLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function FamilyActivitySection({
  activity,
}: FamilyActivitySectionProps) {
  return (
    <section
      id="dashboard-family-activity"
      className="dashboard-section"
      aria-label="Family activity"
    >
      <SectionHeading eyebrow="Recently">Family activity</SectionHeading>

      <ul className="dashboard-activity-list">
        {activity.map((item) => (
          <li key={item.id} className="dashboard-activity-list__item">
            <div className="dashboard-activity-list__main">
              <p className="dashboard-activity-list__description">
                {item.description}
              </p>
              <p className="dashboard-activity-list__meta">
                <span className="dashboard-activity-list__actor">{item.actor}</span>
                <span aria-hidden="true">·</span>
                <span className="dashboard-activity-list__time">
                  {formatActivityTimeLabel(item.timestamp)}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
