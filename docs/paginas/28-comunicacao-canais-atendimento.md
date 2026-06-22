# Comunicação / Canais de Atendimento

![](../../images/Captura de tela 2026-06-22 153710.png)

| Metadado | Valor |
|---|---|
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Domínio** | app.clinicaexperts.com.br |
| **Módulo** | Comunicação |
| **Página** | Canais de Atendimento |
| **Rota** | `/comunicacao/canais-de-comunicacao/?statuses=active` |
| **Idioma** | pt-BR |
| **Referência cruzada** | `docs/05-telas-41-a-50.md` → Tela 48 |
| **Tipo de tela** | Listagem de recursos + integrações (hub de canais) |
| **Estado capturado** | Vazio (filtro `Status: Ativo`, "Mostrando 0 a 0 de 0") |
| **Usuário logado** | Lucas Bastos (avatar "LB") |
| **Data da captura** | 2026-06-22 |
| **Navegador** | Brave (chrome/abas/segundo monitor ignorados) |

---

## 1. Identificação

- **Nome da página:** Canais de Atendimento.
- **Título visível (H1 da área de conteúdo):** **"Canais de Atendimento"**.
- **Item de submenu ativo:** **"Canais de atendimento"** (fundo roxo sólido).
- **Rota completa observada:** `app.clinicaexperts.com.br/comunicacao/canais-de-comunicacao/?statuses=active`.
  - Segmento base: `/comunicacao/canais-de-comunicacao/`.
  - Query string: `?statuses=active` (filtro pré-aplicado de status; nome do parâmetro no plural — `statuses` — sugere suporte a múltiplos valores, ex.: `?statuses=active&statuses=inactive`) (inferido).
- **Ícone de módulo na sidebar global:** balão de conversa, destacado em roxo (módulo Comunicação ativo).
- **Sidebar global:** ícone de Comunicação (balão) também exibe um **badge verde** sobreposto (notificação/status de integração) (inferido).

---

## 2. Objetivo

Tela inicial e **hub de gestão de canais de comunicação** que a clínica utiliza para falar com seus clientes. Centraliza a **conexão, integração e administração** dos canais de **envio/atendimento** de mensagens.

- **Subtítulo exato (sob o H1):** **"Gerencie e integre todos os canais de atendimento que você utiliza para se comunicar com seus clientes."**
- **Canais suportados (conforme contexto e banner):**
  - **WhatsApp Lite** (versão simplificada, citada no banner) e **WhatsApp Business** (versão recomendada para upsell/migração).
  - **E-mail** — canal de envio de mensagens transacionais e modelos do sistema (inferido; coerente com badges de canal vistas em "Modelos de mensagens" — Tela 49).
  - **SMS** — canal de envio por mensagem de texto (inferido, mesma base que e-mail/WhatsApp para os modelos do sistema).
- **Relação com "Modelos de mensagens":** os canais aqui conectados são os **meios físicos de envio** dos templates configurados em **Comunicação › Modelos de mensagens** (aniversário, lembretes, confirmações de agendamento etc.). Sem um canal conectado, os modelos não têm por onde ser disparados (inferido).
- **Banner de upsell/migração:** incentiva migrar de WhatsApp Lite para WhatsApp Business (benefícios e valores).

---

## 3. Navegação

### 3.1 Sidebar global (coluna de ícones, à esquerda extrema)

Conforme "Elementos globais comuns" de `05-telas-41-a-50.md`. Ícone de **Comunicação (balão de conversa)** destacado em roxo, com badge verde.

### 3.2 Submenu do módulo Comunicação (segunda coluna vertical, à esquerda da área principal)

Cabeçalho **"Comunicação"** (negrito) e itens:

| Ordem | Item de menu (texto exato) | Estado | Rota (inferida) |
|---|---|---|---|
| 1 | **Canais de atendimento** | **Ativo** (fundo roxo) | `/comunicacao/canais-de-comunicacao/` |
| 2 | **Modelos de mensagens** | inativo | `/comunicacao/mensagens/mensagens-do-sistema` (ver Tela 49) |
| 3 | **Central de notificações** | inativo | `/comunicacao/central-de-notificacoes` (inferido) |

> Observação de nomenclatura: o item de menu é **"Canais de atendimento"**; o título da rota é `canais-de-comunicacao`. Os termos "atendimento" e "comunicação" são usados de forma intercambiável neste módulo.

### 3.3 Header global

Ícone WhatsApp (suporte, badge rosa), busca/atalho, **"Ajuda"**, sino (notificações), avatar **"LB"**.

---

## 4. Layout

Estrutura de três colunas + conteúdo, da esquerda para a direita:

1. **Sidebar global** (ícones de módulo).
2. **Submenu do módulo** "Comunicação" (lista vertical de itens).
3. **Área principal** (fundo cinza-claro), de cima para baixo:
   1. **H1** "Canais de Atendimento" + subtítulo descritivo.
   2. **Banner informativo** (faixa verde-clara, barra lateral verde) de migração WhatsApp Lite → Business.
   3. **Card branco "Seus canais"** com cantos arredondados e leve sombra, contendo:
      - Título "Seus canais".
      - **Barra de filtros** (chip de status + adicionar filtro + busca).
      - **Área de listagem** (cards/tabela de canais) — no estado capturado, **estado vazio**.
      - **Rodapé de paginação** (itens por página + setas + contador).

Elementos de chrome global: FAB roxo "+" (canto inferior direito), widget de progresso/onboarding ("Ei, Lucas Bastos! Tô aqui guardando o seu desconto!" + "Seu progresso 0%").

---

## 5. Componentes

### 5.1 Banner de migração (faixa verde-clara)

- **Ícone:** WhatsApp (verde).
- **Texto exato:** **"Confira os benefícios e valores para migrar seus canais WhatsApp Lite para WhatsApp Business"** (com "WhatsApp Business" em negrito).
- **Ação à direita:** link **"ⓘ Mais informações"** (ícone de informação + texto) → abre detalhes/modal sobre planos e valores da migração (inferido).
- **Cor/estilo:** fundo verde muito claro, barra de acento vertical verde à esquerda.

### 5.2 Botão de criação / conexão de canal (inferido)

No estado capturado **não há** botão visível de criação (a área está em estado vazio por filtro). Nos estados com/sem canais espera-se um botão primário. Textos prováveis (inferido):

- **"+ Novo canal"** ou **"+ Conectar canal"** (botão roxo sólido), normalmente no topo direito do card "Seus canais" ou dentro do estado vazio natural.
- O **FAB roxo "+"** (global) também pode acionar a criação rápida de um canal neste contexto (inferido).

> Texto exato do botão de criação **não confirmado** nesta captura (filtro "Ativo" exibe o estado "nada foi encontrado", não o estado vazio natural com CTA de criação).

### 5.3 Cards de canal (quando houver canais) (inferido)

Cada canal conectado deve ser exibido como **card** (ou linha de tabela — ver Seção 6) com:

- **Ícone do tipo de canal** (logo WhatsApp / envelope de e-mail / balão de SMS).
- **Nome do canal** (rótulo dado pelo usuário, ex.: "WhatsApp Recepção").
- **Identificador** (número de telefone para WhatsApp/SMS; endereço/conta para e-mail).
- **Badge de status:**
  - **"Conectado"** — badge verde.
  - **"Desconectado"** — badge vermelho/cinza.
  - **"Pendente" / "Conectando"** — badge amarelo (durante leitura de QR) (inferido).
- **Badge "Padrão"** quando o canal for o canal padrão de envio (inferido — ver Regras, Seção 13).
- **Ações** por card: **"Conectar"** (se desconectado), **"Editar"**, **"Remover/Excluir"** (inferido).

### 5.4 Barra de filtros

- **Chip de filtro ativo:** **"Status: Ativo ✕"** (rótulo "Status:" + valor "Ativo" + botão "✕" para remover). Condiz com `?statuses=active`.
- **Link:** **"+ Adicionar filtro"** (roxo) → abre seletor de filtros adicionais.
- **Campo de busca:** input à direita com placeholder **"Buscar"**.

### 5.5 Estado vazio (filtro sem correspondência)

- **Ícone:** lupa em círculo roxo-claro.
- **Título:** **"Oops, nada foi encontrado!"**
- **Subtexto:** **"Os filtros selecionados não correspondem a nenhum registro."**
- **Botão:** **"Limpar filtros"** (roxo-claro / outline).

### 5.6 Rodapé / paginação (do card "Seus canais")

- **Seletor de itens por página:** **"10 por página"** (dropdown — note: 10, diferente das telas de Estoque que usam 25).
- **Controles:** **«** (primeira), **‹** (anterior), **›** (próxima), **»** (última) — desabilitados sem dados.
- **Contador:** **"Mostrando 0 a 0 de 0"** (canto direito).

---

## 6. Tabela / Cards de canal

A listagem pode ser renderizada como **cards** (mais provável, dado o título "Seus canais" e o padrão de hub de integrações) ou como **tabela**. Colunas/atributos esperados (inferido, pois a captura está vazia):

| Coluna / atributo | Descrição | Exemplo |
|---|---|---|
| **Nome** | Rótulo do canal definido pelo usuário | "WhatsApp Recepção" |
| **Tipo** | WhatsApp Lite / WhatsApp Business / E-mail / SMS | "WhatsApp Business" |
| **Número / Conta** | Telefone (WhatsApp/SMS) ou e-mail/conta (e-mail) | "+55 11 99999-9999" |
| **Status** | Conectado / Desconectado / Pendente (badge colorido) | Conectado (verde) |
| **Padrão** | Indica canal padrão de envio (badge) | "Padrão" |
| **Ações** | Conectar / Editar / Remover | botões/menu kebab "⋮" |

- **Ação "Conectar":** disponível quando o canal está **Desconectado** → abre o modal/fluxo de conexão (QR para WhatsApp — Seção 10/14).
- **Ação "Editar":** abre modal de edição do canal (nome, padrão, etc.).
- **Ordenação/agrupamento:** provavelmente por tipo de canal ou status (inferido).

---

## 7. Formulários

### 7.1 Modal "Novo canal" / "Conectar canal" (inferido)

Acionado pelo botão de criação (Seção 5.2). Campos esperados:

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| **Tipo de canal** | seletor (WhatsApp Lite / WhatsApp Business / E-mail / SMS) | Sim | Define o restante do formulário e o fluxo de conexão |
| **Nome do canal** | texto | Sim | Rótulo amigável exibido nos cards |
| **Número de telefone** | telefone (máscara `+55 (DD) 9XXXX-XXXX`) | Cond. | Para WhatsApp/SMS |
| **Conta de e-mail / remetente** | e-mail | Cond. | Para canal e-mail (endereço de envio, nome do remetente) |
| **Definir como padrão** | toggle/checkbox | Não | Marca este canal como padrão de envio |

- Após salvar um canal **WhatsApp**, segue-se a etapa de **conexão via QR Code** (Seção 10/14).
- Botões do modal (inferido): primário **"Salvar"** / **"Conectar"**; secundário **"Cancelar"** / **"×"** (fechar).

---

## 8. Filtros

- **Status (`statuses`):** filtro pré-aplicado **"Ativo"** (`?statuses=active`).
  - Valores possíveis (inferido): `active` (Ativo), `inactive` (Inativo). O parâmetro no plural sugere múltipla seleção.
- **"+ Adicionar filtro":** permite adicionar outros critérios — prováveis: **Tipo de canal** (WhatsApp/E-mail/SMS) e **Status de conexão** (Conectado/Desconectado) (inferido).
- **Busca (`search` / `q`):** campo de texto livre, placeholder **"Buscar"** — filtra por nome/número do canal (inferido nome do parâmetro).
- **Persistência:** filtros refletidos na URL (querystring), permitindo deep-link e refresh sem perda do estado.

---

## 9. Estados

| Estado | Condição | Renderização |
|---|---|---|
| **Filtro sem resultado** (capturado) | Há filtro aplicado (`Status: Ativo`) e nenhum canal corresponde | Ícone lupa + "Oops, nada foi encontrado!" + "Os filtros selecionados não correspondem a nenhum registro." + botão "Limpar filtros" |
| **Vazio natural** (sem nenhum canal) | Nenhum canal cadastrado e sem filtros | Estado vazio com CTA de criação (ex.: ícone (i) + "Hmm, está vazio por aqui!" + botão "+ Novo canal") (inferido) |
| **Com dados** | Há canais cadastrados | Lista de cards/linhas de canal com status e ações |
| **Carregando** | Requisição em andamento | Skeleton/spinner na área de listagem (inferido) |
| **Conectando (WhatsApp)** | Canal aguardando leitura do QR | Badge "Pendente"/"Conectando" + modal de QR aberto (inferido) |
| **Erro** | Falha na API | Mensagem de erro + opção de tentar novamente (inferido) |

---

## 10. Modais

### 10.1 Modal "Conectar canal" — WhatsApp via QR Code (inferido)

Padrão consagrado de integração WhatsApp (WhatsApp Web / WPPConnect / Baileys / API oficial):

- **Cabeçalho:** título **"Conectar WhatsApp"** + botão **"×"**.
- **Corpo:**
  - Instruções passo a passo: "Abra o WhatsApp no seu celular › Configurações › Aparelhos conectados › Conectar um aparelho › aponte a câmera para o código" (texto inferido).
  - **QR Code** renderizado no centro, com atualização/refresh automático ao expirar.
  - Indicador de status: "Aguardando leitura…" → "Conectado!" (verde) ao concluir (inferido).
- **Rodapé:** botão "Atualizar QR Code" / "Cancelar" (inferido).
- **Pós-conexão:** modal fecha automaticamente e o card do canal passa a **"Conectado"** (verde).

### 10.2 Modal "Mais informações" — migração WhatsApp Business (inferido)

Acionado pelo link do banner. Exibe benefícios, comparativo Lite × Business e valores/planos.

### 10.3 Modal de confirmação de remoção (inferido)

Ao excluir um canal: "Tem certeza que deseja remover este canal?" + "Cancelar" / "Remover".

---

## 11. Modelo de dados

### 11.1 Entidade `CanalComunicacao` (inferido)

```jsonc
{
  "uuid": "string (UUID)",            // identificador único
  "nome": "string",                   // rótulo amigável ("WhatsApp Recepção")
  "tipo": "whatsapp_lite | whatsapp_business | email | sms", // tipo do canal
  "identificador": "string",          // número (E.164) ou e-mail/conta
  "status": "active | inactive",      // status do registro (filtro `statuses`)
  "status_conexao": "connected | disconnected | pending | error", // status da integração
  "padrao": false,                    // é o canal padrão de envio?
  "provedor": "string",               // provedor/gateway (ex.: meta_cloud_api, twilio, smtp) (inferido)
  "config": {                          // configurações específicas do tipo
    "telefone": "string|null",        // para whatsapp/sms
    "email_remetente": "string|null", // para e-mail
    "nome_remetente": "string|null"
  },
  "ultima_conexao_em": "ISO-8601|null",
  "criado_em": "ISO-8601",
  "atualizado_em": "ISO-8601",
  "clinica_uuid": "string"            // multi-tenant
}
```

### 11.2 Enumerações

- **`tipo`:** `whatsapp_lite`, `whatsapp_business`, `email`, `sms`.
- **`status`:** `active`, `inactive`.
- **`status_conexao`:** `connected`, `disconnected`, `pending`, `error`.

### 11.3 Relacionamentos

- `CanalComunicacao` 1—N `ModeloMensagem` (um canal envia vários modelos; um modelo pode usar vários canais — relação N—N via canais habilitados por template) (inferido).
- `CanalComunicacao` N—1 `Clinica` (multi-tenant).

---

## 12. Endpoints API (inferidos)

> Todos inferidos a partir da rota e dos padrões do produto. Base provável: `/api/v1` ou `/comunicacao/...`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/comunicacao/canais-de-comunicacao?statuses=active` | Lista canais (com filtros `statuses`, `search`, paginação `page`/`per_page`) |
| `GET` | `/comunicacao/canais-de-comunicacao/{uuid}` | Detalhe de um canal |
| `POST` | `/comunicacao/canais-de-comunicacao` | Cria/registra novo canal |
| `PATCH`/`PUT` | `/comunicacao/canais-de-comunicacao/{uuid}` | Edita canal (nome, padrão, config) |
| `DELETE` | `/comunicacao/canais-de-comunicacao/{uuid}` | Remove canal |
| `POST` | `/comunicacao/canais-de-comunicacao/{uuid}/conectar` | Inicia conexão (gera sessão/QR para WhatsApp) |
| `GET` | `/comunicacao/canais-de-comunicacao/{uuid}/qrcode` | Retorna QR Code atual (polling/refresh) |
| `GET` | `/comunicacao/canais-de-comunicacao/{uuid}/status` | Consulta status de conexão (polling) |
| `POST` | `/comunicacao/canais-de-comunicacao/{uuid}/desconectar` | Desconecta sessão |
| `POST` | `/comunicacao/canais-de-comunicacao/{uuid}/padrao` | Define como canal padrão |

- **Tempo real do QR/status:** provável via **WebSocket/SSE** além de polling, para refletir "Conectado" sem refresh (inferido).
- **Parâmetros de listagem:** `statuses` (multi), `search`, `tipo`, `page`, `per_page` (default 10).

---

## 13. Regras de negócio

1. **Canal padrão:** deve existir **no máximo um canal padrão por tipo** (ou um único padrão geral) usado como remetente default dos modelos de mensagem. Definir um novo padrão remove o flag do anterior (inferido).
2. **Multi-tenant:** canais são escopados à clínica do usuário (`clinica_uuid`); um usuário só vê/gerencia canais da própria clínica.
3. **Dependência de envio:** modelos de mensagem (Tela 49) só disparam por canais **conectados**; um canal **Desconectado** suspende os envios associados (inferido).
4. **Migração WhatsApp Lite → Business:** WhatsApp Lite e Business coexistem; o banner incentiva migração (benefícios/valores). Business usa API oficial (Meta Cloud API) e Lite usa conexão não oficial via QR (inferido).
5. **Filtro padrão da rota:** ao entrar via `?statuses=active`, lista apenas canais ativos; "Limpar filtros" remove a restrição.
6. **Status de registro × status de conexão:** distinção entre `status` (active/inactive — habilitação administrativa) e `status_conexao` (estado da integração WhatsApp/SMTP) (inferido).
7. **Unicidade:** não deve haver dois canais do mesmo tipo com o mesmo identificador (número/e-mail) na mesma clínica (inferido).

---

## 14. Fluxos

### 14.1 Conectar WhatsApp via QR Code (principal — inferido)

1. Usuário clica em **"+ Novo canal"** (ou FAB "+") → abre modal "Novo canal".
2. Seleciona **Tipo = WhatsApp Lite** (ou Business), informa **Nome** e **Número**, salva.
3. Backend cria o registro (`status_conexao = pending`) e inicia sessão → `POST .../conectar`.
4. Abre o **modal "Conectar WhatsApp"** com o **QR Code** (`GET .../qrcode`).
5. Usuário lê o QR no app WhatsApp do celular (Aparelhos conectados).
6. Frontend faz **polling/WebSocket** em `.../status`; ao confirmar, `status_conexao = connected`.
7. Modal fecha automaticamente; card do canal exibe badge **"Conectado"** (verde).
8. (Opcional) Usuário marca o canal como **Padrão**.

### 14.2 Filtrar / limpar filtros

1. Página carrega com `Status: Ativo` aplicado → estado vazio "Oops, nada foi encontrado!".
2. Usuário clica em **"Limpar filtros"** (ou **✕** do chip) → recarrega listagem sem filtro → exibe todos os canais (ou estado vazio natural com CTA de criação).

### 14.3 Editar / remover canal (inferido)

1. No card/linha do canal → ação **"Editar"** (modal) ou **"Remover"** (modal de confirmação).
2. Remover → `DELETE .../{uuid}` → canal sai da lista.

### 14.4 Migração para WhatsApp Business (inferido)

1. Usuário clica em **"Mais informações"** no banner → modal/landing de planos.
2. Segue fluxo de contratação/migração (fora do escopo desta tela).

---

## 15. Notas de implementação

- **Nomenclatura inconsistente:** menu = "Canais de atendimento"; slug da rota = `canais-de-comunicacao`; H1 = "Canais de Atendimento". Manter consistência interna (slug ≠ rótulo) — documentar mapeamento.
- **Trailing slash:** a rota usa barra final (`/canais-de-comunicacao/`) antes da querystring — garantir que o roteador trate `/canais-de-comunicacao` e `/canais-de-comunicacao/` igualmente.
- **`statuses` no plural:** projetar o parser para aceitar múltiplos valores (`?statuses=active&statuses=inactive`), mesmo que a UI atual aplique um só.
- **Paginação:** default **10 por página** (distinto das telas de Estoque, que usam 25) — confirmar consistência de UX ou intencionalidade.
- **Dois eixos de status:** separar claramente `status` (administrativo) de `status_conexao` (integração) na UI (chip de filtro usa o primeiro; badges nos cards usam o segundo).
- **Tempo real:** o status do QR/conexão idealmente atualiza via WebSocket/SSE; prever fallback de polling (`GET .../status`).
- **Segurança/credenciais:** sessões de WhatsApp e credenciais SMTP/gateway SMS devem ser armazenadas criptografadas e nunca expostas ao frontend.
- **Estados vazios distintos:** diferenciar "filtro sem resultado" (mensagem capturada, com "Limpar filtros") de "vazio natural / onboarding" (com CTA "Novo canal"). A captura mostra apenas o primeiro.
- **Banner condicional:** exibir o banner de migração apenas quando houver canais WhatsApp Lite elegíveis (inferido) — evitar poluição visual para quem já usa Business.
- **i18n:** todos os textos em pt-BR; centralizar para futura internacionalização.
- **Acessibilidade:** badges de status (verde/vermelho) precisam de rótulo textual além da cor; QR Code precisa de instruções textuais alternativas.
- **Textos confirmados na captura:** "Canais de Atendimento"; "Gerencie e integre todos os canais de atendimento que você utiliza para se comunicar com seus clientes."; "Confira os benefícios e valores para migrar seus canais WhatsApp Lite para WhatsApp Business"; "Mais informações"; "Seus canais"; "Status: Ativo"; "Adicionar filtro"; "Buscar"; "Oops, nada foi encontrado!"; "Os filtros selecionados não correspondem a nenhum registro."; "Limpar filtros"; "10 por página"; "Mostrando 0 a 0 de 0". Demais elementos (botão de criação, cards de canal, modais) marcados como **(inferido)**.
