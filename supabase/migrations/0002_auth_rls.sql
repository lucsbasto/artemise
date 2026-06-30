-- 0002_auth_rls.sql
-- Liga `usuarios` ao Supabase Auth e instala RLS multi-tenant derivada de auth.uid().
-- Substitui o modelo Go (SET LOCAL app.clinica_id). Ver design §3.

-- ---------------------------------------------------------------- usuarios <-> auth.users
ALTER TABLE usuarios
  ADD CONSTRAINT usuarios_id_auth_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ---------------------------------------------------------------- tenant resolver
-- security definer + search_path fixo: lê `usuarios` IGNORANDO a RLS de `usuarios`,
-- evitando recursão (a policy de usuarios pode referenciar esta função sem loop).
CREATE OR REPLACE FUNCTION auth_clinica_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT clinica_id FROM usuarios WHERE id = auth.uid() $$;

REVOKE ALL ON FUNCTION auth_clinica_id() FROM public;
GRANT EXECUTE ON FUNCTION auth_clinica_id() TO authenticated;

-- ---------------------------------------------------------------- privilégios de tabela
-- A role `authenticated` é quem o PostgREST usa para usuários logados. RLS gateia as linhas.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- service_role (seed/admin server-side via service-role key) precisa de full grant.
-- Sem isto, após um reset de schema o seed via PostgREST dá "permission denied".
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

-- ---------------------------------------------------------------- RLS das 21 tabelas tenant-scoped
DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'pacientes','procedimentos','pacotes','pacote_itens','profissionais',
    'profissional_detalhe','profissional_horarios','profissional_comissoes',
    'profissional_procedimentos','fornecedores','itens_estoque','registros_procedimento',
    'eventos_agenda','contas_financeiras','categorias_contas','metodos_pagamento',
    'lancamentos_financeiros','orcamentos','orcamento_itens','fichas_atendimento','modelos_documento'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I FOR ALL TO authenticated '
      || 'USING (clinica_id = auth_clinica_id()) '
      || 'WITH CHECK (clinica_id = auth_clinica_id())',
      t
    );
    -- client não precisa (nem deve) enviar clinica_id: default = tenant do JWT.
    EXECUTE format('ALTER TABLE %I ALTER COLUMN clinica_id SET DEFAULT auth_clinica_id()', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------- clinicas (RLS própria)
ALTER TABLE clinicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY clinica_self ON clinicas FOR ALL TO authenticated
  USING (id = auth_clinica_id())
  WITH CHECK (id = auth_clinica_id());

-- ---------------------------------------------------------------- usuarios (RLS própria, sem a função p/ writes)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ler a própria linha + colegas da mesma clínica (auth_clinica_id é security definer: sem recursão).
CREATE POLICY usuarios_read ON usuarios FOR SELECT TO authenticated
  USING (id = auth.uid() OR clinica_id = auth_clinica_id());
-- atualizar só a própria linha.
CREATE POLICY usuarios_update_self ON usuarios FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
-- INSERT de usuarios acontece só via RPC criar_clinica (SECURITY DEFINER) — sem policy de insert aqui.
