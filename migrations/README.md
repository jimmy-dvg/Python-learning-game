# Supabase Migration Instructions

To set up your Supabase database, follow these steps in order in the **SQL Editor** of your Supabase Dashboard:

### 1. Core Schema
Run the contents of [001_create_schema.sql](migrations/001_create_schema.sql). This creates the `profiles`, `levels`, `challenges`, `user_progress`, and `submissions` tables.

### 2. Roles and Admin logic
Run the contents of [002_add_roles.sql](migrations/002_add_roles.sql). This adds the `role` column to the `profiles` table.

### 3. Atomic Updates (XP & Progress)
Run the contents of [003_atomic_xp_update.sql](migrations/003_atomic_xp_update.sql). This creates the `fn_complete_challenge` RPC function.

### 4. Security Policies (RLS)
Run the contents of [004_rls_policies.sql](migrations/004_rls_policies.sql). This secures your data so users can only access their own records.

### 5. Storage Setup
Run the contents of [005_storage_buckets.sql](migrations/005_storage_buckets.sql) or manually create a public bucket named **`avatars`** in the Storage tab.

---

### Verification
You can verify the setup by trying to register a new user in your app. Check the `profiles` table in Supabase to see if the record was created automatically via the Auth trigger/service.
