import { Link, useNavigate } from 'react-router-dom';
import { Clock3, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp, cartTotal } from '../../state/AppContext';
import { formatPrice } from '../../utils/format';
import { categoryGradient } from '../../utils/photoTile';
import EmptyState from '../../components/shared/EmptyState';

export default function CartPage() {
  const { cart, dispatch, products } = useApp();
  const navigate = useNavigate();
  const subtotal = cartTotal(cart);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:max-w-2xl">
        <EmptyState
          icon={<ShoppingCart size={40} />}
          title="Tu carrito está vacío"
          description="Añade productos desde la carta para empezar tu pedido."
          action={
            <Link to="/carta" className="btn-primary">
              Ver carta
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-4 sm:max-w-2xl lg:max-w-5xl lg:px-6 lg:py-10">
      <h1 className="text-2xl font-extrabold text-pimenton-600 lg:text-3xl">Tu Carrito</h1>

      <div className="lg:mt-6 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-8">
        <div className="mt-4 space-y-3 lg:mt-0">
          {cart.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            return (
              <div key={line.productId} className="card p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-2xl ${
                      product?.photo ? '' : `bg-gradient-to-br ${categoryGradient[product?.category ?? 'Comidas']}`
                    }`}
                  >
                    {product?.photo ? (
                      <img src={product.photo} alt={line.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{product?.emoji ?? '🍽️'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-brasa-800">{line.name}</p>
                    {product?.description && (
                      <p className="mt-0.5 truncate text-xs text-brasa-400">{product.description}</p>
                    )}
                  </div>
                  <button
                    className="shrink-0 text-brasa-300 hover:text-red-500"
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: line.productId })}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-brasa-200 px-2 py-1">
                    <button
                      className="text-brasa-500 hover:text-pimenton-600"
                      onClick={() =>
                        dispatch({ type: 'UPDATE_CART_QTY', productId: line.productId, quantity: line.quantity - 1 })
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{line.quantity}</span>
                    <button
                      className="text-brasa-500 hover:text-pimenton-600"
                      onClick={() =>
                        dispatch({ type: 'UPDATE_CART_QTY', productId: line.productId, quantity: line.quantity + 1 })
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-pimenton-600">{formatPrice(line.price * line.quantity)}</span>
                </div>
              </div>
            );
          })}

          <Link to="/carta" className="btn-secondary hidden w-full lg:inline-flex">
            Seguir comprando
          </Link>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-oro-100/70 px-4 py-2.5 text-sm font-semibold text-oro-500 lg:mt-0">
            <Clock3 size={16} />
            Recogida lista en aprox. 20-30 min
          </div>

          <div className="card mt-4 space-y-2 p-4">
            <div className="flex justify-between text-sm text-brasa-500">
              <span>Subtotal</span>
              <span className="font-semibold text-brasa-700">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-brasa-500">
              <span>Gastos de envío</span>
              <span className="font-semibold text-emerald-600">0,00 € (Recogida)</span>
            </div>
            <div className="flex justify-between border-t border-brasa-100 pt-2 text-base font-bold text-brasa-800">
              <span>Total a pagar</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <button className="btn-primary mt-5 w-full" onClick={() => navigate('/pedido')}>
            Finalizar pedido ({formatPrice(subtotal)})
          </button>
        </div>
      </div>
    </div>
  );
}
