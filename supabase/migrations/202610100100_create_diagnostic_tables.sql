-- PhySense Lesson 1.1 diagnostic storage
-- Real student/professor attempts only. Synthetic simulations are downloaded
-- as CSV and must never be inserted into these tables.

create table if not exists public.diagnostic_attempts (
  id uuid primary key default gen_random_uuid(),
  client_attempt_id uuid not null unique,
  participant_id uuid not null,
  lesson_id text not null,
  phase text not null check (phase in ('pre', 'post')),
  schema_version text not null default '1.0',
  consent_version text not null,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  duration_ms integer not null check (duration_ms >= 0),
  answer_score smallint not null check (answer_score between 0 and 10),
  reason_score smallint not null check (reason_score between 0 and 10),
  joint_score smallint not null check (joint_score between 0 and 10),
  is_simulated boolean not null default false check (is_simulated = false),
  created_at timestamptz not null default now(),
  constraint diagnostic_attempt_times_valid check (completed_at >= started_at)
);

create table if not exists public.diagnostic_responses (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.diagnostic_attempts(id) on delete cascade,
  question_id text not null,
  selected_answer smallint not null check (selected_answer between 0 and 2),
  selected_reason smallint not null check (selected_reason between 0 and 2),
  answer_correct boolean not null,
  reason_correct boolean not null,
  joint_correct boolean not null,
  confidence text not null check (confidence in ('not-sure', 'somewhat', 'very')),
  concept text not null,
  targeted_misconception text not null,
  difficulty text not null check (difficulty in ('introductory', 'developing', 'challenging')),
  response_time_ms integer not null check (response_time_ms >= 0),
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id),
  constraint diagnostic_joint_score_valid check (joint_correct = (answer_correct and reason_correct))
);

create index if not exists diagnostic_attempts_participant_idx
  on public.diagnostic_attempts (participant_id);

create index if not exists diagnostic_attempts_lesson_phase_idx
  on public.diagnostic_attempts (lesson_id, phase, created_at desc);

create index if not exists diagnostic_responses_question_idx
  on public.diagnostic_responses (question_id);

alter table public.diagnostic_attempts enable row level security;
alter table public.diagnostic_responses enable row level security;

-- Deliberately create no public RLS policies. The anon and authenticated roles
-- cannot read or write diagnostic data. A validated Next.js server endpoint
-- will use the server-only service-role key for inserts and researcher exports.

comment on table public.diagnostic_attempts is
  'Anonymous real-user attempts for PhySense diagnostics. Never contains synthetic rows or direct personal identifiers.';

comment on table public.diagnostic_responses is
  'Item-level two-tier responses linked to a diagnostic attempt.';
