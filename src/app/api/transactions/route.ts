import { NextResponse } from "next/server";

type Transaction = {
  id: string;
  type: "entrada" | "saida";
  title: string;
  category: string;
  date: string;
  value: number;
};

let transactions: Transaction[] = [
  {
    id: "1",
    type: "entrada",
    title: "Mesada",
    category: "Alimentação",
    date: "2025-06-15",
    value: 100,
  },
  {
    id: "2",
    type: "saida",
    title: "Lanchonete",
    category: "Alimentação",
    date: "2025-06-14",
    value: 15.5,
  },
];

export async function GET() {
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    type: body.type,
    title: body.title,
    category: body.category,
    date: body.date,
    value: Number(body.value),
  };
  transactions.push(newTransaction);
  return NextResponse.json(newTransaction, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  transactions = transactions.map((t) =>
    t.id === body.id ? { ...t, ...body } : t
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  transactions = transactions.filter((t) => t.id !== id);
  return NextResponse.json({ ok: true });
}
