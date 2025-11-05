"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Budget = {
  id: string;
  costCenter: string;
  month: string;
  limit: number;
};

async function fetchBudgets(): Promise<Budget[]> {
  const res = await fetch("/api/budgets");
  return res.json();
}

export default function BudgetsPage() {
  const queryClient = useQueryClient();
  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  const [costCenter, setCostCenter] = useState("");
  const [month, setMonth] = useState("");
  const [limit, setLimit] = useState("");

  const createMutation = useMutation<Budget, Error, Omit<Budget, "id">>({
    mutationFn: async (newBudget) => {
      const res = await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify(newBudget),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setCostCenter("");
      setMonth("");
      setLimit("");
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Orçamentos Mensais
        </h1>
        <p className="text-sm text-slate-500">
          Defina limites por centro de custo
        </p>
      </header>

      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-slate-500">Centro de custo</label>
            <input
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="Ex: Alimentação"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Mês</label>
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              type="month"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Limite (R$)</label>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              type="number"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="400"
            />
          </div>
          <button
            onClick={() =>
              createMutation.mutate({
                costCenter,
                month,
                limit: Number(limit),
              })
            }
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold"
          >
            Adicionar orçamento
          </button>
        </div>
      </section>

      <section className="px-4 mt-4 space-y-3 mb-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : budgets && budgets.length > 0 ? (
          budgets.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {b.costCenter}
                </p>
                <p className="text-xs text-slate-400">
                  Mês: {b.month} • Limite: R$ {b.limit}
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(b.id)}
                className="text-xs text-rose-500"
              >
                Excluir
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Nenhum orçamento cadastrado.</p>
        )}
      </section>

      <BottomBar />
    </main>
  );
}
