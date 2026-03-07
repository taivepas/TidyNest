import { SectionHeading } from '../components/SectionHeading';
import { ActionButton } from '../components/ActionButton';

export function QuickActionsSection() {
  return (
    <section
      id="dashboard-quick-actions"
      className="dashboard-section"
      aria-label="Quick actions"
    >
      <SectionHeading eyebrow="Jump in">Quick actions</SectionHeading>

      <div className="dashboard-quick-actions">
        <ActionButton aria-label="Add task">
          Add task
        </ActionButton>
        <ActionButton aria-label="Update room status" variant="ghost">
          Update room status
        </ActionButton>
        <ActionButton aria-label="View cleaning plan" variant="ghost">
          View cleaning plan
        </ActionButton>
      </div>
    </section>
  );
}
