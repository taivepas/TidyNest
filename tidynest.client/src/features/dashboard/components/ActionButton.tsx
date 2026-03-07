import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ActionButtonVariant = 'primary' | 'ghost';

type ActionButtonProps = {
  children: ReactNode;
  variant?: ActionButtonVariant;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export function ActionButton({
  children,
  variant = 'primary',
  ...buttonProps
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`dashboard-action-button dashboard-action-button--${variant}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
