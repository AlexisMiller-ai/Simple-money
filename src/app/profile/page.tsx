"use client";

import { BottomBar } from "../../components/BottomBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  age: number;
  points: number;
};

async function fetchProfile(): Promise<Profile> {
  const res = await fetch("/api/profile");
  return res.json();
}

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  // estados controlados
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setAge(profile.age.toString());
  }, [profile]);

  const updateMutation = useMutation<Profile, Error, Partial<Profile>>({
    mutationFn: async (updated) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(updated),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // se quiser, pode mostrar toast aqui
    },
  });

  // enquanto carrega
  if (isLoading || !profile) {
    return <p className="p-4">Carregando perfil...</p>;
  }

  return (
    <main className="min-h-screen pb-16 md:max-w-md md:mx-auto bg-slate-50">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-slate-900">Meu Perfil</h1>
        <p className="text-sm text-slate-500">
          Visualize e atualize suas informações
        </p>
      </header>

      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          {/* avatar */}
          <div className="text-center mb-2">
            <div className="w-20 h-20 mx-auto bg-violet-100 rounded-full flex items-center justify-center text-2xl font-bold text-violet-700">
              {profile.name.charAt(0)}
            </div>
            <p className="mt-2 font-semibold text-slate-900">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <p className="text-xs text-violet-600 mt-1">
              {profile.points} pontos
            </p>
          </div>

          {/* formulário */}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            <div>
              <label className="text-xs text-slate-500">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Idade</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
                placeholder="22"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">E-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1"
                placeholder="seu@email.com"
              />
            </div>

            <button
              onClick={() => {
                // garantia extra: só envia se tiver profile
                if (!profile) return;
                updateMutation.mutate({
                  name: name.trim() !== "" ? name : profile.name,
                  email: email.trim() !== "" ? email : profile.email,
                  age: age.trim() !== "" ? Number(age) : profile.age,
                });
              }}
              disabled={updateMutation.isPending}
              className="w-full bg-[#7A44FF] text-white py-2 rounded-xl font-semibold mt-1"
            >
              {updateMutation.isPending ? "Salvando..." : "Atualizar Perfil"}
            </button>
          </div>
        </div>
      </section>

      <BottomBar />
    </main>
  );
}
