-- ============================================================================
-- Añade el email del cliente al pedido, para poder enviarle también por
-- correo el número de pedido (además del recordatorio de WhatsApp).
-- ============================================================================

alter table public.orders add column if not exists email text;

-- Se sustituye por una versión con un parámetro más (p_email); se borra la
-- versión anterior de 7 parámetros para no dejar dos funciones solapadas.
drop function if exists public.place_order(text, text, text, jsonb, numeric, text, text);

create or replace function public.place_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_pickup_time text,
  p_items jsonb,
  p_total numeric,
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
begin
  insert into public.orders (customer_name, phone, email, pickup_time, items, total, notes, origin, status)
  values (p_customer_name, p_phone, p_email, p_pickup_time, p_items, p_total, p_notes, p_origin, 'pendiente')
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    update public.products
      set stock = greatest(0, stock - (v_item->>'quantity')::int)
      where id = (v_item->>'productId')::uuid;

    insert into public.stock_movements (product_id, product_name, type, quantity)
    values (
      (v_item->>'productId')::uuid,
      v_item->>'name',
      'venta',
      -((v_item->>'quantity')::int)
    );
  end loop;

  return v_order;
end;
$$;

grant execute on function public.place_order(text, text, text, text, jsonb, numeric, text, text) to anon, authenticated;
