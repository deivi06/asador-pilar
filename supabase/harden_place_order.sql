-- ============================================================================
-- Endurece place_order: antes confiaba en el precio y el total que mandaba
-- el propio navegador (p_total y el "price" de cada línea de p_items), así
-- que cualquiera podía llamar a la función RPC directamente (sin pasar por
-- la web) y crear un pedido con el total que quisiera. Ahora el precio y el
-- total se recalculan siempre en el servidor a partir de public.products, y
-- las cantidades se validan (deben ser enteros positivos).
--
-- Cómo aplicar este script:
--   1. Ejecuta primero supabase/orders_and_catalog.sql y supabase/add_order_email.sql
--      si no lo has hecho ya (este script sustituye la función place_order que crean).
--   2. Abre tu proyecto en https://supabase.com/dashboard
--   3. Ve a "SQL Editor" > "New query"
--   4. Pega el contenido de este archivo y ejecútalo (Run)
-- ============================================================================

-- Se sustituye por una versión sin p_total (ya no se acepta desde el cliente):
-- se borra la versión anterior de 8 parámetros para no dejar dos funciones solapadas.
drop function if exists public.place_order(text, text, text, text, jsonb, numeric, text, text);

create or replace function public.place_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_pickup_time text,
  p_items jsonb,
  p_notes text,
  p_origin text
) returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_quantity int;
  v_total numeric := 0;
  v_resolved_items jsonb := '[]'::jsonb;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido no tiene artículos';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::int;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Cantidad inválida para un artículo del pedido';
    end if;

    select * into v_product from public.products where id = (v_item->>'productId')::uuid;
    if v_product.id is null then
      raise exception 'Producto no encontrado';
    end if;

    -- El precio y el nombre vienen siempre del catálogo, nunca de lo que
    -- mande el cliente: así no se puede manipular el total del pedido.
    v_total := v_total + (v_product.price * v_quantity);
    v_resolved_items := v_resolved_items || jsonb_build_object(
      'productId', v_product.id,
      'name', v_product.name,
      'price', v_product.price,
      'quantity', v_quantity
    );

    update public.products
      set stock = greatest(0, stock - v_quantity)
      where id = v_product.id;

    insert into public.stock_movements (product_id, product_name, type, quantity)
    values (v_product.id, v_product.name, 'venta', -v_quantity);
  end loop;

  insert into public.orders (customer_name, phone, email, pickup_time, items, total, notes, origin, status)
  values (p_customer_name, p_phone, p_email, p_pickup_time, v_resolved_items, v_total, p_notes, p_origin, 'pendiente')
  returning * into v_order;

  return v_order;
end;
$$;

grant execute on function public.place_order(text, text, text, text, jsonb, text, text) to anon, authenticated;
