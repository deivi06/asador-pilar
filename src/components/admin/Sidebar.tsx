import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  UtensilsCrossed,
  Boxes,
  History,
  Clock,
  BarChart3,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAdminAuth } from '../../state/AdminAuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/pedidos/nuevo', label: 'Nuevo Pedido', icon: PlusCircle },
  { to: '/admin/productos', label: 'Productos', icon: UtensilsCrossed },
  { to: '/admin/stock', label: 'Stock', icon: Boxes },
  { to: '/admin/stock/historial', label: 'Historial Stock', icon: History },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock },
  { to: '/admin/ventas', label: 'Ventas', icon: BarChart3 },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const { user, signOut } = useAdminAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink-900 lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img
          src="/logo-asador-pilar.jpg"
          alt="Asador Pilar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide text-white">ASADOR PILAR</p>
          <p className="text-xs text-ink-400">Panel de Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-rojo-500 text-white' : 'text-ink-200 hover:bg-ink-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-800 p-3">
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
        >
          <ExternalLink size={18} />
          Ver tienda
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rojo-500 text-sm font-bold text-white">
            {(user?.email ?? '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{user?.email}</p>
            <p className="text-xs text-ink-400">Gerente</p>
          </div>
          <button
            onClick={signOut}
            className="shrink-0 rounded-lg p-2 text-ink-400 hover:bg-ink-800 hover:text-white"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
