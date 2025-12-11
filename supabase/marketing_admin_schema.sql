create table if not exists campaigns (
  id text primary key,
  name text not null,
  slug text not null,
  status text not null default 'draft',
  description text,
  assets jsonb,
  budget numeric check (budget >= 0),
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create unique index if not exists campaigns_slug_uq on campaigns(slug);
create index if not exists campaigns_status_idx on campaigns(status);

alter table campaigns enable row level security;
create policy "allow read to all" on campaigns for select using (true);

create table if not exists coupons (
  code text primary key,
  description text,
  discount_percent numeric check (discount_percent >= 0 and discount_percent <= 100),
  discount_value numeric check (discount_value >= 0),
  active boolean default true,
  usage_limit int,
  used_count int default 0,
  min_purchase numeric check (min_purchase >= 0),
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create index if not exists coupons_active_idx on coupons(active);

alter table coupons enable row level security;
create policy "allow read to all" on coupons for select using (true);

create table if not exists newsletter_subscriptions (
  email text primary key,
  name text,
  confirmed boolean default false,
  source text,
  unsubscribe_token text,
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create unique index if not exists newsletter_unsubscribe_token_uq on newsletter_subscriptions(unsubscribe_token);
create index if not exists newsletter_created_at_idx on newsletter_subscriptions(created_at);

alter table newsletter_subscriptions enable row level security;
create policy "allow insert to anon" on newsletter_subscriptions
for insert to anon
with check (true);
create policy "allow insert to authenticated" on newsletter_subscriptions
for insert to authenticated
with check (true);

create table if not exists marketing_events (
  id text primary key,
  type text not null,
  campaign_id text references campaigns(id) on delete set null,
  payload jsonb not null,
  user_id text,
  session_id text,
  occurred_at timestamp with time zone default now()
);

create index if not exists marketing_events_type_idx on marketing_events(type);
create index if not exists marketing_events_occurred_idx on marketing_events(occurred_at);

alter table marketing_events enable row level security;
create policy "allow insert to anon" on marketing_events
for insert to anon
with check (true);
create policy "allow insert to authenticated" on marketing_events
for insert to authenticated
with check (true);

