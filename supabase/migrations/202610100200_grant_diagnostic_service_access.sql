-- Allow only the trusted server-side service role to manage diagnostic data.
-- Browser roles remain blocked by both revoked grants and Row Level Security.

revoke all privileges on table public.diagnostic_attempts from anon, authenticated;
revoke all privileges on table public.diagnostic_responses from anon, authenticated;

grant select, insert, update, delete
  on table public.diagnostic_attempts
  to service_role;

grant select, insert, update, delete
  on table public.diagnostic_responses
  to service_role;

grant usage, select
  on sequence public.diagnostic_responses_id_seq
  to service_role;
