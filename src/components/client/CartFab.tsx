import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../state/AppContext';

export default function CartFab() {
  const { cart } = useApp();
  const navigate = useNavigate();
  const count = cart.reduce((n, l) => n + l.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 flex justify-center px-4 sm:bottom-4">
      <button
        onClick={() => navigate('/carrito')}
        className="flex items-center gap-2 rounded-full bg-pimenton-500 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-pimenton-600"
      >
        <ShoppingCart size={18} />
        Pedido ({count} {count === 1 ? 'item' : 'items'})
      </button>
    </div>
  );
}
