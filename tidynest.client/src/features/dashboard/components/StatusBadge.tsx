import type { RoomCleanlinessStatus } from '../types/dashboard';

type StatusBadgeProps = {
  status: RoomCleanlinessStatus;
};

const STATUS_LABELS: Record<RoomCleanlinessStatus, string> = {
  clean: 'Clean',
  needs_tidy: 'Needs tidying',
  deep_clean: 'Deep clean needed',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`status-badge status-badge--${status}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}
