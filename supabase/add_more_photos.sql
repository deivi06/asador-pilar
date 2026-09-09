-- ============================================================================
-- Engancha las fotos de public/patatas/, public/bebidas/ y public/ensaladas/
-- a cada producto, por nombre.
-- ============================================================================

-- --- Patatas ---
update public.products set photo = '/patatas/bm-patatas-fritas.jpg' where name = 'Patatas fritas';
update public.products set photo = '/patatas/patatas_asadas.jpg'
  where name in ('Patata asada (unidad)', 'Patatas asadas (media docena)', 'Patatas asadas (docena)');

-- --- Bebidas ---
update public.products set photo = '/bebidas/cocacola.jpg' where name = 'Coca-Cola';
update public.products set photo = '/bebidas/coca-cola-zero-2-litros-.jpg' where name = 'Coca-Cola Zero';
update public.products set photo = '/bebidas/Fanta-Naranja-2500ml.jpg' where name = 'Fanta naranja';
update public.products set photo = '/bebidas/agua.jpg' where name = 'Agua 50 cl';
update public.products set photo = '/bebidas/aquarius-limon-33-cl.jpg' where name = 'Aquarius';
update public.products set photo = '/bebidas/cerveza.jpg' where name = 'Cerveza';

-- --- Ensaladas ---
update public.products set photo = '/ensaladas/ensaladilla_rusa.jpg' where name = 'Ensaladilla rusa';
update public.products set photo = '/ensaladas/ensaladilla_marisco.jpg' where name = 'Ensaladilla de marisco';
update public.products set photo = '/ensaladas/ensalada_tradicional.jpg' where name = 'Ensalada tradicional';
update public.products set photo = '/ensaladas/ensalada_murciana.jpg' where name = 'Ensalada murciana';
