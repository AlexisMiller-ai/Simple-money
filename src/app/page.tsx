"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("joao.silva@email.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    login({
      id: "1",
      name: "João Silva",
      email,
      points: 580,
    });

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#7A44FF] to-[#9068FF] px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-[#7A44FF]/10 flex items-center justify-center text-2xl">
            💡
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SimpleMoney</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bem-vindo! Faça login ou cadastre-se
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A44FF]"
              placeholder="seu@gmail.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A44FF]"
              placeholder="•••••••"
              required
            />
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-[#7A44FF] hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold hover:bg-[#6a3be6] transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Não tem conta?{" "}
          <Link href="/register" className="text-[#7A44FF] font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
