import { NextResponse } from "next/server";

let goals = [
  {
    id: "1",
    title: "Guardar para notebook",
    targetValue: 2000,
    currentValue: 450,
    deadline: "2025-12-30",
  },
];

export async function GET() {
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newGoal = {
    id: crypto.randomUUID(),
    title: body.title,
    targetValue: Number(body.targetValue) || 0,
    currentValue: Number(body.currentValue) || 0,
    deadline: body.deadline || null,
  };
  goals.push(newGoal);
  return NextResponse.json(newGoal, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  goals = goals.map((g) => (g.id === body.id ? { ...g, ...body } : g));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  goals = goals.filter((g) => g.id !== id);
  return NextResponse.json({ ok: true });
}
