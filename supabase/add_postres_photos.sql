-- ============================================================================
-- Engancha las fotos de public/postres/ a cada postre, por nombre.
-- ============================================================================

update public.products set photo = '/postres/tartaqueso.jpg' where name = 'Tarta de queso';
update public.products set photo = '/postres/tarta_abuela.jpg' where name = 'Tarta de la abuela';
update public.products set photo = '/postres/profiteroles-2.jpg' where name = 'Profiteroles';
update public.products set photo = '/postres/arrozconleche.jpg' where name = 'Arroz con leche';
update public.products set photo = '/postres/natillas_con_chocolate.jpg' where name = 'Natillas con chocolate';
update public.products set photo = '/postres/natillas_sin_chocolate.jpg' where name = 'Natillas sin chocolate';
