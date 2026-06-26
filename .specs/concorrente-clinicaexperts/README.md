# Documentação — Clínica Experts (concorrente)

Engenharia reversa funcional do sistema **Clínica Experts** (app.clinicaexperts.com.br) para referência de implementação no Artemise. Capturado via automação de browser (Playwright + 5 agentes paralelos) durante trial de 7 dias.

> ⚠️ Sistema de terceiro. Documentação de funcionalidades/UX para inspiração. Não copiar código, marca ou conteúdo proprietário.

## Mapa de módulos (navegação principal)

| Módulo | Rota | Status |
|---|---|---|
| Início (dashboard) | `/clinica/inicio` | ✅ |
| Agenda | `/agenda` | ✅ |
| Contatos (pacientes/fornecedores/profissionais/leads) | `/clinica/contatos/listagem-contatos` | ✅ |
| Atendimentos / Prontuário | `/atendimentos/` | ✅ |
| Vendas | `/vendas/` | ✅ |
| Financeiro | `/financeiro/inicio` | ✅ |
| Comissões | `/comissoes-em-aberto` | ✅ |
| Estoque | `/estoque/items` | ✅ |
| CliniDocs (documentos/assinatura) | `/clinidocs/visao-geral` | ✅ |
| Marketing | `/marketing` | ✅ |
| Configurações | `/configuracoes/preferencias-do-sistema` | ✅ |
| Onboarding (trial) | `/trial-onboarding` | ✅ |

## Índice de páginas (`paginas/`)

### Núcleo
- [Início / Dashboard](paginas/inicio.md)
- [Onboarding / trial](paginas/onboarding.md)
- [Agenda](paginas/agenda.md)
- [Contatos + form Paciente](paginas/contatos.md)
- [Ficha do paciente (9 abas)](paginas/ficha-paciente.md)

### Atendimentos / Prontuário
- [Atendimentos (visão geral + listagem)](paginas/atendimentos.md)
- Fichas clínicas (template builder em uso):
  [Anamnese](paginas/prontuario-ficha-anamnese.md) ·
  [Capilar](paginas/prontuario-ficha-capilar.md) ·
  [Corporal](paginas/prontuario-ficha-corporal.md) ·
  [Epilação](paginas/prontuario-ficha-epilacao.md) ·
  [Estética Facial](paginas/prontuario-ficha-estetica-facial.md) ·
  [Facial](paginas/prontuario-ficha-facial.md) ·
  [Fotos e anexos](paginas/prontuario-ficha-fotos-anexos.md) ·
  [Injetáveis](paginas/prontuario-ficha-injetaveis.md) ·
  [Orçamento](paginas/prontuario-ficha-orcamento.md) ·
  [Plano de tratamento](paginas/prontuario-ficha-plano-tratamento.md)

### Vendas
- [Vendas (dashboard + orçamentos)](paginas/vendas.md)
- [Venda personalizada](paginas/venda-personalizada.md)
- [Venda de crédito/saldo](paginas/venda-credito.md)
- [Venda de pacote](paginas/venda-pacote.md)

### Financeiro
- [Financeiro — visão geral](paginas/financeiro.md)
- [Contas a receber](paginas/financeiro-contas-receber.md)
- [Contas a pagar](paginas/financeiro-contas-pagar.md)
- [Contas financeiras](paginas/financeiro-contas.md)
- [DRE](paginas/financeiro-dre.md)
- [Comissões](paginas/comissoes.md)

### Estoque + Documentos
- [Estoque (itens + movimentações)](paginas/estoque.md)
- [CliniDocs — visão geral](paginas/clinidocs.md)
- [CliniDocs — novo documento (wizard)](paginas/clinidocs-novo-documento.md)
- [CliniDocs — modelos](paginas/clinidocs-modelos.md)

### Configurações + Marketing
- [Preferências do sistema (~70 settings)](paginas/config-preferencias.md)
- [Dados da clínica](paginas/config-dados-clinica.md)
- [Assinatura / planos](paginas/config-assinatura.md)
- [Procedimentos/serviços](paginas/config-procedimentos.md)
- [Categorias de procedimentos](paginas/config-categorias-procedimentos.md)
- [Pacotes](paginas/config-pacotes.md)
- [Salas](paginas/config-salas.md)
- [Fichas de atendimento (template builder)](paginas/config-fichas-atendimentos.md)
- [Modelos de atestados/prescrições](paginas/config-modelos-atestados-prescricoes.md)
- [Etiquetas](paginas/config-etiquetas.md)
- [Horários de funcionamento](paginas/config-horarios-funcionamento.md)
- [Marketing (templates Canva)](paginas/marketing.md)

## Deep-links de modais (descobertos)
- Contato: `?person_modal_type=patient|supplier|professional|lead&person_modal_mode=new`
- Agenda: `?event_modal_type=consultation&event_modal_mode=new`
- Venda: `?order_modal_type=order&order_modal_mode=new&order_type=sale|credit|combo` (detalhe: `order_modal_mode=info&order_id=<id>`)
- Título financeiro: `?fin_modal_type=bill&fin_modal_mode=new|info&type_title=inflow|outflow[&title_id=<id>]`
- Conta financeira: `?financial_account_modal_type=safe|cashier|account&financial_account_modal_mode=new`
- Configurações: `?settings_modal_type=...&settings_modal_mode=new`

## Convenções
- 1 markdown por página em `paginas/` + screenshot `.png` correspondente.
- Cada doc: propósito, layout, campos (label/tipo/obrigatório/validação/opções), ações, sub-abas, fluxos, observações para o Artemise.
- Registros de teste criados com prefixo **`[DOC-TESTE]`** (limpar depois).
- Widget de onboarding (checklist + busca "Anna") aparece em todas as telas — omitido dos docs individuais.

## Ferramentas de captura (reutilizáveis)
- `extract-fields.js` + `fmt.js` — extrai campos de form (label/tipo/obrigatório/opções).
- `extract-ficha.js` + `fmt-ficha.js` — extrai blocos de pergunta das fichas clínicas.
- `kill-overlays.js` — remove tours Userpilot/backdrops.
- `PLAYBOOK.md` — guia de automação usado pelos agentes.

## Registros [DOC-TESTE] criados (limpar na conta)
- Contatos: `[DOC-TESTE] Paciente 001`
- Vendas: `[DOC-TESTE] Venda personalizada 001` (order 7374271), `[DOC-TESTE] Venda de credito 001` (order 7374311)
- Financeiro: `[DOC-TESTE] Receita 001` (title 12666193), `[DOC-TESTE] Despesa 001` (title 12666256), `[DOC-TESTE] Conta 001`
- Estoque: `[DOC-TESTE] Item 001` (SKU DOC-TESTE-001) + movimentação entrada 100un
- CliniDocs: rascunho id 707775 (não enviado)
- Configurações: `[DOC-TESTE]` Procedimento/Categoria/Sala/Etiqueta/Ficha 001 + Atestado 001

## Lacunas conhecidas
- **Venda de pacote** e **Config → Pacotes**: form documentado mas não salvo (catálogo de pacotes/estoque vazio no trial).
- **Comissões**: listas vazias no período; regras de comissão configuradas no cadastro de profissional/serviço (não há página standalone).
- Várias sub-rotas de Financeiro/Comissões/CliniDocs/Configurações redirecionam p/ `/clinica/inicio` (não existem como páginas) — documentado em cada doc.
- Campos de moeda são mascarados (Vue) — exigem key events reais p/ automação.
