export type Category = 'Pollos asados' | 'Patatas' | 'Comidas' | 'Ensaladas' | 'Postres' | 'Bebidas';

export const CATEGORIES: Category[] = [
  'Pollos asados',
  'Patatas',
  'Comidas',
  'Ensaladas',
  'Postres',
  'Bebidas',
];

// The days the asador is actually open (matches the real Google Maps hours)
export type Weekday = 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export const WEEKDAYS: Weekday[] = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  active: boolean;
  emoji: string;
  photo?: string;
  popular?: boolean;
  /** Days this dish is on the menu. Pollos/Patatas/Ensaladas/Postres/Bebidas run every open
   *  day; "Comidas" rotates day to day like a real menú del día. */
  days: Weekday[];
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pendiente' | 'entregado' | 'cancelado';
export type OrderOrigin = 'web' | 'telefono';

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  email?: string;
  pickupTime: string;
  items: CartLine[];
  total: number;
  notes?: string;
  status: OrderStatus;
  origin: OrderOrigin;
  createdAt: string; // ISO
}

export type MovementType = 'entrada' | 'venta' | 'ajuste' | 'cancelacion';

export interface StockMovement {
  id: string;
  date: string; // ISO
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number; // signed: + entrada/cancelacion, - venta
}

export interface DaySchedule {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

export interface TimeSlot {
  time: string;
  maxOrders: number;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  rating: number;
  ratingCount: number;
}
