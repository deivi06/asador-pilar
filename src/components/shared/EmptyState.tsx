import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-ticket border border-dashed border-brasa-200 bg-white px-6 py-14 text-center">
      <div className="mb-3 text-brasa-300">{icon}</div>
      <p className="font-display text-lg font-semibold text-brasa-700">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-brasa-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
