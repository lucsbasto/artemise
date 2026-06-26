// Package domain define as structs Go que espelham os tipos TypeScript do
// frontend. Tags `json` em camelCase casam o contrato da API; tags `db` em
// snake_case permitem scan automático via pgx.RowToStructByName.
//
// Convenção: campos opcionais usam ponteiro para distinguir "ausente" de
// zero-value; timestamps usam time.Time / *time.Time.
package domain

import "time"

// Usuario — conta de acesso (sem expor senha_hash).
type Usuario struct {
	ID           string    `json:"id" db:"id"`
	ClinicaID    string    `json:"clinicaId" db:"clinica_id"`
	Nome         string    `json:"nome" db:"nome"`
	Email        string    `json:"email" db:"email"`
	PerfilAcesso string    `json:"perfilAcesso" db:"perfil_acesso"`
	Ativo        bool      `json:"ativo" db:"ativo"`
	CriadoEm     time.Time `json:"criadoEm" db:"criado_em"`
}

// Paciente — espelha o tipo Patient/FichaPaciente do mock.
type Paciente struct {
	ID                 string     `json:"id" db:"id"`
	ClinicaID          string     `json:"clinicaId" db:"clinica_id"`
	Nome               string     `json:"nome" db:"nome"`
	Tipo               string     `json:"tipo" db:"tipo"`
	Etiquetas          []string   `json:"etiquetas" db:"etiquetas"`
	Identificador      *string    `json:"identificador,omitempty" db:"identificador"`
	Ativo              bool       `json:"ativo" db:"ativo"`
	Sexo               *string    `json:"sexo,omitempty" db:"sexo"`
	DataNascimento     *time.Time `json:"dataNascimento,omitempty" db:"data_nascimento"`
	CPF                *string    `json:"cpf,omitempty" db:"cpf"`
	Email              *string    `json:"email,omitempty" db:"email"`
	Endereco           *string    `json:"endereco,omitempty" db:"endereco"`
	Observacoes        *string    `json:"observacoes,omitempty" db:"observacoes"`
	RecebeNotificacoes bool       `json:"recebeNotificacoes" db:"recebe_notificacoes"`
	CriadoEm           time.Time  `json:"criadoEm" db:"criado_em"`
	AtualizadoEm       time.Time  `json:"atualizadoEm" db:"atualizado_em"`
}

// Contato é a base compartilhada por profissionais e fornecedores.
type Contato struct {
	ID            string    `json:"id" db:"id"`
	ClinicaID     string    `json:"clinicaId" db:"clinica_id"`
	Nome          string    `json:"nome" db:"nome"`
	Tipo          string    `json:"tipo" db:"tipo"`
	Etiquetas     []string  `json:"etiquetas" db:"etiquetas"`
	Identificador *string   `json:"identificador,omitempty" db:"identificador"`
	Ativo         bool      `json:"ativo" db:"ativo"`
	AvatarTone    string    `json:"avatarTone" db:"avatar_tone"`
	CriadoEm      time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm  time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// Profissional reusa os campos de contato (identificação básica).
type Profissional = Contato

// Fornecedor reusa os campos de contato.
type Fornecedor = Contato

// HorarioTrabalho — janela de trabalho num dia da semana (0=Dom..6=Sáb).
type HorarioTrabalho struct {
	ID             string `json:"id,omitempty" db:"id"`
	ProfissionalID string `json:"profissionalId,omitempty" db:"profissional_id"`
	DiaSemana      int    `json:"diaSemana" db:"dia_semana"`
	Inicio         string `json:"inicio" db:"inicio"`
	Fim            string `json:"fim" db:"fim"`
}

// RegraComissao — comissão por procedimento (ou padrão quando ProcedimentoID nil).
type RegraComissao struct {
	ID             string  `json:"id,omitempty" db:"id"`
	ProcedimentoID *string `json:"procedimentoId" db:"procedimento_id"`
	Tipo           string  `json:"tipo" db:"tipo"`
	Valor          float64 `json:"valor" db:"valor"`
}

// ProfissionalDetalhe — perfil rico (1:1 com profissionais).
type ProfissionalDetalhe struct {
	ProfissionalID  string            `json:"profissionalId" db:"profissional_id"`
	CPF             *string           `json:"cpf,omitempty" db:"cpf"`
	DataNascimento  *time.Time        `json:"dataNascimento,omitempty" db:"data_nascimento"`
	Telefone        *string           `json:"telefone,omitempty" db:"telefone"`
	Email           *string           `json:"email,omitempty" db:"email"`
	Conselho        *string           `json:"conselho,omitempty" db:"conselho"`
	Registro        *string           `json:"registro,omitempty" db:"registro"`
	UFRegistro      *string           `json:"ufRegistro,omitempty" db:"uf_registro"`
	Especialidade   *string           `json:"especialidade,omitempty" db:"especialidade"`
	Certificacoes   []string          `json:"certificacoes" db:"certificacoes"`
	Vinculo         *string           `json:"vinculo,omitempty" db:"vinculo"`
	ChavePix        *string           `json:"chavePix,omitempty" db:"chave_pix"`
	PerfilAcesso    *string           `json:"perfilAcesso,omitempty" db:"perfil_acesso"`
	ProcedimentoIDs []string          `json:"procedimentoIds"`
	Horarios        []HorarioTrabalho `json:"horarios"`
	Comissoes       []RegraComissao   `json:"comissoes"`
}

// Procedimento — catálogo de procedimentos da clínica.
type Procedimento struct {
	ID           string    `json:"id" db:"id"`
	ClinicaID    string    `json:"clinicaId" db:"clinica_id"`
	Nome         string    `json:"nome" db:"nome"`
	Categoria    *string   `json:"categoria,omitempty" db:"categoria"`
	DuracaoMin   int       `json:"duracaoMin" db:"duracao_min"`
	Valor        float64   `json:"valor" db:"valor"`
	Ativo        bool      `json:"ativo" db:"ativo"`
	UsaMapa      bool      `json:"usaMapa" db:"usa_mapa"`
	Cor          *string   `json:"cor,omitempty" db:"cor"`
	CriadoEm     time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// PacoteItem — item de um pacote.
type PacoteItem struct {
	ID             string  `json:"id,omitempty" db:"id"`
	PacoteID       string  `json:"pacoteId,omitempty" db:"pacote_id"`
	Nome           string  `json:"nome" db:"nome"`
	ProcedimentoID *string `json:"procedimentoId,omitempty" db:"procedimento_id"`
	Qtd            int     `json:"qtd" db:"qtd"`
	PrecoUnitario  float64 `json:"precoUnitario" db:"preco_unitario"`
	Desconto       float64 `json:"desconto" db:"desconto"`
	Total          float64 `json:"total" db:"total"`
}

// Pacote — pacote de procedimentos com itens e total calculado.
type Pacote struct {
	ID           string       `json:"id" db:"id"`
	ClinicaID    string       `json:"clinicaId" db:"clinica_id"`
	Descricao    string       `json:"descricao" db:"descricao"`
	ValorTotal   float64      `json:"valorTotal" db:"valor_total"`
	Validade     string       `json:"validade" db:"validade"`
	Ativo        bool         `json:"ativo" db:"ativo"`
	Itens        []PacoteItem `json:"itens"`
	CriadoEm     time.Time    `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time    `json:"atualizadoEm" db:"atualizado_em"`
}

// ItemEstoque — item de estoque; Valor e EstoqueBaixo são calculados.
type ItemEstoque struct {
	ID           string    `json:"id" db:"id"`
	ClinicaID    string    `json:"clinicaId" db:"clinica_id"`
	Nome         string    `json:"nome" db:"nome"`
	SKU          *string   `json:"sku,omitempty" db:"sku"`
	Categoria    *string   `json:"categoria,omitempty" db:"categoria"`
	Unidade      string    `json:"unidade" db:"unidade"`
	Saldo        float64   `json:"saldo" db:"saldo"`
	Minimo       float64   `json:"minimo" db:"minimo"`
	Custo        float64   `json:"custo" db:"custo"`
	Valor        float64   `json:"valor"`        // calculado: saldo * custo
	EstoqueBaixo bool      `json:"estoqueBaixo"` // calculado: saldo <= minimo
	CriadoEm     time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// PontoInjetavel — ponto marcado no mapa de injetáveis.
type PontoInjetavel struct {
	ID           string  `json:"id"`
	SubstanciaID string  `json:"substanciaId"`
	Modo         string  `json:"modo"`
	X            float64 `json:"x"`
	Y            float64 `json:"y"`
	RegiaoID     string  `json:"regiaoId,omitempty"`
	Unidades     float64 `json:"unidades"`
}

// RastreioInjetavel — rastreabilidade de lote por substância.
type RastreioInjetavel struct {
	Marca          string `json:"marca"`
	NumeroLote     string `json:"numeroLote"`
	DataDiluicao   string `json:"dataDiluicao"`
	VolumeDiluicao string `json:"volumeDiluicao"`
	DataValidade   string `json:"dataValidade"`
}

// FichaInjetaveis — estado serializável do mapa de injetáveis (JSONB).
type FichaInjetaveis struct {
	Pontos         []PontoInjetavel             `json:"pontos"`
	RastreioPorSub map[string]RastreioInjetavel `json:"rastreioPorSub"`
	Relatorio      string                       `json:"relatorio"`
}

// RegistroProcedimento — procedimento lançado na ficha do paciente.
type RegistroProcedimento struct {
	ID             string           `json:"id" db:"id"`
	ClinicaID      string           `json:"clinicaId" db:"clinica_id"`
	PacienteID     string           `json:"pacienteId" db:"paciente_id"`
	Procedimento   string           `json:"procedimento" db:"procedimento"`
	Profissional   string           `json:"profissional" db:"profissional"`
	ProfissionalID *string          `json:"profissionalId,omitempty" db:"profissional_id"`
	ProcedimentoID *string          `json:"procedimentoId,omitempty" db:"procedimento_id"`
	Data           time.Time        `json:"data" db:"data"`
	Status         string           `json:"status" db:"status"`
	Valor          float64          `json:"valor" db:"valor"`
	Observacoes    *string          `json:"observacoes,omitempty" db:"observacoes"`
	UsaMapa        bool             `json:"usaMapa" db:"usa_mapa"`
	Mapa           *FichaInjetaveis `json:"mapa,omitempty" db:"mapa"`
	CriadoEm       time.Time        `json:"criadoEm" db:"criado_em"`
	AtualizadoEm   time.Time        `json:"atualizadoEm" db:"atualizado_em"`
}

// EventoAgenda — evento da agenda (agendamento, bloqueio, etc.).
type EventoAgenda struct {
	ID             string    `json:"id" db:"id"`
	ClinicaID      string    `json:"clinicaId" db:"clinica_id"`
	PacienteID     *string   `json:"pacienteId,omitempty" db:"paciente_id"`
	ProfissionalID *string   `json:"profissionalId,omitempty" db:"profissional_id"`
	ProcedimentoID *string   `json:"procedimentoId,omitempty" db:"procedimento_id"`
	Paciente       *string   `json:"paciente,omitempty" db:"paciente"`
	Profissional   *string   `json:"profissional,omitempty" db:"profissional"`
	Procedimento   *string   `json:"procedimento,omitempty" db:"procedimento"`
	Inicio         time.Time `json:"inicio" db:"inicio"`
	Fim            time.Time `json:"fim" db:"fim"`
	Status         string    `json:"status" db:"status"`
	Tipo           string    `json:"tipo" db:"tipo"`
	Valor          *float64  `json:"valor,omitempty" db:"valor"`
	Observacoes    *string   `json:"observacoes,omitempty" db:"observacoes"`
	CriadoEm       time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm   time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// ContaFinanceira — conta com saldo calculado on-demand.
type ContaFinanceira struct {
	ID           string    `json:"id" db:"id"`
	ClinicaID    string    `json:"clinicaId" db:"clinica_id"`
	Nome         string    `json:"nome" db:"nome"`
	Tipo         string    `json:"tipo" db:"tipo"`
	Saldo        float64   `json:"saldo" db:"saldo"`
	Icon         string    `json:"icon" db:"icon"`
	Ativo        bool      `json:"ativo" db:"ativo"`
	CriadoEm     time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// CategoriaConta — categoria auto-relacional (árvore pai→filhos).
type CategoriaConta struct {
	ID           string           `json:"id" db:"id"`
	ClinicaID    string           `json:"clinicaId" db:"clinica_id"`
	Descricao    string           `json:"descricao" db:"descricao"`
	Ativo        bool             `json:"ativo" db:"ativo"`
	ParentID     *string          `json:"parentId,omitempty" db:"parent_id"`
	Filhos       []CategoriaConta `json:"filhos,omitempty"`
	CriadoEm     time.Time        `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time        `json:"atualizadoEm" db:"atualizado_em"`
}

// MetodoPagamento — método de pagamento.
type MetodoPagamento struct {
	ID           string    `json:"id" db:"id"`
	ClinicaID    string    `json:"clinicaId" db:"clinica_id"`
	Descricao    string    `json:"descricao" db:"descricao"`
	Tipo         string    `json:"tipo" db:"tipo"`
	Marca        string    `json:"marca" db:"marca"`
	Ativo        bool      `json:"ativo" db:"ativo"`
	CriadoEm     time.Time `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time `json:"atualizadoEm" db:"atualizado_em"`
}

// LancamentoFinanceiro — fonte única dos relatórios financeiros.
type LancamentoFinanceiro struct {
	ID           string     `json:"id" db:"id"`
	ClinicaID    string     `json:"clinicaId" db:"clinica_id"`
	Tipo         string     `json:"tipo" db:"tipo"`
	Descricao    string     `json:"descricao" db:"descricao"`
	CategoriaID  *string    `json:"categoriaId,omitempty" db:"categoria_id"`
	MetodoID     *string    `json:"metodoId,omitempty" db:"metodo_id"`
	ContaID      *string    `json:"contaId,omitempty" db:"conta_id"`
	PacienteID   *string    `json:"pacienteId,omitempty" db:"paciente_id"`
	FornecedorID *string    `json:"fornecedorId,omitempty" db:"fornecedor_id"`
	Vencimento   time.Time  `json:"vencimento" db:"vencimento"`
	Liquidacao   *time.Time `json:"liquidacao,omitempty" db:"liquidacao"`
	Situacao     string     `json:"situacao" db:"situacao"`
	Valor        float64    `json:"valor" db:"valor"`
	CriadoEm     time.Time  `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time  `json:"atualizadoEm" db:"atualizado_em"`
}

// OrcamentoItem — item de orçamento.
type OrcamentoItem struct {
	ID          string  `json:"id,omitempty" db:"id"`
	OrcamentoID string  `json:"orcamentoId,omitempty" db:"orcamento_id"`
	Nome        string  `json:"nome" db:"nome"`
	Qtd         int     `json:"qtd" db:"qtd"`
	Valor       float64 `json:"valor" db:"valor"`
	Desconto    float64 `json:"desconto" db:"desconto"`
	Total       float64 `json:"total" db:"total"`
}

// Orcamento — orçamento com itens e total calculado.
type Orcamento struct {
	ID           string          `json:"id" db:"id"`
	ClinicaID    string          `json:"clinicaId" db:"clinica_id"`
	PacienteID   *string         `json:"pacienteId,omitempty" db:"paciente_id"`
	VendedorID   *string         `json:"vendedorId,omitempty" db:"vendedor_id"`
	Cliente      string          `json:"cliente" db:"cliente"`
	Vendedor     string          `json:"vendedor" db:"vendedor"`
	Data         time.Time       `json:"data" db:"data"`
	Total        float64         `json:"total" db:"total"`
	Itens        []OrcamentoItem `json:"itens"`
	CriadoEm     time.Time       `json:"criadoEm" db:"criado_em"`
	AtualizadoEm time.Time       `json:"atualizadoEm" db:"atualizado_em"`
}

// FichaAtendimento — modelo de ficha de atendimento (configuração).
type FichaAtendimento struct {
	ID        string    `json:"id" db:"id"`
	ClinicaID string    `json:"clinicaId" db:"clinica_id"`
	Nome      string    `json:"nome" db:"nome"`
	Ativo     bool      `json:"ativo" db:"ativo"`
	CriadoEm  time.Time `json:"criadoEm" db:"criado_em"`
}

// ModeloDocumento — modelo de documento (atestado, prescrição, etc.).
type ModeloDocumento struct {
	ID        string    `json:"id" db:"id"`
	ClinicaID string    `json:"clinicaId" db:"clinica_id"`
	Nome      string    `json:"nome" db:"nome"`
	Tipo      string    `json:"tipo" db:"tipo"`
	Ativo     bool      `json:"ativo" db:"ativo"`
	CriadoEm  time.Time `json:"criadoEm" db:"criado_em"`
}
