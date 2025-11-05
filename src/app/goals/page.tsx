"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Goal = {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  deadline?: string | null;
};

async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch("/api/goals");
  return res.json();
}

export default function GoalsPage() {
  const queryClient = useQueryClient();

  // buscar metas
  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });

  // estados do formulário
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState("");

  // criar meta
  const createMutation = useMutation<Goal, Error, Omit<Goal, "id">>({
    mutationFn: async (newGoal) => {
      const res = await fetch("/api/goals", {
        method: "POST",
        body: JSON.stringify(newGoal),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setTitle("");
      setTargetValue("");
      setDeadline("");
    },
  });

  // excluir meta
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto">
      {/* topo */}
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">Metas</h1>
        <p className="text-sm text-slate-500">
          Crie e acompanhe suas metas de economia
        </p>
      </header>

      {/* formulário */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-slate-500">Nome da meta</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Ex: Notebook novo"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Valor objetivo</label>
            <input
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="2000"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Data limite</label>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>
          <button
            onClick={() =>
              createMutation.mutate({
                title,
                targetValue: Number(targetValue) || 0,
                currentValue: 0,
                deadline: deadline || null,
              })
            }
            disabled={createMutation.isPending}
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold"
          >
            {createMutation.isPending ? "Salvando..." : "Adicionar meta"}
          </button>
        </div>
      </section>

      {/* lista de metas */}
      <section className="px-4 mt-4 space-y-3 mb-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : goals && goals.length > 0 ? (
          goals.map((goal) => {
            const percent = goal.targetValue
              ? Math.min(
                  Math.round((goal.currentValue / goal.targetValue) * 100),
                  100
                )
              : 0;
            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {goal.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    R$ {goal.currentValue} de R$ {goal.targetValue}
                  </p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                    <div
                      className="h-2 bg-[#7A44FF] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(goal.id)}
                  className="text-xs text-rose-500"
                >
                  Excluir
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">Nenhuma meta cadastrada.</p>
        )}
      </section>

      <BottomBar />
    </main>
  );
}
