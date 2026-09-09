-- Roles de administración: solo los usuarios con role = 'gerente' pueden
-- acceder al panel /admin del frontend.
--
-- Cómo aplicar este script:
--   1. Abre tu proyecto en https://supabase.com/dashboard
--   2. Ve a "SQL Editor" > "New query"
--   3. Pega el contenido de este archivo y ejecútalo (Run)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'empleado' check (role in ('empleado', 'gerente')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuario solo puede leer su propia fila (necesario para que el
-- frontend compruebe su rol tras iniciar sesión).
drop policy if exists "Profiles: select own" on public.profiles;
create policy "Profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

-- Al crear un usuario en Supabase Auth (Authentication > Users > Add user)
-- se le crea automáticamente una fila en profiles con role = 'empleado'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'empleado')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Para convertir a alguien en gerente (acceso al panel de administración),
-- ejecuta esto tras haber creado su usuario en Authentication > Users:
--
--   update public.profiles set role = 'gerente' where email = 'gerente@asadopilar.com';
