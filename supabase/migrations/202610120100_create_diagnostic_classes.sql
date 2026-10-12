-- Prototype instructor classes for the PhySense Lesson 1.1 demonstrator.
-- Class codes identify a class, while participant UUIDs identify browsers.

create table if not exists public.diagnostic_classes (
  id uuid primary key default gen_random_uuid(),
  class_code text not null unique check (class_code ~ '^[A-Z2-9]{6}$'),
  title text not null check (char_length(title) between 3 and 80),
  lesson_id text not null check (lesson_id = 'block-1/1-1'),
  instructor_token_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_attempts
  add column if not exists class_id uuid references public.diagnostic_classes(id) on delete set null;

create index if not exists diagnostic_attempts_class_idx
  on public.diagnostic_attempts (class_id, created_at desc);

alter table public.diagnostic_classes enable row level security;

revoke all privileges on table public.diagnostic_classes from anon, authenticated;
grant select, insert, update, delete on table public.diagnostic_classes to service_role;

comment on table public.diagnostic_classes is
  'Prototype class containers. Contains no instructor or learner names or email addresses.';

comment on column public.diagnostic_attempts.class_id is
  'Optional class association. The class code is not a learner identifier.';
