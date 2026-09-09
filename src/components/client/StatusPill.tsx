import type { Product } from '../../types';

export function availabilityOf(product: Product) {
  if (product.stock <= 0 || !product.active) return { label: 'Agotado', cls: 'bg-red-500 text-white' };
  if (product.stock <= product.minStock) return { label: 'Stock bajo', cls: 'bg-oro-400 text-white' };
  return { label: 'Disponible', cls: 'bg-emerald-500 text-white' };
}

export default function StatusPill({ product }: { product: Product }) {
  const s = availabilityOf(product);
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${s.cls}`}>{s.label}</span>;
}
