# Configurações — Dados da clínica

**Rota:** `/configuracoes/dados-da-clinica`  ·  **Tipo:** Form de cadastro único (dados da empresa)  ·  **Screenshot:** `config-dados-clinica.png`

> ⚠️ Página com dados reais da clínica. NÃO alterado/salvo (regra de segurança). Documentado read-only. A página tem **guard de saída** (dialog "deseja sair?" beforeunload) ao navegar com edição pendente.

## Propósito

Cadastro fiscal/cadastral da empresa (clínica): identificação jurídica, logo, contatos e endereços comercial e de cobrança. Usado em documentos, notas fiscais, impressões e cobrança.

## Form (seções)

### Identificação
- Toggle **Física / Jurídica** (tipo de pessoa).
| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| CNPJ | tel mask | ✅ | (alterna p/ CPF se Física) |
| Nome fantasia | text | ✅ | |
| Razão social | text | ✅ | |
| Logo | file (JPG/PNG/JPEG) | — | botão "Escolher foto" |

### Endereço e contato comercial
| Campo | Tipo | Obrig. |
|---|---|---|
| Telefone | tel (99) 9999-9999 | ✅ |
| (telefone secundário/celular) | tel | — |
| E-mail | email | ✅ |
| País | select | ✅ |
| Código postal (CEP) | text 00000-000 | ✅ |
| Estado | select | ✅ |
| Cidade | select | ✅ |
| Bairro | text | ✅ |
| Rua | text | ✅ |
| Número | text | ✅ |
| Complemento | text | — |

### Endereço e contato de cobrança
- Checkbox **"Igual ao endereço comercial"** (copia os dados acima).
- Mesmos campos da seção comercial: Telefone* (celular (99) 99999-9999), E-mail*, País*, CEP*, Estado*, Cidade*, Bairro*, Rua*, Número*, Complemento.

**Botão Salvar** (rodapé; NÃO acionado).

## Observações para o Artemise

- Separar **endereço comercial** de **endereço de cobrança** com atalho "igual ao comercial" é boa prática para emissão fiscal/cobrança (faturamento pode ter endereço distinto).
- Toggle Física/Jurídica troca documento (CPF/CNPJ) — clínica pode ser autônomo (CPF) ou empresa (CNPJ). Modelar `tipo_pessoa` no cadastro da org.
- Endereço com cascata País→Estado→Cidade por select + CEP auto-preenche (padrão do app, visto também em Contatos).
- **Guard de navegação** (beforeunload) protege contra perda de edição — útil em forms longos; atenção ao automatizar (precisa dialog-accept).
