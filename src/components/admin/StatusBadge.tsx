import type { OrderStatus } from '../../types';
import { statusColors, statusLabels } from '../../utils/format';

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`admin-pill ${statusColors[status]}`}>{statusLabels[status]}</span>;
}
