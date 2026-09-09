import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  BusinessInfo,
  CartLine,
  DaySchedule,
  Order,
  OrderOrigin,
  OrderStatus,
  Product,
  StockMovement,
  TimeSlot,
} from '../types';
import { supabase } from '../lib/supabaseClient';
import {
  businessInfoToRow,
  rowToBusinessInfo,
  rowToOrder,
  rowToProduct,
  rowToSchedule,
  rowToStockMovement,
  rowToTimeSlot,
  productToRow,
  scheduleToRow,
} from '../lib/mappers';

const CART_STORAGE_KEY = 'asadero-pilar-cart-v1';

// Solo se usa como valor de arranque mientras se carga la fila real de Supabase
// (unos cientos de ms) — nunca se persiste ni se usa como fuente de verdad.
const FALLBACK_BUSINESS_INFO: BusinessInfo = {
  name: 'Asador Pilar',
  tagline: 'Comida casera para llevar',
  address: 'Calle Dr. Fleming, 1, 30130 Beniel, Murcia',
  city: 'Beniel',
  phone: '968 600 838',
  whatsapp: '613 529 171',
  instagram: '@asadorpilar',
  lat: 38.0481503,
  lng: -0.9992448,
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asador+Pilar',
  rating: 4.4,
  ratingCount: 105,
};

interface CartState {
  cart: CartLine[];
  cartNotes: string;
  lastOrder: Order | null;
}

function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { cart: [], cartNotes: '', lastOrder: null };
    const parsed = JSON.parse(raw);
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      cartNotes: typeof parsed.cartNotes === 'string' ? parsed.cartNotes : '',
      lastOrder: parsed.lastOrder ?? null,
    };
  } catch {
    return { cart: [], cartNotes: '', lastOrder: null };
  }
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'UPDATE_CART_QTY'; productId: string; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_NOTES'; notes: string }
  | { type: 'UPDATE_ORDER_STATUS'; orderId: number; status: OrderStatus }
  | { type: 'CREATE_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; productId: string }
  | { type: 'ADJUST_STOCK'; productId: string; delta: number; movementType: 'entrada' | 'ajuste' }
  | { type: 'UPDATE_SCHEDULE'; schedule: DaySchedule }
  | { type: 'UPDATE_BUSINESS_INFO'; info: BusinessInfo };

interface PlaceOrderParams {
  customerName: string;
  phone: string;
  email?: string;
  pickupTime: string;
  origin: OrderOrigin;
  items?: CartLine[];
  notes?: string;
}

interface AppContextValue {
  products: Product[];
  orders: Order[];
  stockMovements: StockMovement[];
  schedules: DaySchedule[];
  timeSlots: TimeSlot[];
  businessInfo: BusinessInfo;
  cart: CartLine[];
  cartNotes: string;
  lastOrder: Order | null;
  loading: boolean;
  dispatch: (action: Action) => Promise<void>;
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartState] = useState(loadCartState);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(FALLBACK_BUSINESS_INFO);
  const [cart, setCart] = useState<CartLine[]>(cartState.cart);
  const [cartNotes, setCartNotes] = useState(cartState.cartNotes);
  const [lastOrder, setLastOrder] = useState<Order | null>(cartState.lastOrder);
  const [loading, setLoading] = useState(true);

  const refreshCatalog = async () => {
    const [productsRes, schedulesRes, timeSlotsRes, businessRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at'),
      supabase.from('schedules').select('*'),
      supabase.from('time_slots').select('*').order('time'),
      supabase.from('business_info').select('*').eq('id', 1).single(),
    ]);
    if (productsRes.data) setProducts(productsRes.data.map(rowToProduct));
    if (schedulesRes.data) setSchedules(schedulesRes.data.map(rowToSchedule));
    if (timeSlotsRes.data) setTimeSlots(timeSlotsRes.data.map(rowToTimeSlot));
    if (businessRes.data) setBusinessInfo(rowToBusinessInfo(businessRes.data));
  };

  // orders/stock_movements vienen vacíos para quien no sea gerente (RLS los filtra
  // sin dar error), así que es seguro pedirlos siempre, sin comprobar sesión aquí.
  const refreshOrders = async () => {
    const [ordersRes, movementsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('stock_movements').select('*').order('date', { ascending: false }),
    ]);
    setOrders((ordersRes.data ?? []).map(rowToOrder));
    setStockMovements((movementsRes.data ?? []).map(rowToStockMovement));
  };

  useEffect(() => {
    (async () => {
      await Promise.all([refreshCatalog(), refreshOrders()]);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refreshOrders();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart, cartNotes, lastOrder }));
  }, [cart, cartNotes, lastOrder]);

  const dispatch = async (action: Action) => {
    switch (action.type) {
      case 'ADD_TO_CART': {
        setCart((prev) => {
          const existing = prev.find((l) => l.productId === action.product.id);
          if (existing) {
            return prev.map((l) =>
              l.productId === action.product.id ? { ...l, quantity: l.quantity + action.quantity } : l
            );
          }
          return [
            ...prev,
            {
              productId: action.product.id,
              name: action.product.name,
              price: action.product.price,
              quantity: action.quantity,
            },
          ];
        });
        return;
      }
      case 'UPDATE_CART_QTY': {
        setCart((prev) => {
          if (action.quantity <= 0) return prev.filter((l) => l.productId !== action.productId);
          return prev.map((l) => (l.productId === action.productId ? { ...l, quantity: action.quantity } : l));
        });
        return;
      }
      case 'REMOVE_FROM_CART':
        setCart((prev) => prev.filter((l) => l.productId !== action.productId));
        return;
      case 'CLEAR_CART':
        setCart([]);
        setCartNotes('');
        return;
      case 'SET_CART_NOTES':
        setCartNotes(action.notes);
        return;
      case 'CREATE_PRODUCT': {
        const { data, error } = await supabase.from('products').insert(productToRow(action.product)).select().single();
        if (error) return console.error('[AppContext] CREATE_PRODUCT', error);
        setProducts((prev) => [rowToProduct(data), ...prev]);
        return;
      }
      case 'UPDATE_PRODUCT': {
        const { data, error } = await supabase
          .from('products')
          .update(productToRow(action.product))
          .eq('id', action.product.id)
          .select()
          .single();
        if (error) return console.error('[AppContext] UPDATE_PRODUCT', error);
        setProducts((prev) => prev.map((p) => (p.id === action.product.id ? rowToProduct(data) : p)));
        return;
      }
      case 'DELETE_PRODUCT': {
        const { error } = await supabase.from('products').delete().eq('id', action.productId);
        if (error) return console.error('[AppContext] DELETE_PRODUCT', error);
        setProducts((prev) => prev.filter((p) => p.id !== action.productId));
        return;
      }
      case 'ADJUST_STOCK': {
        const product = products.find((p) => p.id === action.productId);
        if (!product) return;
        const newStock = Math.max(0, product.stock + action.delta);
        const { data, error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', action.productId)
          .select()
          .single();
        if (error) return console.error('[AppContext] ADJUST_STOCK', error);
        setProducts((prev) => prev.map((p) => (p.id === action.productId ? rowToProduct(data) : p)));

        const { data: movement, error: movementError } = await supabase
          .from('stock_movements')
          .insert({
            product_id: action.productId,
            product_name: product.name,
            type: action.movementType,
            quantity: action.delta,
          })
          .select()
          .single();
        if (movementError) return console.error('[AppContext] ADJUST_STOCK movement', movementError);
        setStockMovements((prev) => [rowToStockMovement(movement), ...prev]);
        return;
      }
      case 'UPDATE_ORDER_STATUS': {
        const { data, error } = await supabase.rpc('set_order_status', {
          p_order_id: action.orderId,
          p_status: action.status,
        });
        if (error) return console.error('[AppContext] UPDATE_ORDER_STATUS', error);
        setOrders((prev) => prev.map((o) => (o.id === action.orderId ? rowToOrder(data) : o)));
        refreshCatalog(); // el stock puede haber cambiado si se canceló
        return;
      }
      case 'UPDATE_SCHEDULE': {
        const { data, error } = await supabase
          .from('schedules')
          .update(scheduleToRow(action.schedule))
          .eq('day', action.schedule.day)
          .select()
          .single();
        if (error) return console.error('[AppContext] UPDATE_SCHEDULE', error);
        setSchedules((prev) => prev.map((s) => (s.day === action.schedule.day ? rowToSchedule(data) : s)));
        return;
      }
      case 'UPDATE_BUSINESS_INFO': {
        const { data, error } = await supabase
          .from('business_info')
          .update(businessInfoToRow(action.info))
          .eq('id', 1)
          .select()
          .single();
        if (error) return console.error('[AppContext] UPDATE_BUSINESS_INFO', error);
        setBusinessInfo(rowToBusinessInfo(data));
        return;
      }
    }
  };

  const placeOrder = async (params: PlaceOrderParams): Promise<Order> => {
    const items = params.items ?? cart;
    const notes = params.notes !== undefined ? params.notes : cartNotes || undefined;

    // El precio y el total los recalcula siempre el servidor a partir del
    // catálogo (ver supabase/harden_place_order.sql), así que aquí solo se
    // manda qué producto y cuántas unidades: no hay total que manipular.
    const { data, error } = await supabase.rpc('place_order', {
      p_customer_name: params.customerName,
      p_phone: params.phone,
      p_email: params.email ?? null,
      p_pickup_time: params.pickupTime,
      p_items: items.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      p_notes: notes ?? null,
      p_origin: params.origin,
    });
    if (error || !data) throw new Error(error?.message ?? 'No se pudo crear el pedido');

    const order = rowToOrder(data);
    setLastOrder(order);
    setOrders((prev) => [order, ...prev]);
    if (!params.items) {
      setCart([]);
      setCartNotes('');
    }
    refreshCatalog(); // el stock se descontó en el servidor

    if (order.email) {
      // No bloquea la confirmación del pedido si el email tarda o falla.
      // Solo se manda el id: la función busca el resto de datos del pedido
      // (y del negocio) directamente en la base de datos, así no hay nada
      // que un tercero pueda manipular llamando a la función a mano.
      supabase.functions
        .invoke('send-order-email', {
          body: { orderId: order.id },
        })
        .then(({ error: fnError }) => {
          if (fnError) console.error('[AppContext] send-order-email', fnError);
        });
    }

    return order;
  };

  const value = useMemo<AppContextValue>(
    () => ({
      products,
      orders,
      stockMovements,
      schedules,
      timeSlots,
      businessInfo,
      cart,
      cartNotes,
      lastOrder,
      loading,
      dispatch,
      placeOrder,
    }),
    [products, orders, stockMovements, schedules, timeSlots, businessInfo, cart, cartNotes, lastOrder, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}

export function cartLineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
}
