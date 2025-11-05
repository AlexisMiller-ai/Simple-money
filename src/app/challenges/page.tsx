"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  status: "aberto" | "concluido";
};

async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch("/api/challenges");
  return res.json();
}

export default function ChallengesPage() {
  const queryClient = useQueryClient();
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState("");

  const createMutation = useMutation<Challenge, Error, Omit<Challenge, "id">>({
    mutationFn: async (newChallenge) => {
      const res = await fetch("/api/challenges", {
        method: "POST",
        body: JSON.stringify(newChallenge),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      setTitle("");
      setDesc("");
      setPoints("");
    },
  });

  const finishMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const challenge = (challenges || []).find((c) => c.id === id);
      if (!challenge) return;
      await fetch("/api/challenges", {
        method: "PUT",
        body: JSON.stringify({ ...challenge, status: "concluido" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await fetch(`/api/challenges?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">Desafios</h1>
        <p className="text-sm text-slate-500">
          Crie e conclua desafios financeiros
        </p>
      </header>

      {/* formulário */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-slate-500">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="Ex: Economizar 30 reais"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Descrição</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="detalhe do desafio"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Pontos</label>
            <input
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              type="number"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="50"
            />
          </div>
          <button
            onClick={() =>
              createMutation.mutate({
                title,
                description: desc,
                points: Number(points) || 0,
                status: "aberto",
              })
            }
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold"
          >
            Adicionar desafio
          </button>
        </div>
      </section>

      {/* lista */}
      <section className="px-4 mt-4 space-y-3 mb-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : challenges && challenges.length > 0 ? (
          challenges.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {c.title}
                </p>
                <p className="text-xs text-slate-400">{c.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Pontos: {c.points}
                </p>
              </div>
              <div className="text-right space-y-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    c.status === "concluido"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.status === "concluido" ? "Concluído" : "Aberto"}
                </span>
                {c.status !== "concluido" && (
                  <button
                    onClick={() => finishMutation.mutate(c.id)}
                    className="block text-xs text-[#7A44FF]"
                  >
                    Concluir
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(c.id)}
                  className="block text-xs text-rose-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Nenhum desafio cadastrado.</p>
        )}
      </section>

      <BottomBar />
    </main>
  );
}
