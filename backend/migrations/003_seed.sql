-- migrate:up
--
-- Seed de desenvolvimento fiel a web/src/lib/mock.ts.
-- Senha do usuário admin (lucsbasto@gmail.com): "senha123"
-- (hash argon2id pré-computado abaixo, m=65536,t=1,p=4).
--
-- Idempotente: usa UUIDs fixos + ON CONFLICT DO NOTHING.
-- As tabelas tenant-scoped têm FORCE RLS (002); por isso definimos o
-- app.clinica_id no contexto da transação antes dos INSERTs.

SELECT set_config('app.clinica_id', '00000000-0000-0000-0000-000000000001', true);

-- Clínica (sem RLS)
INSERT INTO clinicas (id, nome, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Clínica Experts', 'clinica-experts')
ON CONFLICT (id) DO NOTHING;

-- Usuário admin (sem RLS). senha: senha123
INSERT INTO usuarios (id, clinica_id, nome, email, senha_hash, perfil_acesso, ativo) VALUES
  ('00000000-0000-0000-0000-0000000000a1',
   '00000000-0000-0000-0000-000000000001',
   'Lucas Bastos',
   'lucsbasto@gmail.com',
   '$argon2id$v=19$m=65536,t=1,p=4$ws1DS0zrHtZlOP5bZdVbpA$kx1hIKl8Mfgt+6fzG/uip6TlCQu2xDbUkzcUtpeQeec',
   'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Profissional (identificação básica)
INSERT INTO profissionais (id, clinica_id, nome, tipo, identificador, ativo, avatar_tone) VALUES
  ('00000000-0000-0000-0000-0000000000b1',
   '00000000-0000-0000-0000-000000000001',
   'Lucas Bastos', 'Profissional', '+55 (63) 98502-1531', false, 'green')
ON CONFLICT (id) DO NOTHING;

-- Paciente Clara Ribeiro
INSERT INTO pacientes (id, clinica_id, nome, tipo, identificador, ativo, sexo,
                       data_nascimento, cpf, email, endereco, observacoes, recebe_notificacoes) VALUES
  ('00000000-0000-0000-0000-0000000000c1',
   '00000000-0000-0000-0000-000000000001',
   'Clara Ribeiro (Paciente de exemplo)', 'Paciente', '+55 (11) 99999-9999', true, 'Feminino',
   '1991-12-02', '315.772.070-84', 'clara.ribeiro@exemplo.com',
   'Av. Pedro Álvares Cabral, SN — Vila Mariana, São Paulo, SP — 04094-050 — Brasil',
   'Esse paciente é um paciente de exemplo.', false)
ON CONFLICT (id) DO NOTHING;

-- Procedimentos (14; injetáveis usam mapa)
INSERT INTO procedimentos (id, clinica_id, nome, categoria, duracao_min, valor, ativo, usa_mapa) VALUES
  ('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000001','Limpeza de Pele Profunda','Facial',60,200,true,false),
  ('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0000-000000000001','Microagulhamento','Facial',60,500,true,false),
  ('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0000-000000000001','Peeling Químico','Facial',60,300,true,false),
  ('00000000-0000-0000-0000-000000000104','00000000-0000-0000-0000-000000000001','Tratamento de Acne','Facial',60,250,true,false),
  ('00000000-0000-0000-0000-000000000105','00000000-0000-0000-0000-000000000001','Harmonização Facial','Injetáveis',90,2500,true,true),
  ('00000000-0000-0000-0000-000000000106','00000000-0000-0000-0000-000000000001','Toxina Botulínica (Botox)','Injetáveis',45,1300,true,true),
  ('00000000-0000-0000-0000-000000000107','00000000-0000-0000-0000-000000000001','Preenchimento c/ Ácido Hialurônico','Injetáveis',60,1800,true,true),
  ('00000000-0000-0000-0000-000000000108','00000000-0000-0000-0000-000000000001','Bioestimulador de Colágeno','Injetáveis',60,1600,true,true),
  ('00000000-0000-0000-0000-000000000109','00000000-0000-0000-0000-000000000001','Fios de PDO (lifting)','Injetáveis',60,2000,true,true),
  ('00000000-0000-0000-0000-00000000010a','00000000-0000-0000-0000-000000000001','Skinbooster','Injetáveis',45,900,true,true),
  ('00000000-0000-0000-0000-00000000010b','00000000-0000-0000-0000-000000000001','Radiofrequência Facial','Facial',50,400,true,false),
  ('00000000-0000-0000-0000-00000000010c','00000000-0000-0000-0000-000000000001','Laser / Luz Intensa Pulsada (IPL)','Facial',45,600,true,false),
  ('00000000-0000-0000-0000-00000000010d','00000000-0000-0000-0000-000000000001','Criolipólise','Corporal',60,800,true,false),
  ('00000000-0000-0000-0000-00000000010e','00000000-0000-0000-0000-000000000001','Radiofrequência / Drenagem Corporal','Corporal',60,350,true,false)
ON CONFLICT (id) DO NOTHING;

-- Itens de estoque (8)
INSERT INTO itens_estoque (id, clinica_id, nome, sku, categoria, unidade, saldo, minimo, custo) VALUES
  ('00000000-0000-0000-0000-000000000201','00000000-0000-0000-0000-000000000001','Ácido Hialurônico 2ml','AH-002','Injetáveis','ui',120,30,180),
  ('00000000-0000-0000-0000-000000000202','00000000-0000-0000-0000-000000000001','Agulha 30G','AG-030','Material de atendimento','cx',3,10,45),
  ('00000000-0000-0000-0000-000000000203','00000000-0000-0000-0000-000000000001','Creme Anti-idade','CR-ANT','Revenda','un',28,8,60),
  ('00000000-0000-0000-0000-000000000204','00000000-0000-0000-0000-000000000001','Gel Condutor 1L','GC-1L','Material de atendimento','un',2,4,22),
  ('00000000-0000-0000-0000-000000000205','00000000-0000-0000-0000-000000000001','Protetor Solar FPS 50','PS-050','Revenda','un',40,10,35),
  ('00000000-0000-0000-0000-000000000206','00000000-0000-0000-0000-000000000001','Toxina Botulínica 100ui','TX-100','Injetáveis','ui',200,50,900),
  ('00000000-0000-0000-0000-000000000207','00000000-0000-0000-0000-000000000001','Fio de PDO','PDO-01','Injetáveis','ui',80,20,40),
  ('00000000-0000-0000-0000-000000000208','00000000-0000-0000-0000-000000000001','Bioestimulador de Colágeno','BIO-01','Injetáveis','ui',60,15,1200)
ON CONFLICT (id) DO NOTHING;

-- Métodos de pagamento (8 exatos)
INSERT INTO metodos_pagamento (id, clinica_id, descricao, tipo, marca, ativo) VALUES
  ('00000000-0000-0000-0000-000000000301','00000000-0000-0000-0000-000000000001','Boleto','Boleto','—',true),
  ('00000000-0000-0000-0000-000000000302','00000000-0000-0000-0000-000000000001','Cartão de crédito','Cartão','Outra',true),
  ('00000000-0000-0000-0000-000000000303','00000000-0000-0000-0000-000000000001','Cartão de débito','Cartão','Outra',true),
  ('00000000-0000-0000-0000-000000000304','00000000-0000-0000-0000-000000000001','Depósito','Transferência','—',true),
  ('00000000-0000-0000-0000-000000000305','00000000-0000-0000-0000-000000000001','Dinheiro','Dinheiro','—',false),
  ('00000000-0000-0000-0000-000000000306','00000000-0000-0000-0000-000000000001','Máquina de cartão','Cartão','—',true),
  ('00000000-0000-0000-0000-000000000307','00000000-0000-0000-0000-000000000001','PIX','PIX','—',true),
  ('00000000-0000-0000-0000-000000000308','00000000-0000-0000-0000-000000000001','Transferência','Transferência','—',true)
ON CONFLICT (id) DO NOTHING;

-- Categorias de contas (árvore: raízes primeiro, depois filhos)
INSERT INTO categorias_contas (id, clinica_id, descricao, ativo, parent_id) VALUES
  ('00000000-0000-0000-0000-000000000401','00000000-0000-0000-0000-000000000001','Receitas de serviços',true,NULL),
  ('00000000-0000-0000-0000-000000000402','00000000-0000-0000-0000-000000000001','Vendas de produtos',true,NULL),
  ('00000000-0000-0000-0000-000000000403','00000000-0000-0000-0000-000000000001','Aquisições de imobilizados',true,NULL),
  ('00000000-0000-0000-0000-000000000404','00000000-0000-0000-0000-000000000001','Outras despesas',true,NULL),
  ('00000000-0000-0000-0000-000000000405','00000000-0000-0000-0000-000000000001','Impostos e taxas',false,NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO categorias_contas (id, clinica_id, descricao, ativo, parent_id) VALUES
  ('00000000-0000-0000-0000-000000000411','00000000-0000-0000-0000-000000000001','Procedimentos estéticos',true,'00000000-0000-0000-0000-000000000401'),
  ('00000000-0000-0000-0000-000000000412','00000000-0000-0000-0000-000000000001','Consultas',true,'00000000-0000-0000-0000-000000000401'),
  ('00000000-0000-0000-0000-000000000421','00000000-0000-0000-0000-000000000001','Cosméticos',true,'00000000-0000-0000-0000-000000000402'),
  ('00000000-0000-0000-0000-000000000431','00000000-0000-0000-0000-000000000001','Equipamentos',true,'00000000-0000-0000-0000-000000000403'),
  ('00000000-0000-0000-0000-000000000432','00000000-0000-0000-0000-000000000001','Móveis e utensílios',false,'00000000-0000-0000-0000-000000000403'),
  ('00000000-0000-0000-0000-000000000441','00000000-0000-0000-0000-000000000001','Aluguel',true,'00000000-0000-0000-0000-000000000404'),
  ('00000000-0000-0000-0000-000000000442','00000000-0000-0000-0000-000000000001','Energia elétrica',true,'00000000-0000-0000-0000-000000000404'),
  ('00000000-0000-0000-0000-000000000443','00000000-0000-0000-0000-000000000001','Marketing',true,'00000000-0000-0000-0000-000000000404')
ON CONFLICT (id) DO NOTHING;

-- Contas financeiras
INSERT INTO contas_financeiras (id, clinica_id, nome, tipo, saldo, icon, ativo) VALUES
  ('00000000-0000-0000-0000-000000000601','00000000-0000-0000-0000-000000000001','Banco padrão','Conta Corrente',2431,'bank',true),
  ('00000000-0000-0000-0000-000000000602','00000000-0000-0000-0000-000000000001','Caixa','Caixa',0,'cash',true)
ON CONFLICT (id) DO NOTHING;

-- Fichas de atendimento (10)
INSERT INTO fichas_atendimento (id, clinica_id, nome, ativo) VALUES
  ('00000000-0000-0000-0000-000000000501','00000000-0000-0000-0000-000000000001','Anamnese',true),
  ('00000000-0000-0000-0000-000000000502','00000000-0000-0000-0000-000000000001','Capilar',true),
  ('00000000-0000-0000-0000-000000000503','00000000-0000-0000-0000-000000000001','Corporal',true),
  ('00000000-0000-0000-0000-000000000504','00000000-0000-0000-0000-000000000001','Epilação',true),
  ('00000000-0000-0000-0000-000000000505','00000000-0000-0000-0000-000000000001','Estética Facial',true),
  ('00000000-0000-0000-0000-000000000506','00000000-0000-0000-0000-000000000001','Facial',true),
  ('00000000-0000-0000-0000-000000000507','00000000-0000-0000-0000-000000000001','Fotos e anexos',true),
  ('00000000-0000-0000-0000-000000000508','00000000-0000-0000-0000-000000000001','Injetáveis',true),
  ('00000000-0000-0000-0000-000000000509','00000000-0000-0000-0000-000000000001','Orçamento',true),
  ('00000000-0000-0000-0000-00000000050a','00000000-0000-0000-0000-000000000001','Plano de tratamento',true)
ON CONFLICT (id) DO NOTHING;

-- Modelo de documento
INSERT INTO modelos_documento (id, clinica_id, nome, tipo, ativo) VALUES
  ('00000000-0000-0000-0000-000000000701','00000000-0000-0000-0000-000000000001','Atestado','Atestado',true)
ON CONFLICT (id) DO NOTHING;

-- migrate:down

-- Define o contexto RLS para que os DELETEs nas tabelas com FORCE RLS atinjam
-- as linhas do tenant semeado.
SELECT set_config('app.clinica_id', '00000000-0000-0000-0000-000000000001', true);

DELETE FROM modelos_documento     WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM fichas_atendimento    WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM contas_financeiras    WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM categorias_contas     WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM metodos_pagamento     WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM itens_estoque         WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM procedimentos         WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM pacientes             WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM profissionais         WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM sessions WHERE usuario_id IN (SELECT id FROM usuarios WHERE clinica_id = '00000000-0000-0000-0000-000000000001');
DELETE FROM usuarios              WHERE clinica_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM clinicas              WHERE id = '00000000-0000-0000-0000-000000000001';
