# Supabase

This directory contains Supabase Edge Functions and schema documentation for the project.

---

## `todos` table

Reference schema demonstrating Row Level Security (RLS). Copy-paste this into your Supabase SQL Editor to set up the example table.

### Schema

```sql
-- Create the todos table
create table if not exists public.todos (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  is_complete boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.todos enable row level security;
```

### RLS Policies

```sql
-- Users can only read their own todos
create policy "Users can view their own todos"
  on public.todos for select
  using (auth.uid() = user_id);

-- Users can only insert their own todos
create policy "Users can insert their own todos"
  on public.todos for insert
  with check (auth.uid() = user_id);

-- Users can only update their own todos
create policy "Users can update their own todos"
  on public.todos for update
  using (auth.uid() = user_id);

-- Users can only delete their own todos
create policy "Users can delete their own todos"
  on public.todos for delete
  using (auth.uid() = user_id);
```

### Applying the schema

**Option A — Supabase Dashboard:**
1. Go to your project → **SQL Editor**
2. Paste the DDL above and click **Run**

**Option B — Supabase CLI:**
```bash
supabase db push
```

---

## Edge Functions

Edge Functions live in `functions/`. Each is a self-contained Deno/TypeScript module.

| Function | Path | Description |
|----------|------|-------------|
| `hello`  | `functions/hello/index.ts` | Reference example — returns a JSON greeting |

### Running locally

```bash
supabase functions serve hello --no-verify-jwt
```

### Deploying

```bash
supabase functions deploy hello
```
