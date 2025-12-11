create table if not exists products (
  id text primary key,
  title text not null,
  price numeric not null check (price >= 0),
  image text,
  description text,
  brand text,
  age_group text,
  stock integer,
  category text,
  slug text unique,
  created_at timestamptz default now(),
  rating numeric
);

alter table products enable row level security;

create policy "allow read to all" on products
for select using (true);
