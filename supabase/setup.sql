-- Script idempotente: se puede ejecutar varias veces sin error, aunque ya
-- exista la tabla "profiles" (p. ej. de la plantilla por defecto de Supabase).

-- 1) Crea la tabla solo si no existe todavía
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2) Añade la columna "role" si la tabla ya existía sin ella
alter table public.profiles
  add column if not exists role text not null default 'empleado';

-- Restringe los valores permitidos (si ya existiera la restricción, la ignora)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('gerente', 'empleado'));
  end if;
end $$;

-- 3) Crea un perfil para cualquier usuario que ya exista y no tenga fila todavía
insert into public.profiles (id, role)
select id, 'empleado' from auth.users
on conflict (id) do nothing;

-- 4) Seguridad: cada usuario solo puede leer su propio perfil
alter table public.profiles enable row level security;

drop policy if exists "Los usuarios pueden ver su propio perfil" on public.profiles;
create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- 5) Crea automáticamente un perfil (rol "empleado" por defecto) para cada usuario nuevo
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'empleado')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
