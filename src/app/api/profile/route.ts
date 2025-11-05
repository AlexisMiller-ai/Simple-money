import { NextResponse } from "next/server";

type Profile = {
  id: string;
  name: string;
  email: string;
  age: number;
  points: number;
};

let profile: Profile = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@email.com",
  age: 22,
  points: 580,
};

// GET -> retorna o perfil
export async function GET() {
  return NextResponse.json(profile);
}

// PUT -> atualiza o perfil
export async function PUT(req: Request) {
  const body = await req.json();
  profile = { ...profile, ...body };
  return NextResponse.json(profile);
}
