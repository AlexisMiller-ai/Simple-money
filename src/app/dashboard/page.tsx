"use client";

import { BottomBar } from "../../components/BottomBar";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto bg-[#F4F4F5]">
      {/* topo */}
      <header className="px-4 pt-6">
        <p className="text-sm text-slate-500">
          Olá, {user ? user.name.split(" ")[0] : "usuário"} 👋
        </p>
        <h2 className="text-xl font-semibold text-slate-900">
          Bem-vindo de volta
        </h2>
      </header>

      {/* saldo */}
      <section className="px-4 mt-4">
        <div className="bg-gradient-to-r from-[#7A44FF] to-[#9C5BFF] rounded-2xl p-4 text-white shadow">
          <p className="text-sm opacity-90">Seu saldo</p>
          <p className="text-3xl font-bold mt-1">R$ 245,80</p>
          <p className="text-xs mt-2 opacity-80">Atualizado hoje</p>
        </div>
      </section>

      {/* cards */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <p className="text-xs text-slate-500">Minhas metas</p>
          <p className="text-2xl font-bold text-slate-900">60%</p>
          <a href="/goals" className="text-xs text-[#7A44FF] mt-2 inline-block">
            Ver
          </a>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <p className="text-xs text-slate-500">Últimas transações</p>
          <p className="text-2xl font-bold text-slate-900">3</p>
          <a
            href="/transactions"
            className="text-xs text-[#7A44FF] mt-2 inline-block"
          >
            Ver
          </a>
        </div>
      </section>

      {/* desafio */}
      <section className="px-4 mt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Desafio do Dia</p>
          <p className="text-xs text-slate-500 mt-1">
            Poupador da Semana – economize R$ 30 até domingo
          </p>
          <button className="mt-3 bg-[#7A44FF] text-white px-3 py-1 rounded-lg text-sm">
            Participar
          </button>
        </div>
      </section>

      <BottomBar />
    </main>
  );
}
