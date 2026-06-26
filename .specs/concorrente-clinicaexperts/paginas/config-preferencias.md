# Configurações — Preferências do sistema

**Rota:** `/configuracoes/preferencias-do-sistema`  ·  **Tipo:** Form de settings global (1 página, N seções)  ·  **Screenshot:** `_config_menu.png`, `_config_main.png`

## Propósito

Painel central de preferências da clínica. Define defaults globais para todos os módulos (financeiro, agenda, atendimentos, comissões, estoque, vendas, etc.). Cada linha é um setting com **label + descrição + (Padrão: X)** e um controle (toggle, select, input ou botão "Configurar" que abre um sub-modal). Salvar/Cancelar fixos no rodapé.

## Menu lateral de Configurações (sub-sidebar, 11 itens)

Expansível pelo botão `sub-sidebar-toggle` (seta no canto inferior esquerdo). Itens:
1. **Preferências do sistema** — `/configuracoes/preferencias-do-sistema`
2. **Dados da clínica** — `/configuracoes/dados-da-clinica`
3. **Assinatura** — `/configuracoes/assinatura`
4. **Procedimentos** — `/configuracoes/procedimentos`
5. **Categorias de procedimentos** — `/configuracoes/categorias-de-procedimentos`
6. **Pacotes** — `/configuracoes/pacotes`
7. **Salas de atendimento** — `/configuracoes/salas-de-atendimento`
8. **Fichas de atendimentos** — `/configuracoes/fichas-de-atendimentos/`
9. **Modelos de atestados e prescrições** — `/configuracoes/modelos-de-atestados-e-prescricoes`
10. **Etiquetas** — `/configuracoes/etiquetas`
11. **Horários de funcionamento** — `/configuracoes/horarios-de-funcionamento`

> NÃO há item de menu separado para Usuários/Equipe, Perfis/Permissões, Formas de pagamento, Categorias financeiras ou Integrações dentro de Configurações. Usuários/permissões ficam sob **Dados da clínica** (abas) e categorias/contas/formas de pagamento ficam no módulo **Financeiro**. Lembretes/automações ficam embutidos aqui (botões "Configurar") e no módulo **Marketing**.

## Seções e settings

### Geral
| Setting | Controle | Padrão |
|---|---|---|
| Fuso horário | select | (GMT-03:00) São Paulo |
| Moeda | select | BRL - R$ |

### Financeiro
| Setting | Controle | Padrão |
|---|---|---|
| Ocultar dados financeiros (esconde infos da página inicial) | toggle | Desabilitado |
| Usar DRE (habilita categorias do DRE) | toggle | Desabilitado |
| Usar abertura de caixa | toggle | Desabilitado |
| Mostrar apenas movimentações de Dinheiro no caixa | toggle | Desabilitado |
| Conciliação bancária | toggle | Desabilitado |
| Categoria de receitas | select | Receitas de serviços |
| Método de receitas | select | Dinheiro (atual: PIX) |
| Método de despesas | select | Dinheiro (atual: PIX) |
| Conta de receitas | select | Banco padrão |
| Conta de despesas | select | Banco padrão |
| Categoria de transferências | select | Transferências |
| Categoria de taxas da máquina de cartão | select | Tarifas |
| Categoria de descontos em contas a receber | select | Descontos concedidos |
| Categoria de descontos em contas a pagar | select | Descontos recebidos |
| Categoria de juros e multas em contas a pagar | select | Juros e multas pagos |
| Categoria de juros e multas em contas a receber | select | Juros e multas recebidos |
| Categoria de comissões | select | Comissões de profissionais |
| Categoria de sangria | select | Receitas a identificar |
| Categoria de suprimento | select | Adiantamentos de terceiros |
| Transferir taxa para paciente (taxa cobrada direto do paciente) | toggle | Desabilitado |

### Agenda
| Setting | Controle | Padrão |
|---|---|---|
| Concluir agendamentos automaticamente | toggle | Habilitado |
| Agendamentos apenas para Profissionais | toggle | Desabilitado |
| Criar comanda automaticamente | toggle | Desabilitado |
| Habilitar convênios | toggle | Desabilitado |
| Habilitar lista de espera | toggle | Desabilitado |
| Habilitar sala de espera (status "aguardando" → sala de espera) | toggle | Desabilitado |
| Mostrar apenas horários de funcionamento | toggle | Desabilitado |
| Apenas o profissional inicia o agendamento | toggle | Desabilitado |
| Bloquear horários em feriados nacionais | toggle | Desabilitado |
| Intervalo de tempo da agenda | select | 30 minutos |
| Cor do agendamento | select | Profissional |
| Primeiro dia da semana | select | Domingo |
| Lembrete de agendamento | botão "Configurar" | — |
| Lembrete de bloqueio de horário | botão "Configurar" | — |
| Lembrete de lembrete | botão "Configurar" | — |
| Aviso de agendamento criado | botão "Configurar" | — |
| Aviso de agendamento alterado | botão "Configurar" | — |
| Aviso de agendamento cancelado | botão "Configurar" | — |
| Aviso de agendamento confirmado | botão "Configurar" | — |

### Atendimentos
| Setting | Controle | Padrão |
|---|---|---|
| Permitir criar atendimentos rascunhos (auto-save) | toggle | Desabilitado |
| Habilitar CID | toggle | Desabilitado |
| Restringir acesso a prontuários (só o profissional que atendeu) | toggle | Habilitado |
| Código CNES (Cadastro Nacional de Estabelecimentos de Saúde) | input | Vazio |
| Habilitar orçamentos no odontograma | toggle | Habilitado |

### Contatos
| Setting | Controle |
|---|---|
| Campos de cadastro obrigatório (define campos obrigatórios no cadastro de pacientes) | botão "Configurar" |
| Campos personalizados (custom fields no cadastro de contato) | botão "Configurar" |

### Impressão
| Setting | Controle |
|---|---|
| Modelo de impressão (estilo usado em impressões) | botão "Configurar" |

### Comissões
| Setting | Controle | Padrão |
|---|---|---|
| Comissionar atendimentos | toggle | Habilitado |
| Comissionar vendas | toggle | Habilitado |
| Forma de disponibilidade (no ato da venda / finalização da comanda / conforme recebimento) | botão "Configurar" | — |
| Material de atendimento (comportamento do custo de materiais) | botão "Configurar" | — |
| Taxas de pagamentos (clínica / profissional / proporcional) | botão "Configurar" | — |
| Custo adicional de serviços (clínica / profissional / proporcional) | botão "Configurar" | — |

### Orçamentos
| Setting | Controle | Padrão |
|---|---|---|
| Vencimento de orçamentos | input (dias) | 30 dias |
| Observação de orçamentos (texto padrão em novos orçamentos) | botão "Configurar" | — |

### Estoque
| Setting | Controle | Padrão |
|---|---|---|
| Permitir estoque negativo | toggle | Desabilitado |
| Controlar lotes e validades | toggle | Desabilitado |
| Controlar patrimônio | toggle | Desabilitado |
| Controlar Composição/Kit | toggle | Desabilitado |
| Controlar Materiais de Expediente | toggle | Desabilitado |

### Segurança
| Setting | Controle |
|---|---|
| Exigir autenticação de dois fatores (2FA p/ todos os profissionais) | toggle |

### Vendas
| Setting | Controle | Padrão |
|---|---|---|
| Forma de disponibilização de créditos, saldos e cashback (criação da venda / após pagamento) | select | Pagamento |
| Gerar cashback em vendas | toggle | Desabilitado |
| Valor padrão de cashback para produtos | input % | — |
| Valor padrão de cashback para procedimentos | input % | — |
| Valor padrão de cashback para venda de crédito (saldo) | input % | — |
| Validade do cashback (0 = nunca expira) | input minutos | 0 |

### Notificações
| Setting | Controle | Padrão |
|---|---|---|
| Envio de mensagens pelo WhatsApp (WhatsApp Web / Aplicativo) | select | Aplicativo |

## Observações para o Artemise

- **Settings-as-defaults**: cada preferência tem descrição + valor padrão explícito inline — ótimo padrão de UX para discoverability. Vale replicar o formato "label + descrição cinza + (Padrão: X)".
- Forte acoplamento financeiro: ~15 settings só mapeiam categorias/contas/métodos padrão para automatizar lançamentos (receita, despesa, taxa de cartão, juros, descontos, comissão, sangria, suprimento). Mostra o quanto o financeiro é granular.
- **Feature flags por toggle**: convênios, lista de espera, sala de espera, CID, DRE, abertura de caixa, lotes/validade, patrimônio, kit — tudo é opt-in. Permite vender a mesma base para clínicas simples e complexas.
- Cashback/carteira do cliente como mecanismo de fidelização nativo (valor % por produto/procedimento/crédito + validade).
- Botões "Configurar" abrem sub-modais para settings compostos (lembretes, campos obrigatórios, custom fields, modelo de impressão, regras de comissão) — modelo de "setting que vira wizard".
- 2FA opcional, restrição de prontuário por profissional = preocupações de compliance/LGPD relevantes para saúde.
