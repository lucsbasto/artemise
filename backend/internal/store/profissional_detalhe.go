package store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// detalheColumns são as colunas selecionadas de profissional_detalhe; a ordem
// casa as tags db da struct ProfissionalDetalhe (scan via RowToStructByNameLax).
const detalheColumns = `profissional_id, cpf, data_nascimento, telefone, email,
	conselho, registro, uf_registro, especialidade, certificacoes, vinculo,
	chave_pix, perfil_acesso`

// ProfissionalExiste confirma que o profissional pertence ao tenant atual (RLS).
func ProfissionalExiste(ctx context.Context, tx pgx.Tx, id string) (bool, error) {
	var x string
	err := tx.QueryRow(ctx, `SELECT id FROM profissionais WHERE id = $1`, id).Scan(&x)
	if errors.Is(err, pgx.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

// GetProfissionalDetalhe monta o perfil rico: a linha 1:1 de profissional_detalhe
// (ou zero-value se ainda não existir) mais as 4 sub-coleções. As fatias nunca
// retornam nil, para serializarem como [] e não null.
func GetProfissionalDetalhe(ctx context.Context, tx pgx.Tx, id string) (domain.ProfissionalDetalhe, error) {
	det, err := getLax[domain.ProfissionalDetalhe](ctx, tx,
		`SELECT `+detalheColumns+` FROM profissional_detalhe WHERE profissional_id = $1`, id)
	if errors.Is(err, pgx.ErrNoRows) {
		det = domain.ProfissionalDetalhe{ProfissionalID: id}
	} else if err != nil {
		return det, fmt.Errorf("detalhe: %w", err)
	}
	det.ProfissionalID = id
	if det.Certificacoes == nil {
		det.Certificacoes = []string{}
	}

	// inicio/fim são TIME; cast para text para casar o campo string da struct.
	horarios, err := collectLax[domain.HorarioTrabalho](ctx, tx,
		`SELECT id, profissional_id, dia_semana, inicio::text AS inicio, fim::text AS fim
		 FROM profissional_horarios WHERE profissional_id = $1 ORDER BY dia_semana, inicio`, id)
	if err != nil {
		return det, fmt.Errorf("horarios: %w", err)
	}
	det.Horarios = horarios
	if det.Horarios == nil {
		det.Horarios = []domain.HorarioTrabalho{}
	}

	comissoes, err := collectLax[domain.RegraComissao](ctx, tx,
		`SELECT id, procedimento_id, tipo, valor
		 FROM profissional_comissoes WHERE profissional_id = $1`, id)
	if err != nil {
		return det, fmt.Errorf("comissoes: %w", err)
	}
	det.Comissoes = comissoes
	if det.Comissoes == nil {
		det.Comissoes = []domain.RegraComissao{}
	}

	pids, err := collectScalar[string](ctx, tx,
		`SELECT procedimento_id::text FROM profissional_procedimentos WHERE profissional_id = $1`, id)
	if err != nil {
		return det, fmt.Errorf("procedimentos: %w", err)
	}
	det.ProcedimentoIDs = pids
	if det.ProcedimentoIDs == nil {
		det.ProcedimentoIDs = []string{}
	}

	return det, nil
}

// detalheField descreve uma coluna 1:1 atualizável de profissional_detalhe.
type detalheField struct {
	column string
	cast   string // sufixo de cast no placeholder, ex.: "::date"
	array  bool   // TEXT[]
}

// detalheFieldOrder fixa a ordem de iteração (mapa em Go é aleatório) para que
// os placeholders SQL fiquem determinísticos.
var detalheFieldOrder = []string{
	"cpf", "dataNascimento", "telefone", "email", "conselho", "registro",
	"ufRegistro", "especialidade", "certificacoes", "vinculo", "chavePix", "perfilAcesso",
}

var detalheFields = map[string]detalheField{
	"cpf":            {column: "cpf"},
	"dataNascimento": {column: "data_nascimento", cast: "::date"},
	"telefone":       {column: "telefone"},
	"email":          {column: "email"},
	"conselho":       {column: "conselho"},
	"registro":       {column: "registro"},
	"ufRegistro":     {column: "uf_registro"},
	"especialidade":  {column: "especialidade"},
	"certificacoes":  {column: "certificacoes", array: true},
	"vinculo":        {column: "vinculo"},
	"chavePix":       {column: "chave_pix"},
	"perfilAcesso":   {column: "perfil_acesso"},
}

// ErrInvalidPayload sinaliza JSON malformado em uma sub-seção do PATCH (→ 400).
var ErrInvalidPayload = errors.New("payload inválido")

// PatchProfissionalDetalhe aplica um update parcial numa única transação: faz
// upsert das colunas 1:1 presentes no corpo e, para cada sub-coleção presente
// (horarios/comissoes/procedimentoIds), substitui as linhas filhas (delete+insert).
// Sub-seções ausentes do corpo não são tocadas.
func PatchProfissionalDetalhe(ctx context.Context, tx pgx.Tx, id string, body map[string]json.RawMessage) error {
	if err := upsertDetalheColumns(ctx, tx, id, body); err != nil {
		return err
	}
	if raw, ok := body["horarios"]; ok {
		if err := replaceHorarios(ctx, tx, id, raw); err != nil {
			return err
		}
	}
	if raw, ok := body["comissoes"]; ok {
		if err := replaceComissoes(ctx, tx, id, raw); err != nil {
			return err
		}
	}
	if raw, ok := body["procedimentoIds"]; ok {
		if err := replaceProcedimentos(ctx, tx, id, raw); err != nil {
			return err
		}
	}
	return nil
}

func upsertDetalheColumns(ctx context.Context, tx pgx.Tx, id string, body map[string]json.RawMessage) error {
	args := []any{id} // $1 = profissional_id
	var cols, vals, updates []string
	for _, key := range detalheFieldOrder {
		raw, ok := body[key]
		if !ok {
			continue
		}
		f := detalheFields[key]
		if f.array {
			var v []string
			if err := json.Unmarshal(raw, &v); err != nil {
				return fmt.Errorf("%w: %s", ErrInvalidPayload, key)
			}
			args = append(args, v)
		} else {
			var v *string
			if err := json.Unmarshal(raw, &v); err != nil {
				return fmt.Errorf("%w: %s", ErrInvalidPayload, key)
			}
			args = append(args, v)
		}
		cols = append(cols, f.column)
		vals = append(vals, fmt.Sprintf("$%d%s", len(args), f.cast))
		updates = append(updates, fmt.Sprintf("%s = EXCLUDED.%s", f.column, f.column))
	}
	if len(cols) == 0 {
		return nil // nenhuma coluna 1:1 no corpo — nada a fazer aqui
	}
	sql := fmt.Sprintf(`
		INSERT INTO profissional_detalhe (profissional_id, clinica_id, %s)
		VALUES ($1, current_setting('app.clinica_id')::uuid, %s)
		ON CONFLICT (profissional_id) DO UPDATE SET %s`,
		strings.Join(cols, ", "), strings.Join(vals, ", "), strings.Join(updates, ", "))
	if _, err := tx.Exec(ctx, sql, args...); err != nil {
		return fmt.Errorf("upsert detalhe: %w", err)
	}
	return nil
}

func replaceHorarios(ctx context.Context, tx pgx.Tx, id string, raw json.RawMessage) error {
	var hs []domain.HorarioTrabalho
	if err := json.Unmarshal(raw, &hs); err != nil {
		return fmt.Errorf("%w: horarios", ErrInvalidPayload)
	}
	if _, err := tx.Exec(ctx, `DELETE FROM profissional_horarios WHERE profissional_id = $1`, id); err != nil {
		return fmt.Errorf("limpar horarios: %w", err)
	}
	for _, h := range hs {
		if _, err := tx.Exec(ctx, `
			INSERT INTO profissional_horarios (clinica_id, profissional_id, dia_semana, inicio, fim)
			VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3::time, $4::time)`,
			id, h.DiaSemana, h.Inicio, h.Fim); err != nil {
			return fmt.Errorf("inserir horario: %w", err)
		}
	}
	return nil
}

func replaceComissoes(ctx context.Context, tx pgx.Tx, id string, raw json.RawMessage) error {
	var cs []domain.RegraComissao
	if err := json.Unmarshal(raw, &cs); err != nil {
		return fmt.Errorf("%w: comissoes", ErrInvalidPayload)
	}
	if _, err := tx.Exec(ctx, `DELETE FROM profissional_comissoes WHERE profissional_id = $1`, id); err != nil {
		return fmt.Errorf("limpar comissoes: %w", err)
	}
	for _, c := range cs {
		if _, err := tx.Exec(ctx, `
			INSERT INTO profissional_comissoes (clinica_id, profissional_id, procedimento_id, tipo, valor)
			VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3, $4)`,
			id, c.ProcedimentoID, c.Tipo, c.Valor); err != nil {
			return fmt.Errorf("inserir comissao: %w", err)
		}
	}
	return nil
}

func replaceProcedimentos(ctx context.Context, tx pgx.Tx, id string, raw json.RawMessage) error {
	var pids []string
	if err := json.Unmarshal(raw, &pids); err != nil {
		return fmt.Errorf("%w: procedimentoIds", ErrInvalidPayload)
	}
	if _, err := tx.Exec(ctx, `DELETE FROM profissional_procedimentos WHERE profissional_id = $1`, id); err != nil {
		return fmt.Errorf("limpar procedimentos: %w", err)
	}
	for _, pid := range pids {
		if _, err := tx.Exec(ctx, `
			INSERT INTO profissional_procedimentos (profissional_id, procedimento_id, clinica_id)
			VALUES ($1, $2, current_setting('app.clinica_id')::uuid)`,
			id, pid); err != nil {
			return fmt.Errorf("inserir procedimento: %w", err)
		}
	}
	return nil
}
