import { NextResponse } from "next/server";

type CostCenter = {
  id: string;
  name: string;
  description?: string;
};

let costCenters: CostCenter[] = [
  { id: "1", name: "Alimentação", description: "Restaurantes, lanches" },
  { id: "2", name: "Educação", description: "Cursos e faculdade" },
];

export async function GET() {
  return NextResponse.json(costCenters);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newCC: CostCenter = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description || "",
  };
  costCenters.push(newCC);
  return NextResponse.json(newCC, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  costCenters = costCenters.map((c) =>
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
  costCenters = costCenters.filter((c) => c.id !== id);
  return NextResponse.json({ ok: true });
}
