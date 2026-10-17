-- Supabase Auth-backed instructor ownership.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'learner' check (role in ('learner', 'instructor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all privileges on table public.profiles from anon, authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, role) values (new.id, 'learner')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

alter table public.diagnostic_classes
  add column if not exists instructor_id uuid references public.profiles(user_id) on delete set null;

alter table public.diagnostic_classes
  alter column instructor_token_hash drop not null;

create index if not exists diagnostic_classes_instructor_idx
  on public.diagnostic_classes (instructor_id, created_at desc);

comment on table public.profiles is
  'Application roles linked to Supabase Auth users. Managed only by trusted server code.';

comment on column public.diagnostic_classes.instructor_id is
  'The authenticated instructor who created and owns this class.';
