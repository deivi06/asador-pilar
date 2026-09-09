-- ============================================================================
-- Actualiza la categoría "Comidas" para que coincida con la carta oficial
-- escrita a mano por el asador. Seguro de re-ejecutar (idempotente).
-- ============================================================================

-- 1) Quita los platos que ya no están en la carta oficial
delete from public.products
  where category = 'Comidas'
  and name in ('Estofado de ternera', 'Arroz al horno', 'Lasaña de carne', 'Albóndigas en salsa');

-- 2) Corrige los días de los platos que se quedan (varios pasan a estar
--    disponibles todos los días, según la carta oficial)
update public.products set days = array['Miércoles','Jueves','Viernes','Sábado','Domingo'] where name = 'Caldo con albóndigas';
update public.products set days = array['Miércoles','Jueves','Viernes','Sábado','Domingo'] where name = 'Muslo al horno';
update public.products set days = array['Miércoles','Jueves','Viernes','Sábado','Domingo'] where name = 'Muslo en salsa';
update public.products set days = array['Miércoles','Jueves','Viernes','Sábado','Domingo'] where name = 'Lenguado';
update public.products set days = array['Miércoles','Jueves','Viernes','Sábado','Domingo'] where name = 'Canelones';
update public.products set days = array['Miércoles','Viernes','Sábado','Domingo'] where name = 'Macarrones caseros';
update public.products set days = array['Miércoles','Domingo'] where name = 'Paella de pollo';
update public.products set days = array['Sábado','Domingo'] where name = 'Bacalao con tomate';

-- 3) Añade los platos que faltan (solo si no existen ya, por nombre)
insert into public.products (name, category, description, price, stock, min_stock, active, emoji, days)
select v.name, v.category, v.description, v.price, v.stock, v.min_stock, v.active, v.emoji, v.days
from (values
  ('Merluza al horno', 'Comidas', 'Merluza al horno con su jugo', 7.5, 10, 4, true, '🐟', array['Miércoles']),
  ('Magra con tomate', 'Comidas', 'Carne magra de cerdo con salsa de tomate casera', 6.0, 10, 4, true, '🍖', array['Miércoles']),
  ('Zarangollo', 'Comidas', 'Calabacín y cebolla rehogados con huevo, receta murciana', 4.5, 10, 4, true, '🍳', array['Miércoles']),
  ('Ternera en salsa', 'Comidas', 'Ternera guisada a fuego lento en salsa casera', 7.0, 10, 4, true, '🍲', array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Guiso de pollo y albóndigas', 'Comidas', 'Guiso casero de pollo y albóndigas de carne', 6.5, 10, 4, true, '🍲', array['Jueves']),
  ('Pollo al ajillo', 'Comidas', 'Pollo troceado salteado con ajo', 6.5, 10, 4, true, '🍗', array['Jueves']),
  ('Espaguetis a la carbonara', 'Comidas', 'Espaguetis con salsa carbonara casera', 5.5, 10, 4, true, '🍝', array['Jueves']),
  ('Merluza con cebolla caramelizada', 'Comidas', 'Merluza con cebolla caramelizada al punto', 7.5, 10, 4, true, '🐟', array['Jueves']),
  ('Salteado de champiñón', 'Comidas', 'Champiñones salteados con ajo y perejil', 4.5, 10, 4, true, '🍄', array['Jueves']),
  ('Paella de marisco', 'Comidas', 'Arroz de paella con marisco variado', 8.5, 10, 4, true, '🥘', array['Viernes']),
  ('Chipirón con tomate', 'Comidas', 'Chipirón guisado en salsa de tomate casera', 7.0, 10, 4, true, '🦑', array['Viernes']),
  ('Arroz tres delicias', 'Comidas', 'Arroz tres delicias con verduras, jamón y huevo', 6.0, 10, 4, true, '🍚', array['Viernes']),
  ('Merluza en salsa de bocas', 'Comidas', 'Merluza en salsa casera con bocas', 7.5, 10, 4, true, '🐟', array['Viernes']),
  ('Berenjena rellena', 'Comidas', 'Berenjena rellena de carne, gratinada al horno', 5.5, 10, 4, true, '🍆', array['Sábado','Domingo']),
  ('Codillo en salsa', 'Comidas', 'Codillo de cerdo guisado en salsa casera', 6.5, 10, 4, true, '🍖', array['Sábado','Domingo']),
  ('Calamar a la plancha', 'Comidas', 'Calamar a la plancha con un toque de ajo y perejil', 8.0, 10, 4, true, '🦑', array['Sábado','Domingo']),
  ('Cabeza de cordero', 'Comidas', 'Cabeza de cordero al horno, receta tradicional', 7.5, 10, 4, true, '🐑', array['Sábado','Domingo'])
) as v(name, category, description, price, stock, min_stock, active, emoji, days)
where not exists (select 1 from public.products p where p.name = v.name);
