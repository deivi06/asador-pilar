-- ============================================================================
-- Consulta de solo lectura para que un cliente vea su propio pedido (número +
-- teléfono), sin cancelarlo. La cancelación real la sigue haciendo
-- cancel_order_by_customer (cancel_order.sql).
-- ============================================================================

create or replace function public.get_order_by_customer(p_order_id bigint, p_phone text)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_phone text := regexp_replace(p_phone, '\s', '', 'g');
begin
  select * into v_order from public.orders
    where id = p_order_id
    and regexp_replace(phone, '\s', '', 'g') = v_phone;

  -- Mensaje genérico a propósito, igual que en cancel_order_by_customer.
  if v_order.id is null then
    raise exception 'No se ha encontrado ningún pedido con ese número y teléfono';
  end if;

  return v_order;
end;
$$;

grant execute on function public.get_order_by_customer(bigint, text) to anon, authenticated;
