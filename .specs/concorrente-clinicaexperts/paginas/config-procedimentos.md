# Configurações — Procedimentos (Serviços)

**Rota:** `/configuracoes/procedimentos` · form: `/configuracoes/procedimentos/novo`  ·  **Tipo:** Listagem + form modal  ·  **Screenshots:** `config-procedimentos.png`, `config-procedimentos-form.png`, `config-procedimentos-form2.png`

## Propósito

Catálogo de **procedimentos/serviços** vendáveis e agendáveis da clínica. Cada procedimento define preço, duração, custo, cor na agenda, materiais consumidos do estoque e categoria. É a entidade-base usada em agendamentos, atendimentos, comandas e vendas.

## Listagem

- Cabeçalho: **Procedimentos** + contador (`N registros`) + **Exportar ▾**.
- **Adicionar filtro** (+) e **Buscar**.
- Colunas: **Nome** · **Categoria** · **Duração** (min) · **Valor** (R$) · **Ativo** (toggle inline) · menu **⋮** por linha · engrenagem (config de colunas).
- Ordenável por coluna (setas ◆).
- Paginação: "25 por página" + `« ‹ 1 › »`.
- **FAB (+)** inferior direito → ação única **"Novo procedimento"** (abre rota `/novo`).
- Dados existentes (exemplo): Anamnese R$250 / Atendimento R$200 / Avaliação R$150 / Reconsulta R$200 — todos 60 min, sem categoria.

## Form: Novo Procedimento

> Rota: `/configuracoes/procedimentos/novo` (modal). **Validação:** obrigatórios reais = **Nome** e **Cor**. Sem Cor, toast "Campo obrigatório" e borda vermelha no campo.

### Dados principais
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| Nome | text | ✅ | ph "Digite" |
| Valor de venda | moeda R$ + select tipo | — | tipo = **Fixo** (provável: Fixo / Variável / por profissional) |
| Custo adicional | moeda R$ | — | tem tooltip (?) — custo extra além dos materiais; alimenta comissão (ver Preferências) |
| Cor | select | ✅ | swatches: Cinza, Laranja, Amarelo, Limão, Verde, Turquesa, Azul céu, … (cor na agenda) |
| Duração | number (minutos) | — | default "0 minutos" |
| Tempo de reconsulta | number (dias) | — | janela p/ retorno/reconsulta |
| Categoria | search/select | — | "Pesquise/Selecione" + link **+ Adicionar** (cria categoria inline) |
| Ativo | toggle | — | default ligado; tooltip (?) |

### Materiais de atendimento (seção)
- **Adicionar material**: search/select de itens de estoque consumidos no procedimento (repetível).
- **Custo total**: R$ calculado automaticamente a partir dos materiais (+ custo adicional). Read-only.

### Informações Adicionais (colapsável)
- **Descrição para o CliniSite** (textarea) — texto exibido no site público/agendamento online (CliniSite).

**Botão Salvar.** ✅ Teste criado: **`[DOC-TESTE] Procedimento 001`** (Nome + Cor Verde + Valor R$100 + Duração 30 min) → toast "Procedimento salvo! Novo procedimento adicionado com sucesso." e volta à listagem.

## Observações para o Artemise

- **Procedimento = serviço unificado**: preço + duração + cor de agenda + materiais (BOM) + categoria num só cadastro. A "Cor" obrigatória amarra o serviço à visualização da agenda — decisão de produto interessante (consistência visual forçada).
- **Materiais de atendimento** ligam serviço ao estoque com **Custo total auto-calculado** → permite margem/comissão precisa por procedimento. Vale modelar (procedimento N:N insumo com quantidade).
- **Custo adicional** + materiais alimentam regras de comissão definidas globalmente em Preferências (clínica/profissional/proporcional) — comissão NÃO fica no cadastro do procedimento, é regra global. Simplifica manutenção.
- **Tempo de reconsulta** habilita lógica de retorno/cortesia (reconsulta gratuita dentro de N dias) — feature de fidelização clínica.
- **Descrição para CliniSite** mostra integração com agendamento online público — separar copy de marketing do nome interno.
- Valor de venda com tipo ("Fixo") sugere suporte a preço variável/por profissional — relevante p/ clínicas com tabelas diferentes por especialista.
