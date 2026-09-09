import type { Category } from '../types';

// Each category gets a warm, food-appropriate gradient pair since the prototype
// uses illustrated tiles rather than licensed stock photography (unless a real
// photo is set on the product).
export const categoryGradient: Record<Category, string> = {
  'Pollos asados': 'from-oro-300 to-pimenton-400',
  Patatas: 'from-oro-200 to-oro-400',
  Comidas: 'from-oro-300 to-brasa-500',
  Ensaladas: 'from-oliva-100 to-oliva-400',
  Postres: 'from-oro-100 to-oro-300',
  Bebidas: 'from-brasa-200 to-brasa-400',
};
