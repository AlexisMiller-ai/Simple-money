"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Transaction = {
  id: string;
  type: "entrada" | "saida";
  title: string;
  category: string;
  date: string;
  value: number;
};

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/transactions");
  return res.json();
}

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  // filtros simples
  const [filterType, setFilterType] = useState<"todos" | "entrada" | "saida">(
    "todos"
  );

  // formulário
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [category, setCategory] = useState("Alimentação");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");

  const createMutation = useMutation<
    Transaction,
    Error,
    Omit<Transaction, "id">
  >({
    mutationFn: async (newTransaction) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(newTransaction),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setTitle("");
      setValue("");
      setDate("");
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const filtered =
    filterType === "todos"
      ? transactions || []
      : (transactions || []).filter((t) => t.type === filterType);

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">Transações</h1>
        <p className="text-sm text-slate-500">Entradas e saídas do seu mês</p>
      </header>

      {/* filtros */}
      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={() => setFilterType("todos")}
          className={`px-3 py-1 rounded-full text-sm ${
            filterType === "todos"
              ? "bg-[#7A44FF] text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterType("entrada")}
          className={`px-3 py-1 rounded-full text-sm ${
            filterType === "entrada"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Entradas
        </button>
        <button
          onClick={() => setFilterType("saida")}
          className={`px-3 py-1 rounded-full text-sm ${
            filterType === "saida"
              ? "bg-rose-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Saídas
        </button>
      </div>

      {/* formulário rápido */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-slate-500">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              placeholder="Ex: Lanchonete"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-slate-500">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "entrada" | "saida")}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              >
                <option>Alimentação</option>
                <option>Lazer</option>
                <option>Educação</option>
                <option>Transporte</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-slate-500">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500">Valor</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
                placeholder="0,00"
              />
            </div>
          </div>
          <button
            onClick={() =>
              createMutation.mutate({
                title,
                type,
                category,
                date: date || new Date().toISOString().slice(0, 10),
                value: Number(value),
              })
            }
            disabled={createMutation.isPending}
            className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold"
          >
            {createMutation.isPending ? "Salvando..." : "Adicionar transação"}
          </button>
        </div>
      </section>

      {/* lista */}
      <section className="px-4 mt-4 space-y-3 mb-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : filtered.length > 0 ? (
          filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {t.title}
                </p>
                <p className="text-xs text-slate-400">
                  {t.category} • {t.date}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={
                    t.type === "entrada"
                      ? "text-emerald-500 font-semibold"
                      : "text-rose-500 font-semibold"
                  }
                >
                  {t.type === "entrada" ? "+" : "-"} R$ {t.value.toFixed(2)}
                </p>
                <button
                  onClick={() => deleteMutation.mutate(t.id)}
                  className="text-xs text-slate-400 mt-1"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            Nenhuma transação cadastrada.
          </p>
        )}
      </section>

      <BottomBar />
    </main>
  );
}
