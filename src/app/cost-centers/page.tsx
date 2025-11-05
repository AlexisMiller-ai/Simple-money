"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CostCenter = {
  id: string;
  name: string;
  description?: string;
};

async function fetchCostCenters(): Promise<CostCenter[]> {
  const res = await fetch("/api/cost-centers");
  return res.json();
}

export default function CostCentersPage() {
  const queryClient = useQueryClient();
  const { data: costCenters, isLoading } = useQuery({
    queryKey: ["cost-centers"],
    queryFn: fetchCostCenters,
  });

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const createMutation = useMutation<CostCenter, Error, Omit<CostCenter, "id">>(
    {
      mutationFn: async (newCC) => {
        const res = await fetch("/api/cost-centers", {
          method: "POST",
          body: JSON.stringify(newCC),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
        setName("");
        setDesc("");
      },
    }
  );

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await fetch(`/api/cost-centers?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
    },
  });

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Centros de Custo
        </h1>
        <p className="text-sm text-slate-500">
          Cadastre categorias para suas despesas
        </p>
      </header>

      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-slate-500">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="Ex: Alimentação"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Descrição</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="(opcional)"
            />
          </div>
          <button
            onClick={() => createMutation.mutate({ name, description: desc })}
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold"
          >
            Adicionar centro
          </button>
        </div>
      </section>

      <section className="px-4 mt-4 space-y-3 mb-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : costCenters && costCenters.length > 0 ? (
          costCenters.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                {c.description ? (
                  <p className="text-xs text-slate-400">{c.description}</p>
                ) : null}
              </div>
              <button
                onClick={() => deleteMutation.mutate(c.id)}
                className="text-xs text-rose-500"
              >
                Excluir
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Nenhum centro cadastrado.</p>
        )}
      </section>

      <BottomBar />
    </main>
  );
}
