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

## Step 3 — enable instructor classes

Run `supabase/migrations/202610120100_create_diagnostic_classes.sql` in the
SQL Editor. This creates `diagnostic_classes` and adds the optional `class_id`
link to `diagnostic_attempts`. The class table remains unavailable to browser
roles; all validation and summaries pass through the server API.

## Step 4 — enable instructor accounts

Run `supabase/migrations/202610180100_add_instructor_accounts.sql` in the SQL
Editor. This creates the role-based `profiles` table, adds instructor ownership
to classes, and installs a safe profile trigger for future Auth users.

Create an instructor under **Authentication → Users**. Then assign the role in
the SQL Editor, replacing the example email:

```sql
insert into public.profiles (user_id, role)
select id, 'instructor' from auth.users where email = 'instructor@example.com'
on conflict (user_id) do update set role = excluded.role;
```

The public `/instructor/register` route uses trusted server code to promote a
newly registered account to the `instructor` role. Other Auth users retain the
trigger's default `learner` role.

## Step 5 — enable student rosters

Run `supabase/migrations/202610180200_create_class_roster.sql` in the SQL
Editor. This creates the protected `class_roster` table used for student email
uploads, personal invitation tokens, and completion status. Browser roles have
no direct table access; roster reads and writes pass through authenticated
server endpoints that verify class ownership.
