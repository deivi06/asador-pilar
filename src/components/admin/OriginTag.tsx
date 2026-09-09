import type { OrderOrigin } from '../../types';

export default function OriginTag({ origin }: { origin: OrderOrigin }) {
  const isWeb = origin === 'web';
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
        isWeb ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-ink-200 bg-ink-50 text-ink-500'
      }`}
    >
      {isWeb ? 'WEB' : 'TEL'}
    </span>
  );
}
