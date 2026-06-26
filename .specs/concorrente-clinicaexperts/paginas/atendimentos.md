# Atendimentos / Prontuário

**Rotas:** `/atendimentos/` (listagem) · `/atendimentos/editar/{uuid}` (ficha/prontuário)
**Tipo:** Listagem + editor de prontuário clínico
**Screenshots:** `atendimentos.png`

## Listagem de atendimentos

- Colunas: **Data** · **Paciente** · **Profissional** · **Fichas de atendimento** (ex.: "Estética Facial") · **Status** (ex.: `Em andamento`) · menu ⋮ · engrenagem (config colunas).
- **Adicionar filtro**, **Exportar ▾**, paginação, FAB(+) para novo atendimento.
- Status do atendimento: `Em andamento`, (finalizado/cancelado…).

## Editor de prontuário (`/atendimentos/editar/{uuid}`)

Tela cheia de registro clínico do atendimento.

### Header do paciente
- Avatar + Nome + **idade calculada** (ex.: "34 anos, 6 meses, 20 dias") + ícone copiar/clipboard.

### Sidebar — Fichas (templates clínicos)
Lista de fichas/formulários disponíveis (marcador azul = preenchida):
1. **Anamnese**
2. **Capilar**
3. **Corporal**
4. **Epilação**
5. **Estética Facial**
6. **Facial**
7. **Fotos e anexos**
8. **Injetáveis**
9. **Orçamento**
10. **Plano de tratamento**

> São templates de prontuário por especialidade. Configuráveis (provável CRUD de fichas em Configurações). Cada ficha = conjunto de campos próprios.

### Ficha "Anamnese" (representativa)
Campos observados:
- **Queixa Principal** — editor rich-text (B/I/U/S, cor, alinhamento, listas, undo/redo).
- **Tratamentos anteriores** — editor rich-text.
- **Gestante?** — radio (Sim/Não).
- Dezenas de **grupos de pergunta** padrão `Sim / Não / Outro (texto livre)` (histórico de saúde, alergias, condições, etc).
- **Gravação de áudio** (IA — Anna Transcription): checkboxes "Habilitar gravação de áudio", "Identificar locutores".
- **Upload de arquivos/imagens** (file inputs).

### Ficha "Fotos e anexos"
- Galeria de imagens antes/depois + anexos do atendimento.

### Ficha "Orçamento"
- Orçamento de procedimentos vinculado ao atendimento (ver módulo Vendas).

### Ficha "Plano de tratamento"
- Sequência de sessões/procedimentos planejados.

### Rodapé (sticky)
- **Timer** de duração do atendimento (ex.: `00:36:59`) — cronometra a sessão.
- Seletor de **visibilidade**: `Privado ▾` (controla quem vê a ficha).
- Botões: **Cancelar** · **Finalizar atendimento**.

## Observações para o Artemise

- Prontuário modular por especialidade (fichas plugáveis) é o coração de um sistema clínico — alto valor.
- Editores rich-text por campo dão liberdade ao profissional.
- Timer de atendimento + visibilidade (privado/compartilhado) = controle de duração e LGPD.
- Transcrição de áudio por IA durante o atendimento (mãos livres) é diferencial forte.
- Fichas configuráveis (template builder) permitem adaptar a cada nicho (capilar, corporal, injetáveis…).
- Idade exibida com precisão (anos/meses/dias) — detalhe clínico útil.

## ⚠️ Profundidade
Cada uma das 10 fichas tem dezenas de campos (questionários). Este doc cobre a **estrutura** e a ficha Anamnese como amostra. Detalhamento campo-a-campo de todas as fichas = sob demanda (ver checkpoint).
