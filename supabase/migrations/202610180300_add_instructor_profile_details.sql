-- Professional instructor profile details used in the private workspace.

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists university text;

-- Preserve existing accounts while making the new fields required going forward.
update public.profiles as profile
set
  full_name = coalesce(
    nullif(trim(profile.full_name), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(auth_user.email, '@', 1), ''),
    'Instructor'
  ),
  university = coalesce(
    nullif(trim(profile.university), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'university'), ''),
    'Institution not provided'
  )
from auth.users as auth_user
where auth_user.id = profile.user_id;

update public.profiles
set
  full_name = coalesce(nullif(trim(full_name), ''), 'Instructor'),
  university = coalesce(nullif(trim(university), ''), 'Institution not provided')
where full_name is null or university is null;

alter table public.profiles
  alter column role set default 'instructor',
  alter column full_name set not null,
  alter column university set not null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, role, full_name, university)
  values (
    new.id,
    'instructor',
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), nullif(split_part(new.email, '@', 1), ''), 'Instructor'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'university'), ''), 'Institution not provided')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

comment on column public.profiles.full_name is
  'Instructor display name supplied during registration.';

comment on column public.profiles.university is
  'Instructor university or institution supplied during registration.';
