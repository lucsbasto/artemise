"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) {
        setErro("Credenciais inválidas");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErro("Não foi possível conectar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Entrar</h1>
      <p className="mt-1 text-sm text-muted">Acesse o painel da sua clínica.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {erro && (
          <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
            {erro}
          </p>
        )}

        <label className="block">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@clinica.com.br"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Senha</span>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-2 hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>

        <div className="flex justify-end">
          <a href="#" className="text-sm font-medium text-brand hover:underline">Esqueceu a senha?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <>Entrar <ArrowRight className="size-4" /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/registrar" className="font-semibold text-brand hover:underline">Criar conta grátis</Link>
      </p>
    </div>
  );
}
