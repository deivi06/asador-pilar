import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { CATEGORIES, WEEKDAYS, type Category, type Product, type Weekday } from '../../types';
import { formatPrice } from '../../utils/format';
import PageHeader from '../../components/admin/PageHeader';

const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  category: 'Pollos asados',
  description: '',
  price: 0,
  stock: 0,
  minStock: 5,
  active: true,
  emoji: '🍽️',
  days: WEEKDAYS,
});

export default function ProductsPage() {
  const { products, dispatch } = useApp();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm());
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Todas'>('Todas');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      (categoryFilter === 'Todas' || p.category === categoryFilter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
  };

  const openCreate = () => {
    setCreating(true);
    setForm(emptyForm());
  };

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', product: { ...editing, ...form } });
    } else {
      dispatch({ type: 'CREATE_PRODUCT', product: { ...form, id: `p-${Date.now()}` } });
    }
    closeModal();
  };

  const statusOf = (p: Product) => {
    if (!p.active) return { label: 'Desactivado', cls: 'bg-ink-100 text-ink-400' };
    if (p.stock <= 0) return { label: 'Agotado', cls: 'bg-red-50 text-red-500' };
    if (p.stock <= p.minStock) return { label: 'Stock bajo', cls: 'bg-amber-50 text-amber-600' };
    return { label: 'Disponible', cls: 'bg-emerald-50 text-emerald-600' };
  };

  return (
    <div>
      <PageHeader
        title="Gestión de Productos"
        subtitle="Carta de asado, precios y existencias en tiempo real"
        action={
          <button className="admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Añadir Producto
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            className="admin-input pl-9"
            placeholder="Buscar plato o ingrediente..."
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
      </div>

      <div className="admin-card overflow-hidden">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-xs text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Días</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock actual</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((p) => {
                const s = statusOf(p);
                return (
                  <tr key={p.id} className="hover:bg-ink-50">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg">
                        {p.emoji}
                      </div>
                      <span className="font-semibold text-ink-700">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{p.category}</td>
                    <td className="px-4 py-3 text-xs text-ink-500">
                      {p.days.length === WEEKDAYS.length ? 'Todos los días' : p.days.map((d) => d.slice(0, 3)).join(', ')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink-700">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-ink-600">{p.stock} uds.</td>
                    <td className="px-4 py-3">
                      <span className={`admin-pill border-transparent ${s.cls}`}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                          onClick={() => openEdit(p)}
                          aria-label="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-500"
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-700">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={closeModal} className="p-1 text-ink-400">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-lg border border-dashed border-ink-200 p-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink-100 text-2xl">
                {form.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-600">Subir nueva imagen</p>
                <p className="text-xs text-ink-400">Formato recomendado JPG o PNG, máx. 2MB</p>
              </div>
              <Upload size={16} className="ml-auto text-ink-300" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="admin-label">Nombre del plato *</label>
                <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Categoría</label>
                  <select
                    className="admin-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Precio (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    className="admin-input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Descripción</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Stock actual *</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="admin-label">Stock mínimo aviso</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Días en los que se ofrece</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map((d) => {
                    const checked = form.days.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          const days = checked
                            ? form.days.filter((x) => x !== d)
                            : ([...form.days, d] as Weekday[]);
                          setForm({ ...form, days });
                        }}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          checked ? 'bg-rojo-500 text-white' : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  Deja solo un día marcado para platos tipo "menú del día" (Comidas).
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-700">Disponibilidad inmediata</p>
                  <p className="text-xs text-ink-400">Permite que los clientes compren este producto</p>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                  <span className="relative h-5 w-9 rounded-full bg-ink-200 transition peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="admin-btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button className="admin-btn-primary" onClick={save}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <p className="text-lg font-bold text-ink-700">¿Eliminar "{deleteTarget.name}"?</p>
            <p className="mt-1 text-sm text-ink-400">Esta acción no se puede deshacer.</p>
            <div className="mt-5 flex justify-center gap-2">
              <button className="admin-btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button
                className="admin-btn-primary !bg-red-500 hover:!bg-red-600"
                onClick={() => {
                  dispatch({ type: 'DELETE_PRODUCT', productId: deleteTarget.id });
                  setDeleteTarget(null);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
