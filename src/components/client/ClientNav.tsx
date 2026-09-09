import { Link, NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, Phone } from 'lucide-react';
import { useApp } from '../../state/AppContext';

const tabs = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/carta', label: 'Menú', icon: UtensilsCrossed, end: false },
  { to: '/carrito', label: 'Carrito', icon: ShoppingCart, end: false },
];

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3.5 py-2 text-sm font-bold uppercase tracking-wide transition ${
    isActive ? 'bg-pimenton-600 text-white' : 'text-white/75 hover:text-white'
  }`;

export default function ClientNav() {
  const { cart, businessInfo } = useApp();
  const count = cart.reduce((n, l) => n + l.quantity, 0);

  return (
    <>
      {/* Brand bar — dark header, visible on every breakpoint */}
      <header className="sticky top-0 z-30 bg-brasa-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo-asador-pilar.jpg" alt="Asador Pilar" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-extrabold tracking-wide">ASADOR PILAR</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {tabs.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkCls}>
                {label}
                {label === 'Carrito' && count > 0 ? ` (${count})` : ''}
              </NavLink>
            ))}
            <NavLink to="/horario" className={navLinkCls}>
              Horario
            </NavLink>
            <NavLink to="/contacto" className={navLinkCls}>
              Contacto
            </NavLink>
            <NavLink to="/mi-pedido" className={navLinkCls}>
              Mi Pedido
            </NavLink>
            <Link to="/admin" className="ml-2 rounded-lg border border-white/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white/60 transition hover:border-white/40 hover:text-white">
              Administración
            </Link>
          </nav>

          <a
            href={`tel:${businessInfo.phone.replace(/\s/g, '')}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pimenton-600 text-white lg:hidden"
            aria-label="Llamar"
          >
            <Phone size={16} />
          </a>
        </div>
      </header>

      {/* Mobile: fixed bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-brasa-700 bg-brasa-900 lg:hidden">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                isActive ? 'text-pimenton-400' : 'text-brasa-300'
              }`
            }
          >
            <span className="relative">
              <Icon size={20} />
              {label === 'Carrito' && count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pimenton-500 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
