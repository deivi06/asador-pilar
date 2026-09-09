import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatDateTime } from '../../utils/format';
import type { MovementType } from '../../types';
import PageHeader from '../../components/admin/PageHeader';

const typeLabels: Record<MovementType, string> = {
  entrada: 'Entrada',
  venta: 'Venta',
  ajuste: 'Ajuste manual',
  cancelacion: 'Cancelación',
};

const typeColors: Record<MovementType, string> = {
  entrada: 'bg-emerald-50 text-emerald-600',
  venta: 'bg-rojo-50 text-rojo-600',
  ajuste: 'bg-ink-100 text-ink-500',
  cancelacion: 'bg-amber-50 text-amber-600',
};

const userFor: Record<MovementType, string> = {
  entrada: 'Cocina Asador',
  venta: 'TPV Mostrador',
  ajuste: 'Panel admin',
  cancelacion: 'WEB App',
};

export default function StockHistoryPage() {
  const { stockMovements } = useApp();
  const [filter, setFilter] = useState<MovementType | 'todos'>('todos');
  const [search, setSearch] = useState('');

  const filtered = stockMovements.filter(
    (m) => (filter === 'todos' || m.type === filter) && m.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Link to="/admin/stock" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-rojo-500">
        <ArrowLeft size={16} /> Volver a stock
      </Link>
      <PageHeader title="Historial de Movimientos" subtitle="Auditoría y trazabilidad del inventario de insumos" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            className="admin-input pl-9"
            placeholder="Buscar producto o motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-input w-auto" value={filter} onChange={(e) => setFilter(e.target.value as MovementType | 'todos')}>
          <option value="todos">Tipo: Todos</option>
          {(['entrada', 'venta', 'ajuste', 'cancelacion'] as const).map((t) => (
            <option key={t} value={t}>
              Tipo: {typeLabels[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-xs text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha / hora</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Cantidad</th>
                <th className="px-4 py-3 font-medium">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3 text-ink-500">{formatDateTime(m.date)}</td>
                  <td className="px-4 py-3 font-semibold text-ink-700">{m.productName}</td>
                  <td className="px-4 py-3">
                    <span className={`admin-pill border-transparent ${typeColors[m.type]}`}>{typeLabels[m.type]}</span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${m.quantity >= 0 ? 'text-emerald-600' : 'text-rojo-600'}`}>
                    {m.quantity >= 0 ? '+' : ''}
                    {m.quantity}
                  </td>
                  <td className="px-4 py-3 text-ink-400">{userFor[m.type]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
