create table if not exists orders (
  id text primary key,
  total numeric not null check (total >= 0),
  payment_method text not null,
  items jsonb not null,
  status text not null default 'paid',
  intent_id text,
  created_at timestamp with time zone default now()
);

alter table orders enable row level security;

create policy "allow read to all" on orders for select using (true);

create policy "allow insert to anon" on orders
for insert to anon
with check (true);

create policy "allow insert to authenticated" on orders
for insert to authenticated
with check (true);
