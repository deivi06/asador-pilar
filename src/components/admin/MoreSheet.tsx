import { Link } from 'react-router-dom';
import { UtensilsCrossed, History, Clock, BarChart3, Mail, Settings, ExternalLink, LogOut, X } from 'lucide-react';
import { useAdminAuth } from '../../state/AdminAuthContext';

const links = [
  { to: '/admin/productos', label: 'Productos', icon: UtensilsCrossed },
  { to: '/admin/stock/historial', label: 'Historial', icon: History },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock },
  { to: '/admin/ventas', label: 'Ventas', icon: BarChart3 },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
  { to: '/', label: 'Ver tienda', icon: ExternalLink },
];

export default function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAdminAuth();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-8 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-bold text-ink-700">Más opciones</p>
          <button onClick={onClose} className="p-1 text-ink-400">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-100 p-4 text-center text-xs font-medium text-ink-600"
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-100 p-4 text-center text-xs font-medium text-red-500"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
