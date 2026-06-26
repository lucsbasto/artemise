package store

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// orcamentoColumns casa as tags db de Orcamento (scan Lax; Itens é carregado à parte).
const orcamentoColumns = `id, clinica_id, paciente_id, vendedor_id, cliente,
	vendedor, data, total, criado_em, atualizado_em`

// orcamentoItemColumns casa as tags db de OrcamentoItem.
const orcamentoItemColumns = `id, orcamento_id, nome, qtd, valor, desconto, total`

// OrcamentoInput é o corpo aceito ao criar/editar o cabeçalho de um orçamento.
type OrcamentoInput struct {
	VendedorID *string              `json:"vendedorId"`
	Cliente    string               `json:"cliente"`
	Vendedor   string               `json:"vendedor"`
	Data       string               `json:"data"`
	Itens      []OrcamentoItemInput `json:"itens"`
}

// OrcamentoItemInput é o corpo de um item; total é sempre recalculado no servidor.
type OrcamentoItemInput struct {
	Nome     string  `json:"nome"`
	Qtd      int     `json:"qtd"`
	Valor    float64 `json:"valor"`
	Desconto float64 `json:"desconto"`
}

// ListOrcamentos lista os orçamentos de um paciente, cada um com seus itens.
func ListOrcamentos(ctx context.Context, tx pgx.Tx, pacienteID string) ([]domain.Orcamento, error) {
	orcs, err := collectLax[domain.Orcamento](ctx, tx,
		`SELECT `+orcamentoColumns+` FROM orcamentos
		 WHERE paciente_id = $1 ORDER BY data DESC, criado_em DESC`, pacienteID)
	if err != nil {
		return nil, err
	}
	for i := range orcs {
		itens, err := getOrcamentoItens(ctx, tx, orcs[i].ID)
		if err != nil {
			return nil, err
		}
		orcs[i].Itens = itens
	}
	if orcs == nil {
		orcs = []domain.Orcamento{}
	}
	return orcs, nil
}

// GetOrcamento busca um orçamento por id dentro de um paciente, com itens.
func GetOrcamento(ctx context.Context, tx pgx.Tx, pacienteID, oid string) (domain.Orcamento, bool, error) {
	orc, err := getLax[domain.Orcamento](ctx, tx,
		`SELECT `+orcamentoColumns+` FROM orcamentos
		 WHERE id = $1 AND paciente_id = $2`, oid, pacienteID)
	if errors.Is(err, pgx.ErrNoRows) {
		return orc, false, nil
	}
	if err != nil {
		return orc, false, err
	}
	itens, err := getOrcamentoItens(ctx, tx, orc.ID)
	if err != nil {
		return orc, false, err
	}
	orc.Itens = itens
	return orc, true, nil
}

// CreateOrcamento cria o cabeçalho e os itens numa transação, computando o total
// de cada item e o total do orçamento (server é a fonte de verdade).
func CreateOrcamento(ctx context.Context, tx pgx.Tx, pacienteID string, in OrcamentoInput) (domain.Orcamento, error) {
	var zero domain.Orcamento
	in.Data = normalizaData(in.Data)
	orc, err := getLax[domain.Orcamento](ctx, tx, `
		INSERT INTO orcamentos (clinica_id, paciente_id, vendedor_id, cliente, vendedor, data, total)
		VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3, $4, $5::date, 0)
		RETURNING `+orcamentoColumns,
		pacienteID, in.VendedorID, in.Cliente, in.Vendedor, in.Data)
	if err != nil {
		return zero, fmt.Errorf("inserir orçamento: %w", err)
	}
	for _, it := range in.Itens {
		if _, err := insertOrcamentoItem(ctx, tx, orc.ID, it); err != nil {
			return zero, err
		}
	}
	if err := recomputeOrcamentoTotal(ctx, tx, orc.ID); err != nil {
		return zero, err
	}
	full, _, err := GetOrcamento(ctx, tx, pacienteID, orc.ID)
	return full, err
}

// UpdateOrcamento atualiza apenas o cabeçalho (campos já mesclados em `in`) e
// recalcula o total a partir dos itens persistidos.
func UpdateOrcamento(ctx context.Context, tx pgx.Tx, pacienteID, oid string, in OrcamentoInput) (domain.Orcamento, bool, error) {
	var zero domain.Orcamento
	in.Data = normalizaData(in.Data)
	tag, err := tx.Exec(ctx, `
		UPDATE orcamentos SET vendedor_id = $3, cliente = $4, vendedor = $5, data = $6::date
		WHERE id = $1 AND paciente_id = $2`,
		oid, pacienteID, in.VendedorID, in.Cliente, in.Vendedor, in.Data)
	if err != nil {
		return zero, false, fmt.Errorf("atualizar orçamento: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return zero, false, nil
	}
	if err := recomputeOrcamentoTotal(ctx, tx, oid); err != nil {
		return zero, false, err
	}
	return GetOrcamento(ctx, tx, pacienteID, oid)
}

// DeleteOrcamento remove o orçamento (itens caem por cascade). found=false → 404.
func DeleteOrcamento(ctx context.Context, tx pgx.Tx, pacienteID, oid string) (bool, error) {
	tag, err := tx.Exec(ctx,
		`DELETE FROM orcamentos WHERE id = $1 AND paciente_id = $2`, oid, pacienteID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// AddOrcamentoItem adiciona um item, recalcula o total e devolve o orçamento.
func AddOrcamentoItem(ctx context.Context, tx pgx.Tx, pacienteID, oid string, item OrcamentoItemInput) (domain.Orcamento, bool, error) {
	ok, err := orcamentoPertence(ctx, tx, pacienteID, oid)
	if err != nil || !ok {
		return domain.Orcamento{}, false, err
	}
	if _, err := insertOrcamentoItem(ctx, tx, oid, item); err != nil {
		return domain.Orcamento{}, false, err
	}
	if err := recomputeOrcamentoTotal(ctx, tx, oid); err != nil {
		return domain.Orcamento{}, false, err
	}
	return GetOrcamento(ctx, tx, pacienteID, oid)
}

// UpdateOrcamentoItem atualiza um item (campos já mesclados), recalcula totais.
func UpdateOrcamentoItem(ctx context.Context, tx pgx.Tx, pacienteID, oid, iid string, item OrcamentoItemInput) (domain.Orcamento, bool, error) {
	total := domain.ItemTotal(item.Qtd, item.Valor, item.Desconto, domain.DescontoReais)
	tag, err := tx.Exec(ctx, `
		UPDATE orcamento_itens SET nome = $3, qtd = $4, valor = $5, desconto = $6, total = $7
		WHERE id = $1 AND orcamento_id = $2`,
		iid, oid, item.Nome, item.Qtd, item.Valor, item.Desconto, total)
	if err != nil {
		return domain.Orcamento{}, false, fmt.Errorf("atualizar item: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.Orcamento{}, false, nil
	}
	if err := recomputeOrcamentoTotal(ctx, tx, oid); err != nil {
		return domain.Orcamento{}, false, err
	}
	return GetOrcamento(ctx, tx, pacienteID, oid)
}

// DeleteOrcamentoItem remove um item e recalcula o total. found=false → 404.
func DeleteOrcamentoItem(ctx context.Context, tx pgx.Tx, pacienteID, oid, iid string) (domain.Orcamento, bool, error) {
	tag, err := tx.Exec(ctx,
		`DELETE FROM orcamento_itens WHERE id = $1 AND orcamento_id = $2`, iid, oid)
	if err != nil {
		return domain.Orcamento{}, false, err
	}
	if tag.RowsAffected() == 0 {
		return domain.Orcamento{}, false, nil
	}
	if err := recomputeOrcamentoTotal(ctx, tx, oid); err != nil {
		return domain.Orcamento{}, false, err
	}
	return GetOrcamento(ctx, tx, pacienteID, oid)
}

// GetOrcamentoItem busca um item por id dentro de um orçamento (para PATCH parcial).
func GetOrcamentoItem(ctx context.Context, tx pgx.Tx, oid, iid string) (domain.OrcamentoItem, bool, error) {
	item, err := getLax[domain.OrcamentoItem](ctx, tx,
		`SELECT `+orcamentoItemColumns+` FROM orcamento_itens
		 WHERE id = $1 AND orcamento_id = $2`, iid, oid)
	if errors.Is(err, pgx.ErrNoRows) {
		return item, false, nil
	}
	if err != nil {
		return item, false, err
	}
	return item, true, nil
}

func insertOrcamentoItem(ctx context.Context, tx pgx.Tx, oid string, it OrcamentoItemInput) (domain.OrcamentoItem, error) {
	total := domain.ItemTotal(it.Qtd, it.Valor, it.Desconto, domain.DescontoReais)
	item, err := getLax[domain.OrcamentoItem](ctx, tx, `
		INSERT INTO orcamento_itens (clinica_id, orcamento_id, nome, qtd, valor, desconto, total)
		VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3, $4, $5, $6)
		RETURNING `+orcamentoItemColumns,
		oid, it.Nome, it.Qtd, it.Valor, it.Desconto, total)
	if err != nil {
		return item, fmt.Errorf("inserir item: %w", err)
	}
	return item, nil
}

func getOrcamentoItens(ctx context.Context, tx pgx.Tx, oid string) ([]domain.OrcamentoItem, error) {
	itens, err := collectLax[domain.OrcamentoItem](ctx, tx,
		`SELECT `+orcamentoItemColumns+` FROM orcamento_itens WHERE orcamento_id = $1 ORDER BY id`, oid)
	if err != nil {
		return nil, err
	}
	if itens == nil {
		itens = []domain.OrcamentoItem{}
	}
	return itens, nil
}

// recomputeOrcamentoTotal recarrega os itens e grava o total agregado no cabeçalho.
func recomputeOrcamentoTotal(ctx context.Context, tx pgx.Tx, oid string) error {
	itens, err := getOrcamentoItens(ctx, tx, oid)
	if err != nil {
		return err
	}
	total := domain.ValorTotal(itens, 0, domain.DescontoReais)
	if _, err := tx.Exec(ctx, `UPDATE orcamentos SET total = $2 WHERE id = $1`, oid, total); err != nil {
		return fmt.Errorf("atualizar total: %w", err)
	}
	return nil
}

func orcamentoPertence(ctx context.Context, tx pgx.Tx, pacienteID, oid string) (bool, error) {
	var x string
	err := tx.QueryRow(ctx,
		`SELECT id FROM orcamentos WHERE id = $1 AND paciente_id = $2`, oid, pacienteID).Scan(&x)
	if errors.Is(err, pgx.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}
