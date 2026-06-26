-- migrate:up
--
-- Row Level Security por clinica_id. Habilitada e FORÇADA (FORCE) em toda
-- tabela tenant-scoped. FORCE é obrigatório porque o app_role é DONO das
-- tabelas (criou-as nas migrations) e, sem FORCE, o dono ignora as policies.
--
-- clinicas/usuarios/sessions ficam FORA da RLS: são consultadas no login e na
-- resolução de sessão ANTES de existir um app.clinica_id no contexto.
--
-- A policy usa current_setting('app.clinica_id', true) (missing_ok = true), de
-- modo que, sem contexto definido, retorna NULL e nenhuma linha é exposta.

DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'pacientes',
    'procedimentos',
    'pacotes',
    'pacote_itens',
    'profissionais',
    'profissional_detalhe',
    'profissional_horarios',
    'profissional_comissoes',
    'profissional_procedimentos',
    'fornecedores',
    'itens_estoque',
    'registros_procedimento',
    'eventos_agenda',
    'contas_financeiras',
    'categorias_contas',
    'metodos_pagamento',
    'lancamentos_financeiros',
    'orcamentos',
    'orcamento_itens',
    'fichas_atendimento',
    'modelos_documento'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I FOR ALL '
      || 'USING (clinica_id = current_setting(''app.clinica_id'', true)::uuid) '
      || 'WITH CHECK (clinica_id = current_setting(''app.clinica_id'', true)::uuid)',
      t
    );
  END LOOP;
END $$;

-- migrate:down

DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'pacientes',
    'procedimentos',
    'pacotes',
    'pacote_itens',
    'profissionais',
    'profissional_detalhe',
    'profissional_horarios',
    'profissional_comissoes',
    'profissional_procedimentos',
    'fornecedores',
    'itens_estoque',
    'registros_procedimento',
    'eventos_agenda',
    'contas_financeiras',
    'categorias_contas',
    'metodos_pagamento',
    'lancamentos_financeiros',
    'orcamentos',
    'orcamento_itens',
    'fichas_atendimento',
    'modelos_documento'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
