import type { SummaryMetrics } from '../types/dashboard';

type HeroSectionProps = {
  summary: SummaryMetrics;
};

export function HeroSection({ summary }: HeroSectionProps) {
  const remainingToday =
    summary.todayTasksTotal - summary.todayTasksCompleted;

  const remainingLabel =
    remainingToday > 0
      ? `You have ${remainingToday} task${remainingToday === 1 ? '' : 's'} left today and ${summary.roomsNeedingAttention} room${summary.roomsNeedingAttention === 1 ? '' : 's'} that could use some care.`
      : 'You are all caught up for today. Nice work keeping things cozy!';

  return (
    <section
      id="dashboard-hero"
      className="dashboard-hero"
      aria-labelledby="dashboard-hero-title"
    >
      <p className="dashboard-hero__greeting">Welcome back</p>
      <h2 id="dashboard-hero-title" className="dashboard-hero__headline">
        A cozy home, one small task at a time.
      </h2>
      <p className="dashboard-hero__support">{remainingLabel}</p>
    </section>
  );
}
