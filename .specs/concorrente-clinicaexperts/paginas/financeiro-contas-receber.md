# Financeiro — Contas a receber

**Rota:** `/financeiro/contas-a-receber?interval=<ini>&interval=<fim>`
**Tipo:** Listagem (tabela) + form/modal de criação + painel de detalhe
**Screenshot:** `financeiro-contas-receber.png` · form: `financeiro-nova-receita.png` · detalhe: `financeiro-titulo-detalhe.png`

## Propósito
Gestão de títulos a receber (receitas). Lista parcelas/títulos com situação de recebimento, KPIs do período e criação de receitas.

## Listagem
- Cabeçalho: **Contas a receber** + contador (`N registros`) · **Ações em lote ▾** · **Exportar ▾** (exporta "Financeiro").
- Filtros: chip **Período de liquidação** (range de datas) · **Adicionar filtro** (+) · campo **Buscar**.
- KPIs (clicáveis, filtram a lista por `status`): **Vencidos** · **Vencem hoje** · **A vencer** · **A receber** · **Recebidos** · **Total do período** (aba ativa).
- Colunas: checkbox · **Vencimento** · **Recebimento** (com ícone de relógio se pendente/atrasado) · **Descrição** · **Categoria** · **Método** (ícone: PIX/cartão/boleto) · **Situação** (badge: `Recebido` verde · `Em atraso` vermelho · `Em aberto` amarelo) · **Valor líquido (R$)** · menu **⋮** por linha · engrenagem (config de colunas). Cada coluna é ordenável (ícone sort).
- Marcador de barra vermelha à esquerda da linha = título em atraso.
- Paginação: "25 por página" + `« ‹ › »`.
- **FAB (+)** inferior direito → **Nova receita**.

### Ações por linha (⋮) / painel de detalhe
Ao abrir um título (mode `info`): **Imprimir** · **Excluir** · **Editar**; e por parcela, ícone **$ (Receber/Liquidar)** + **⋮**. *(NÃO acionado — operação de liquidação financeira.)*

## Form: Nova receita
> Deep-link: `?fin_modal_type=bill&fin_modal_mode=new&type_title=inflow`
> Edição/detalhe: `&fin_modal_mode=info&title_id=<id>`

### Dados do título
| Campo | Tipo | Obrig. | Opções / Notas |
|---|---|---|---|
| Valor | tel (moeda R$) | ✅ | mínimo R$ 0,01; campo **mascarado** (precisa input real, não só set de value) |
| Data de competência | date | ✅ | default hoje |
| Contato | select busca | ✅ (de fato opcional p/ receita — auto-preenche descrição) | "Pesquise/Selecione"; link **+ adicionar** cria contato inline |
| Categoria | select busca | ✅ | default **Receitas de serviços**; ver lista completa abaixo |
| Descrição | text | ✅ | default "Título a receber [de <contato>]" |
| Observações | textarea | — | sob **Mostrar mais opções** |
| Anexos | file (multi) | — | JPG, JPEG, PNG, WEBP, HEIC, HEIF, JFIF, PDF, TXT, DOC, DOCX, XLS, XLSX, OGG, MP4, MOV — < 20,97 MB; drag-and-drop |

### Desconto (seção colapsável — "Sem desconto ou uso de saldo")
- Permite aplicar **Desconto** e **Uso de saldo**; tipo de valor **R$** ou **%**.

### Recorrência (seção colapsável — "Não se repete")
Opções: `Não se repete` · `A cada dia` · `A cada semana` · `A cada duas semanas` · `A cada mês` · `A cada bimestre` · `A cada trimestre` · `A cada quadrimestre` · `A cada semestre` · `A cada ano` · `Personalizada`.

### Recebimento (forma(s) de pagamento — repetível)
| Campo | Tipo | Obrig. | Opções |
|---|---|---|---|
| Valor | tel (moeda) | ✅ | mín R$ 0,01 |
| Método | select | ✅ | `PIX` · `Máquina de cartão` · `Outras bandeiras` · `Mais métodos` · `Boleto` · `Depósito` · `Dinheiro` · `Transferência` |
| Conta | select | ✅ | conta financeira destino (ex.: Banco padrão, Caixa) |
| Vencimento | date | ✅ | default hoje |
| Parcelamento | select | ✅ | `À vista` · `2x`…`12x` |
- Links: **+ Adicionar forma de pagamento** (múltiplos métodos) · **Editar parcelas** (editar parcelas individualmente) · ícone lixeira (remover linha).
- Rodapé: **Valor total** (soma) + **Salvar**.

### Categorias disponíveis (compartilhadas receita/despesa)
Receitas de serviços · 13º salário · Adiantamentos de terceiros · Adiantamentos salariais · Água e saneamento · Aluguel · Alvará de funcionamento · Benefícios · Brindes para clientes · Cancelamentos · COFINS sobre vendas · Combustíveis · Comissões de profissionais · Comissões de vendedores · Compras de materiais de atendimento · Compras de produtos para revenda · Computadores e Periféricos · Condomínio · Confraternizações · Contribuição sindical · Convênios · CSLL · Cursos e treinamentos · Custo das mercadorias vendidas · Custo dos serviços prestados · Descontos concedidos · Descontos recebidos · Despesas a identificar · Edifícios e Construções · Empréstimos e Financiamentos · Energia elétrica · Estacionamento · Férias · FGTS e multa de FGTS · Frete/Transporte · Gratificações · Honorários advocatícios · Honorários consultoria · Honorários contábeis · ICMS sobre vendas · Impostos sobre aplicações · INSS sobre salários - GPS · Internet · IPTU · IPVA / DPVAT / Licenciamento · IRPJ · IRRF s/ salários - DARF 0561 · ISS sobre faturamento · Juros e multas pagos · Juros e multas recebidos · Juros pagos · Limpeza · Máquinas e Equipamentos · Materiais de escritório · Outras despesas · Outras despesas com veículos · Outras receitas · Outros impostos sobre vendas · PIS sobre venda · Pró-labore · Publicidade/Marketing · Receitas a identificar · Receitas de vendas · Rendimentos de aplicações · Rescisões · Salários · Seguro de imóveis · Seguros de veículos · Serviços de Terceiros · Sistemas e ferramentas · Tarifas · Telefone · Terrenos · Transferências · Uniformes · Vale-Alimentação · Vale-Transporte · Veículos.

## Painel "Detalhes da receita" (mode=info)
Cabeçalho: Valor · Data de competência · Contato (avatar). Categoria · Descrição · Parcelamento.
Tabela **Recebimento**: Parc. (1/1) · Método · Conta · Valor (R$) · Recebido (R$) · Em aberto (R$) · Vencimento · Recebim. · Situação (`Em aberto`) · Ações (**$ liquidar**, ⋮). Subtotal.
Breakdown por parcela: **Uso de saldo · Desconto · Juros · Multa · Tarifas** (colunas: Valor recebido / Valor a receber / Valor em aberto).
Rodapé: **Imprimir · Excluir · Editar**.

## Fluxos / teste
**[DOC-TESTE] Receita 001** criado (title_id `12666193`): Valor R$ 200,00 · Categoria Receitas de serviços · Contato Clara Ribeiro · Método PIX · Conta Banco padrão · Vencimento 25/06/2026 · À vista. Validações capturadas: "**Valor mínimo R$ 0,01**" no Valor do título e no Valor do recebimento (ambos obrigatórios). Campos de moeda são mascarados — exigem digitação real (key events) para o v-model registrar.

## Observações para o Artemise
- Separação clara entre **competência** (data do fato gerador) e **vencimento/recebimento** (regime de caixa) — essencial p/ DRE correto.
- Um título pode ter **múltiplas formas de pagamento** + **parcelamento** independentes — modelo flexível de recebimento.
- Recorrência rica (10 presets + personalizada) cobre mensalidades/assinaturas.
- Ícone de método na coluna dá leitura visual rápida (PIX vs. cartão vs. boleto).
- KPIs como links pré-filtrados (`status=`) = navegação financeira muito fluida.
