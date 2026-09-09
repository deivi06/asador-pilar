import { Link, Navigate } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import { useApp, cartLineTotal } from '../../state/AppContext';
import { formatPrice, formatOrderCode } from '../../utils/format';

export default function ConfirmationPage() {
  const { lastOrder, businessInfo } = useApp();

  if (!lastOrder) {
    return <Navigate to="/carta" replace />;
  }

  const reminderNumber = lastOrder.phone.replace(/\s/g, '');
  const reminderMessage = encodeURIComponent(
    `Recordatorio: pedido #${formatOrderCode(lastOrder.id)} en ${businessInfo.name}. ` +
      `Recogida hoy a las ${lastOrder.pickupTime} en ${businessInfo.address}.`
  );
  const reminderLink = `https://wa.me/34${reminderNumber}?text=${reminderMessage}`;

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center sm:max-w-lg lg:max-w-xl lg:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50">
        <Check size={30} className="text-emerald-600" strokeWidth={3} />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-emerald-600">¡Pedido confirmado!</h1>
      <p className="mt-1 text-brasa-500">Tu comida ya se está cocinando a fuego lento.</p>

      <div className="card mt-6 space-y-3 p-4 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-brasa-400">Número de pedido</span>
          <span className="font-bold text-brasa-800">#{formatOrderCode(lastOrder.id)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brasa-400">Hora de recogida</span>
          <span className="font-bold text-pimenton-600">Hoy, {lastOrder.pickupTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brasa-400">Dirección</span>
          <span className="font-bold text-brasa-800">{businessInfo.address}</span>
        </div>
      </div>

      <div className="card mt-4 p-4 text-left">
        <p className="mb-2 text-sm font-bold text-brasa-700">Resumen de recogida</p>
        <div className="space-y-1.5 text-sm">
          {lastOrder.items.map((line) => (
            <div key={line.productId} className="flex justify-between text-brasa-500">
              <span>
                {line.name} ×{line.quantity}
              </span>
              <span>{formatPrice(cartLineTotal(line))}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t border-brasa-100 pt-2 font-bold text-brasa-800">
          <span>Total Pagado</span>
          <span>{formatPrice(lastOrder.total)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-oro-100/70 p-4 text-left text-sm text-oro-500">
        <p className="font-bold">¡Te esperamos en {businessInfo.name}!</p>
        <p className="mt-1">Pide cita o acércate a la hora indicada. Tu pedido estará listo y caliente.</p>
      </div>

      <a
        href={reminderLink}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-600"
      >
        <MessageCircle size={18} /> Enviarme recordatorio por WhatsApp
      </a>

      <Link to="/" className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-brasa-800 px-5 py-3.5 font-bold text-white transition hover:bg-brasa-900">
        Volver al inicio
      </Link>

      <Link to="/mi-pedido" className="mt-4 inline-block text-sm font-semibold text-brasa-400 underline hover:text-red-500">
        ¿Necesitas anular este pedido?
      </Link>
    </div>
  );
}
