import Link from "next/link";
import {
  Sparkles,
  PlayCircle,
  Stethoscope,
  Wallet,
  BarChart3,
  CalendarDays,
  UserRound,
  Receipt,
  Package,
  MessageCircle,
  Syringe,
  Check,
  Quote,
} from "lucide-react";

const MODULES = [
  { icon: CalendarDays, title: "Agenda inteligente", desc: "Calendário por profissional, bloqueios, lembretes e sala de espera em tempo real." },
  { icon: UserRound, title: "Ficha do paciente", desc: "Linha do tempo, carteira, pacotes/créditos, orçamentos e financeiro num só lugar." },
  { icon: Receipt, title: "Financeiro completo", desc: "Extrato, competência, categorias, contas e comissões — relatórios prontos." },
  { icon: Package, title: "Estoque", desc: "Itens, giro, contagem e itens abertos. Nunca mais perca injetável vencendo." },
  { icon: MessageCircle, title: "Comunicação", desc: "Canais de atendimento e modelos de mensagem com automações de WhatsApp." },
  { icon: Syringe, title: "Mapa de injetáveis", desc: "Registro visual de aplicações por região, lote e profissional. Rastreabilidade total." },
];

const PILLARS = [
  { icon: Stethoscope, title: "Operação clínica", desc: "Agenda semanal, sala de espera, prontuário, fichas de atendimento, atestados e prescrições — tudo na ficha do paciente." },
  { icon: Wallet, title: "Financeiro", desc: "Contas a pagar e receber, fluxo de caixa, orçamentos, comissões e métodos de pagamento. Saiba a saúde do caixa em tempo real." },
  { icon: BarChart3, title: "Gestão", desc: "Controle de estoque com giro e contagem, automação de WhatsApp e e-mail, cadastros de procedimentos, pacotes e profissionais." },
];

const FAQ = [
  { q: "Preciso migrar meus dados manualmente?", a: "Não. Nossa equipe importa pacientes, agenda e histórico financeiro do seu sistema atual sem custo durante o onboarding." },
  { q: "Funciona no celular e tablet?", a: "Sim. O Artemise é totalmente responsivo — recepção no desktop, profissional no tablet, gestor no celular." },
  { q: "Meus dados estão seguros?", a: "Cada clínica tem seus dados isolados (multi-tenant com Row-Level Security) e backups automáticos. Conformidade com a LGPD." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade. Você pode exportar seus dados e cancelar a qualquer momento." },
];

export default function LandingPage() {
  return (
    <div className="bg-white text-foreground">
      {/* NAV */}
      <header className="glass sticky top-0 z-50 border-b border-gray-100 bg-white/80">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="#top" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
              <Sparkles className="size-4" />
            </span>
            Artemise
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a href="#recursos" className="transition hover:text-foreground">Recursos</a>
            <a href="#modulos" className="transition hover:text-foreground">Módulos</a>
            <a href="#planos" className="transition hover:text-foreground">Planos</a>
            <a href="#faq" className="transition hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-foreground transition hover:text-brand sm:inline">
              Entrar
            </Link>
            <Link href="/registrar" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-600">
              Testar grátis
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="grid-bg relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-0 h-80 bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            <span className="size-1.5 animate-pulse rounded-full bg-brand" />
            Novo · Automação de WhatsApp integrada
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Sua clínica inteira
            <br />
            <span className="text-brand">em um só sistema.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Agenda, prontuário, financeiro, estoque e comunicação. O Artemise reúne tudo que sua
            clínica de estética e saúde precisa para crescer — sem planilhas, sem retrabalho.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/registrar" className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-600 sm:w-auto">
              Começar agora — 14 dias grátis
            </Link>
            <a href="#recursos" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand sm:w-auto">
              <PlayCircle className="size-4" /> Ver como funciona
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">Sem cartão de crédito · Migração de dados inclusa</p>

          {/* mock dashboard */}
          <div className="float relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-brand/10">
              <div className="flex h-10 items-center gap-2 border-b border-gray-100 bg-gray-50 px-4">
                <span className="size-3 rounded-full bg-red-300" />
                <span className="size-3 rounded-full bg-yellow-300" />
                <span className="size-3 rounded-full bg-green-300" />
                <span className="ml-3 text-xs text-muted">app.artemise.com.br/dashboard</span>
              </div>
              <div className="grid grid-cols-12 gap-4 bg-gray-50/60 p-6">
                <div className="col-span-3 hidden flex-col gap-2 sm:flex">
                  <div className="flex h-8 items-center rounded-lg bg-brand/10 px-3 text-xs font-semibold text-brand">Início</div>
                  <div className="flex h-7 items-center rounded-lg bg-white px-3 text-xs text-muted">Agenda</div>
                  <div className="flex h-7 items-center rounded-lg bg-white px-3 text-xs text-muted">Pacientes</div>
                  <div className="flex h-7 items-center rounded-lg bg-white px-3 text-xs text-muted">Financeiro</div>
                  <div className="flex h-7 items-center rounded-lg bg-white px-3 text-xs text-muted">Estoque</div>
                </div>
                <div className="col-span-12 grid grid-cols-3 gap-3 sm:col-span-9">
                  <div className="rounded-xl border border-gray-100 bg-white p-4 text-left">
                    <p className="text-[11px] text-muted">Faturamento mês</p>
                    <p className="text-lg font-bold text-foreground">R$ 84.200</p>
                    <p className="text-[11px] font-medium text-green-600">▲ 12% vs. mês anterior</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 text-left">
                    <p className="text-[11px] text-muted">Agendamentos hoje</p>
                    <p className="text-lg font-bold text-foreground">27</p>
                    <p className="text-[11px] text-muted">4 na sala de espera</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 text-left">
                    <p className="text-[11px] text-muted">Comissões abertas</p>
                    <p className="text-lg font-bold text-foreground">R$ 6.310</p>
                    <p className="text-[11px] text-muted">8 profissionais</p>
                  </div>
                  <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-4 text-left">
                    <p className="mb-2 text-[11px] text-muted">Fluxo de caixa</p>
                    <div className="flex h-20 items-end gap-1.5">
                      {[40, 65, 50, 80, 95, 70, 55].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t bg-brand" style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.7 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted">
            Clínicas que cresceram com o Artemise
          </p>
          <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-6 opacity-60 sm:grid-cols-4">
            <span className="font-bold text-foreground">Lumière</span>
            <span className="font-bold text-foreground">Belle Derma</span>
            <span className="font-bold text-foreground">Vitalis</span>
            <span className="font-bold text-foreground">Aura Estética</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 text-center md:grid-cols-4">
          {[
            ["+40%", "menos faltas com lembretes automáticos"],
            ["5h", "economizadas por semana na recepção"],
            ["100%", "do financeiro num só painel"],
            ["2 min", "para abrir uma ficha de atendimento"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-4xl font-extrabold text-brand">{n}</p>
              <p className="mt-1 text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section id="recursos" className="border-y border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Três pilares, um só sistema</h2>
            <p className="mt-4 text-muted">Da recepção ao caixa, o Artemise conecta cada parte da operação da sua clínica.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-card border border-gray-100 bg-white p-7 transition hover:shadow-xl hover:shadow-brand/5">
                <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modulos" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tudo que sua clínica faz no dia a dia</h2>
            <p className="mt-4 text-muted">Seis módulos integrados que conversam entre si.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-card border border-gray-100 p-6 transition hover:border-brand/40">
                <Icon className="size-6 text-brand" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOMATION SPLIT */}
      <section className="border-y border-gray-100 bg-gray-50/70">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">Automação</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Menos faltas. Mais retorno.</h2>
            <p className="mt-4 text-muted">
              Confirmações, lembretes e pós-atendimento disparados automaticamente no WhatsApp. Sua
              agenda cheia sem a recepção ficar no telefone.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Lembrete 24h antes, com confirmação em um toque",
                "Aniversariantes e reativação de inativos automáticos",
                "Modelos de mensagem prontos por procedimento",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="size-5 shrink-0 text-brand" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-brand/5">
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-sm text-white">
                  Olá, Marina! 💜 Confirmando seu botox amanhã às 14h na Artemise. Posso confirmar?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm text-foreground">Confirmado! 🙌</div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-sm text-white">
                  Perfeito! Te esperamos. Qualquer coisa é só chamar 😊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Quote className="mx-auto size-10 text-brand/30" />
          <p className="mt-6 text-xl font-medium leading-relaxed sm:text-2xl">
            &ldquo;Saímos de três planilhas e dois sistemas para um só. Hoje a recepção, o financeiro
            e os profissionais olham para a mesma tela. O caixa fecha em minutos.&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand-100 font-bold text-brand">CR</div>
            <div className="text-left">
              <p className="text-sm font-bold">Camila Ribeiro</p>
              <p className="text-xs text-muted">Diretora · Clínica Lumière</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="border-y border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Planos que cabem na sua clínica</h2>
            <p className="mt-4 text-muted">Comece grátis. Pague conforme cresce. Cancele quando quiser.</p>
          </div>
          <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
            {/* Essencial */}
            <div className="rounded-card border border-gray-100 bg-white p-7">
              <h3 className="font-bold">Essencial</h3>
              <p className="mt-1 text-sm text-muted">Para clínicas começando a organizar.</p>
              <p className="mt-5"><span className="text-4xl font-extrabold">R$ 149</span><span className="text-sm text-muted">/mês</span></p>
              <Link href="/registrar" className="mt-5 block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold transition hover:border-brand hover:text-brand">Testar grátis</Link>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                {["Agenda e pacientes", "Ficha de atendimento", "Até 2 profissionais"].map((t) => (
                  <li key={t} className="flex gap-2"><Check className="size-4 text-brand" /> {t}</li>
                ))}
              </ul>
            </div>
            {/* Pro */}
            <div className="relative rounded-card border-2 border-brand bg-white p-7 shadow-xl shadow-brand/10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Mais popular</span>
              <h3 className="font-bold">Profissional</h3>
              <p className="mt-1 text-sm text-muted">Para clínicas em crescimento.</p>
              <p className="mt-5"><span className="text-4xl font-extrabold">R$ 349</span><span className="text-sm text-muted">/mês</span></p>
              <Link href="/registrar" className="mt-5 block rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white shadow shadow-brand/30 transition hover:bg-brand-600">Começar agora</Link>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                {["Tudo do Essencial", "Financeiro e estoque completos", "Automação de WhatsApp", "Profissionais ilimitados"].map((t) => (
                  <li key={t} className="flex gap-2"><Check className="size-4 text-brand" /> {t}</li>
                ))}
              </ul>
            </div>
            {/* Rede */}
            <div className="rounded-card border border-gray-100 bg-white p-7">
              <h3 className="font-bold">Rede</h3>
              <p className="mt-1 text-sm text-muted">Para redes e franquias multi-unidade.</p>
              <p className="mt-5"><span className="text-4xl font-extrabold">Sob consulta</span></p>
              <Link href="/registrar" className="mt-5 block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold transition hover:border-brand hover:text-brand">Falar com vendas</Link>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                {["Tudo do Profissional", "Multi-unidade e permissões", "Suporte dedicado e SLA"].map((t) => (
                  <li key={t} className="flex gap-2"><Check className="size-4 text-brand" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-12 divide-y divide-gray-100">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {q}
                  <span className="text-brand transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center text-white">
            <div className="grid-bg absolute inset-0 opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Pronto para organizar sua clínica?</h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-100">
                Comece em minutos. 14 dias grátis, sem cartão de crédito e com migração inclusa.
              </p>
              <Link href="/registrar" className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand-50">
                Criar minha conta grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="#top" className="flex items-center gap-2 text-lg font-extrabold">
              <span className="grid size-7 place-items-center rounded-lg bg-brand text-white"><Sparkles className="size-4" /></span>
              Artemise
            </Link>
            <p className="mt-3 max-w-xs text-muted">O sistema de gestão completo para clínicas de estética e saúde.</p>
          </div>
          <div>
            <p className="font-semibold">Produto</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li><a href="#recursos" className="hover:text-brand">Recursos</a></li>
              <li><a href="#modulos" className="hover:text-brand">Módulos</a></li>
              <li><a href="#planos" className="hover:text-brand">Planos</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Empresa</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li><Link href="/login" className="hover:text-brand">Entrar</Link></li>
              <li><Link href="/registrar" className="hover:text-brand">Criar conta</Link></li>
              <li><a href="#faq" className="hover:text-brand">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Legal</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li><a href="#" className="hover:text-brand">Privacidade (LGPD)</a></li>
              <li><a href="#" className="hover:text-brand">Termos de uso</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted sm:flex-row">
            <p>© 2026 Artemise. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-brand">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-brand">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17V10.3H6.1V17h2.24zM7.22 9.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zM18 17v-3.67c0-1.96-1.05-2.87-2.45-2.87-1.13 0-1.63.62-1.92 1.06V10.3h-2.24V17h2.24v-3.74c0-.99.69-1.2 1.13-1.2.43 0 .99.34.99 1.23V17H18z" /></svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-brand">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C19.4 5 12 5 12 5s-7.4 0-8.9.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8C4.6 19 12 19 12 19s7.4 0 8.9-.5a2.5 2.5 0 0 0 1.7-1.8c.4-1.5.4-4.7.4-4.7zM9.8 15V9l5.2 3-5.2 3z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
