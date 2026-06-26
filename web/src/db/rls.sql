-- RLS foundation: função que resolve os tenants do usuário logado.
--
-- ORDEM: rodar ANTES de `npm run db:migrate`. As policies geradas pelo Drizzle
-- referenciam private.user_clinica_ids(), então a função tem de pré-existir.
-- `check_function_bodies = off` permite criar a função mesmo que public.memberships
-- ainda não exista (a tabela é criada pela migration logo em seguida; só é lida em runtime).
-- SECURITY DEFINER → roda como owner, ignora RLS de memberships (sem recursão de policy).

set check_function_bodies = off;

create schema if not exists private;

create or replace function private.user_clinica_ids()
returns setof uuid
language sql
security definer
stable
set search_path = ''
as $$
  select clinica_id
  from public.memberships
  where profile_id = (select auth.uid())
    and ativo = true
$$;

revoke all on function private.user_clinica_ids() from public, anon;
grant execute on function private.user_clinica_ids() to authenticated;

-- Onboarding: quando um auth.user é criado, espelha em public.profiles.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
