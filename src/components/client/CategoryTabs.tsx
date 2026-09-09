import type { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  active: Category | 'Todas';
  onChange: (c: Category | 'Todas') => void;
}

export default function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const all: (Category | 'Todas')[] = ['Todas', ...categories];
  return (
    <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {all.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === c
              ? 'bg-pimenton-500 text-white shadow-sm'
              : 'border border-brasa-200 bg-white text-brasa-500 hover:border-pimenton-300'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
