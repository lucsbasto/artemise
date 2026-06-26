# Financeiro — DRE (Demonstrativo de Resultado do Exercício)

**Rota:** `/financeiro/dre`
**Tipo:** Relatório (matriz read-only)
**Screenshot:** `financeiro-dre.png`

## Propósito
DRE Gerencial: demonstrativo de resultado por **categoria × mês**, no formato contábil de margens em cascata. Somente leitura (sem criação/edição).

## Layout
- Título **DRE - Demonstrativo de Resultado do Exercício Gerencial**.
- Seletor de **ano** com setas `‹ 2026 ›`.
- Tabela: 1ª coluna **Categorias** (linhas); colunas **Janeiro … Dezembro** (12 meses). Valores em R$ por célula (R$ 0,00 quando sem movimento).
- Linhas em azul = grupos/subtotais; linhas com `=` = resultados calculados; linhas comuns = detalhe.

## Estrutura de linhas (ordem, top-down)
1. **Receitas operacionais** *(grupo)*
   - Receitas de vendas de produtos e serviços
   - **= Receita bruta de vendas**
2. **Deduções da receita bruta** *(grupo)*
   - Impostos sobre vendas
   - Comissões sobre vendas
   - Descontos incondicionais
   - Devoluções de vendas
   - **= Receita líquida de vendas**
3. **Custos operacionais** *(grupo)*
   - Custo das mercadorias vendidas
   - Custo dos serviços prestados
   - **= Lucro bruto**
4. **Despesas operacionais** *(grupo)*
   - Despesas comerciais
   - Despesas administrativas
   - **= Lucro / Prejuízo operacional**

*(continua abaixo com despesas/receitas financeiras e resultado líquido — mesmo padrão de cascata.)*

## Observações para o Artemise
- DRE pronto **gerencial** (não fiscal) já agrega receitas/despesas pelas categorias do plano de contas — forte argumento de venda para clínicas que hoje usam planilha.
- Visão **mensal anualizada** (12 colunas) facilita comparação de tendência sem precisar gerar 12 relatórios.
- As categorias do form de receita/despesa mapeiam diretamente nas linhas do DRE (ex.: "Comissões sobre vendas", "ISS sobre faturamento") — a taxonomia de categorias É a estrutura do DRE. Replicar isso exige planejar o plano de contas desde o cadastro de lançamento.
- Não há exportação/print visível nesta tela nem drill-down por célula (oportunidade).
