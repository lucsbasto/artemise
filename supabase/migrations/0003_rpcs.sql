-- 0003_rpcs.sql
-- RPCs chamadas via supabase.rpc(). Ver design §4.2, §6, §8.
-- Convenção: payloads JSONB chegam em camelCase (como o frontend serializa).

-- ================================================================ criar_clinica (register)
-- SECURITY DEFINER: escreve `clinicas`/`usuarios` antes de existir tenant. Idempotente.
CREATE OR REPLACE FUNCTION criar_clinica(p_nome_clinica text, p_nome_usuario text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_clinica uuid; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'SEM_SESSAO'; END IF;
  -- já tem perfil? devolve a clínica existente (re-tentativa segura).
  IF EXISTS (SELECT 1 FROM usuarios WHERE id = v_uid) THEN
    RETURN (SELECT clinica_id FROM usuarios WHERE id = v_uid);
  END IF;
  INSERT INTO clinicas (nome, slug)
  VALUES (
    p_nome_clinica,
    lower(regexp_replace(p_nome_clinica, '\W+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 4)
  )
  RETURNING id INTO v_clinica;
  INSERT INTO usuarios (id, clinica_id, nome, email, perfil_acesso, ativo)
  VALUES (v_uid, v_clinica, p_nome_usuario,
          (SELECT email FROM auth.users WHERE id = v_uid), 'admin', true);
  RETURN v_clinica;
END $$;

REVOKE ALL ON FUNCTION criar_clinica(text, text) FROM public;
GRANT EXECUTE ON FUNCTION criar_clinica(text, text) TO authenticated;

-- ================================================================ registrar_procedimento (estoque atômico)
-- SECURITY INVOKER: roda no tenant do chamador (RLS aplica). FOR UPDATE serializa baixas concorrentes.
-- p_mapa: {pontos:[{substanciaId uuid, unidades numeric}, ...], ...} | null
CREATE OR REPLACE FUNCTION registrar_procedimento(
  p_paciente_id uuid, p_registro jsonb, p_mapa jsonb, p_registro_id uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SET search_path = public
AS $$
DECLARE v_id uuid; v_anterior jsonb; r record; v_saldo numeric;
BEGIN
  IF p_registro_id IS NOT NULL THEN
    SELECT mapa INTO v_anterior FROM registros_procedimento WHERE id = p_registro_id; -- RLS isola tenant
  END IF;

  -- delta por substância = soma(novo) - soma(anterior); lock + checa + aplica.
  FOR r IN
    WITH novo AS (
      SELECT (p->>'substanciaId')::uuid AS sid, sum((p->>'unidades')::numeric) AS u
      FROM jsonb_array_elements(coalesce(p_mapa->'pontos', '[]'::jsonb)) p GROUP BY 1
    ),
    ant AS (
      SELECT (p->>'substanciaId')::uuid AS sid, sum((p->>'unidades')::numeric) AS u
      FROM jsonb_array_elements(coalesce(v_anterior->'pontos', '[]'::jsonb)) p GROUP BY 1
    )
    SELECT coalesce(novo.sid, ant.sid) AS sid, coalesce(novo.u, 0) - coalesce(ant.u, 0) AS delta
    FROM novo FULL OUTER JOIN ant ON novo.sid = ant.sid
  LOOP
    IF r.delta = 0 THEN CONTINUE; END IF;
    SELECT saldo INTO v_saldo FROM itens_estoque WHERE id = r.sid FOR UPDATE; -- LOCK
    IF v_saldo IS NULL THEN RAISE EXCEPTION 'ITEM_INEXISTENTE:%', r.sid; END IF;
    IF v_saldo - r.delta < 0 THEN RAISE EXCEPTION 'SALDO_INSUFICIENTE:%', r.sid; END IF;
    UPDATE itens_estoque SET saldo = saldo - r.delta WHERE id = r.sid;
  END LOOP;

  IF p_registro_id IS NULL THEN
    INSERT INTO registros_procedimento
      (paciente_id, procedimento, profissional, profissional_id, procedimento_id,
       data, status, valor, observacoes, usa_mapa, mapa)
    VALUES (
      p_paciente_id,
      p_registro->>'procedimento',
      coalesce(p_registro->>'profissional', ''),
      nullif(p_registro->>'profissionalId', '')::uuid,
      nullif(p_registro->>'procedimentoId', '')::uuid,
      (p_registro->>'data')::date,
      coalesce(p_registro->>'status', 'agendado'),
      coalesce((p_registro->>'valor')::numeric, 0),
      p_registro->>'observacoes',
      coalesce((p_registro->>'usaMapa')::boolean, p_mapa IS NOT NULL),
      p_mapa
    ) RETURNING id INTO v_id;
  ELSE
    UPDATE registros_procedimento SET
      procedimento    = p_registro->>'procedimento',
      profissional    = coalesce(p_registro->>'profissional', ''),
      profissional_id = nullif(p_registro->>'profissionalId', '')::uuid,
      procedimento_id = nullif(p_registro->>'procedimentoId', '')::uuid,
      data            = (p_registro->>'data')::date,
      status          = coalesce(p_registro->>'status', 'agendado'),
      valor           = coalesce((p_registro->>'valor')::numeric, 0),
      observacoes     = p_registro->>'observacoes',
      usa_mapa        = coalesce((p_registro->>'usaMapa')::boolean, p_mapa IS NOT NULL),
      mapa            = p_mapa
    WHERE id = p_registro_id
    RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END $$;

GRANT EXECUTE ON FUNCTION registrar_procedimento(uuid, jsonb, jsonb, uuid) TO authenticated;

-- ================================================================ excluir_registro_procedimento (estorno)
-- Devolve as unidades do mapa ao estoque (delta negativo, nunca falha) e apaga o registro.
CREATE OR REPLACE FUNCTION excluir_registro_procedimento(p_registro_id uuid)
RETURNS void
LANGUAGE plpgsql SET search_path = public
AS $$
DECLARE v_anterior jsonb; r record;
BEGIN
  SELECT mapa INTO v_anterior FROM registros_procedimento WHERE id = p_registro_id;
  FOR r IN
    SELECT (p->>'substanciaId')::uuid AS sid, sum((p->>'unidades')::numeric) AS u
    FROM jsonb_array_elements(coalesce(v_anterior->'pontos', '[]'::jsonb)) p GROUP BY 1
  LOOP
    UPDATE itens_estoque SET saldo = saldo + r.u WHERE id = r.sid;
  END LOOP;
  DELETE FROM registros_procedimento WHERE id = p_registro_id;
END $$;

GRANT EXECUTE ON FUNCTION excluir_registro_procedimento(uuid) TO authenticated;

-- ================================================================ salvar_detalhe_profissional
-- Upsert do detalhe + replace de horarios/comissoes/procedimentos numa transação. SECURITY INVOKER.
CREATE OR REPLACE FUNCTION salvar_detalhe_profissional(
  p_profissional_id uuid, p_detalhe jsonb, p_horarios jsonb, p_comissoes jsonb, p_proc_ids uuid[])
RETURNS void
LANGUAGE plpgsql SET search_path = public
AS $$
DECLARE v_clinica uuid := auth_clinica_id();
BEGIN
  INSERT INTO profissional_detalhe
    (profissional_id, clinica_id, cpf, data_nascimento, telefone, email, conselho, registro,
     uf_registro, especialidade, certificacoes, vinculo, chave_pix, perfil_acesso)
  VALUES (
    p_profissional_id, v_clinica,
    p_detalhe->>'cpf', nullif(p_detalhe->>'dataNascimento', '')::date, p_detalhe->>'telefone',
    p_detalhe->>'email', p_detalhe->>'conselho', p_detalhe->>'registro', p_detalhe->>'ufRegistro',
    p_detalhe->>'especialidade',
    coalesce((SELECT array_agg(value) FROM jsonb_array_elements_text(coalesce(p_detalhe->'certificacoes', '[]'::jsonb))), '{}'),
    p_detalhe->>'vinculo', p_detalhe->>'chavePix', p_detalhe->>'perfilAcesso'
  )
  ON CONFLICT (profissional_id) DO UPDATE SET
    cpf=excluded.cpf, data_nascimento=excluded.data_nascimento, telefone=excluded.telefone,
    email=excluded.email, conselho=excluded.conselho, registro=excluded.registro,
    uf_registro=excluded.uf_registro, especialidade=excluded.especialidade,
    certificacoes=excluded.certificacoes, vinculo=excluded.vinculo, chave_pix=excluded.chave_pix,
    perfil_acesso=excluded.perfil_acesso;

  DELETE FROM profissional_horarios WHERE profissional_id = p_profissional_id;
  INSERT INTO profissional_horarios (clinica_id, profissional_id, dia_semana, inicio, fim)
  SELECT v_clinica, p_profissional_id, (h->>'diaSemana')::smallint, (h->>'inicio')::time, (h->>'fim')::time
  FROM jsonb_array_elements(coalesce(p_horarios, '[]'::jsonb)) h;

  DELETE FROM profissional_comissoes WHERE profissional_id = p_profissional_id;
  INSERT INTO profissional_comissoes (clinica_id, profissional_id, procedimento_id, tipo, valor)
  SELECT v_clinica, p_profissional_id, nullif(c->>'procedimentoId', '')::uuid, c->>'tipo', (c->>'valor')::numeric
  FROM jsonb_array_elements(coalesce(p_comissoes, '[]'::jsonb)) c;

  DELETE FROM profissional_procedimentos WHERE profissional_id = p_profissional_id;
  INSERT INTO profissional_procedimentos (profissional_id, procedimento_id, clinica_id)
  SELECT p_profissional_id, pid, v_clinica FROM unnest(p_proc_ids) pid;
END $$;

GRANT EXECUTE ON FUNCTION salvar_detalhe_profissional(uuid, jsonb, jsonb, jsonb, uuid[]) TO authenticated;
