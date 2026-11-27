-- Nepali Tools — Supabase schema (paste into SQL Editor, run once)
-- Everything is deliberately minimal; Supabase Auth tables come later.

-- 1) Data engine snapshots (replaces serverless-FS persistence)
create table if not exists public.market_snapshots (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamptz not null default now(),
  payload jsonb not null,
  source_hashes jsonb
);
create index if not exists market_snapshots_updated_idx on public.market_snapshots (updated_at desc);

create table if not exists public.sync_runs (
  id bigserial primary key,
  ran_at timestamptz not null default now(),
  ok boolean not null,
  events jsonb not null default '[]'::jsonb
);

-- 2) Newsletter (single opt-in now, double opt-in token ready for later)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed','bounced')),
  locale text not null default 'ne',
  source text not null default 'website',
  confirm_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers (status);

-- 3) Grow-in-ready: engine history is appended as rows too
create table if not exists public.market_history (
  id bigserial primary key,
  category text not null check (category in ('gold','forex','vegetables')),
  captured_at timestamptz not null,
  payload jsonb not null
);
create index if not exists market_history_cat_idx on public.market_history (category, captured_at desc);

-- RLS: every read/write goes through the server (service-role key);
-- no public anon access to any of these tables.
alter table public.market_snapshots enable row level security;
alter table public.sync_runs enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.market_history enable row level security;
