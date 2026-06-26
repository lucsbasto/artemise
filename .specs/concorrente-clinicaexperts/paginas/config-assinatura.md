# Configurações — Assinatura (Planos / Billing)

**Rotas:** `/configuracoes/assinatura` (status) → `/planos` (seleção de plano)  ·  **Tipo:** Status de assinatura + pricing  ·  **Screenshots:** `config-assinatura.png`, `config-assinatura-planos.png`

> ⚠️ Página de cobrança real. NÃO acionei "Assinar agora" / "Solicitar" (compra). Apenas visualizei os planos.

## Estado atual (trial)

- **Período gratuito** — "Você ainda possui 6 dias de uso grátis." + botão **"Escolha seu plano"** → `/planos`.

## Página de Planos (`/planos`)

- Toggle de cobrança **Mensal / Anual** ("Opte pelos planos anuais e pague menos"). Mensais canceláveis a qualquer momento.
- 4 tiers + add-on **Secretária virtual** (botão "Adicionar secretária virtual" em cada plano). WhatsApp via **API oficial da Meta** (janelas entre R$ 0,08 e R$ 0,40).

### Tabela de planos (preço anual parcelado 12x)

| Plano | Tagline | Preço (12x) | Anual | Economia | Usuários | Destaque |
|---|---|---|---|---|---|---|
| **Basic** | Comece sem complicação | R$ 149,90/mês | R$ 1.798/ano | R$ 590 | 1 | "Para começar" |
| **Essencial** | As ferramentas certas para crescer | R$ 249,00/mês | R$ 2.988/ano | R$ 1.200 | até 3 | "Custo-benefício" / Mais vendido |
| **Avançado** | Eficiência e automatização | R$ 399,00/mês | R$ 4.788/ano | R$ 1.200 | até 10 | "Mais vendido" |
| **Experts** | Próximo nível / grandes operações | **Sob orçamento** ("Solicitar") | — | — | ilimitados | "Recomendado" · Secretária virtual inclusa |

### Features por tier (incremental)

**Basic** (1 usuário): Agenda inteligente · Prontuário Digital · Contatos · Avisos automáticos · Anna Assistant (IA) · Financeiro Básico · 2 GB de armazenamento.

**Essencial** (até 3): *Tudo do Basic +* Agenda Online · Assinatura Digital · Financeiro completo · 5 GB · Notificações via API oficial Meta.

**Avançado** (até 10): *Tudo do Essencial +* Vendas · Estoque · Comissões · 10 GB.

**Experts** (ilimitados): *Tudo do Avançado +* CliniCRM · Emissão de NF · CliniChat Premium · 25 GB · Secretária virtual inclusa.

- CTA por plano: **Assinar agora** (Basic/Essencial/Avançado) · **Solicitar** (Experts). "Falar com um especialista agora" para dúvidas.

## Observações para o Artemise

- **Pricing do concorrente (referência de mercado BR, jun/2026):** entrada R$ 149,90/mês (1 usuário) escalando a R$ 399/mês (10 usuários), com enterprise sob consulta. Ancoragem útil para posicionar o Artemise.
- **Empacotamento por feature-flag + nº de usuários**: as features de Vendas/Estoque/Comissões (que vimos como toggles em Preferências) são gated por plano (Avançado+). Confirma estratégia "mesma base, planos diferentes" — o produto é modular e a monetização é por habilitar módulos.
- **Add-on "Secretária virtual"** e **WhatsApp pay-per-message** (API Meta, R$0,08–0,40/janela) = receita recorrente + consumo. Modelo híbrido SaaS + usage-based.
- Armazenamento escalonado (2→5→10→25 GB) como alavanca de upgrade.
- Anna Assistant (IA) já no plano de entrada — IA como feature de aquisição, não premium.
- Desconto anual fixo (~R$1.200 nos tiers médios) e parcelamento 12x reduzem barreira de entrada.
