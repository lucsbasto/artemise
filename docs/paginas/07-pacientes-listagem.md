# Contatos / Pacientes

| Metadado | Valor |
|---|---|
| **Página** | Contatos / Pacientes (listagem) |
| **Rota/URL** | `app.clinicaexperts.com.br/clinica/contatos/listagem-pacientes` |
| **Breadcrumb** | `Contatos / Pacientes` |
| **Módulo** | Contatos |
| **Tipo de tela** | Listagem em tabela (CRUD) |
| **Permissões (inferido)** | Acesso de usuário com perfil que enxerga Contatos da clínica |
| **Tela de referência** | Tela 16 — `docs/02-telas-11-a-20.md` |
| **Idioma** | pt-BR |
| **Cor primária** | Roxo (`#7C3AED` aprox. — inferido) |
| **Data do registro** | 2026-06-22 |

![](../../images/Captura%20de%20tela%202026-06-22%20152955.png)

---

## 1. Identificação

- **Nome da página:** Pacientes (listagem de contatos do tipo Paciente).
- **Rota:** `/clinica/contatos/listagem-pacientes`.
- **Breadcrumb exibido:** **`Contatos`** (link roxo) **`/`** **`Pacientes`** (texto cinza/ativo).
- **Título do card:** **"Pacientes"** seguido do contador **"1 registro"** (texto cinza claro ao lado do título).
- **Contexto:** subseção do módulo **Contatos**, que agrupa também Profissionais, Fornecedores, Leads, Todos os contatos, Aniversariantes, Frequência, Mesclar contatos e Convidar colaboradores (ver Tela 15).
- **Ícone ativo na sidebar:** ícone de pessoas (Contatos), destacado em roxo com fundo arredondado.

---

## 2. Objetivo

Listar, buscar, filtrar, ordenar, exportar e gerenciar todos os **pacientes** cadastrados na clínica em uma tabela paginada. A partir dela o usuário pode:

- Visualizar os pacientes com avatar, nome, etiquetas, identificador (telefone/WhatsApp) e status (Ativo).
- Buscar por nome/identificador e aplicar filtros adicionais.
- Ativar/inativar o paciente diretamente pela tabela (toggle).
- Abrir a ficha completa do paciente (Telas 17–20) clicando no nome.
- Iniciar conversa via WhatsApp pelo ícone verde do identificador.
- Cadastrar novo paciente (botão flutuante "+" / modal — inferido).
- Executar ações em lote sobre múltiplos pacientes selecionados.
- Exportar a lista (CSV/Excel — inferido).

---

## 3. Navegação

### 3.1 Submenu "Contatos" (coluna secundária — ver Tela 15)

Título **"Contatos"** e itens (ordem exata):

1. **Pacientes** ← *(página atual / ativa)* → `/clinica/contatos/listagem-pacientes`
2. **Profissionais** *(inferido)* → `/clinica/contatos/listagem-profissionais`
3. **Fornecedores** *(inferido)* → `/clinica/contatos/listagem-fornecedores`
4. **Leads** *(inferido)*
5. **Todos os contatos** → `/clinica/contatos/listagem-contatos`
6. **Aniversariantes** *(inferido)*
7. **Frequência** *(inferido)*
8. **Mesclar contatos** *(inferido)*
9. **Convidar colaboradores** *(inferido)*

> Observação: o submenu de Contatos aparece como coluna de texto à esquerda (Tela 15). Na captura da Tela 16 o submenu está recolhido, exibindo apenas a sidebar de ícones; o ícone de pessoas (Contatos) está ativo.

### 3.2 Saídas de navegação a partir desta tela

- **Clicar no nome do paciente** → abre a ficha do paciente, aba **Informações**: `/clinica/contatos/listagem/paciente/{id}/informacoes` (Tela 17).
- **Ícone WhatsApp (verde)** no identificador → inicia conversa/WhatsApp com o número *(inferido)*.
- **Menu "⋮" da linha** → ações Ver/Editar/Excluir *(inferido)*.
- **Botão flutuante "+"** (canto inferior direito, roxo) → criar novo registro (modal Novo paciente — inferido).

### 3.3 Elementos globais persistentes

- **Header:** logo **clínicaexperts**, ícone hambúrguer (recolher sidebar), e à direita: WhatsApp, busca/atalho, **"Ajuda"** (ícone "?"), sino de notificações, avatar **"LB"** (Lucas Bastos).
- **Sidebar de ícones** (extrema esquerda).
- **Botão flutuante "+"** roxo + botão de IA/assistente (canto inferior direito).
- **Toast laranja** de onboarding: **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😄"**
- **Barra de progresso** **"0% — Seu progresso"** (onboarding, canto inferior esquerdo).

---

## 4. Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER: ☰  clínicaexperts          [WA] [🔍] [? Ajuda] [🔔] [LB]          │
├───┬──────────────────────────────────────────────────────────────────────┤
│ S │ Contatos / Pacientes                                                  │
│ I │ ┌──────────────────────────────────────────────────────────────────┐ │
│ D │ │ Pacientes  1 registro          [Ações em lote ▼]  [Exportar ▼]   │ │
│ E │ │                                                                    │ │
│ B │ │ + Adicionar filtro                              [ Buscar........ ] │ │
│ A │ │ ──────────────────────────────────────────────────────────────── │ │
│ R │ │ ☐ │ Nome ◆        │ Etiquetas │ Identificador     │ Ativo │ ⚙   │ │
│   │ │ ──────────────────────────────────────────────────────────────── │ │
│   │ │ ☐ │ (av) Clara Ribeiro (Paciente de exemplo)               │   │ │
│   │ │   │      Paciente │          │ +55(11)99999-9999 [WA]│ [●]│ ⋮  │ │
│   │ │ ──────────────────────────────────────────────────────────────── │ │
│   │ │ [25 por página ▼]                       «  ‹  [1]  ›  »          │ │
│   │ └──────────────────────────────────────────────────────────────────┘ │
│   │                                                          (+)  (✨IA)  │
└───┴──────────────────────────────────────────────────────────────────────┘
```

- **Card branco** centralizado sobre fundo cinza claro, com cantos arredondados e sombra leve.
- **Cabeçalho do card:** título à esquerda; botões de ação (Ações em lote, Exportar) à direita, alinhados na mesma linha.
- **Linha de filtros:** "+ Adicionar filtro" à esquerda; campo "Buscar" à direita.
- **Tabela:** cabeçalho com checkbox de seleção total e ícone de engrenagem (configurar colunas) no canto direito.
- **Rodapé do card:** seletor de itens por página à esquerda; controles de paginação à direita.

---

## 5. Componentes

### 5.1 Cabeçalho do card

| Componente | Texto exato | Tipo | Comportamento |
|---|---|---|---|
| Título | **`Pacientes`** | Texto (heading) | Estático |
| Contador | **`1 registro`** | Texto secundário | Reflete total de registros; pluraliza p/ "N registros" *(inferido)* |
| Botão | **`Ações em lote`** + seta `▼` | Botão dropdown | **Desabilitado** até haver ≥1 linha selecionada via checkbox |
| Botão | **`Exportar`** + seta `▼` | Botão dropdown | Abre menu com formatos de exportação (CSV/Excel — inferido) |

### 5.2 Filtros e busca

| Componente | Texto exato | Tipo | Comportamento |
|---|---|---|---|
| Link/botão | **`+ Adicionar filtro`** | Link com ícone "+" roxo | Abre popover de filtros (ver §8) |
| Campo busca | placeholder **`Buscar`** | Input de texto | Busca por nome/identificador; debounce (inferido) |

### 5.3 Botão "Novo paciente"

> **Atenção:** na Tela 16 **não há** botão "Novo paciente" explícito no cabeçalho do card. A criação ocorre via **botão flutuante "+"** roxo (canto inferior direito) — *(inferido)*. Texto exato do botão flutuante: apenas o ícone **"+"** (sem rótulo). O rótulo "Novo paciente" / "+ Novo paciente" é **inferido** por analogia ao botão "+ Novo evento" da Tela 15.

### 5.4 Badges / indicadores

| Badge | Texto exato | Contexto |
|---|---|---|
| Subtítulo do contato | **`Paciente`** | Sob o nome, indica o tipo de contato |
| Identificador c/ ícone | **`+55 (11) 99999-9999`** + ícone WhatsApp (verde) | Coluna Identificador |
| Toggle Ativo | (sem texto) — switch **verde ligado** | Coluna Ativo |

### 5.5 Ícone de configuração de colunas

- **Ícone de engrenagem** (⚙) no canto direito do cabeçalho da tabela → abre painel para **configurar/mostrar/ocultar colunas** *(inferido)*.

---

## 6. Tabela

### 6.1 Colunas (ordem e textos exatos)

| # | Coluna (cabeçalho) | Conteúdo da célula | Ordenável | Observações |
|---|---|---|---|---|
| 0 | **`☐`** (checkbox) | Checkbox de seleção da linha | — | Checkbox no cabeçalho = selecionar todos |
| 1 | **`Nome`** + ícone `◆` (ordenação) | Avatar (foto) + **Nome** (link) + subtítulo **`Paciente`** | **Sim** (ícone `◆` ativo) | Ordenação clicável; default por Nome (inferido) |
| 2 | **`Etiquetas`** | Tags/etiquetas do paciente (vazio no exemplo) | Não (inferido) | Chips de cor *(inferido)* |
| 3 | **`Identificador`** | Telefone formatado **`+55 (11) 99999-9999`** + ícone WhatsApp verde | Não (inferido) | Ícone WA clicável → conversa |
| 4 | **`Ativo`** | **Toggle/switch** (verde = ativo) | Não | Ativa/inativa direto na tabela |
| 5 | **`⚙`** (engrenagem) | Cabeçalho: config. de colunas. Célula: menu **`⋮`** (ações da linha) | — | Coluna utilitária à direita |

### 6.2 Avatar

- Imagem circular do paciente à esquerda do nome. Quando sem foto, exibe iniciais/placeholder *(inferido)*.
- No exemplo: foto da paciente "Clara Ribeiro".

### 6.3 Linha de exemplo (dados exatos)

| Campo | Valor |
|---|---|
| Checkbox | (desmarcado) |
| Avatar | foto da paciente |
| Nome | **`Clara Ribeiro (Paciente de exemplo)`** |
| Subtítulo | **`Paciente`** |
| Etiquetas | (vazio) |
| Identificador | **`+55 (11) 99999-9999`** + ícone WhatsApp (verde) |
| Ativo | **toggle ligado (verde)** |
| Ações | menu **`⋮`** (três pontos verticais) |

### 6.4 Ações por linha (menu "⋮") — *(inferido)*

| Ação | Texto exato (inferido) | Efeito |
|---|---|---|
| Ver | **`Ver`** / **`Abrir ficha`** | Navega para `/.../paciente/{id}/informacoes` |
| Editar | **`Editar`** | Abre modal/form de edição cadastral |
| Excluir | **`Excluir`** | Abre confirmação e remove/inativa o paciente |

### 6.5 Ordenação

- Coluna **Nome** ordenável (ícone `◆` no cabeçalho). Clique alterna asc/desc *(inferido)*.
- Demais colunas: ordenação não evidenciada na captura.

### 6.6 Seleção em massa

- **Checkbox no cabeçalho** seleciona/desseleciona todas as linhas da página.
- **Checkbox por linha** seleciona individualmente.
- Com ≥1 selecionado, o botão **"Ações em lote"** habilita (ativar/inativar/excluir/exportar selecionados — inferido).

### 6.7 Paginação

| Componente | Texto/estado exato |
|---|---|
| Seletor por página | **`25 por página`** (dropdown) — opções: 10/25/50/100 *(inferido; 25 é o valor exibido)* |
| Controles | **`«`** (primeira) · **`‹`** (anterior) · **`[1]`** (página atual, destacada em roxo) · **`›`** (próxima) · **`»`** (última) |

---

## 7. Formulários

Nesta listagem não há formulário inline. Os formulários associados são:

1. **Busca** (campo "Buscar") — input único, sem validação.
2. **Filtros** (popover "+ Adicionar filtro") — ver §8.
3. **Novo paciente / Editar paciente** (modal) — ver §10 *(inferido)*.

---

## 8. Filtros

- **Gatilho:** link **`+ Adicionar filtro`**.
- **Comportamento:** abre popover/painel de filtros (padrão de duas colunas observado na Tela 20: à esquerda atributos, à direita valores).

### Filtros disponíveis (inferido)

| Filtro | Tipo | Valores |
|---|---|---|
| **Busca** (campo "Buscar") | Texto livre | Por **nome**, **CPF** e **telefone** *(inferido)* |
| **Status** | Lista/checkbox | **Ativo** / **Inativo** *(inferido — coluna "Ativo")* |
| **Etiquetas / Tags** | Multi-select | Etiquetas cadastradas *(inferido — coluna "Etiquetas")* |
| **Profissional responsável** | Combobox | *(inferido)* |
| **Data de cadastro** | Intervalo de datas | *(inferido)* |

---

## 9. Estados

| Estado | Comportamento / Texto |
|---|---|
| **Carregando** | Skeleton/spinner na área da tabela enquanto busca dados *(inferido)* |
| **Com dados** | Tabela renderizada (estado da captura: "1 registro") |
| **Vazio (sem registros / filtros sem match)** | Padrão do app: ícone de lupa em círculo + título **`Oops, nada foi encontrado!`** + subtítulo **`Os filtros selecionados não correspondem a nenhum registro.`** + botão **`Limpar filtros`** + botão roxo de criação *(inferido, por analogia à Tela 15)* |
| **Vazio (lista realmente sem pacientes)** | Estado vazio com chamada para cadastrar primeiro paciente *(inferido)* |
| **Erro de carregamento** | Mensagem de erro + ação de tentar novamente *(inferido)* |
| **Exportando** | Indicador de progresso / download iniciado *(inferido)* |

---

## 10. Modais

### 10.1 Modal "Novo paciente" *(inferido)*

> Não visível na Tela 16. Campos inferidos a partir da ficha do paciente (Tela 17 — aba Informações), que expõe o modelo cadastral completo.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| **Nome completo** | Texto | Sim* | Ex.: "Clara Ribeiro" |
| **Data de nascimento** | Data (`dd/mm/aaaa`) | Não | Exibe idade calculada (ex.: "34 anos") |
| **Sexo** | Select | Não | Feminino / Masculino / Outro *(inferido)* |
| **Email** | Email | Não | Ex.: "clara.ribeiro@exemplo.com" |
| **Telefone** | Telefone (`+55 (DD) 9XXXX-XXXX`) | Não | Com ícone/integração WhatsApp |
| **Notificações** | Toggle/Select | Não | "Não recebe notificações" / "Recebe" *(inferido)* |
| **Endereço** | Grupo de campos | Não | Logradouro, número, bairro, cidade, UF, CEP, país |
| **CEP** | Texto (máscara `00000-000`) | Não | Ex.: "04094-050"; pode autopreencher endereço *(inferido)* |
| **CPF** | Texto (máscara `000.000.000-00`) | Não | Ex.: "315.772.070-84"; validação de dígito verificador |
| **Etiquetas** | Multi-select (chips) | Não | Tags do paciente |
| **Observações** | Textarea | Não | Texto livre |
| **Status / Ativo** | Toggle | Não | Default: Ativo |

- **Ações do modal (inferido):** botão roxo **`Salvar`** + botão **`Cancelar`** / **`X`** (fechar).

### 10.2 Modal de confirmação de exclusão *(inferido)*

- Título tipo **`Excluir paciente?`**, mensagem de confirmação, botões **`Cancelar`** / **`Excluir`** (vermelho).

### 10.3 Menu "Exportar" *(inferido)*

- Opções: **`Exportar para CSV`** / **`Exportar para Excel`** / **`Exportar para PDF`** *(inferido)*.

---

## 11. Modelo de dados — `Paciente` (inferido)

```ts
interface Paciente {
  id: number;                       // ex.: 10318910 (ver rota da ficha, Tela 17)
  nome: string;                     // "Clara Ribeiro"
  is_exemplo: boolean;              // flag "(Paciente de exemplo)" / selo EXEMPLO
  tipo: "paciente";                 // discriminador do contato (subtítulo "Paciente")
  avatar_url: string | null;        // foto do paciente

  // Contato
  telefone: string;                 // "+55 (11) 99999-9999"
  whatsapp: boolean;                // habilita ícone/ação WhatsApp
  email: string | null;             // "clara.ribeiro@exemplo.com"

  // Dados pessoais
  data_nascimento: string | null;   // "1991-12-02" (ISO) → exibe 02/12/1991 + idade
  idade: number | null;             // derivado (34)
  sexo: "feminino" | "masculino" | "outro" | null;
  cpf: string | null;               // "315.772.070-84" — único na clínica

  // Endereço
  endereco: {
    logradouro: string | null;      // "Av. Pedro Álvares Cabral"
    numero: string | null;          // "SN"
    bairro: string | null;          // "Vila Mariana"
    cidade: string | null;          // "São Paulo"
    uf: string | null;              // "SP"
    cep: string | null;             // "04094-050"
    pais: string | null;            // "Brasil"
  } | null;

  // Operacional
  etiquetas: Tag[];                 // coluna "Etiquetas"
  ativo: boolean;                   // toggle "Ativo"
  notificacoes: boolean;            // "Não recebe notificações"
  observacoes: string | null;       // "Esse paciente é um paciente de exemplo."

  // Auditoria
  criado_em: string;                // "2026-06-22T15:00:43" → "22/06/2026 15:00:43"
  atualizado_em: string | null;
}

interface Tag { id: number; nome: string; cor: string; }
```

---

## 12. Endpoints API inferidos

> Base inferida: `/api` (ou prefixo equivalente). Todos os endpoints são **inferidos**.

| Operação | Método | Endpoint (inferido) | Observações |
|---|---|---|---|
| Listar pacientes | `GET` | `/clinica/contatos/pacientes?page=1&per_page=25` | Paginado; retorna total p/ contador "N registros" |
| Buscar/filtrar | `GET` | `/clinica/contatos/pacientes?search={termo}&status={ativo}&tags[]={id}` | `search` cobre nome/CPF/telefone |
| Obter paciente | `GET` | `/clinica/contatos/pacientes/{id}` | Dados da ficha (Tela 17) |
| Criar paciente | `POST` | `/clinica/contatos/pacientes` | Payload = modelo §11 |
| Editar paciente | `PUT`/`PATCH` | `/clinica/contatos/pacientes/{id}` | Edição cadastral |
| Ativar/inativar | `PATCH` | `/clinica/contatos/pacientes/{id}` `{ ativo: true|false }` | Acionado pelo toggle "Ativo" |
| Excluir paciente | `DELETE` | `/clinica/contatos/pacientes/{id}` | Confirmação no front |
| Ações em lote | `POST` | `/clinica/contatos/pacientes/bulk` `{ ids:[], acao:"ativar|inativar|excluir|exportar" }` | Botão "Ações em lote" |
| Exportar | `GET` | `/clinica/contatos/pacientes/export?format=csv|xlsx|pdf&...filtros` | Gera arquivo; respeita filtros ativos |
| Listar etiquetas | `GET` | `/clinica/contatos/etiquetas` | Para filtro/coluna Etiquetas |

---

## 13. Regras de negócio e validações

1. **CPF único** por clínica — não permitir dois pacientes com o mesmo CPF *(inferido)*.
2. **CPF válido** — validação de dígitos verificadores quando preenchido *(inferido)*.
3. **Nome obrigatório** *(inferido)* — demais campos opcionais.
4. **Email válido** (formato) quando preenchido *(inferido)*.
5. **Telefone** com máscara internacional `+55 (DD) 9XXXX-XXXX`; valida DDD/dígitos *(inferido)*.
6. **Toggle "Ativo"** altera o status sem recarregar a página (atualização otimista — inferido).
7. **Ações em lote** desabilitadas sem seleção (estado observado na Tela 16).
8. **"Paciente de exemplo"** é um registro seed/demo (selo EXEMPLO na ficha) — pode ter tratamento especial (não excluir / ocultar — inferido).
9. **Exportação** respeita filtros e busca ativos no momento *(inferido)*.
10. **CEP** pode disparar autopreenchimento de endereço (logradouro/bairro/cidade/UF) *(inferido)*.

---

## 14. Fluxos

### 14.1 Buscar paciente
1. Usuário digita no campo **"Buscar"**.
2. Front dispara `GET .../pacientes?search={termo}` (debounce — inferido).
3. Tabela atualiza; contador "N registros" reflete o resultado.
4. Sem match → estado vazio "Oops, nada foi encontrado!" (inferido).

### 14.2 Aplicar filtro
1. Clica **"+ Adicionar filtro"** → popover de filtros.
2. Seleciona atributo (Status/Etiquetas/etc.) e valor.
3. Filtro aplicado vira chip removível (padrão Tela 15) e recarrega a lista.

### 14.3 Ativar/Inativar paciente
1. Usuário aciona o **toggle "Ativo"** na linha.
2. `PATCH .../pacientes/{id} { ativo }`.
3. Toggle reflete novo estado (verde = ativo).

### 14.4 Criar novo paciente *(inferido)*
1. Clica botão flutuante **"+"**.
2. Abre modal "Novo paciente".
3. Preenche campos (§10.1), CPF validado/único.
4. **Salvar** → `POST .../pacientes` → lista atualiza e contador incrementa.

### 14.5 Abrir ficha do paciente
1. Clica no **nome** do paciente.
2. Navega para `/clinica/contatos/listagem/paciente/{id}/informacoes` (Tela 17).

### 14.6 Ações em lote
1. Marca checkboxes das linhas desejadas.
2. Botão **"Ações em lote"** habilita.
3. Escolhe ação (ativar/inativar/excluir/exportar selecionados) → `POST .../pacientes/bulk`.

### 14.7 Exportar lista
1. Clica **"Exportar ▼"**.
2. Escolhe formato (CSV/Excel/PDF — inferido).
3. `GET .../pacientes/export?format=...` respeitando filtros → download.

### 14.8 Iniciar conversa WhatsApp
1. Clica no ícone WhatsApp (verde) ao lado do identificador.
2. Abre conversa/WhatsApp com o número *(inferido)*.

---

## 15. Notas de implementação

- **Padrão de listagem reutilizável:** cabeçalho (título + contador + ações), barra de filtros (+ Adicionar filtro + Buscar), tabela com seleção, config de colunas (⚙) e paginação (`seletor por página` + `« ‹ [n] › »`). Mesmo componente serve Profissionais/Fornecedores/Leads/Todos os contatos trocando o `tipo` de contato.
- **Colunas configuráveis:** o ícone de engrenagem indica colunas customizáveis (persistir preferência por usuário — inferido).
- **Coluna "Identificador"** combina telefone formatado + ação WhatsApp; tratar formatação E.164 ↔ exibição `+55 (DD) 9XXXX-XXXX`.
- **Toggle "Ativo"** com atualização otimista e rollback em caso de erro de API.
- **"Ações em lote"** parte desabilitada; habilitar reativamente conforme seleção.
- **Estados vazios** seguem o padrão ilustrado do app (ícone + título + subtítulo + ações) — reaproveitar o componente das Telas 15/19/20.
- **Cores semânticas:** roxo (primária/ações/menu ativo/paginação ativa), verde (WhatsApp e toggle ativo).
- **Registro "Paciente de exemplo"** é seed de onboarding; considerar flag `is_exemplo` para tratamento/ocultação.
- **Acessibilidade:** checkboxes, toggles e menu "⋮" precisam de `aria-label` (não há rótulos textuais visíveis).
- **i18n:** todos os textos em pt-BR; pluralização do contador "registro/registros".
- **Elementos globais de onboarding** (toast de desconto, barra "Seu progresso", botão IA) são overlays independentes desta tela.

> **Legenda:** itens marcados como *(inferido)* não são diretamente observáveis na captura da Tela 16 e foram deduzidos do padrão do app e da ficha do paciente (Telas 17–20).
