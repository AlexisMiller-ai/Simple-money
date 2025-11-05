import { NextResponse } from "next/server";

type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  status: "aberto" | "concluido";
};

let challenges: Challenge[] = [
  {
    id: "1",
    title: "Poupador da semana",
    description: "Economize R$ 30 até domingo",
    points: 50,
    status: "aberto",
  },
];

export async function GET() {
  return NextResponse.json(challenges);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newChallenge: Challenge = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,
    points: Number(body.points) || 0,
    status: "aberto",
  };
  challenges.push(newChallenge);
  return NextResponse.json(newChallenge, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  challenges = challenges.map((c) =>
    c.id === body.id ? { ...c, ...body } : c
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  challenges = challenges.filter((c) => c.id !== id);
  return NextResponse.json({ ok: true });
}
