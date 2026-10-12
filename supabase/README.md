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

## Step 2 — grant the server role access

Run `supabase/migrations/202610100200_grant_diagnostic_service_access.sql`
in the SQL Editor after the table migration. This grants database privileges
to Supabase's trusted `service_role` while explicitly revoking access from the
public `anon` and signed-in `authenticated` browser roles.

Do not paste `SUPABASE_SERVICE_ROLE_KEY` into the SQL editor, browser console,
client component, screenshot, email, or Git repository.

## Step 3 — enable the instructor class prototype

Run `supabase/migrations/202610120100_create_diagnostic_classes.sql` in the
SQL Editor. This creates `diagnostic_classes` and adds the optional `class_id`
link to `diagnostic_attempts`. The class table remains unavailable to browser
roles; all validation and summaries pass through the server API.

Add `INSTRUCTOR_PROTOTYPE_KEY` to the local and Vercel server environments.
Use a long random value and share it only with people allowed to create
prototype classes. It is not stored in the browser after a class is created.
