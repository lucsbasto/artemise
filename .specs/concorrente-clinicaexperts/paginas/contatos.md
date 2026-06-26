# Contatos

**Rota:** `/clinica/contatos/listagem-contatos`
**Tipo:** Listagem (tabela) + CRUD via modal
**Screenshot:** `contatos.png`

## Propósito

Cadastro **unificado** de pessoas da clínica. Um único modelo "Contato" com **tipos**: Paciente, Fornecedor, Profissional, Lead.

## Listagem

- Cabeçalho: título + contador (`N registros`), **Ações em lote ▾**, **Exportar ▾**.
- **Adicionar filtro** (+) e campo **Buscar**.
- Tabela — colunas: checkbox seleção · **Nome** (com sub-rótulo do tipo + foto/avatar) · **Etiquetas** · **Identificador** (telefone + ícone WhatsApp) · **Ativo** (toggle on/off) · menu ⋮ por linha · engrenagem (config de colunas).
- Paginação: seletor "25 por página" + navegação `« ‹ 1 › »`.
- **FAB (+)** inferior direito: criar contato.

### Ações em lote / linha
- Toggle **Ativo** direto na linha.
- Menu ⋮ por contato (editar/excluir/etc).
- WhatsApp inline pelo identificador.

## FAB — tipos de contato

`Novo paciente` · `Novo fornecedor` · `Novo profissional` · `Novo lead`

Deep-link do modal: `?person_modal_type=patient|supplier|professional|lead&person_modal_mode=new`

## Form: Novo paciente

> Deep-link: `?person_modal_type=patient&person_modal_mode=new`
> **Validação:** apenas **Nome** é obrigatório de fato. Campos de endereço marcados `*` só validam se a seção de endereço for preenchida (validação condicional).

### Identificação
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Foto | file (JPG/PNG) | — | Botão "Escolher foto" |
| Nome | text | ✅ | ph "Nome Sobrenome" |
| E-mail | email | — | |
| Telefone | tel | — | máscara (99) 9999-9999 |
| Sexo | botões | — | Feminino / Masculino |
| Data de nascimento | date | — | |
| CPF | tel mask | — | 000.000.000-00 |
| RG | text | — | |
| Etiquetas | multiselect busca | — | tags |
| Ativo | checkbox | — | default ligado |
| Origem | select | — | "Selecione a origem" (canal de captação) |
| Profissão | text | — | |
| Observações | textarea | — | |

### Contatos adicionais (repetível)
- Tipo (select) + valor — múltiplos meios de contato.

### Responsável
- **Habilitar responsável** (checkbox) → libera campos de responsável legal (p/ menores).

### Preferências de notificação
- Checkboxes: **E-mail** · **SMS** · **WhatsApp**.

### Endereço (seção condicional)
| Campo | Tipo | Obrig.* |
|---|---|---|
| País | select | |
| Código postal (CEP) | text | ✅* |
| Estado | select | ✅* |
| Cidade | select | ✅* |
| Bairro | text | ✅* |
| Rua | text | ✅* |
| Número | text | ✅* |
| Complemento | text | |

(*) obrigatórios só quando a seção é usada. CEP provavelmente auto-preenche Estado/Cidade/Bairro/Rua.

### Anexos
- Upload de arquivos (Anexos).

**Botão Salvar.** Teste criado: `[DOC-TESTE] Paciente 001` (salvou só com Nome).

## Variações por tipo
- **Fornecedor / Profissional / Lead:** mesmo modal base, campos específicos por tipo (ex.: profissional → conselho/registro, especialidade; fornecedor → CNPJ/razão social).

## Observações para o Artemise

- Modelo de contato unificado (1 entidade, N tipos) reduz duplicação vs. tabelas separadas paciente/fornecedor/profissional.
- Validação condicional de endereço (só exige se preencher) = bom UX, evita fricção no cadastro rápido.
- Preferências de notificação por canal direto no cadastro habilitam automações (lembretes E-mail/SMS/WhatsApp).
- "Origem" no cadastro alimenta relatórios de captação/marketing.
- Responsável legal embutido cobre pacientes menores de idade.
