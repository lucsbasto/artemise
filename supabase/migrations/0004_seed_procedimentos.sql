-- 0004_seed_procedimentos.sql
-- Catálogo inicial de procedimentos. Popula toda clínica que ainda não tem
-- nenhum procedimento (tenant novo cai aqui). Roda como owner na migração, sem
-- contexto de auth, então insere direto por clinica_id (RLS não se aplica ao
-- owner). Idempotente: o NOT EXISTS pula clínicas que já têm catálogo, então
-- reexecutar não duplica.
INSERT INTO procedimentos (clinica_id, nome, categoria, duracao_min, valor, ativo, usa_mapa)
SELECT c.id, v.nome, v.categoria, v.duracao_min, v.valor, true, v.usa_mapa
FROM clinicas c
CROSS JOIN (VALUES
  ('Limpeza de Pele Profunda',              'Facial',     60,  200, false),
  ('Microagulhamento',                      'Facial',     60,  500, false),
  ('Peeling Químico',                       'Facial',     60,  300, false),
  ('Tratamento de Acne',                    'Facial',     60,  250, false),
  ('Toxina Botulínica',                     'Injetáveis', 45,  900, true),
  ('Preenchimento com Ácido Hialurônico',   'Injetáveis', 45, 1200, true),
  ('Massagem Modeladora',                   'Corporal',   50,  180, false),
  ('Drenagem Linfática',                    'Corporal',   50,  160, false)
) AS v(nome, categoria, duracao_min, valor, usa_mapa)
WHERE NOT EXISTS (
  SELECT 1 FROM procedimentos p WHERE p.clinica_id = c.id
);
