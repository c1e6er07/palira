-- Adicionar políticas de INSERT para permitir criação de dados mock

-- Campanhas - permitir insert para authenticated users
create policy if not exists "allow insert to authenticated" on campaigns
for insert to authenticated
with check (true);

-- Cupons - permitir insert para authenticated users
create policy if not exists "allow insert to authenticated" on coupons
for insert to authenticated
with check (true);

-- Newsletter já tem política de insert

-- Marketing events já tem política de insert
