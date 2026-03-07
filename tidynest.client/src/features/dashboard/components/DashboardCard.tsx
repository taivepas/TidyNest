import { useId } from 'react';
import type { ReactNode } from 'react';

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  /** Optional short helper text shown under the title. */
  description?: string;
  /**
   * Visually emphasize the card as primary. Useful for hero/summary areas.
   */
  tone?: 'default' | 'accent';
};

export function DashboardCard({
  title,
  description,
  children,
  tone = 'default',
}: DashboardCardProps) {
  const headingId = useId();

  return (
    <section
      className={`dashboard-card dashboard-card--${tone}`}
      aria-labelledby={headingId}
    >
      <header className="dashboard-card__header">
        <h2 id={headingId} className="dashboard-card__title">
          {title}
        </h2>
        {description ? (
          <p className="dashboard-card__description">{description}</p>
        ) : null}
      </header>
      <div className="dashboard-card__body">{children}</div>
    </section>
  );
}
