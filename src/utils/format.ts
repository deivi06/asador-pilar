export const formatPrice = (value: number): string =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
};

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatOrderCode = (id: number): string =>
  `AP-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;

export const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const statusColors: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-600 border-amber-200',
  entregado: 'bg-ink-100 text-ink-400 border-ink-200',
  cancelado: 'bg-red-50 text-red-500 border-red-200',
};
