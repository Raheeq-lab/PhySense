-- Link consented diagnostic attempts to the invitation used to submit them.
-- This enables an instructor-owned raw export while preserving older and
-- class-code attempts as anonymous (roster_id remains null).

alter table public.diagnostic_attempts
  add column if not exists roster_id uuid
  references public.class_roster(id) on delete set null;

create index if not exists diagnostic_attempts_roster_idx
  on public.diagnostic_attempts (roster_id, completed_at);

comment on column public.diagnostic_attempts.roster_id is
  'Roster invitation used for this consented attempt; null for anonymous class-code attempts.';
