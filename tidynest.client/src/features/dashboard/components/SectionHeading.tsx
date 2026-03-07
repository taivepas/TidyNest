import type { ReactNode } from 'react';

type SectionHeadingLevel = 'h2' | 'h3';

type SectionHeadingProps = {
  as?: SectionHeadingLevel;
  children: ReactNode;
  /** Optional supporting text shown below the heading. */
  eyebrow?: string;
};

export function SectionHeading({
  as = 'h2',
  eyebrow,
  children,
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <header className="dashboard-section-heading">
      {eyebrow ? (
        <p className="dashboard-section-heading__eyebrow">{eyebrow}</p>
      ) : null}
      <HeadingTag className="dashboard-section-heading__title">
        {children}
      </HeadingTag>
    </header>
  );
}
