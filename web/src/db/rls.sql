-- RLS foundation: funções que resolvem tenant + role do usuário logado, RPC de
-- onboarding e trigger de espelhamento de auth.users.
--
-- ORDEM: rodar ANTES de `npm run db:migrate`. As policies geradas pelo Drizzle
-- referenciam estas funções, então elas têm de pré-existir. `check_function_bodies = off`
-- permite criá-las mesmo que as tabelas (public.memberships/clinicas) ainda não existam
-- — só são lidas em runtime, quando a migration já as criou.
-- SECURITY DEFINER → rodam como owner, ignoram RLS (sem recursão de policy).

set check_function_bodies = off;

create schema if not exists private;

-- Tenants ativos do usuário logado (base do isolamento).
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

-- É admin/owner da clínica? (gate de escrita p/ membership e configs da clínica)
create or replace function private.user_is_admin(target uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships
    where profile_id = (select auth.uid())
      and clinica_id = target
      and ativo = true
      and role in ('owner', 'admin')
  )
$$;

-- É owner da clínica? (gate de ações destrutivas — deletar a clínica)
create or replace function private.user_is_owner(target uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships
    where profile_id = (select auth.uid())
      and clinica_id = target
      and ativo = true
      and role = 'owner'
  )
$$;

revoke all on function private.user_clinica_ids() from public, anon;
revoke all on function private.user_is_admin(uuid) from public, anon;
revoke all on function private.user_is_owner(uuid) from public, anon;
grant execute on function private.user_clinica_ids() to authenticated;
grant execute on function private.user_is_admin(uuid) to authenticated;
grant execute on function private.user_is_owner(uuid) to authenticated;

-- Onboarding atômico: cria a clínica e o vínculo owner do usuário logado.
-- SECURITY DEFINER → contorna o RLS (que proíbe self-insert de membership).
-- É a ÚNICA via de criar clínica (clinicas_insert no RLS é `false`).
create or replace function public.create_clinica(
  p_nome text,
  p_pessoa_tipo text default 'juridica',
  p_documento text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'não autenticado';
  end if;
  insert into public.clinicas (nome, pessoa_tipo, documento)
  values (p_nome, p_pessoa_tipo::public.pessoa_tipo, p_documento)
  returning id into v_id;
  insert into public.memberships (profile_id, clinica_id, role)
  values ((select auth.uid()), v_id, 'owner');
  return v_id;
end;
$$;

revoke all on function public.create_clinica(text, text, text) from public, anon;
grant execute on function public.create_clinica(text, text, text) to authenticated;

-- Espelha auth.users → public.profiles no signup.
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
