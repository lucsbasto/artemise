# CliniDocs — Visão geral

**Rota:** `/clinidocs/visao-geral`  ·  **Tipo:** Dashboard (módulo de documentos + assinatura digital)  ·  **Screenshot:** `clinidocs.png`, `clinidocs-documento-detalhe.png`

## Propósito

Módulo de **documentos clínicos com assinatura digital** (consentimentos, contratos, termos). Gera documentos a partir de **modelos** com variáveis dinâmicas (dados do paciente/clínica/venda), coleta **assinaturas** (no dispositivo, WhatsApp, e-mail, SMS) e mantém **trilha de auditoria** (linha do tempo) por documento.

> Módulo essencialmente **SPA de rota única visível** (`/clinidocs/visao-geral`). Sub-caminhos como `/clinidocs/modelos` ou `/clinidocs/documentos` **redirecionam** para o início. As páginas reais alcançáveis são: `/clinidocs/novo-documento`, `/clinidocs/documento/<id>`, `/clinidocs/modelos-de-documentos` e `/clinidocs/modelos-de-documentos/selecionar` (ver docs irmãos).

## Layout — Dashboard "Visão geral CliniDocs"

- **Filtros** (topo): badge "N filtro aplicado" + **Limpar filtros**; **Período** (range de datas, default últimos 30 dias) · **Adicionar filtro** (+) · **Buscar**.
- **Cartões KPI** (clicáveis, com seta ›):
  - **Total de documentos** · **Assinados** · **Pendentes** (sub-rótulo "Aguardando assinatura") · **Cancelados**.
- **Volume de assinaturas** — gráfico de barras com abas **Diária / Semanal / Mensal / Anual**.
- **Status por categoria** — legenda do ciclo de vida do documento: **Rascunho** · **Cancelado** · **Aguardando** · **Assinado** · **Rejeitado**.
- **Documentos recentes** — lista (vazia inicialmente) + botão **Ver tudo**.
- **FAB (+)** inferior direito: única opção **"Novo documento"** → vai para `/clinidocs/novo-documento`.

## Sub-páginas (documentadas em arquivos próprios)

| Página | Rota | Arquivo |
|---|---|---|
| Novo documento (wizard 3 passos) | `/clinidocs/novo-documento` | `clinidocs-novo-documento.md` |
| Detalhe do documento | `/clinidocs/documento/<id>` | (abaixo) |
| Modelos de documentos (listagem) | `/clinidocs/modelos-de-documentos` | `clinidocs-modelos.md` |
| Novo modelo / Editar modelo | `/clinidocs/modelos-de-documentos/selecionar` e `/.../<id>/editar` | `clinidocs-modelos.md` |

## Página: Detalhe do documento

**Rota:** `/clinidocs/documento/<id>`  ·  **Screenshot:** `clinidocs-documento-detalhe.png`

- **Cabeçalho:** identificador do documento + **badge de status** (ex.: Rascunho).
- **Coluna esquerda:**
  - **Documentos** — arquivos do "envelope" (cada doc/anexo).
  - **Signatários** — pessoas que assinam (nome + papel, ex.: "Paciente") + **Adicionar signatário**.
  - **Linha do tempo** — **trilha de auditoria** dos eventos do documento (ex.: "Rascunho criado" com data/hora).
- **Centro:** renderização/preview do documento (conteúdo do modelo já com variáveis resolvidas — ex.: "TERMO DE CONSENTIMENTO INFORMADO PARA PROCEDIMENTOS ESTÉTICOS").
- **Rodapé/ações:** **Adicionar signatário** · **Mais opções** · **Voltar** · **Baixar documento(s)** · **Enviar para assinatura**.
- **Mais opções** (menu): **Excluir** · **Cancelar documento** *(ambos destrutivos — apenas documentados, não executados)*.

## Fluxos testados ([DOC-TESTE])

- **Documento de teste criado como rascunho** (id `707775`): titular/signatário **Clara Ribeiro (Paciente de exemplo)**, modelo "Termo de consentimento para procedimentos", envio "Assinar no dispositivo", assinatura manuscrita. Salvo via **"Salvar como rascunho"** → modal "Rascunho salvo! ... ainda não foi enviado para assinatura". **Nenhum envio externo disparado.**
  - *Obs.: o nome do documento é herdado do modelo, então não foi possível prefixar `[DOC-TESTE]` no título; o registro de teste é o rascunho id 707775 (titular Clara Ribeiro).*

## Observações para o Artemise

- **Ciclo de vida explícito** do documento (Rascunho → Aguardando → Assinado / Rejeitado / Cancelado) com dashboard de volume e status — referência direta para um módulo de documentos/assinatura.
- **Linha do tempo (audit trail)** por documento é diferencial de compliance (LGPD/consentimento).
- Conceito de **"envelope"** (1 documento pode agrupar vários arquivos + vários signatários) — modelar documento ⇄ signatários N:N com papéis.
- **"Assinar no dispositivo"** (assinatura presencial no tablet/celular da clínica) cobre o caso de consentimento na recepção sem depender de e-mail/WhatsApp.
- KPIs e gráfico de assinaturas prontos dão visibilidade de pendências de assinatura — ótimo para cobrança/lembrete automático.
