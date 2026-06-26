package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// PacienteColumns são as colunas de pacientes projetadas no JSON (casam os
// campos db da struct domain.Paciente).
const PacienteColumns = `id, clinica_id, nome, tipo, etiquetas, identificador, ativo, sexo,
	data_nascimento, cpf, email, endereco, observacoes, recebe_notificacoes, criado_em, atualizado_em`

// pacienteListSpec configura busca (nome/email) e ordenações de pacientes.
var pacienteListSpec = ListSpec{
	Table:      "pacientes",
	Columns:    PacienteColumns,
	SearchCols: []string{"nome", "email"},
	SortWhite: map[string]string{
		"nome":            "nome ASC",
		"data_nascimento": "data_nascimento ASC NULLS LAST",
	},
	DefaultSort: "nome ASC",
}

// ListPacientes devolve a página de pacientes e o total para os parâmetros dados.
func ListPacientes(ctx context.Context, db Queryer, p ListParams) ([]domain.Paciente, int, error) {
	return List[domain.Paciente](ctx, db, pacienteListSpec, p)
}
