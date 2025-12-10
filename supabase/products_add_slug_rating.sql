alter table products add column if not exists slug text;
alter table products add column if not exists created_at timestamp with time zone default now();
alter table products add column if not exists rating numeric;

update products set slug = lower(replace(title, ' ', '-')) where slug is null;
update products set rating = 4.5 where id in ('k1','k3','k9');
update products set rating = 4.2 where id in ('k2','k4','k8');
update products set rating = 4.0 where id in ('k5','k6');
update products set rating = 3.8 where id in ('k7','k10');

create unique index if not exists products_slug_uq on products(slug);
