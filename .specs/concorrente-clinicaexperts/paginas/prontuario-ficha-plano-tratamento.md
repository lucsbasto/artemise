# Prontuário — Ficha Plano de tratamento

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Plano de tratamento**, último item)
**Tipo:** Formulário de atendimento (conduta clínica) — **5 editores rich-text empilhados**
**Screenshots:** `prontuario-plano-01-inicial.png`, `prontuario-plano-02-preenchido.png`, `prontuario-plano-03-orcamento-vinculo.png`
**Verificado em:** atendimento `1043a6a9-7355-4136-a749-2d993dfe133e` (paciente Clara Ribeiro / ficha `[DOC-TESTE] Ficha 001`), sessão `ag-plano`.

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## ⚠️ Achado principal (corrige expectativa do briefing)

A ficha **"Plano de tratamento" deste app NÃO é um planejador estruturado de sessões.** É um
bloco de **5 campos de texto livre (TipTap/ProseMirror)**. Verificado exaustivamente — **não existe**
nenhum dos elementos abaixo nesta ficha (nem em qualquer ficha do prontuário):

- ❌ Adicionar procedimento/sessão ao plano com **sequência, nº de sessões, intervalo**.
- ❌ **Status por sessão** (pendente/realizada), datas previstas, progresso **X de Y sessões**.
- ❌ **Gerar agendamentos** / agendar sessões direto do plano.
- ❌ Vínculo direto plano ↔ orçamento ou plano ↔ agenda.
- ❌ Botões "Imprimir", "Gerar", "PDF", "Recibo", "Receita" na ficha.

A "conduta" é digitada como prosa nos 5 editores. O sequenciamento de sessões, se houver, fica a
critério do que o profissional **escrever** no campo *Planejamento* — não há mecânica de dados.

Onde mora o que o briefing esperava neste produto (módulos **separados**, não a ficha):
- **Itens/procedimentos + valores** → ficha **Orçamento** (linha de itens, qtd, valor) — ver `prontuario-ficha-orcamento.md`.
- **Agendamento de sessões** → módulo **Agenda** (sidebar global), desacoplado do prontuário.

## Campos (verificado) — todos rich-text TipTap

| # | Campo (título da seção) | Tipo | Posição | Notas |
|---|---|---|---|---|
| 1 | **Plano de tratamento** | rich-text (TipTap) | topo | conduta geral |
| 2 | **Exames laboratoriais** | rich-text (TipTap) | abaixo | solicitação de exames |
| 3 | **Planejamento** | rich-text (TipTap) | meio | cronograma/sessões **em texto livre** |
| 4 | **Prescrição** | rich-text (TipTap) | abaixo | medicamentos/produtos |
| 5 | **Cuidados e home care** | rich-text (TipTap) | rodapé | orientações ao paciente |

Cada editor é uma `div.tiptap.ProseMirror.eui-input-editor-cont` (`contenteditable=true`).

### Barra de ferramentas (idêntica nos 5 editores)
15 controles, da esquerda p/ direita: **Negrito · Itálico · Sublinhado · Tachado · Cor da fonte (A) ·
Marca-texto · Alinhar à esquerda · Centralizar · Alinhar à direita · Justificar · Lista com marcadores ·
Lista numerada · Limpar formatação (Tᵪ) · Desfazer · Refazer.**

### Transcrição por áudio (IA)
Existe um modal de transcrição no DOM ("Inicie a Transcrição", "Habilitar gravação de áudio",
"Identificar locutores", "Iniciar gravação") — recurso de ditar a conduta por voz e transcrever para
o editor. Não acionado neste teste (evita captura de áudio), mas presente.

## Fluxo verificado (exercitado de verdade)

1. Sidebar → **Plano de tratamento** → abrem os 5 editores vazios (`prontuario-plano-01-inicial.png`).
2. Cliquei no 1º editor e digitei: `[DOC-TESTE] Plano: 3 sessoes de limpeza de pele, intervalo 15 dias entre sessoes.`
3. Cliquei no editor **Planejamento** (3º) e digitei: `[DOC-TESTE] Planejamento: Sessao 1 hoje; Sessao 2 +15d; Sessao 3 +30d.` (`prontuario-plano-02-preenchido.png`).
4. **Salvar = autosave.** Não há botão "Salvar" — só **Cancelar** e **Finalizar atendimento** no rodapé.
   Verifiquei a persistência: naveguei para **Anamnese** e voltei para **Plano de tratamento** → o texto
   dos dois editores **permaneceu**. Confirmado: salva sozinho ao editar/sair do campo.
5. **Indicador de preenchimento:** fichas com conteúdo ganham um **ponto azul** no item da sidebar
   (apareceu em "Plano de tratamento" e "Orçamento" depois que digitei). Bom sinal visual de "ficha tem dados".
6. NÃO finalizei o atendimento (botão "Finalizar atendimento" intocado). Nenhuma cobrança/envio disparado.

### Vínculo orçamento (ficha vizinha, para contexto) — `prontuario-plano-03-orcamento-vinculo.png`
A ficha **Orçamento** (item logo acima na sidebar) é o lugar estruturado: **Pacote** (select),
linhas de **Nome (procedimento/produto, busca-select) · Quantidade · Valor unit. · Desc. unit. · Total**,
botão **"+ Adicionar procedimento/produto"**, **Desconto**, **Condições de pagamento**
("+ Adicionar condição") e **Valor total** (Subtotal/Desconto/Total). A coluna *Quantidade* poderia
representar nº de sessões, mas **não há agendamento nem status por sessão** ali. Detalhe completo em
`prontuario-ficha-orcamento.md`. Não há botão que ligue este orçamento ao texto do Plano.

## Registros [DOC-TESTE] criados
- Editor **Plano de tratamento**: texto `[DOC-TESTE] Plano: 3 sessoes de limpeza de pele, intervalo 15 dias entre sessoes.`
- Editor **Planejamento**: texto `[DOC-TESTE] Planejamento: Sessao 1 hoje; Sessao 2 +15d; Sessao 3 +30d.`
- Ambos persistidos por autosave na ficha `[DOC-TESTE] Ficha 001`.

## Observações para o Artemise (oportunidade de produto)

O concorrente trata "plano de tratamento" como **prosa**. Isso é uma **lacuna clara** e uma chance de
diferenciação: transformar o plano em **dado estruturado e acionável**.

**Modelo de dados sugerido (Artemise):**

```
PlanoTratamento (1 por atendimento/ficha)
├── conduta_geral: rich-text        # equivalente ao campo livre deles
├── exames: rich-text               # solicitação de exames
├── prescricao: rich-text           # ou estruturar como itens de receita
├── home_care: rich-text            # orientações pós (alimenta automação)
└── itens_plano: ItemPlano[]        # ← o diferencial estruturado
     ItemPlano
     ├── procedimento_id (catálogo)         # link ao serviço/orçamento
     ├── n_sessoes: int                     # ex.: 3
     ├── intervalo_dias: int                # ex.: 15
     ├── orcamento_item_id?                  # vínculo financeiro 1:1
     └── sessoes: Sessao[]                   # geradas a partir de n_sessoes
          Sessao
          ├── ordem: int                     # 1..N
          ├── data_prevista: date            # calculada do intervalo
          ├── status: enum(pendente|realizada|cancelada)
          ├── agendamento_id?                # link p/ Agenda (1 clique → agenda)
          └── data_realizada?: date
```

Funcionalidades que o concorrente **não tem** e o Artemise deveria entregar:
- **Sequenciador de sessões:** definir nº de sessões + intervalo → o sistema **gera as N sessões**
  com datas previstas e status `pendente`.
- **Progresso X de Y** (ex.: "1 de 3 sessões realizadas") + barra de evolução no plano.
- **"Gerar agendamentos"**: botão que cria os eventos na Agenda a partir das datas previstas (hoje é manual e em módulo separado).
- **Vínculo plano ↔ orçamento ↔ agenda** num único fluxo (no concorrente são 3 ilhas: texto, orçamento, agenda).
- Manter o que eles têm de bom: **rich-text com transcrição por áudio (IA)** e **autosave** (sem botão salvar).
- **Home care** dedicado para alimentar lembretes/automação pós-consulta (eles já separam — vale manter).
