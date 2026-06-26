# CliniDocs — Novo documento (wizard de envio para assinatura)

**Rota:** `/clinidocs/novo-documento`  ·  **Tipo:** Wizard 3 passos  ·  **Screenshot:** `clinidocs-novo-documento.png`, `clinidocs-doc-step2.png`, `clinidocs-doc-step3.png`

## Propósito

Fluxo de criação de um documento a partir de modelo (ou upload), definição de titular/signatários, canal de envio e método de autenticação, com revisão final e envio para assinatura (ou salvamento como rascunho).

Stepper: **1 Seleção → 2 Signatários e envio → 3 Revisão final**.

## Passo 1 — Seleção

### Titular do documento
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Titular do documento | select busca (pessoa) | ✅ | "Selecione uma pessoa a quem este documento se refere." Busca em contatos (ex.: Clara Ribeiro) |

### Documentos
- Toggle de origem: **Utilizar modelo** (default) · **Fazer upload** (enviar arquivo próprio).
- **Modelos de documentos** — campo **Buscar documento** + lista com **checkbox** (seleção múltipla: "Selecione abaixo um ou mais modelos"), ícone **editar** (pencil → abre editor do modelo) e **excluir** (trash) por modelo.
  - Modelos existentes: `Termo de consentimento para procedimentos (Documento de exemplo)` · `Contrato de prestação de serviço`.
- Rodapé: **Voltar** · **Continuar**.

## Passo 2 — Signatários e envio

### Signatários
- Toggle **"Eu assino o(s) documento(s)"** (a clínica/profissional também assina).
- Lista de signatários — cada cartão mostra avatar, nome, **data nasc.**, **CPF**, **WhatsApp**, **e-mail** e **"Assina como: <papel>"** (ex.: Paciente). Ações: **Editar** · excluir (trash).
  - O **titular é adicionado automaticamente** como signatário.
- **+ Adicionar signatário** (adiciona outras pessoas).

### Método de envio (radio — define o canal de coleta)
- **WhatsApp** · **E-mail** · **SMS** · **Assinar no dispositivo** (presencial, sem envio externo).
- "Defina por qual canal o signatário irá receber o documento para assinatura, ou se irá assinar no dispositivo."

### Autenticação e assinatura (checkbox — validações exigidas antes de assinar)
- **Código de acesso** — *Indisponível* (desabilitado neste contexto).
- **Assinatura manuscrita** — "Assinatura simples com desenho".
- **Certificado digital** — "ICP-Brasil (A1/A3)".

- Rodapé: **Anterior** · **Continuar**.

## Passo 3 — Revisão final

- **Signatários** — resumo (ex.: "Clara Ribeiro — Titular e Signatário").
- **Documentos** — modelo selecionado + ação **Editar** / excluir.
- **Método de envio, código e assinatura** — resumo:
  - `Envio: <canal>` · `Código de acesso: ativo/inativo` · `Assinatura: <tipo>`.
- Rodapé: **Anterior** · **Salvar como rascunho** · **Enviar para assinatura**.
  - **Salvar como rascunho** → modal "Rascunho salvo! As alterações foram salvas como rascunho. O documento ainda não foi enviado para assinatura." + botão **Visualizar rascunho** (abre `/clinidocs/documento/<id>`).
  - **Enviar para assinatura** → finaliza (dispara o canal escolhido) — *não acionado nos testes para evitar envio externo*.

## Fluxo testado ([DOC-TESTE])

- Titular/signatário **Clara Ribeiro**, modelo "Termo de consentimento para procedimentos", envio **Assinar no dispositivo**, autenticação **Assinatura manuscrita**. Concluído via **Salvar como rascunho** → documento `707775` em estado Rascunho (sem envio externo).

## Observações para o Artemise

- Separar **canal de envio** (WhatsApp/E-mail/SMS/dispositivo) de **método de autenticação** (código/manuscrita/ICP-Brasil) é um modelo flexível: o mesmo documento atende desde consentimento presencial até contrato com certificado ICP-Brasil.
- **Seleção múltipla de modelos** + múltiplos signatários no mesmo envelope reduz cliques (assinar contrato + termo de uma vez).
- Papel do signatário ("Assina como: Paciente/Profissional/...") é metadado importante para validade jurídica.
- "Salvar como rascunho" antes de enviar é boa rede de segurança (evita envios acidentais).
