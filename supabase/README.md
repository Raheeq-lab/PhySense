# PhySense Supabase setup

## Step 1 — create the diagnostic tables

1. Open the Supabase project used by PhySense.
2. In the left menu, open **SQL Editor**.
3. Select **New query**.
4. Copy the complete contents of
   `supabase/migrations/202610100100_create_diagnostic_tables.sql`.
5. Paste it into the query and select **Run**.
6. Open **Table Editor** and confirm these two tables exist:
   - `diagnostic_attempts`
   - `diagnostic_responses`

Both tables have Row Level Security enabled and intentionally have no public
policies. Browser clients cannot access the research data directly. Only the
server-side PhySense API built in the next step will use the service-role key.

Do not paste `SUPABASE_SERVICE_ROLE_KEY` into the SQL editor, browser console,
client component, screenshot, email, or Git repository.
