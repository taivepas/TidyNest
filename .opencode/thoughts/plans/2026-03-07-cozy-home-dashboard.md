---
date: "2026-03-07T10:20:00Z"
author: opencode
type: plan
topic: "Cozy family dashboard front page"
status: draft
git_commit: "e49117a64eb834b26bb6aadff61dfac972995740"
git_branch: "main"
related_research: "none"
last_updated: "2026-03-07T10:20:00Z"
last_updated_by: opencode
---

# Cozy Family Dashboard Front Page Implementation Plan

## Overview

We will build a cozy, welcoming, dashboard-style home hub as the new app front page. This will be frontend-only, powered by typed mock data through an API-like adapter so the UI can later connect to real endpoints with minimal refactoring.

## Current State Analysis

- `tidynest.client/src/App.tsx:3-6` currently renders only an empty `<main className="app-shell" />`.
- `tidynest.client/src/index.css:1-14` and `tidynest.client/src/App.css:1-7` contain only minimal base sizing styles.
- No dashboard feature slice, reusable dashboard components, or mock API adapter currently exists.
- No authentication requirements currently apply (and must remain out of scope).

## Desired End State

The root route loads a realistic and family-friendly dashboard that includes:

- Welcome hero section with supportive copy
- Cleaning overview with summary cards
- Room status summary (Kitchen, Living Room, Bathroom, Bedroom)
- Upcoming household tasks
- Quick actions
- Family activity overview

The page must feel warm, calm, and organized, be responsive across mobile/tablet/desktop, and use reusable components plus vertical-slice structure suitable for future expansion (accounts, family members, recurring tasks, notifications, mobile app parity).

### Key Discoveries

- The app was intentionally reset to a blank baseline, enabling a clean dashboard-first structure.
- Existing project guidance emphasizes mobile-first design, reusable primitives, compositional page architecture, and accessibility.
- Vite alias `@` is available for cleaner feature imports.

## What We're NOT Doing

- No login/logout/auth flows
- No backend API changes
- No persistent storage
- No notifications engine implementation
- No recurring task engine implementation
- No multi-user account management implementation

## Implementation Approach

Implement a **vertical slice** under `src/features/dashboard` with:

1. Typed feature contracts (`types`)
2. Mock API adapter and hook (`data` + `hooks`) that mimics async integration
3. Reusable dashboard components (`components`)
4. Section composition (`sections` + `pages`)
5. Cozy design tokens and responsive layout rules (`styles`)

This provides immediate UX value while preserving a low-friction path to real APIs.

---

## Phase 1: Feature Slice Foundation + Mock API Contract

### Overview

Create the dashboard slice, types, mock API adapter, data hook, and page entry wiring so the feature has a clean architecture before full UI detail.

### Changes Required

#### 1. Wire dashboard page into app shell

**File**: `tidynest.client/src/App.tsx`

**Changes**: Render `DashboardPage` inside the existing root shell.

```tsx
import './App.css'
import { DashboardPage } from '@/features/dashboard'

function App() {
  return (
    <main className="app-shell">
      <DashboardPage />
    </main>
  )
}

export default App
```

**Why**: Makes dashboard the main home hub while keeping app entry clean.

#### 2. Create vertical-slice feature scaffold

**Files**:

- `tidynest.client/src/features/dashboard/index.ts`
- `tidynest.client/src/features/dashboard/pages/DashboardPage.tsx`
- `tidynest.client/src/features/dashboard/types/dashboard.ts`
- `tidynest.client/src/features/dashboard/data/dashboardMockData.ts`
- `tidynest.client/src/features/dashboard/data/dashboardApi.ts`
- `tidynest.client/src/features/dashboard/hooks/useDashboardData.ts`

**Changes**: Define strongly typed contracts and async mock API integration path.

```ts
// data/dashboardApi.ts
import type { DashboardData } from '../types/dashboard'
import { dashboardMockData } from './dashboardMockData'

export async function getDashboardData(): Promise<DashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardMockData), 250)
  })
}
```

**Why**: Satisfies frontend-only requirement while preparing for real API integration.

#### 3. Add cozy baseline design tokens and layout containers

**Files**:

- `tidynest.client/src/index.css`
- `tidynest.client/src/features/dashboard/styles/dashboard.css`

**Changes**: Add warm color palette, spacing scale, rounded surfaces, and responsive container/grid baseline.

```css
:root {
  --tn-bg: #f6f1ea;
  --tn-surface: #fffaf4;
  --tn-surface-soft: #f2e8de;
  --tn-text: #2e2925;
  --tn-muted: #6f655d;
  --tn-accent: #c9785f;
  --tn-radius-card: 16px;
  --tn-space-2: 0.5rem;
  --tn-space-4: 1rem;
  --tn-space-6: 1.5rem;
  --tn-space-8: 2rem;
}
```

**Why**: Establishes a consistent cozy and soft visual foundation for all sections.

### Success Criteria

#### Automated Verification

- [x] Build passes: `npm run build` (in `tidynest.client`)
- [x] Lint passes: `npm run lint` (in `tidynest.client`)
- [x] Type check passes: `npm run build` (includes `tsc -b`)

#### Manual Verification

- [ ] App renders dashboard page instead of blank screen
- [ ] Mock API hook shows loading-to-content transition
- [ ] Warm theme tokens are visually reflected in page background/surfaces

**⏸️ PAUSE**: Wait for human verification before Phase 2

---

## Phase 2: Build Required Dashboard Sections and Reusable Blocks

### Overview

Implement all required content areas and reusable building blocks with realistic mock household content.

### Changes Required

#### 1. Build reusable dashboard primitives

**Files**:

- `tidynest.client/src/features/dashboard/components/DashboardCard.tsx`
- `tidynest.client/src/features/dashboard/components/SectionHeading.tsx`
- `tidynest.client/src/features/dashboard/components/StatusBadge.tsx`
- `tidynest.client/src/features/dashboard/components/ActionButton.tsx`

**Changes**: Create composable card/heading/badge/button primitives with semantic and accessible markup.

```tsx
type DashboardCardProps = {
  title: string
  children: React.ReactNode
}

export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <section className="dashboard-card" aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

**Why**: Keeps UI consistent and makes future dashboard modules easier to add.

#### 2. Implement required sections

**Files**:

- `tidynest.client/src/features/dashboard/sections/HeroSection.tsx`
- `tidynest.client/src/features/dashboard/sections/CleaningOverviewSection.tsx`
- `tidynest.client/src/features/dashboard/sections/RoomStatusSection.tsx`
- `tidynest.client/src/features/dashboard/sections/UpcomingTasksSection.tsx`
- `tidynest.client/src/features/dashboard/sections/QuickActionsSection.tsx`
- `tidynest.client/src/features/dashboard/sections/FamilyActivitySection.tsx`

**Changes**: Implement each section using mock data and reusable primitives.

```tsx
<HeroSection
  headline="Welcome to TidyNest"
  supportText="A calmer, cleaner home starts here."
/>
```

**Why**: Delivers the complete feature scope requested for the home hub.

#### 3. Compose dashboard page layout

**File**: `tidynest.client/src/features/dashboard/pages/DashboardPage.tsx`

**Changes**: Use responsive grid composition that prioritizes readability and family-friendly scanning.

```tsx
<div className="dashboard-grid">
  <HeroSection />
  <CleaningOverviewSection />
  <RoomStatusSection />
  <UpcomingTasksSection />
  <QuickActionsSection />
  <FamilyActivitySection />
</div>
```

**Why**: Creates a realistic, organized, dashboard-style experience.

### Success Criteria

#### Automated Verification

- [x] Build passes: `npm run build` (in `tidynest.client`)
- [x] Lint passes: `npm run lint` (in `tidynest.client`)
- [x] Type check passes: `npm run build` (includes `tsc -b`)

#### Manual Verification

- [ ] Hero, cleaning overview, room summary, upcoming tasks, quick actions, and family activity all visible
- [ ] Room statuses display (Clean / Needs tidying / Deep clean needed)
- [ ] Summary cards show realistic counts (today, completed, rooms needing attention, weekly progress)
- [ ] Quick actions are clearly visible and keyboard focusable

**⏸️ PAUSE**: Wait for human verification before Phase 3

---

## Phase 3: Responsive Polish, Accessibility, and Future-Ready Structure Validation

### Overview

Refine responsive behavior, accessibility quality, and structure hygiene so the dashboard is production-ready visually and architecture-ready for future expansions.

### Changes Required

#### 1. Responsive layout refinement

**Files**:

- `tidynest.client/src/features/dashboard/styles/dashboard.css`
- `tidynest.client/src/features/dashboard/pages/DashboardPage.tsx`

**Changes**: Tune breakpoints for mobile-first flow and desktop density without clutter.

```css
.dashboard-grid {
  display: grid;
  gap: var(--tn-space-6);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}
```

**Why**: Ensures intuitive navigation and readable hierarchy on all form factors.

#### 2. Accessibility and interaction pass

**Files**:

- `tidynest.client/src/features/dashboard/sections/*.tsx`
- `tidynest.client/src/features/dashboard/components/*.tsx`

**Changes**: Ensure heading order, semantic sectioning, button labels, and keyboard navigability.

```tsx
<button type="button" aria-label="Add task" className="action-btn">
  Add task
</button>
```

**Why**: Aligns with project accessibility expectations and improves usability for all users.

#### 3. Future-expansion readiness check

**Files**:

- `tidynest.client/src/features/dashboard/types/dashboard.ts`
- `tidynest.client/src/features/dashboard/data/dashboardApi.ts`

**Changes**: Confirm types and adapter boundaries can absorb future fields (members, recurrence, notifications) without UI rewrite.

```ts
export type DashboardData = {
  summary: SummaryMetrics
  rooms: RoomStatus[]
  upcomingTasks: HouseholdTask[]
  familyActivity: ActivityItem[]
}
```

**Why**: Reduces future migration cost when backend contracts are introduced.

### Success Criteria

#### Automated Verification

- [x] Build passes: `npm run build` (in `tidynest.client`)
- [x] Lint passes: `npm run lint` (in `tidynest.client`)
- [x] Type check passes: `npm run build` (includes `tsc -b`)

#### Manual Verification

- [ ] Mobile (<768px): sections stack cleanly with readable spacing
- [ ] Tablet (>=768px): balanced multi-column layout appears
- [ ] Desktop (>=1100px): dashboard density increases without clutter
- [ ] Keyboard-only navigation reaches core actions and task links logically

**⏸️ PAUSE**: Wait for human verification before implementation completion

---

## Testing Strategy

### Unit Tests

- [ ] `DashboardPage` loading state: verifies mock API loading UI appears before data
- [ ] `CleaningOverviewSection`: verifies summary metrics map correctly from data
- [ ] `RoomStatusSection`: verifies room status badges render correct label/state
- [ ] `UpcomingTasksSection`: verifies task list order and labels

### Integration Tests

- [ ] Dashboard full render: verifies all required sections appear on front page
- [ ] Quick actions interaction: verifies buttons are present and accessible
- [ ] Responsive snapshot checks (if test tooling supports): validates major breakpoints

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Dashboard becomes visually crowded on small screens | Mobile-first layout with strict spacing scale and section prioritization |
| Mock data shape drifts from future API needs | Keep a single typed adapter boundary (`dashboardApi.ts`) and shared feature types |
| Component sprawl reduces maintainability | Enforce vertical-slice organization and reusable primitives |
| Cozy palette harms contrast/accessibility | Validate contrast and keep clear typography hierarchy |

## References

- Research: none
- Related docs:
  - `docs/ui-guidelines.md`
  - `docs/coding-standards.md`
  - `docs/architecture.md`
  - `docs/product.md`
