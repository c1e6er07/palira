create table if not exists products (
  id text primary key,
  title text not null,
  price numeric not null check (price >= 0),
  image text
);

alter table products enable row level security;

create policy "allow read to all" on products
for select using (true);
