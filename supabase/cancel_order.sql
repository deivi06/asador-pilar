-- ============================================================================
-- Permite a un cliente anónimo anular su propio pedido, identificándose con
-- el número de pedido + el teléfono con el que lo hizo (sin necesitar cuenta).
-- ============================================================================

create or replace function public.cancel_order_by_customer(p_order_id bigint, p_phone text)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_phone text := regexp_replace(p_phone, '\s', '', 'g');
begin
  select * into v_order from public.orders
    where id = p_order_id
    and regexp_replace(phone, '\s', '', 'g') = v_phone;

  -- Mensaje genérico a propósito: no revela si falló el número de pedido o
  -- el teléfono, para no facilitar que alguien vaya probando combinaciones.
  if v_order.id is null then
    raise exception 'No se ha encontrado ningún pedido con ese número y teléfono';
  end if;

  if v_order.status = 'entregado' then
    raise exception 'Este pedido ya se entregó y no se puede anular';
  end if;

  if v_order.status <> 'cancelado' then
    for v_item in select * from jsonb_array_elements(v_order.items)
    loop
      update public.products
        set stock = stock + (v_item->>'quantity')::int
        where id = (v_item->>'productId')::uuid;

      insert into public.stock_movements (product_id, product_name, type, quantity)
      values (
        (v_item->>'productId')::uuid,
        v_item->>'name',
        'cancelacion',
        (v_item->>'quantity')::int
      );
    end loop;

    update public.orders set status = 'cancelado' where id = p_order_id returning * into v_order;
  end if;

  return v_order;
end;
$$;

grant execute on function public.cancel_order_by_customer(bigint, text) to anon, authenticated;
