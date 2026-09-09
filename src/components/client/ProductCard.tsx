import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { categoryGradient } from '../../utils/photoTile';
import StatusPill from './StatusPill';

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0 || !product.active;

  return (
    <Link to={`/carta/${product.id}`} className="card flex flex-col overflow-hidden transition hover:shadow-md">
      <div
        className={`relative flex h-28 items-center justify-center overflow-hidden text-5xl ${
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
        <div className="absolute left-2 top-2">
          <StatusPill product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-brasa-800">{product.name}</h3>
        <p className="mt-1 text-base font-bold text-pimenton-600">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
