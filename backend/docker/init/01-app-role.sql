-- Init script para o Postgres local (docker-compose).
-- Cria o role de aplicação NÃO-superusuário usado pelo backend Go.
-- RLS só isola tenants quando a conexão NÃO é superusuário; por isso o app
-- conecta como app_role e a migration 002 usa FORCE ROW LEVEL SECURITY
-- (app_role é dono das tabelas e, sem FORCE, o dono ignora RLS).

CREATE ROLE app_role LOGIN PASSWORD 'app_secret' NOSUPERUSER NOCREATEROLE;

-- pgcrypto fornece gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- app_role precisa criar objetos (migrations) e operar no schema public
GRANT ALL ON SCHEMA public TO app_role;
ALTER SCHEMA public OWNER TO app_role;
