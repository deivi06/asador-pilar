import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, PlusCircle, Boxes, Menu } from 'lucide-react';
import { useState } from 'react';
import MoreSheet from './MoreSheet';

const links = [
  { to: '/admin', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/pedidos/nuevo', label: 'Nuevo', icon: PlusCircle },
  { to: '/admin/stock', label: 'Stock', icon: Boxes },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-800 bg-ink-900 lg:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-rojo-400' : 'text-ink-300'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-300"
        >
          <Menu size={20} />
          Más
        </button>
      </nav>
      <MoreSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
