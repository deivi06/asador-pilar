-- Tabla para los mensajes del formulario de contacto de la web
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Cualquier visitante (sin necesidad de iniciar sesión) puede enviar un mensaje
drop policy if exists "Cualquiera puede enviar un mensaje" on public.contact_messages;
create policy "Cualquiera puede enviar un mensaje"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Solo los usuarios con rol de gerente pueden leer los mensajes (panel de admin)
drop policy if exists "Los gerentes pueden leer los mensajes" on public.contact_messages;
create policy "Los gerentes pueden leer los mensajes"
  on public.contact_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'gerente'
    )
  );
