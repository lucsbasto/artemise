# Configurações / Dados da Clínica

| Metadado | Valor |
|----------|-------|
| **Página** | Configurações / Dados da Clínica |
| **Rota** | `/configuracoes/dados-da-clinica` |
| **URL completa** | `app.clinicaexperts.com.br/configuracoes/dados-da-clinica` |
| **Módulo** | Configurações |
| **Tipo de tela** | Formulário de cadastro/edição (single record) |
| **Breadcrumb** | `Configurações / Dados da Clinica` |
| **Acesso** | Sidebar → ícone de engrenagem (Configurações) |
| **Idioma** | pt-BR |
| **Referência cruzada** | `docs/06-telas-51-a-58.md` (Tela 51) |
| **Captura** | 2026-06-22 153834 |
| **Data do doc** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153834.png)

---

## 1. Identificação

- **Nome da página:** Dados da Clínica
- **Rota:** `/configuracoes/dados-da-clinica`
- **Título exibido no breadcrumb:** `Configurações / Dados da Clinica` (texto exato visto na tela; nota: "Clinica" sem acento no breadcrumb, embora o título de seção use "clínica" com acento).
- **Título da primeira seção (heading bold):** **"Dados da clínica"**
- **Contexto:** Tela única de identidade cadastral da clínica/empresa. Não há listagem nem paginação — é um formulário de registro único (o registro da própria clínica/tenant logado).
- **Identificação do usuário logado:** avatar **"LB"** (Lucas Bastos) no header.

---

## 2. Objetivo

Cadastrar e editar os dados cadastrais da clínica usados em documentos, notas fiscais e notificações a pacientes. O formulário cobre:

- **Identificação fiscal:** tipo de pessoa (Física/Jurídica), CNPJ, nome fantasia, razão social.
- **Logotipo:** upload da marca da clínica (JPG/PNG/JPEG).
- **Endereço e contato comercial:** telefone, e-mail, país, CEP, estado, cidade, bairro, rua, número, complemento. Usado em notificações enviadas aos pacientes.
- **Endereço e contato de cobrança:** dados para emissão de nota fiscal (seção parcialmente visível no rodapé da captura — ver §7.4 inferido).

O objetivo de negócio é centralizar a identidade da empresa para reuso em atestados (ver Tela 58: variável `Nome da clínica` / `Endereço da clínica`), recibos, NF-e e comunicações.

---

## 3. Navegação

- **Entrada:** Sidebar esquerda → ícone de engrenagem (**Configurações**, destacado em roxo) → subitem Dados da Clínica.
- **Breadcrumb:** `Configurações` (link clicável roxo) `/` `Dados da Clinica` (texto atual, não-link).
- **Saída/links:**
  - "Configurações" no breadcrumb volta ao índice de Configurações *(inferido)*.
  - Header padrão: WhatsApp, busca (lupa), **"Ajuda"**, sino (notificações), avatar **"LB"**.
- **Sem FAB** nesta tela (é formulário, não listagem).
- **Persistência da rota:** rota fixa, sem query string na captura.

---

## 4. Layout

Header e sidebar padrão (ver §"Elementos comuns" do doc 06). Área principal com fundo cinza claro (#f5f5f7 aprox.) e o formulário organizado em **cards/seções brancas empilhadas verticalmente**, cada uma com título em negrito. O formulário é longo e rolável.

Estrutura de cima para baixo:

1. **Breadcrumb** (`Configurações / Dados da Clinica`).
2. **Seção "Dados da clínica"** — card branco, layout em **duas colunas**:
   - Coluna esquerda: campos de identificação (Tipo de pessoa, CNPJ, Nome fantasia, Razão social).
   - Coluna direita: **"Logotipo"** (área de upload).
3. **Seção "Endereço e contato comercial"** — card branco, texto auxiliar + **grade de 2 colunas** de campos.
4. **Seção "Endereço e contato de cobrança"** — card branco (parcialmente visível), texto auxiliar + campos *(inferido: estrutura análoga ao endereço comercial)*.
5. **Botão "Salvar"** no rodapé do formulário *(inferido — fora do recorte da captura)*.

Larguras: na seção de identificação a coluna de campos ocupa ~50% à esquerda e o logotipo ~50% à direita. Nas seções de endereço, os campos se distribuem em grade de 2 colunas de largura igual.

---

## 5. Componentes

### 5.1 Seletor segmentado (toggle) "Tipo de pessoa"
- Controle único com duas opções lado a lado: **"Física"** | **"Jurídica"**.
- Na captura, ambos os rótulos aparecem em cinza claro; o estado selecionado alterna validação/rótulo do documento (CPF para Física, CNPJ para Jurídica).

### 5.2 Upload de logotipo
- **Rótulo:** **"Logotipo"**.
- **Preview:** avatar **circular** com placeholder (ícone de pessoa cinza) quando sem imagem.
- **Texto de instrução (linha 1):** **"Selecione um arquivo JPG, PNG ou JPEG do seu dispositivo"**.
- **Texto de instrução (linha 2):** **"Arraste e solte arquivos aqui, ou"**.
- **Botão:** **"Escolher foto"** (fundo lavanda/roxo claro).
- **Comportamento:** seleção via file picker **ou** drag-and-drop na área. Formatos aceitos: JPG, PNG, JPEG.

### 5.3 Seletor de DDI (telefone)
- Dropdown à esquerda do campo de telefone: bandeira do Brasil 🇧🇷 + **"+55"** + seta (▾).
- Permite trocar o país do código discagem *(inferido)*.

### 5.4 Botão "Salvar"
- **Texto exato:** **"Salvar"** *(inferido — não visível na captura; consistente com os demais formulários do módulo, ex.: Tela 53, 55, 58 todas usam "Salvar" roxo centralizado)*.
- Cor: roxo (cor primária da marca).
- Posição: rodapé do formulário, centralizado *(inferido)*.

### 5.5 Dropdowns de endereço
- **País**, **Estado**, **Cidade** são dropdowns (combobox) com placeholder **"Selecione"** e seta (▾). Estado/Cidade aparentam ser selects pesquisáveis.

### 5.6 Widgets fixos (canto inferior direito)
- Balão laranja: **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto! 😅"**
- Botão flutuante roxo (sparkle / assistente IA).
- Card **"Seu progresso"** com **"0%"** e seta de recolher.

---

## 6. Tabelas

**Não há tabelas nesta página.** É um formulário de registro único, sem listagem, ordenação ou paginação.

---

## 7. Formulários / Campos

> Convenção: `*` no rótulo = campo obrigatório. Rótulos transcritos exatamente como na tela.

### 7.1 Seção "Dados da clínica"

| # | Rótulo exato | Tipo | Obrigatório | Placeholder / Valor na captura | Máscara / Formato |
|---|--------------|------|:-----------:|-------------------------------|-------------------|
| 1 | **Tipo de pessoa*** | Toggle segmentado (Física / Jurídica) | Sim | — (opções "Física", "Jurídica") | — |
| 2 | **CNPJ*** | Texto | Sim | (vazio) | `00.000.000/0000-00` *(inferido)*; alterna para `000.000.000-00` (CPF) se Tipo = Física *(inferido)* |
| 3 | **Nome fantasia*** | Texto | Sim | valor: **"ateste"** | livre |
| 4 | **Razão social*** | Texto | Sim | valor: **"Lucas Bastos"** | livre |
| 5 | **Logotipo** | Upload (file/drag-drop) | Não *(sem asterisco)* | placeholder circular | JPG, PNG, JPEG |

### 7.2 Seção "Endereço e contato comercial"

Texto auxiliar (cinza): **"Informe os dados comerciais da sua clínica. Eles serão utilizados em notificações enviadas para seus pacientes."**

| # | Rótulo exato | Tipo | Obrigatório | Placeholder | Máscara / Formato |
|---|--------------|------|:-----------:|-------------|-------------------|
| 6 | **Telefone*** | Texto + seletor DDI | Sim | **"(99) 9999-9999"** | `(99) 99999-9999` / `(99) 9999-9999`; prefixo DDI 🇧🇷 **+55** |
| 7 | **E-mail*** | Texto (email) | Sim | **"Digite"** | validação de e-mail *(inferido)* |
| 8 | **País*** | Dropdown | Sim | **"Selecione"** | — |
| 9 | **Código postal*** | Texto | Sim | **"00000-000"** | `00000-000` (CEP) |
| 10 | **Estado*** | Dropdown | Sim | **"Selecione"** | UF *(inferido: lista de estados BR)* |
| 11 | **Cidade*** | Dropdown | Sim | **"Selecione"** | dependente do Estado *(inferido)* |
| 12 | **Bairro*** | Texto | Sim | **"Digite"** | livre |
| 13 | **Rua*** | Texto | Sim | **"Digite"** | livre |
| 14 | **Número*** | Texto | Sim | **"Digite"** | numérico/alfanumérico |
| 15 | **Complemento** | Texto | **Não** (sem asterisco) | **"Digite"** | livre |

> Observação: a tela rotula CEP como **"Código postal*"** (não "CEP"). UF é representada pelo campo **"Estado*"** (dropdown), não por sigla de 2 letras digitável. "Horário de funcionamento" **não está presente** na captura desta tela — não há campos de horário visíveis *(inferido: ausente; pode existir em outra subseção de Configurações)*.

### 7.3 Seção "Endereço e contato de cobrança" (parcialmente visível)

Texto auxiliar: **"Informe os dados de cobrança da sua clínica. Eles serão utilizados para emissão da nota fiscal."**

| # | Rótulo *(inferido)* | Tipo | Obrigatório | Placeholder *(inferido)* |
|---|--------------------|------|:-----------:|-------------------------|
| 16+ | Telefone, E-mail, País, Código postal, Estado, Cidade, Bairro, Rua, Número, Complemento *(inferido — estrutura análoga à seção comercial; campos cortados pela borda inferior da captura)* | Texto/Dropdown | *(inferido)* Sim, exceto Complemento | análogo à seção comercial |

> Possivelmente há um checkbox/toggle **"Usar o mesmo endereço comercial"** para copiar os dados *(inferido — não visível)*.

---

## 8. Filtros

**Não aplicável.** Página de formulário — sem filtros, busca ou "+ Adicionar filtro".

---

## 9. Estados

- **Edição (preenchido):** estado da captura — Nome fantasia = "ateste", Razão social = "Lucas Bastos", demais campos vazios; logotipo no placeholder; País/Estado/Cidade em "Selecione".
- **Vazio/novo:** todos os campos em placeholder padrão.
- **Logotipo sem imagem:** avatar circular placeholder (ícone de pessoa).
- **Logotipo com imagem:** preview da imagem enviada no círculo *(inferido)*.
- **Validação/erro:** campos obrigatórios marcados em vermelho com mensagem ao tentar salvar com pendência *(inferido)*.
- **Salvando:** botão "Salvar" em estado loading/desabilitado *(inferido)*.
- **Sucesso:** toast/notificação de confirmação após salvar *(inferido)*.
- **Onboarding:** card "Seu progresso 0%" no canto inferior (estado de onboarding incompleto).

---

## 10. Modais

**Nenhum modal próprio da tela.** O único diálogo é o **file picker nativo do SO** acionado por "Escolher foto". *(Inferido: pode haver modal de recorte/crop da imagem após seleção do logo, e um diálogo de descarte ao sair com alterações não salvas — nenhum visível na captura.)*

---

## 11. Modelo de Dados

### Entidade `Clinica` *(campos inferidos a partir dos rótulos)*

| Campo | Tipo | Obrigatório | Origem (rótulo na tela) |
|-------|------|:-----------:|-------------------------|
| `id` | UUID / int | Sim | (PK, interno) |
| `tipo_pessoa` | enum `'fisica' \| 'juridica'` | Sim | Tipo de pessoa |
| `cnpj` | string (14 dígitos) | Sim (se jurídica) | CNPJ |
| `cpf` | string (11 dígitos) | Sim (se física) | CNPJ→CPF *(inferido)* |
| `nome_fantasia` | string | Sim | Nome fantasia |
| `razao_social` | string | Sim | Razão social |
| `logotipo_url` | string (URL) | Não | Logotipo |
| **Endereço/contato comercial** | | | |
| `telefone` | string (E.164 / com DDD) | Sim | Telefone |
| `ddi` | string (ex.: `+55`) | Sim | seletor DDI |
| `email` | string (email) | Sim | E-mail |
| `pais` | string / ISO code | Sim | País |
| `cep` | string (`00000-000`) | Sim | Código postal |
| `estado` | string (UF) | Sim | Estado |
| `cidade` | string | Sim | Cidade |
| `bairro` | string | Sim | Bairro |
| `rua` | string | Sim | Rua |
| `numero` | string | Sim | Número |
| `complemento` | string | Não | Complemento |
| **Endereço/contato de cobrança** *(inferido)* | | | |
| `cobranca_telefone` | string | *(inferido)* | Telefone (cobrança) |
| `cobranca_email` | string | *(inferido)* | E-mail (cobrança) |
| `cobranca_pais` | string | *(inferido)* | País (cobrança) |
| `cobranca_cep` | string | *(inferido)* | Código postal (cobrança) |
| `cobranca_estado` | string | *(inferido)* | Estado (cobrança) |
| `cobranca_cidade` | string | *(inferido)* | Cidade (cobrança) |
| `cobranca_bairro` | string | *(inferido)* | Bairro (cobrança) |
| `cobranca_rua` | string | *(inferido)* | Rua (cobrança) |
| `cobranca_numero` | string | *(inferido)* | Número (cobrança) |
| `cobranca_complemento` | string | *(inferido)* | Complemento (cobrança) |
| `updated_at` | datetime | Sim | (interno) |

> Nota de modelagem *(inferido)*: os dois endereços podem estar normalizados em uma tabela `enderecos` relacionada (`tipo = 'comercial' \| 'cobranca'`) em vez de colunas planas.

---

## 12. Endpoints de API (inferidos)

> Todos **inferidos** — nenhum confirmado na captura.

| Método | Endpoint | Uso |
|--------|----------|-----|
| `GET` | `/api/clinica` ou `/api/configuracoes/dados-da-clinica` | Carregar dados atuais da clínica |
| `PUT` / `PATCH` | `/api/clinica/{id}` | Salvar/atualizar dados da clínica |
| `POST` | `/api/clinica/logotipo` (multipart/form-data) | Upload do logotipo |
| `DELETE` | `/api/clinica/logotipo` | Remover logotipo |
| `GET` | `/api/cep/{cep}` ou integração ViaCEP `https://viacep.com.br/ws/{cep}/json/` | Autocompletar endereço por CEP |
| `GET` | `/api/localidades/estados` | Lista de UFs (dropdown Estado) |
| `GET` | `/api/localidades/cidades?estado={uf}` | Cidades por estado (dropdown dependente) |
| `GET` | `/api/localidades/paises` | Lista de países (dropdown País) |
| `GET` | `/api/cnpj/{cnpj}` (ex.: ReceitaWS/BrasilAPI) | Autopreencher razão social/nome a partir do CNPJ *(inferido)* |

---

## 13. Regras de Negócio

- **R1 — Obrigatoriedade:** todos os campos com `*` são obrigatórios; "Complemento" é opcional. Salvar deve validar pendências.
- **R2 — Tipo de pessoa:** ao escolher **Física**, o documento vira CPF (`000.000.000-00`) e o rótulo/validação muda; **Jurídica** mantém CNPJ (`00.000.000/0000-00`) *(inferido)*. Razão social pode ficar opcional para pessoa física *(inferido)*.
- **R3 — Validação de CNPJ:** validar dígitos verificadores (algoritmo módulo 11) além da máscara *(inferido)*. Opcionalmente consultar API de CNPJ para autopreencher Razão social/Nome fantasia *(inferido)*.
- **R4 — CEP autocompletar:** ao preencher "Código postal" com 8 dígitos válidos, disparar busca (ViaCEP ou similar) e **autopreencher** Estado, Cidade, Bairro e Rua, mantendo Número/Complemento manuais *(inferido — comportamento padrão do mercado, não confirmado)*.
- **R5 — Cidade dependente de Estado:** o dropdown Cidade carrega opções conforme o Estado selecionado *(inferido)*.
- **R6 — Telefone:** máscara dinâmica fixo `(99) 9999-9999` vs celular `(99) 99999-9999`; DDI prefixado por seletor de país.
- **R7 — E-mail:** validação de formato `local@dominio.tld`.
- **R8 — Logotipo:** aceitar somente JPG/PNG/JPEG; limite de tamanho/dimensão *(inferido)*; usado em documentos e notificações.
- **R9 — Uso dos dados:** endereço comercial → notificações a pacientes; endereço de cobrança → emissão de nota fiscal (conforme textos auxiliares das seções).
- **R10 — Registro único:** existe um único registro por clínica/tenant; a operação é sempre *update* (upsert), nunca criação de múltiplos.

---

## 14. Fluxos

### 14.1 Carregar a página
1. Usuário acessa `/configuracoes/dados-da-clinica`.
2. `GET` dos dados da clínica preenche o formulário (campos vazios ficam em placeholder).
3. Dropdowns de País/Estado/Cidade carregam opções (lazy).

### 14.2 Salvar dados (fluxo principal)
1. Usuário edita os campos.
2. Clica em **"Salvar"** *(inferido)*.
3. Front valida campos obrigatórios e máscaras (CNPJ/CPF, CEP, telefone, e-mail).
4. Em caso de erro: destaca campos pendentes e impede submissão.
5. Em sucesso: `PUT/PATCH` persiste os dados.
6. Exibe confirmação (toast) e mantém na tela *(inferido)*.

### 14.3 Upload de logotipo
1. Usuário clica **"Escolher foto"** ou arrasta arquivo para a área.
2. Valida formato (JPG/PNG/JPEG).
3. (Opcional) crop/preview *(inferido)*.
4. `POST` multipart envia a imagem; preview circular atualiza.

### 14.4 Autocompletar por CEP *(inferido)*
1. Usuário digita o CEP em "Código postal".
2. Ao completar 8 dígitos, dispara busca de endereço.
3. Estado/Cidade/Bairro/Rua são preenchidos automaticamente; foco vai para "Número".

### 14.5 Alternar tipo de pessoa
1. Usuário clica em "Física" ou "Jurídica".
2. Rótulo/máscara/validação do campo de documento são ajustados *(inferido)*.

---

## 15. Notas de Implementação

- **Inconsistência de acento:** o breadcrumb mostra **"Dados da Clinica"** (sem acento) enquanto o título de seção mostra **"Dados da clínica"** (com acento). Padronizar para "Clínica".
- **Rótulo do documento:** o campo está rotulado fixo como **"CNPJ*"** mesmo com o toggle "Física" disponível — verificar se o rótulo muda dinamicamente para "CPF" quando Física é selecionada (recomendado).
- **"Código postal" vs "CEP":** a tela usa "Código postal"; manter consistência com o restante do produto.
- **Estado como dropdown:** UF é select, não input — usar lista oficial de 27 UFs.
- **Botão Salvar não visível:** confirmar texto exato e posição (presumido "Salvar" roxo centralizado, conforme padrão das Telas 53/55/58).
- **Horário de funcionamento:** solicitado no escopo, mas **ausente** nesta tela — confirmar se pertence a outra subseção de Configurações.
- **Seção de cobrança:** validar se há toggle "mesmo que comercial" e quais campos são obrigatórios.
- **Acessibilidade:** garantir `label`/`for`, indicação de obrigatório por mais que cor, foco visível nos dropdowns pesquisáveis, alt text no preview do logotipo.
- **Drag-and-drop:** suportar arrastar arquivo sobre toda a área de upload, não só o botão.
- **Integrações externas:** ViaCEP (CEP) e API de CNPJ (Receita) são dependências externas — tratar timeout/falha sem bloquear o salvamento manual.
- **Máscaras:** aplicar máscara de CNPJ/CPF/CEP/telefone no front e **normalizar** (remover máscara) antes de persistir.
