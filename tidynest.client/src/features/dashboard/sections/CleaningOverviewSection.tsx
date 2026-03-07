import type { SummaryMetrics } from '../types/dashboard';
import { DashboardCard } from '../components/DashboardCard';

type CleaningOverviewSectionProps = {
  summary: SummaryMetrics;
};

export function CleaningOverviewSection({
  summary,
}: CleaningOverviewSectionProps) {
  return (
    <DashboardCard
      title="Cleaning overview"
      description="A quick snapshot of how today is shaping up."
    >
      <div className="dashboard-metrics-grid" role="list">
        <article className="dashboard-metric" role="listitem">
          <p className="dashboard-metric__label">Tasks to do today</p>
          <p className="dashboard-metric__value">{summary.todayTasksTotal}</p>
        </article>

        <article className="dashboard-metric" role="listitem">
          <p className="dashboard-metric__label">Completed tasks</p>
          <p className="dashboard-metric__value">
            {summary.todayTasksCompleted}
          </p>
        </article>

        <article className="dashboard-metric" role="listitem">
          <p className="dashboard-metric__label">Rooms needing attention</p>
          <p className="dashboard-metric__value">
            {summary.roomsNeedingAttention}
          </p>
        </article>

        <article className="dashboard-metric" role="listitem">
          <p className="dashboard-metric__label">This week&apos;s progress</p>
          <p className="dashboard-metric__value">
            {summary.weeklyProgressPercent}
            <span className="dashboard-metric__unit">%</span>
          </p>
        </article>
      </div>
    </DashboardCard>
  );
}
