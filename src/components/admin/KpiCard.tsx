import { ArrowUp, ArrowDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; label: string };
  tag?: { label: string; tone: 'warning' | 'critical' };
}

const tagStyles = {
  warning: 'bg-amber-50 text-amber-600',
  critical: 'bg-red-50 text-red-500',
};

export default function KpiCard({ label, value, trend, tag }: KpiCardProps) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-400">{label}</p>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.direction === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend.label}
          </span>
        )}
        {tag && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tagStyles[tag.tone]}`}>
            {tag.label}
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-ink-700">{value}</p>
    </div>
  );
}
