import Link from "next/link";
import { Sparkles, Check } from "lucide-react";

const BULLETS = [
  "Agenda, prontuário e financeiro num só lugar",
  "Automação de WhatsApp que reduz faltas",
  "Seus dados isolados e seguros (LGPD)",
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <aside className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="grid-bg absolute inset-0 opacity-20" />
        <Link href="/" className="relative flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-white/15">
            <Sparkles className="size-5" />
          </span>
          Artemise
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight">
            Sua clínica inteira em um só sistema.
          </h2>
          <ul className="mt-8 space-y-4">
            {BULLETS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-brand-100">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                  <Check className="size-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-100">© 2026 Artemise · Gestão para clínicas</p>
      </aside>

      {/* content */}
      <main className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
