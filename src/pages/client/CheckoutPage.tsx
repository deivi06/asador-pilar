import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp, cartTotal, cartLineTotal } from '../../state/AppContext';
import { supabase } from '../../lib/supabaseClient';
import { formatPrice } from '../../utils/format';

export default function CheckoutPage() {
  const { cart, timeSlots, businessInfo, placeOrder } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [occupancy, setOccupancy] = useState<Record<string, number>>({});

  const total = cartTotal(cart);

  // Ocupación pública de franjas (sin exponer los pedidos de otros clientes).
  useEffect(() => {
    supabase
      .from('slot_occupancy')
      .select('*')
      .then(({ data }) => {
        const map: Record<string, number> = {};
        for (const row of data ?? []) map[row.time] = row.used;
        setOccupancy(map);
      });
  }, []);

  const availableSlots = timeSlots.filter((slot) => (occupancy[slot.time] ?? 0) < slot.maxOrders);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:max-w-2xl">
        <p className="text-brasa-500">Tu carrito está vacío.</p>
        <Link to="/carta" className="btn-primary mt-4 inline-flex">
          Ver carta
        </Link>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !time) {
      setError('Completa tu nombre, teléfono, email y hora de recogida.');
      return;
    }
    if (!accepted) {
      setError('Confirma que pasarás a recoger el pedido para continuar.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        pickupTime: time,
        origin: 'web',
      });
      navigate('/confirmacion');
    } catch {
      setError('No se pudo enviar el pedido. Inténtalo de nuevo en unos segundos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-4 sm:max-w-2xl lg:max-w-5xl lg:px-6 lg:py-10">
      <div className="flex items-center gap-2">
        <Link to="/carrito" className="text-brasa-500 hover:text-pimenton-600" aria-label="Volver al carrito">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-extrabold text-pimenton-600 lg:text-2xl">Datos de Recogida</h1>
      </div>

      <div className="lg:mt-6 lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-8">
        <div>
          <div className="mt-5 space-y-4 lg:mt-0">
            <div>
              <label className="label-field">Nombre completo *</label>
              <input className="input-field" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Teléfono de contacto *</label>
              <input className="input-field" placeholder="+34 600 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs text-brasa-400">Te enviaremos ahí el número de pedido, por si acaso.</p>
            </div>
            <div>
              <label className="label-field">Hora de recogida estimada *</label>
              <select className="input-field" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Seleccionar hora</option>
                {availableSlots.map((slot) => (
                  <option key={slot.time} value={slot.time}>
                    Hoy a las {slot.time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-pimenton-200 bg-pimenton-50 p-3 text-sm text-pimenton-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>
              <strong>Recuerda:</strong> Los pedidos se recogen únicamente en {businessInfo.address}.
            </p>
          </div>

          <label className="mt-4 flex items-start gap-2.5 text-sm text-brasa-600 lg:hidden">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-brasa-300 text-pimenton-500 focus:ring-pimenton-300"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            Acepto las condiciones y confirmo que pasaré a recoger el pedido.
          </label>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="card mt-4 p-4 lg:mt-0">
            <p className="mb-2 text-sm font-bold text-brasa-700">Resumen del pedido</p>
            <div className="space-y-1.5 text-sm">
              {cart.map((line) => (
                <div key={line.productId} className="flex justify-between text-brasa-500">
                  <span>
                    {line.name} ×{line.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(cartLineTotal(line))}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-brasa-100 pt-2 font-bold text-brasa-800">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <label className="mt-4 hidden items-start gap-2.5 text-sm text-brasa-600 lg:flex">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-brasa-300 text-pimenton-500 focus:ring-pimenton-300"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            Acepto las condiciones y confirmo que pasaré a recoger el pedido.
          </label>

          {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}

          <button className="btn-primary mt-5 w-full" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Enviando...' : `Confirmar Pedido — ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
