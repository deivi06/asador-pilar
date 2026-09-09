import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChefHat, Flame, Minus, Plus, UtensilsCrossed, X } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { CATEGORIES, WEEKDAYS, type Category, type Product, type Weekday } from '../../types';
import { formatPrice } from '../../utils/format';
import { categoryGradient } from '../../utils/photoTile';

const DAY_INFO: Record<Weekday, { tagline: string; icon: typeof Flame; special?: boolean }> = {
  Miércoles: { tagline: 'Menú de mitad de semana', icon: Flame },
  Jueves: { tagline: 'Sabor tradicional', icon: ChefHat },
  Viernes: { tagline: 'Menú especial', icon: Flame, special: true },
  Sábado: { tagline: 'Para disfrutar en familia', icon: UtensilsCrossed },
  Domingo: { tagline: 'El mejor día del asador', icon: ChefHat, special: true },
};

// "Comidas" (el plato del día) siempre primero; el resto sigue el orden habitual de la carta.
const SECTION_ORDER: Category[] = ['Comidas', ...CATEGORIES.filter((c) => c !== 'Comidas')];

const CATEGORY_META: Record<Category, { desc: string; emoji: string; photo?: string }> = {
  Comidas: {
    desc: 'El plato del día: guisos y platos caseros que cambian cada jornada.',
    emoji: '🍲',
    photo: '/comidas.jpg',
  },
  'Pollos asados': {
    desc: 'Pollo entero o a la brasa, asado al estilo de la casa.',
    emoji: '🍗',
    photo: '/pollos-asados.webp',
  },
  Patatas: {
    desc: 'Patatas fritas y patatas asadas al horno de leña.',
    emoji: '🥔',
    photo: '/patatas_fritas.jpg',
  },
  Ensaladas: {
    desc: 'Ensaladillas y ensaladas frescas, preparadas al momento.',
    emoji: '🥗',
    photo: '/ensaladas.jpg',
  },
  Postres: {
    desc: 'Tarta de queso y flan casero de la casa.',
    emoji: '🍰',
    photo: '/postresjpg.jpg',
  },
  Bebidas: { desc: 'Refrescos, agua y cerveza bien fríos.', emoji: '🥤', photo: '/bebida.jpg' },
};

function DishTile({ product }: { product: Product }) {
  const { cart, dispatch } = useApp();
  const soldOut = product.stock <= 0 || !product.active;
  const qty = cart.find((l) => l.productId === product.id)?.quantity ?? 0;

  return (
    <div className={`overflow-hidden rounded-xl border border-brasa-100 ${soldOut ? 'opacity-60' : ''}`}>
      <div
        className={`flex h-16 items-center justify-center text-2xl ${
          product.photo ? '' : `bg-gradient-to-br ${categoryGradient[product.category]}`
        }`}
      >
        {product.photo ? (
          <img src={product.photo} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span>{product.emoji}</span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold leading-tight text-brasa-800">{product.name}</p>
        <p className="text-xs font-bold text-pimenton-600">{formatPrice(product.price)}</p>

        {soldOut ? (
          <p className="mt-1.5 text-center text-[10px] font-bold uppercase text-brasa-300">Agotado</p>
        ) : qty === 0 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: 'ADD_TO_CART', product, quantity: 1 })}
            className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg bg-pimenton-500 py-1.5 text-xs font-bold text-white transition hover:bg-pimenton-600"
          >
            <Plus size={12} /> Añadir
          </button>
        ) : (
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-brasa-200 px-1">
            <button
              type="button"
              onClick={() => dispatch({ type: 'UPDATE_CART_QTY', productId: product.id, quantity: qty - 1 })}
              className="flex h-6 w-6 items-center justify-center text-brasa-500 hover:text-pimenton-600"
              aria-label="Quitar uno"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-bold text-brasa-800">{qty}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'ADD_TO_CART', product, quantity: 1 })}
              className="flex h-6 w-6 items-center justify-center text-brasa-500 hover:text-pimenton-600"
              aria-label="Añadir uno"
            >
              <Plus size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryScreen({
  day,
  category,
  items,
  onBack,
  onClose,
}: {
  day: Weekday;
  category: Category;
  items: Product[];
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-brasa-900/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-brasa-400 hover:text-brasa-700" aria-label="Volver">
            <ArrowLeft size={20} />
          </button>
          <h2 className="flex-1 text-lg font-extrabold text-brasa-900">
            {category}
            {category === 'Comidas' ? ` de ${day}` : ''}
          </h2>
          <button onClick={onClose} className="text-brasa-400 hover:text-brasa-700" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((p) => (
            <DishTile key={p.id} product={p} />
          ))}
          {items.length === 0 && <p className="col-span-full text-sm text-brasa-300">Sin novedades este día.</p>}
        </div>
      </div>
    </div>
  );
}

function DayMenuModal({
  day,
  sections,
  onClose,
}: {
  day: Weekday;
  sections: { category: Category; items: Product[] }[];
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-brasa-900/60 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <div
          className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-brasa-900">Menú de {day}</h2>
            <button onClick={onClose} className="text-brasa-400 hover:text-brasa-700" aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sections.map(({ category }) => {
              const meta = CATEGORY_META[category];
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="overflow-hidden rounded-2xl border border-brasa-100 text-left transition hover:shadow-md"
                >
                  <div
                    className={`flex h-28 items-center justify-center text-4xl sm:h-32 ${
                      meta.photo ? '' : `bg-gradient-to-br ${categoryGradient[category]}`
                    }`}
                  >
                    {meta.photo ? (
                      <img src={meta.photo} alt={category} className="h-full w-full object-cover" />
                    ) : (
                      <span>{meta.emoji}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-brasa-800">
                      {category}
                      {category === 'Comidas' ? ` de ${day}` : ''}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-brasa-400">{meta.desc}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-pimenton-600">
                      Ver más <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeCategory && (
        <CategoryScreen
          day={day}
          category={activeCategory}
          items={sections.find((s) => s.category === activeCategory)?.items ?? []}
          onBack={() => setActiveCategory(null)}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default function MenuPage() {
  const { products, businessInfo } = useApp();
  const [openDay, setOpenDay] = useState<Weekday | null>(null);

  const sectionsFor = (day: Weekday) =>
    SECTION_ORDER.map((category) => ({
      category,
      items: products.filter((p) => p.category === category && p.days.includes(day)),
    })).filter((s) => s.items.length > 0);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pt-10 text-center lg:pt-14">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-brasa-900 sm:text-4xl lg:text-5xl">
          Menú semanal
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-brasa-500">
          Toca un día para ver lo que cocinamos. Todos incluyen pollo asado y pollo a la brasa.
        </p>
        <p className="mt-2 text-xs italic text-brasa-300">
          * El menú puede variar según disponibilidad. Consulta el menú del día llamando al {businessInfo.phone}.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-14 pt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {WEEKDAYS.map((day) => {
            const { tagline, icon: Icon, special } = DAY_INFO[day];
            return (
              <div
                key={day}
                className={`relative rounded-2xl border bg-white p-5 text-center transition hover:shadow-md ${
                  special ? 'border-oro-300' : 'border-brasa-100'
                }`}
              >
                {special && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-oro-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brasa-900">
                    Especial
                  </span>
                )}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pimenton-600 text-white">
                  <Icon size={24} />
                </div>
                <p className="mt-4 text-base font-extrabold uppercase text-brasa-900 sm:text-lg">{day}</p>
                <p className="mt-1 text-sm text-brasa-500">{tagline}</p>
                <button
                  type="button"
                  onClick={() => setOpenDay(day)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pimenton-600 hover:text-pimenton-700"
                >
                  Ver menú <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {openDay && (
        <DayMenuModal
          day={openDay}
          sections={sectionsFor(openDay)}
          onClose={() => setOpenDay(null)}
        />
      )}
    </div>
  );
}
