alter table products add column if not exists category text;

update products set category = 'Brinquedos' where id in ('k1','k2','k3','k8','k10');
update products set category = 'Acessórios' where id in ('k4','k7');
update products set category = 'Livros' where id in ('k9');
update products set category = 'Moda' where id in ('k5');
update products set category = coalesce(category, 'Brinquedos');

create index if not exists products_category_idx on products(category);
