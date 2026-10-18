-- Per-student class invitations. Email addresses remain separate from
-- pseudonymous diagnostic responses and are accessible only to server code.

create table if not exists public.class_roster (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.diagnostic_classes(id) on delete cascade,
  student_email text not null check (student_email = lower(student_email) and char_length(student_email) between 3 and 320),
  personal_token uuid not null default gen_random_uuid() unique,
  has_completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (class_id, student_email)
);

create index if not exists class_roster_class_idx
  on public.class_roster (class_id, created_at);

alter table public.class_roster enable row level security;
revoke all privileges on table public.class_roster from anon, authenticated;
grant select, insert, update, delete on table public.class_roster to service_role;

comment on table public.class_roster is
  'Instructor-managed invitation emails and tokens, kept separate from diagnostic response records.';
