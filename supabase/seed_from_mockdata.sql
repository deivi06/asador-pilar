-- ============================================================================
-- Siembra inicial: la carta, horarios, franjas y datos del negocio que ya
-- tenía la app en src/data/mockData.ts, para que la web no arranque vacía.
-- Pedidos y movimientos de stock NO se siembran (esos deben empezar reales,
-- desde cero, en un lanzamiento a producción).
-- Ejecuta esto UNA SOLA VEZ, después de orders_and_catalog.sql.
-- ============================================================================

-- --- Datos del negocio -------------------------------------------------------
insert into public.business_info (id, name, tagline, address, city, phone, whatsapp, instagram, lat, lng, google_maps_url, rating, rating_count)
values (
  1,
  'Asador Pilar',
  'Comida casera para llevar',
  'Calle Dr. Fleming, 1, 30130 Beniel, Murcia',
  'Beniel',
  '968 600 838',
  '613 529 171',
  '@asadorpilar',
  38.0481503,
  -0.9992448,
  'https://www.google.com/maps/search/?api=1&query=Asador+Pilar&query_place_id=ChIJi0jLgA2cYw0RVV3iAQtYLbI',
  4.4,
  105
)
on conflict (id) do nothing;

-- --- Horarios semanales --------------------------------------------------------
insert into public.schedules (day, open, open_time, close_time) values
  ('Lunes', false, '09:00', '16:00'),
  ('Martes', false, '09:00', '16:00'),
  ('Miércoles', true, '09:00', '16:00'),
  ('Jueves', true, '09:00', '16:00'),
  ('Viernes', true, '09:00', '16:30'),
  ('Sábado', true, '09:00', '16:00'),
  ('Domingo', true, '09:00', '16:00')
on conflict (day) do nothing;

-- --- Franjas horarias de recogida ------------------------------------------------
insert into public.time_slots (time, max_orders) values
  ('13:00', 5), ('13:15', 5), ('13:30', 5), ('13:45', 5),
  ('14:00', 5), ('14:15', 5), ('14:30', 5), ('14:45', 5),
  ('15:00', 5), ('15:15', 5)
on conflict (time) do nothing;

-- --- Productos (solo si la tabla está vacía, para no duplicar en un reintento) ---
insert into public.products (name, category, description, price, stock, min_stock, active, emoji, photo, popular, days)
select * from (values
  ('Pollo asado', 'Pollos asados', 'Pollo asado al estilo de la casa, dorado y jugoso', 7.0, 18, 5, true, '🍗', '/pollos-asados.webp', true, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Medio pollo asado', 'Pollos asados', 'Medio pollo asado con su jugo', 4.0, 14, 5, true, '🍗', '/pollos-asados.webp', false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Pollo a la brasa', 'Pollos asados', 'Pollo entero a la brasa con un toque ahumado', 7.5, 12, 5, true, '🍗', '/pollos-asados.webp', false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Medio pollo a la brasa', 'Pollos asados', 'Medio pollo a la brasa con un toque ahumado', 4.25, 10, 4, true, '🍗', '/pollos-asados.webp', false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),

  ('Patatas fritas', 'Patatas', 'Ración de patatas fritas caseras', 3.0, 25, 8, true, '🍟', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Patata asada (unidad)', 'Patatas', 'Patata asada al horno de leña, se vende por unidades', 1.0, 60, 15, true, '🥔', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Patatas asadas (media docena)', 'Patatas', 'Media docena de patatas asadas al horno de leña', 5.0, 20, 5, true, '🥔', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Patatas asadas (docena)', 'Patatas', 'Docena de patatas asadas al horno de leña', 9.0, 10, 3, true, '🥔', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),

  ('Ensaladilla rusa', 'Ensaladas', 'Ensaladilla rusa casera con mahonesa propia', 4.0, 2, 5, true, '🥗', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Ensaladilla de marisco', 'Ensaladas', 'Ensaladilla con surimi y gambas', 5.0, 7, 4, true, '🦐', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Ensalada tradicional', 'Ensaladas', 'Lechuga, tomate, cebolla y aceitunas, aliñada al momento', 4.0, 9, 4, true, '🥬', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Ensalada murciana', 'Ensaladas', 'Tomate, atún, huevo cocido, aceitunas y cebolla al estilo murciano', 4.5, 8, 4, true, '🍅', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),

  ('Lentejas estofadas', 'Comidas', 'Lentejas guisadas con chorizo y verduras, receta de casa', 5.5, 10, 4, true, '🍲', null, false, array['Miércoles']),
  ('Macarrones caseros', 'Comidas', 'Macarrones con tomate casero y carne', 5.5, 10, 4, true, '🍝', null, false, array['Miércoles','Sábado']),
  ('Estofado de ternera', 'Comidas', 'Ternera guisada a fuego lento con patata y zanahoria', 7.0, 8, 3, true, '🍲', null, false, array['Miércoles','Jueves','Domingo']),
  ('Arroz al horno', 'Comidas', 'Arroz al horno con garbanzos y morcilla', 6.0, 0, 4, true, '🍚', null, false, array['Jueves','Domingo']),
  ('Caldo con albóndigas', 'Comidas', 'Caldo casero con albóndigas de carne', 4.5, 12, 4, true, '🍜', null, false, array['Viernes']),
  ('Lasaña de carne', 'Comidas', 'Lasaña de carne gratinada al horno', 6.5, 8, 3, true, '🍝', null, true, array['Viernes']),
  ('Bacalao con tomate', 'Comidas', 'Bacalao confitado con salsa de tomate casera', 7.5, 6, 3, true, '🐟', null, false, array['Sábado']),
  ('Muslo al horno', 'Comidas', 'Muslo de pollo al horno con su jugo', 4.5, 12, 4, true, '🍗', null, false, array['Miércoles']),
  ('Muslo en salsa', 'Comidas', 'Muslo de pollo guisado en salsa casera', 4.5, 12, 4, true, '🍗', null, false, array['Miércoles']),
  ('Paella de pollo', 'Comidas', 'Arroz de paella con pollo, receta de la casa', 6.5, 8, 3, true, '🥘', null, false, array['Miércoles']),
  ('Lenguado', 'Comidas', 'Lenguado a la plancha', 8.0, 6, 3, true, '🐟', null, false, array['Miércoles']),
  ('Canelones', 'Comidas', 'Canelones de carne gratinados al horno', 6.0, 10, 4, true, '🍝', null, false, array['Miércoles']),
  ('Albóndigas en salsa', 'Comidas', 'Albóndigas de carne en salsa casera', 5.5, 10, 4, true, '🍲', null, false, array['Miércoles']),

  ('Tarta de queso', 'Postres', 'Tarta de queso horneada, receta de la casa', 3.5, 0, 3, true, '🍰', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Flan casero', 'Postres', 'Flan de huevo con caramelo', 2.5, 15, 5, true, '🍮', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),

  ('Coca-Cola', 'Bebidas', 'Lata 33 cl', 1.5, 40, 10, true, '🥤', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Agua 50 cl', 'Bebidas', 'Botella de agua mineral', 1.0, 50, 10, true, '💧', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Fanta naranja', 'Bebidas', 'Lata 33 cl', 1.5, 4, 10, true, '🥤', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Coca-Cola Zero', 'Bebidas', 'Lata 33 cl', 1.5, 30, 10, true, '🥤', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Aquarius', 'Bebidas', 'Botella 50 cl', 1.5, 20, 8, true, '🧃', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Cerveza', 'Bebidas', 'Botellín 25 cl', 1.8, 36, 12, true, '🍺', null, false, array['Miércoles','Jueves','Viernes','Sábado','Domingo'])
) as v(name, category, description, price, stock, min_stock, active, emoji, photo, popular, days)
where not exists (select 1 from public.products);
