package store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// registroColumns casa as tags db de RegistroProcedimento (scan Lax).
const registroColumns = `id, clinica_id, paciente_id, procedimento, profissional,
	profissional_id, procedimento_id, data, status, valor, observacoes, usa_mapa,
	mapa, criado_em, atualizado_em`

// RegistroInput é o corpo aceito ao criar/editar um registro de procedimento.
// Mapa chega como JSON cru e é validado/re-serializado pelo handler (design R-6)
// antes de chegar aqui.
type RegistroInput struct {
	Procedimento   string          `json:"procedimento"`
	Profissional   string          `json:"profissional"`
	ProfissionalID *string         `json:"profissionalId"`
	ProcedimentoID *string         `json:"procedimentoId"`
	Data           string          `json:"data"`
	Status         string          `json:"status"`
	Valor          float64         `json:"valor"`
	Observacoes    *string         `json:"observacoes"`
	Mapa           json.RawMessage `json:"mapa"`
}

// RegistroToInput projeta um registro existente em RegistroInput, para que um
// PATCH possa decodificar o corpo por cima e atualizar só os campos enviados.
func RegistroToInput(r domain.RegistroProcedimento) RegistroInput {
	in := RegistroInput{
		Procedimento:   r.Procedimento,
		Profissional:   r.Profissional,
		ProfissionalID: r.ProfissionalID,
		ProcedimentoID: r.ProcedimentoID,
		Data:           r.Data.Format("2006-01-02"),
		Status:         r.Status,
		Valor:          r.Valor,
		Observacoes:    r.Observacoes,
	}
	if r.Mapa != nil {
		if b, err := json.Marshal(r.Mapa); err == nil {
			in.Mapa = b
		}
	}
	return in
}

// ListRegistros lista os registros de um paciente (mais recentes primeiro).
func ListRegistros(ctx context.Context, tx pgx.Tx, pacienteID string) ([]domain.RegistroProcedimento, error) {
	rs, err := collectLax[domain.RegistroProcedimento](ctx, tx,
		`SELECT `+registroColumns+` FROM registros_procedimento
		 WHERE paciente_id = $1 ORDER BY data DESC, criado_em DESC`, pacienteID)
	if err != nil {
		return nil, err
	}
	if rs == nil {
		rs = []domain.RegistroProcedimento{}
	}
	return rs, nil
}

// GetRegistro busca um registro por id dentro de um paciente. found=false → 404.
func GetRegistro(ctx context.Context, tx pgx.Tx, pacienteID, rid string) (domain.RegistroProcedimento, bool, error) {
	r, err := getLax[domain.RegistroProcedimento](ctx, tx,
		`SELECT `+registroColumns+` FROM registros_procedimento
		 WHERE id = $1 AND paciente_id = $2`, rid, pacienteID)
	if errors.Is(err, pgx.ErrNoRows) {
		return r, false, nil
	}
	if err != nil {
		return r, false, err
	}
	return r, true, nil
}

// CreateRegistro insere um registro. usa_mapa é derivado do catálogo de
// procedimentos (procedimentos.usa_mapa) — nunca do cliente.
func CreateRegistro(ctx context.Context, tx pgx.Tx, pacienteID string, in RegistroInput) (domain.RegistroProcedimento, error) {
	var zero domain.RegistroProcedimento
	usaMapa, err := usaMapaDoProcedimento(ctx, tx, in.ProcedimentoID)
	if err != nil {
		return zero, err
	}
	in.Data = normalizaData(in.Data)
	if in.Status == "" {
		in.Status = "agendado"
	}
	r, err := getLax[domain.RegistroProcedimento](ctx, tx, `
		INSERT INTO registros_procedimento
			(clinica_id, paciente_id, procedimento, profissional, profissional_id,
			 procedimento_id, data, status, valor, observacoes, usa_mapa, mapa)
		VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3, $4, $5,
			$6::date, $7, $8, $9, $10, $11::jsonb)
		RETURNING `+registroColumns,
		pacienteID, in.Procedimento, in.Profissional, in.ProfissionalID,
		in.ProcedimentoID, in.Data, in.Status, in.Valor, in.Observacoes,
		usaMapa, nullableJSON(in.Mapa))
	if err != nil {
		return zero, fmt.Errorf("inserir registro: %w", err)
	}
	return r, nil
}

// UpdateRegistro sobrescreve o registro com os campos já mesclados em `in`
// (existente + corpo do PATCH). Recalcula usa_mapa a partir do procedimento.
func UpdateRegistro(ctx context.Context, tx pgx.Tx, pacienteID, rid string, in RegistroInput) (domain.RegistroProcedimento, bool, error) {
	var zero domain.RegistroProcedimento
	usaMapa, err := usaMapaDoProcedimento(ctx, tx, in.ProcedimentoID)
	if err != nil {
		return zero, false, err
	}
	in.Data = normalizaData(in.Data)
	r, err := getLax[domain.RegistroProcedimento](ctx, tx, `
		UPDATE registros_procedimento SET
			procedimento = $3, profissional = $4, profissional_id = $5,
			procedimento_id = $6, data = $7::date, status = $8, valor = $9,
			observacoes = $10, usa_mapa = $11, mapa = $12::jsonb
		WHERE id = $1 AND paciente_id = $2
		RETURNING `+registroColumns,
		rid, pacienteID, in.Procedimento, in.Profissional, in.ProfissionalID,
		in.ProcedimentoID, in.Data, in.Status, in.Valor, in.Observacoes,
		usaMapa, nullableJSON(in.Mapa))
	if errors.Is(err, pgx.ErrNoRows) {
		return zero, false, nil
	}
	if err != nil {
		return zero, false, fmt.Errorf("atualizar registro: %w", err)
	}
	return r, true, nil
}

// DeleteRegistro remove um registro. found=false → 404.
func DeleteRegistro(ctx context.Context, tx pgx.Tx, pacienteID, rid string) (bool, error) {
	tag, err := tx.Exec(ctx,
		`DELETE FROM registros_procedimento WHERE id = $1 AND paciente_id = $2`, rid, pacienteID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// usaMapaDoProcedimento resolve usa_mapa pelo catálogo; sem procedimento → false.
func usaMapaDoProcedimento(ctx context.Context, tx pgx.Tx, procedimentoID *string) (bool, error) {
	if procedimentoID == nil || *procedimentoID == "" {
		return false, nil
	}
	var usaMapa bool
	err := tx.QueryRow(ctx,
		`SELECT usa_mapa FROM procedimentos WHERE id = $1`, *procedimentoID).Scan(&usaMapa)
	if errors.Is(err, pgx.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, fmt.Errorf("lookup usa_mapa: %w", err)
	}
	return usaMapa, nil
}

// normalizaData garante uma data válida (default: hoje) para a coluna NOT NULL.
func normalizaData(s string) string {
	if s == "" {
		return time.Now().Format("2006-01-02")
	}
	return s
}

// nullableJSON converte um RawMessage vazio em nil para gravar NULL no JSONB.
func nullableJSON(raw json.RawMessage) any {
	if len(raw) == 0 {
		return nil
	}
	return []byte(raw)
}
