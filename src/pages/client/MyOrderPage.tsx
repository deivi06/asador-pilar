import { useState, type FormEvent } from 'react';
import { Ban, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { rowToOrder } from '../../lib/mappers';
import { formatOrderCode, formatPrice } from '../../utils/format';
import type { Order } from '../../types';

// Acepta "AP-2026-1025", "#1025" o simplemente "1025".
function parseOrderId(raw: string): number | null {
  const cleaned = raw.trim().replace(/^#/, '');
  const segments = cleaned.split('-').filter(Boolean);
  const last = segments[segments.length - 1];
  const id = parseInt(last, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

const STATUS_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-600',
  entregado: 'bg-ink-100 text-brasa-500',
  cancelado: 'bg-red-50 text-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function MyOrderPage() {
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const orderId = parseOrderId(code);
    if (!orderId || !phone.trim()) {
      setError('Introduce el número de pedido y el teléfono con el que lo hiciste.');
      return;
    }
    setError('');
    setCancelMessage('');
    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc('get_order_by_customer', {
      p_order_id: orderId,
      p_phone: phone.trim(),
    });
    setLoading(false);
    if (rpcError || !data) {
      setOrder(null);
      setError(rpcError?.message ?? 'No se pudo encontrar el pedido.');
      return;
    }
    setOrder(rowToOrder(data));
  };

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('cancel_order_by_customer', {
      p_order_id: order.id,
      p_phone: phone.trim(),
    });
    setCancelling(false);
    if (rpcError || !data) {
      setError(rpcError?.message ?? 'No se pudo anular el pedido.');
      return;
    }
    setOrder(rowToOrder(data));
    setCancelMessage('Pedido anulado correctamente.');
  };

  const reset = () => {
    setOrder(null);
    setCode('');
    setPhone('');
    setError('');
    setCancelMessage('');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:max-w-lg lg:py-16">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pimenton-50 text-pimenton-500">
          <Search size={24} />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-brasa-800">Mi Pedido</h1>
        <p className="mx-auto mt-1 max-w-sm text-brasa-500">
          Introduce el número de pedido y el teléfono con el que lo hiciste para consultarlo.
        </p>
      </div>

      {!order ? (
        <form onSubmit={handleLookup} className="card mt-6 space-y-4 p-5">
          <div>
            <label className="label-field">Número de pedido *</label>
            <input
              className="input-field"
              placeholder="Ej: AP-2026-1025"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Teléfono usado en el pedido *</label>
            <input
              className="input-field"
              placeholder="600 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Buscando...' : 'Buscar pedido'}
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <div className="card space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brasa-800">#{formatOrderCode(order.id)}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brasa-400">Hora de recogida</span>
              <span className="font-bold text-pimenton-600">{order.pickupTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brasa-400">Cliente</span>
              <span className="font-semibold text-brasa-800">{order.customerName}</span>
            </div>
          </div>

          <div className="card mt-4 p-4">
            <p className="mb-2 text-sm font-bold text-brasa-700">Contenido del pedido</p>
            <div className="space-y-1.5 text-sm">
              {order.items.map((line) => (
                <div key={line.productId} className="flex justify-between text-brasa-500">
                  <span>
                    {line.name} ×{line.quantity}
                  </span>
                  <span>{formatPrice(line.price * line.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-brasa-100 pt-2 font-bold text-brasa-800">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {cancelMessage && (
            <p className="mt-4 text-center text-sm font-semibold text-emerald-600">{cancelMessage}</p>
          )}
          {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}

          {order.status === 'pendiente' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3.5 font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
            >
              <Ban size={18} /> {cancelling ? 'Anulando...' : 'Anular pedido'}
            </button>
          )}
          {order.status === 'entregado' && (
            <p className="mt-4 text-center text-sm text-brasa-400">
              Este pedido ya se entregó y no se puede anular.
            </p>
          )}

          <button onClick={reset} className="btn-secondary mt-3 w-full">
            Buscar otro pedido
          </button>
        </div>
      )}
    </div>
  );
}
