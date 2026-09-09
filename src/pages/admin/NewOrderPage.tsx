import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Search, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { CATEGORIES, type CartLine, type Category } from '../../types';
import { formatPrice, formatOrderCode } from '../../utils/format';
import PageHeader from '../../components/admin/PageHeader';

export default function NewOrderPage() {
  const { products, timeSlots, orders, placeOrder } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<Category | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [lines, setLines] = useState<CartLine[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<number | null>(null);

  const slotAvailability = useMemo(() => {
    return timeSlots.map((slot) => {
      const used = orders.filter((o) => o.pickupTime === slot.time && o.status !== 'cancelado').length;
      return { ...slot, full: used >= slot.maxOrders };
    });
  }, [timeSlots, orders]);

  const visibleProducts = products.filter(
    (p) =>
      (category === 'Todos' || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const changeQty = (productId: string, name: string, price: number, delta: number, max: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      const newQty = Math.min(max, Math.max(0, (existing?.quantity ?? 0) + delta));
      if (newQty === 0) return prev.filter((l) => l.productId !== productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, quantity: newQty } : l));
      }
      return [...prev, { productId, name, price, quantity: newQty }];
    });
  };

  const handleCreate = async () => {
    if (!name.trim() || !phone.trim() || !time || lines.length === 0) {
      setError('Completa nombre, teléfono, hora de recogida y añade al menos un producto.');
      return;
    }
    setError('');
    try {
      const order = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        pickupTime: time,
        origin: 'telefono',
        items: lines,
        notes: notes.trim() || undefined,
      });
      setSuccess(order.id);
      setName('');
      setPhone('');
      setEmail('');
      setTime('');
      setNotes('');
      setLines([]);
    } catch {
      setError('No se pudo crear el pedido. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <PageHeader title="Crear Pedido Manual" subtitle="Registro rápido para pedidos telefónicos y en mostrador" />

      {success && (
        <div className="admin-card mb-6 flex items-center gap-3 border-emerald-200 bg-emerald-50/60 p-4">
          <CheckCircle2 className="text-emerald-600" size={24} />
          <div>
            <p className="font-semibold text-ink-700">Pedido #{formatOrderCode(success)} creado correctamente</p>
            <p className="text-sm text-ink-500">Origen: teléfono</p>
          </div>
          <button className="admin-btn-secondary ml-auto" onClick={() => navigate('/admin/pedidos')}>
            Ver pedidos
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <p className="mb-4 font-semibold text-ink-700">Datos del Cliente</p>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Nombre completo *</label>
              <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Teléfono de contacto *</label>
              <input className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Email (opcional)</label>
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">
                <Clock size={12} className="mr-1 inline" /> Hora de recogida estimada *
              </label>
              <select className="admin-input" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Seleccionar hora</option>
                {slotAvailability.map((slot) => (
                  <option key={slot.time} value={slot.time} disabled={slot.full}>
                    {slot.time} {slot.full ? '(completo)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Observaciones de preparación</label>
              <textarea
                className="admin-input"
                rows={3}
                placeholder="Ej: sin cebolla, poco hecho..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <span className="admin-pill border-ink-200 bg-ink-50 text-ink-500">Pedido por teléfono</span>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-ink-700">Seleccionar Productos</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
              <input
                className="admin-input w-40 pl-8 text-sm"
                placeholder="Buscar plato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="scrollbar-thin mb-3 flex gap-2 overflow-x-auto pb-2">
            {(['Todos', ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  category === c ? 'bg-rojo-500 text-white' : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
            {visibleProducts.map((p) => {
              const line = lines.find((l) => l.productId === p.id);
              const soldOut = p.stock <= 0 || !p.active;
              return (
                <div
                  key={p.id}
                  className={`rounded-lg border p-3 ${
                    soldOut ? 'border-ink-100 bg-ink-50 opacity-60' : 'border-ink-100'
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-700">{p.name}</p>
                  <p className="text-xs text-ink-400">{formatPrice(p.price)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      disabled={soldOut}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-rojo-500 text-white disabled:bg-ink-200"
                      onClick={() => changeQty(p.id, p.name, p.price, -1, p.stock)}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-bold text-ink-700">{line?.quantity ?? 0}</span>
                    <button
                      disabled={soldOut}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-rojo-500 text-white disabled:bg-ink-200"
                      onClick={() => changeQty(p.id, p.name, p.price, 1, p.stock)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-ink-100 pt-4">
            <p className="mb-2 text-sm font-semibold text-ink-700">Resumen del pedido actual</p>
            {lines.length === 0 ? (
              <p className="text-sm text-ink-400">Añade productos desde arriba.</p>
            ) : (
              <div className="space-y-1 text-sm">
                {lines.map((l) => (
                  <div key={l.productId} className="flex justify-between text-ink-600">
                    <span>
                      {l.quantity} × {l.name}
                    </span>
                    <span className="font-medium">{formatPrice(l.price * l.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400">Importe Total</p>
                <p className="text-2xl font-bold text-rojo-500">{formatPrice(total)}</p>
              </div>
              <button className="admin-btn-primary" onClick={handleCreate}>
                Crear Pedido
              </button>
            </div>
            {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
