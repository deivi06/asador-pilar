// Convierte entre las filas de Supabase (snake_case) y los tipos de la app
// (camelCase, definidos en src/types/index.ts) para no tener que tocar el
// resto de la app cuando cambia el origen de los datos.
import type { BusinessInfo, DaySchedule, Order, Product, StockMovement, TimeSlot } from '../types';

export function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    minStock: row.min_stock,
    active: row.active,
    emoji: row.emoji,
    photo: row.photo ?? undefined,
    popular: row.popular ?? undefined,
    days: row.days ?? [],
  };
}

export function productToRow(product: Omit<Product, 'id'> | Product) {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    stock: product.stock,
    min_stock: product.minStock,
    active: product.active,
    emoji: product.emoji,
    photo: product.photo ?? null,
    popular: product.popular ?? false,
    days: product.days,
  };
}

export function rowToOrder(row: any): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email ?? undefined,
    pickupTime: row.pickup_time,
    items: row.items,
    total: Number(row.total),
    notes: row.notes ?? undefined,
    status: row.status,
    origin: row.origin,
    createdAt: row.created_at,
  };
}

export function rowToSchedule(row: any): DaySchedule {
  return {
    day: row.day,
    open: row.open,
    openTime: row.open_time,
    closeTime: row.close_time,
  };
}

export function scheduleToRow(schedule: DaySchedule) {
  return {
    day: schedule.day,
    open: schedule.open,
    open_time: schedule.openTime,
    close_time: schedule.closeTime,
  };
}

export function rowToTimeSlot(row: any): TimeSlot {
  return { time: row.time, maxOrders: row.max_orders };
}

export function rowToBusinessInfo(row: any): BusinessInfo {
  return {
    name: row.name,
    tagline: row.tagline,
    address: row.address,
    city: row.city,
    phone: row.phone,
    whatsapp: row.whatsapp,
    instagram: row.instagram ?? undefined,
    lat: Number(row.lat),
    lng: Number(row.lng),
    googleMapsUrl: row.google_maps_url,
    rating: Number(row.rating),
    ratingCount: row.rating_count,
  };
}

export function businessInfoToRow(info: BusinessInfo) {
  return {
    name: info.name,
    tagline: info.tagline,
    address: info.address,
    city: info.city,
    phone: info.phone,
    whatsapp: info.whatsapp,
    instagram: info.instagram ?? null,
    lat: info.lat,
    lng: info.lng,
    google_maps_url: info.googleMapsUrl,
    rating: info.rating,
    rating_count: info.ratingCount,
  };
}

export function rowToStockMovement(row: any): StockMovement {
  return {
    id: row.id,
    date: row.date,
    productId: row.product_id,
    productName: row.product_name,
    type: row.type,
    quantity: row.quantity,
  };
}
