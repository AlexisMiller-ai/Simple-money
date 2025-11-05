import { NextResponse } from "next/server";

type Budget = {
  id: string;
  costCenter: string;
  month: string; // 2025-10
  limit: number;
};

let budgets: Budget[] = [
  {
    id: "1",
    costCenter: "Alimentação",
    month: "2025-10",
    limit: 400,
  },
];

export async function GET() {
  return NextResponse.json(budgets);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newBudget: Budget = {
    id: crypto.randomUUID(),
    costCenter: body.costCenter,
    month: body.month,
    limit: Number(body.limit),
  };
  budgets.push(newBudget);
  return NextResponse.json(newBudget, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  budgets = budgets.filter((b) => b.id !== id);
  return NextResponse.json({ ok: true });
}
