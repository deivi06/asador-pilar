-- ============================================================================
-- Actualiza "Postres" según la lista indicada. Idempotente.
-- ============================================================================

-- 1) Quita el flan
delete from public.products where category = 'Postres' and name = 'Flan casero';

-- 2) Añade los postres que faltan (solo si no existen ya, por nombre)
insert into public.products (name, category, description, price, stock, min_stock, active, emoji, days)
select v.name, v.category, v.description, v.price, v.stock, v.min_stock, v.active, v.emoji, v.days
from (values
  ('Tarta de la abuela', 'Postres', 'Tarta casera, receta de la abuela', 3.5, 10, 3, true, '🍰', array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Profiteroles', 'Postres', 'Profiteroles rellenos de nata con cobertura de chocolate', 3.5, 10, 3, true, '🧁', array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Arroz con leche', 'Postres', 'Arroz con leche casero con canela', 3.0, 10, 3, true, '🍚', array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Natillas con chocolate', 'Postres', 'Natillas caseras con chocolate', 2.5, 10, 3, true, '🍫', array['Miércoles','Jueves','Viernes','Sábado','Domingo']),
  ('Natillas sin chocolate', 'Postres', 'Natillas caseras tradicionales', 2.5, 10, 3, true, '🍮', array['Miércoles','Jueves','Viernes','Sábado','Domingo'])
) as v(name, category, description, price, stock, min_stock, active, emoji, days)
where not exists (select 1 from public.products p where p.name = v.name);
