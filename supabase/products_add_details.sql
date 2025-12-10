alter table products add column if not exists description text;
alter table products add column if not exists brand text;
alter table products add column if not exists age_group text;
alter table products add column if not exists stock int;

update products set description = 'Boneca com vestido mágico e acessórios brilhantes.', brand='Palira Kids', age_group='3–5 anos', stock=25 where id='k1';
update products set description = 'Carrinho colorido com rodas turbinadas e luzes.', brand='TurboFun', age_group='4–7 anos', stock=40 where id='k2';
update products set description = 'Kit de artes com tintas seguras e moldes divertidos.', brand='ArteMágica', age_group='5–8 anos', stock=30 where id='k3';
update products set description = 'Luminária com estrelas cintilantes para noites mágicas.', brand='DreamLight', age_group='3–6 anos', stock=50 where id='k4';
update products set description = 'Jogo educativo com letras e desafios divertidos.', brand='EduPlay', age_group='4–6 anos', stock=35 where id='k5';
update products set description = 'Pelúcia de dinossauro macia e fofa.', brand='SoftDino', age_group='2–5 anos', stock=20 where id='k6';
update products set description = 'Mochila temática com bolsos secretos.', brand='HeroBag', age_group='5–9 anos', stock=15 where id='k7';
update products set description = 'Quebra-cabeça arco-íris com peças grandes.', brand='PuzzleJoy', age_group='3–6 anos', stock=60 where id='k8';
update products set description = 'Livro ilustrado com histórias encantadoras.', brand='MagicBook', age_group='4–7 anos', stock=45 where id='k9';
update products set description = 'Patins coloridos com ajuste seguro.', brand='ColorSkate', age_group='6–10 anos', stock=10 where id='k10';
