import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatPrice } from '../../utils/format';
import { categoryGradient } from '../../utils/photoTile';
import StatusPill from '../../components/client/StatusPill';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, dispatch, cartNotes, loading } = useApp();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const product = products.find((p) => p.id === productId);
  if (!product) {
    // Mientras se cargan los productos desde Supabase, `products` está vacío
    // un instante — no redirigir hasta saber de verdad que el producto no existe.
    if (loading) return null;
    return <Navigate to="/carta" replace />;
  }

  const soldOut = product.stock <= 0 || !product.active;

  const handleAdd = () => {
    dispatch({ type: 'ADD_TO_CART', product, quantity: qty });
    if (notes.trim()) {
      const addition = `${product.name}: ${notes.trim()}`;
      dispatch({
        type: 'SET_CART_NOTES',
        notes: cartNotes ? `${cartNotes}\n${addition}` : addition,
      });
    }
    navigate('/carta');
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4 sm:max-w-2xl lg:max-w-5xl lg:px-6 lg:py-10">
      <Link to="/carta" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brasa-500 hover:text-pimenton-600">
        <ArrowLeft size={16} /> Volver a la Carta
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10">
        <div
          className={`flex h-56 items-center justify-center overflow-hidden rounded-2xl text-8xl sm:h-72 lg:h-full lg:min-h-[26rem] lg:text-9xl ${
            product.photo ? '' : `bg-gradient-to-br ${categoryGradient[product.category]}`
          }`}
        >
          {product.photo ? (
            <img
              src={product.photo}
              alt={product.name}
              className={`h-full w-full object-cover ${soldOut ? 'opacity-40 grayscale' : ''}`}
            />
          ) : (
            <span className={soldOut ? 'opacity-40 grayscale' : ''}>{product.emoji}</span>
          )}
        </div>

        <div>
          <div className="mt-4 flex items-center justify-between lg:mt-0">
            <StatusPill product={product} />
            <span className="text-3xl font-bold text-pimenton-600">{formatPrice(product.price)}</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-brasa-800 lg:text-3xl">{product.name}</h1>
          <p className="mt-1.5 text-brasa-500">{product.description}</p>

          {soldOut ? (
            <div className="card mt-6 p-4 text-center text-sm font-semibold text-brasa-400">
              Este producto no está disponible ahora mismo.
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-semibold text-brasa-700">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brasa-200 text-brasa-600 hover:border-pimenton-400"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center text-lg font-bold text-brasa-800">{qty}</span>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-pimenton-500 text-white hover:bg-pimenton-600"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label className="label-field">Observaciones de preparación</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Ej: sin sal, extra crujiente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button className="btn-primary mt-6 w-full" onClick={handleAdd}>
                Añadir al carrito — {formatPrice(product.price * qty)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
