import { useDashboardData } from '../hooks/useDashboardData';
import { HeroSection } from '../sections/HeroSection';
import { CleaningOverviewSection } from '../sections/CleaningOverviewSection';
import { RoomStatusSection } from '../sections/RoomStatusSection';
import { UpcomingTasksSection } from '../sections/UpcomingTasksSection';
import { QuickActionsSection } from '../sections/QuickActionsSection';
import { FamilyActivitySection } from '../sections/FamilyActivitySection';
import '../styles/dashboard.css';

export function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Welcome to TidyNest</h1>
        <p className="dashboard-subtitle">
          A calmer, cozier home hub for your daily routines.
        </p>
      </header>

      <section className="dashboard-content" aria-label="Home dashboard snapshot">
        {isLoading && (
          <p
            className="dashboard-loading"
            role="status"
            aria-live="polite"
          >
            Loading your home snapshot...
          </p>
        )}

        {!isLoading && error && (
          <p className="dashboard-error" role="alert">
            Something went wrong while loading your dashboard. Please refresh to try again.
          </p>
        )}

        {!isLoading && data && (
          <div className="dashboard-grid">
            <HeroSection summary={data.summary} />
            <CleaningOverviewSection summary={data.summary} />
            <RoomStatusSection rooms={data.rooms} />
            <UpcomingTasksSection
              tasks={data.upcomingTasks}
              rooms={data.rooms}
            />
            <QuickActionsSection />
            <FamilyActivitySection activity={data.familyActivity} />
          </div>
        )}
      </section>
    </div>
  );
}
