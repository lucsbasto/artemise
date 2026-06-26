# Ficha do Paciente (detalhe)

**Rota:** `/clinica/contatos/listagem/paciente/{id}/{aba}` (ex.: id `10370859`)
**Tipo:** Detalhe de contato (paciente) com abas
**Screenshot:** `ficha-paciente.png`

## Propósito

Visão 360º do paciente: dados cadastrais, histórico, financeiro, pacotes/créditos, prontuário, documentos assináveis e formulários. Aberta clicando no nome do paciente na listagem de contatos.

## Cabeçalho / coluna do paciente (fixa em todas as abas)

- **Foto** (avatar) com botão de **upload/trocar foto** (ícone câmera) e selo "EXEMPLO" + ícone de alerta.
- **Nome:** `Clara Ribeiro (Paciente de exemplo)`
- Linha resumo: **Sexo • Idade** (`Feminino • 34 anos`), **telefone** (`+55 (11) 99999-9999`), **CPF** (`315.772.070-84`).
- **Badge de tipo:** `Paciente`.
- **Botão "Enviar mensagem"** (WhatsApp, verde) + menu **⋮** (ações: editar, etc.).
- **Navegação por abas** (lista): Informações · Linha do tempo · Carteira · Pacotes · Financeiro · Orçamentos · Prontuário · Documentos · Formulários.
- **FAB (+)** inferior direito (criar registro vinculado ao paciente).

## Aba: Informações  (`/informacoes`)

Exibição read-only com link **Editar informações** (lápis). Campos:

| Campo | Exemplo | Notas |
|---|---|---|
| Nome completo | Clara Ribeiro (Paciente de exemplo) | |
| Data de nascimento | 05/12/1991 (34 anos) | idade calculada |
| Sexo | Feminino | |
| Email | clara.ribeiro@exemplo.com | |
| Telefone | +55 (11) 99999-9999 | ícone WhatsApp inline |
| Notificações | Não recebe notificações | preferência de canal |
| Endereço | Av. Pedro Álvares Cabral, SN · Vila Mariana, São Paulo, SP · 04094-050 · Brasil | endereço completo |
| CPF | 315.772.070-84 | |
| Observações | "Esse paciente é um paciente de exemplo." | texto livre |
| Cadastrado em | 25/06/2026 17:16:24 | timestamp de criação |
| Status | Ativo | ativo/inativo |

## Aba: Linha do tempo  (`/linha-do-tempo`)

Feed cronológico de eventos do paciente, com **Adicionar filtro**. Cada evento: título + `data/hora • responsável` + valor (quando aplicável). Exemplos:
- **Venda de crédito criada** — qui, 25/06/2026 18:36 • Lucas Bastos — R$ 150,00
- **Documento criado** — 25/06/2026 18:35 • Lucas Bastos
- **Título criado** — 25/06/2026 18:34 • Lucas Bastos — R$ 200,00
- **Venda criada** — 25/06/2026 18:33 • ...

## Aba: Carteira  (`/carteira`)

Carteira digital do paciente (saldo + cashback). Cards no topo:
- **Saldo** — R$ 0,00 (cartão `•••• •••• •••• 0000`)
- **Cashback** — R$ 0,00 (cartão `•••• •••• •••• 0000`)
- **Total na carteira** — R$ 0,00
- Botão **Adicionar saldo**.

Tabela de movimentações — colunas: **Movimentação** · **Valor (R$)** · **Responsável** · **Data**. (ex.: Compra · 150,00 · Lucas Bastos · 25/06/2026). Paginação "10 por página". **Adicionar filtro**.

## Aba: Pacotes  (`/creditos`)

Créditos/pacotes de procedimentos comprados. **Exportar** + **Adicionar filtro**. Tabela — colunas: **Procedimento/Produto** · **Descrição** · **Data venda** · **Validade** · **contador de uso** (`- /1` = usados/total). Ex.: Anamnese · `[DOC-TESTE] Venda personalizada 001` · 25/06/2026.

## Aba: Financeiro  (`/financeiro`)

Financeiro do paciente. **Cards de resumo:** Realizado (R$ 2.431,00) · A receber (R$ 0,00) · Em aberto (-R$ 550,00) · Em atraso (-R$ 300,00) · **Total do período** (R$ 1.581,00). **Adicionar filtro**. `32 registros`, paginado.

Tabela — colunas: **Vencimento** · **Execução** · **Descrição** · **Situação** · **Valor líq. (R$)**.
- Situações observadas: **Pago**, **Recebido**, **Em atraso**.
- Valores positivos (receitas) e negativos (despesas). Ex.: Microagulhamento · Recebido · 600,00 ; Aluguel da Clínica · Pago · -1.200,00.

## Aba: Orçamentos  (`/orcamentos`)

Lista de orçamentos do paciente. Vazia no exemplo ("Oops, nada foi encontrado!"). Ações: **Adicionar novo orçamento**, **Exportar**, **Adicionar filtro** / **Limpar filtros**. Paginação "25 por página".

## Aba: Prontuário  (`/prontuario`)

Histórico de atendimentos/fichas do paciente. **Adicionar filtro**. Mostra banner quando há atendimento ativo: **"Este paciente possui um atendimento em andamento. Retomar atendimento"** (link que reabre o editor de atendimento — ver docs `prontuario-ficha-*.md`).

## Aba: Documentos  (`/documentos/`)

Documentos/termos assináveis (assinatura digital). **Sub-filtros por status com contadores:** Rascunho (1) · Cancelado (0) · Aguardando assinatura (0) · Assinado (0) · Tudo (1). **Adicionar filtro**.

Tabela — colunas: **Documento** · **Criado em** · **Enviado em** · **Status**. Ex.: "Termo de consentimento para procedimentos (Documento de exemplo)" · Clara Ribeiro · 25/06/2026 18:35 · **Rascunho**.

## Aba: Formulários  (`/formulario`)

Formulários respondidos/enviados ao paciente. Ação **Novo formulário** + **Adicionar filtro**. Vazio no exemplo.

## Observações para o Artemise

- **Visão 360º do paciente em abas** (cadastro + financeiro + clínico + documentos) é o hub central; reduz troca de contexto.
- **Carteira digital com saldo e cashback** (fidelização) e **Pacotes/créditos com contador de uso e validade** são alavancas de receita recorrente.
- **Linha do tempo unificada** (vendas, documentos, títulos, atendimentos) dá auditoria e contexto comercial num só feed.
- **Documentos com assinatura digital** e máquina de estados (Rascunho → Aguardando assinatura → Assinado/Cancelado) cobre consentimento/LGPD.
- Financeiro por paciente com situações (Pago/Recebido/Em aberto/Em atraso) liga prontuário ao fluxo de caixa.
- Banner "Retomar atendimento" conecta a ficha do paciente ao atendimento em andamento — boa continuidade de fluxo.
- Preferências de notificação visíveis no cadastro habilitam automações de comunicação (WhatsApp inline em vários pontos).
