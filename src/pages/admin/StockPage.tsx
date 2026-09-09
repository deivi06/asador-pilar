import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, History, Search } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { CATEGORIES, type Category } from '../../types';
import PageHeader from '../../components/admin/PageHeader';

export default function StockPage() {
  const { products, dispatch } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Todas'>('Todas');
  const [search, setSearch] = useState('');
  const [adjustProductId, setAdjustProductId] = useState(products[0]?.id ?? '');
  const [adjustType, setAdjustType] = useState<'entrada' | 'salida'>('entrada');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const filtered = products.filter(
    (p) => (categoryFilter === 'Todas' || p.category === categoryFilter) && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const outOfStock = products.filter((p) => p.stock <= 0);

  const statusOf = (p: (typeof products)[number]) => {
    if (p.stock <= 0) return { label: 'Agotado', cls: 'bg-red-50 text-red-500' };
    if (p.stock <= p.minStock) return { label: 'Bajo', cls: 'bg-amber-50 text-amber-600' };
    return { label: 'Normal', cls: 'bg-emerald-50 text-emerald-600' };
  };

  const applyAdjustment = () => {
    const amt = Number(amount);
    if (!adjustProductId || !amt || amt <= 0) return;
    dispatch({
      type: 'ADJUST_STOCK',
      productId: adjustProductId,
      delta: adjustType === 'entrada' ? amt : -amt,
      movementType: 'ajuste',
    });
    setAmount('');
    setReason('');
  };

  return (
    <div>
      <PageHeader
        title="Gestión de Stock"
        subtitle="Control de raciones e insumos, listo para hoy"
        action={
          lowStockCount > 0 && (
            <span className="admin-pill border-amber-200 bg-amber-50 text-amber-600">
              {lowStockCount} ajustes detectados
            </span>
          )
        }
      />

      {outOfStock.length > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={18} />
          <p className="text-sm text-red-700">
            <strong>Crítico:</strong> {outOfStock.map((p) => p.name).join(', ')} agotad
            {outOfStock.length > 1 ? 'os' : 'o'}. {lowStockCount} productos más bajo lo mínimo recomendado.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
              <input
                className="admin-input pl-9"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="admin-input w-auto"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | 'Todas')}
            >
              <option value="Todas">Categoría: Todas</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Categoría: {c}
                </option>
              ))}
            </select>
            <Link to="/admin/stock/historial" className="admin-btn-secondary">
              <History size={16} /> Historial
            </Link>
          </div>

          <div className="admin-card overflow-hidden">
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-100 text-xs text-ink-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium">Categoría</th>
                    <th className="px-4 py-3 font-medium">Stock actual</th>
                    <th className="px-4 py-3 font-medium">Mínimo</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((p) => {
                    const s = statusOf(p);
                    const pct = Math.min(100, (p.stock / Math.max(p.minStock * 3, 1)) * 100);
                    const barColor = p.stock <= 0 ? 'bg-red-400' : p.stock <= p.minStock ? 'bg-amber-400' : 'bg-emerald-400';
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setAdjustProductId(p.id)}
                        className={`cursor-pointer hover:bg-ink-50 ${adjustProductId === p.id ? 'bg-rojo-50/50' : ''}`}
                      >
                        <td className="px-4 py-3 font-semibold text-ink-700">{p.name}</td>
                        <td className="px-4 py-3 text-ink-500">{p.category}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 font-semibold text-ink-700">{p.stock}</span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ink-500">{p.minStock}</td>
                        <td className="px-4 py-3">
                          <span className={`admin-pill border-transparent ${s.cls}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="admin-card h-fit p-5 lg:sticky lg:top-6">
          <p className="mb-4 font-semibold text-ink-700">Ajustar Stock Manual</p>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Producto</label>
              <select className="admin-input" value={adjustProductId} onChange={(e) => setAdjustProductId(e.target.value)}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stock} uds.)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Tipo de ajuste</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAdjustType('entrada')}
                  className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                    adjustType === 'entrada'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-ink-200 text-ink-500'
                  }`}
                >
                  Entrada (+)
                </button>
                <button
                  onClick={() => setAdjustType('salida')}
                  className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                    adjustType === 'salida' ? 'border-red-500 bg-red-50 text-red-500' : 'border-ink-200 text-ink-500'
                  }`}
                >
                  Salida (−)
                </button>
              </div>
            </div>
            <div>
              <label className="admin-label">Cantidad</label>
              <input
                type="number"
                min={0}
                className="admin-input"
                placeholder="24"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Motivo / notas</label>
              <textarea
                className="admin-input"
                rows={3}
                placeholder="Ej: nueva tanda de preparación en cocina..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <button className="admin-btn-primary w-full" onClick={applyAdjustment}>
              Aplicar Ajuste de Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
