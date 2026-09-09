import { useEffect, useMemo, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import type { Order, OrderStatus } from '../../types';
import { formatPrice, formatOrderCode, statusLabels } from '../../utils/format';
import StatusBadge from '../../components/admin/StatusBadge';
import OriginTag from '../../components/admin/OriginTag';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/shared/EmptyState';

const statusFilters: { label: string; value: OrderStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Entregado', value: 'entregado' },
  { label: 'Cancelado', value: 'cancelado' },
];

const statusFlow: OrderStatus[] = ['pendiente', 'entregado'];

export default function OrdersPage() {
  const { orders, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');
  const [originFilter, setOriginFilter] = useState<'todos' | 'web' | 'telefono'>('todos');
  const [selectedId, setSelectedId] = useState<number | null>(orders[0]?.id ?? null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        !query ||
        o.customerName.toLowerCase().includes(query.toLowerCase()) ||
        String(o.id).includes(query);
      // "Todos" no incluye entregados ni cancelados: hay que filtrar explícitamente
      // por su estado para verlos, así no se acumulan en el listado del día.
      const matchesStatus =
        statusFilter === 'todos'
          ? o.status !== 'entregado' && o.status !== 'cancelado'
          : o.status === statusFilter;
      const matchesOrigin = originFilter === 'todos' || o.origin === originFilter;
      return matchesQuery && matchesStatus && matchesOrigin;
    });
  }, [orders, query, statusFilter, originFilter]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  // Si el pedido seleccionado pasa a "entregado" y desaparece del listado
  // filtrado, deseleccionarlo para que el panel de detalle no se quede huérfano.
  useEffect(() => {
    if (selected && !filtered.some((o) => o.id === selected.id)) {
      setSelectedId(null);
    }
  }, [filtered, selected]);

  const setStatus = (order: Order, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', orderId: order.id, status });
  };

  return (
    <div>
      <PageHeader title="Gestión de Pedidos" subtitle="Listado general y control de estados" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            className="admin-input pl-9"
            placeholder="Buscar cliente o nº pedido..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="admin-input w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'todos')}
        >
          {statusFilters.map((f) => (
            <option key={f.value} value={f.value}>
              Estado: {f.label}
            </option>
          ))}
        </select>
        <select
          className="admin-input w-auto"
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value as 'todos' | 'web' | 'telefono')}
        >
          <option value="todos">Origen: Todos</option>
          <option value="web">Origen: Web</option>
          <option value="telefono">Origen: Teléfono</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="admin-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={<Search size={28} />} title="No hay pedidos con estos filtros" />
            </div>
          ) : (
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-100 text-xs text-ink-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Pedido</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Hora</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Origen</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      className={`cursor-pointer transition hover:bg-ink-50 ${
                        selectedId === o.id ? 'bg-rojo-50/60' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-ink-700">#{formatOrderCode(o.id)}</td>
                      <td className="px-4 py-3 text-ink-600">{o.customerName}</td>
                      <td className="px-4 py-3 text-ink-500">{o.pickupTime}</td>
                      <td className="px-4 py-3 font-semibold text-ink-700">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <OriginTag origin={o.origin} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-ink-300">
                        <Eye size={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="admin-card h-fit p-5 lg:sticky lg:top-6">
          {!selected ? (
            <p className="text-sm text-ink-400">Selecciona un pedido para ver el detalle.</p>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-ink-700">Detalle Pedido</p>
                <span className="text-xs font-semibold text-ink-400">#{formatOrderCode(selected.id)}</span>
              </div>

              <p className="admin-label">Cliente</p>
              <p className="text-sm font-semibold text-ink-700">{selected.customerName}</p>
              <p className="text-sm text-ink-500">{selected.phone}</p>
              {selected.email && <p className="text-sm text-ink-500">{selected.email}</p>}

              <p className="admin-label mt-4">Productos</p>
              <div className="space-y-1.5 text-sm">
                {selected.items.map((line) => (
                  <div key={line.productId} className="flex justify-between text-ink-600">
                    <span>
                      {line.quantity}× {line.name}
                    </span>
                    <span className="font-medium">{formatPrice(line.price * line.quantity)}</span>
                  </div>
                ))}
              </div>

              {selected.notes && (
                <>
                  <p className="admin-label mt-4">Observaciones</p>
                  <p className="text-sm text-ink-500">{selected.notes}</p>
                </>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                <div>
                  <p className="admin-label">Hora recogida</p>
                  <p className="text-sm font-semibold text-ink-700">{selected.pickupTime}</p>
                </div>
                <div>
                  <p className="admin-label">Origen</p>
                  <OriginTag origin={selected.origin} />
                </div>
                <div className="text-right">
                  <p className="admin-label">Total</p>
                  <p className="text-lg font-bold text-rojo-500">{formatPrice(selected.total)}</p>
                </div>
              </div>

              <p className="admin-label mt-4">Cambiar estado</p>
              <div className="flex flex-wrap gap-1.5">
                {statusFlow.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(selected, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selected.status === s
                        ? 'bg-rojo-500 text-white'
                        : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
                {selected.status !== 'cancelado' && selected.status !== 'entregado' && (
                  <button
                    onClick={() => setStatus(selected, 'cancelado')}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
