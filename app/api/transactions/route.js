// app/api/transactions/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions.js";
import dbConnect from "../../../lib/dbConnect.js";
import Transaction from "../../../models/Transaction.js";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";
  const transactions = showAll
    ? await Transaction.find({}).lean()
    : await Transaction.find({ user: userId }).lean();
  return NextResponse.json({ transactions });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  await dbConnect();
  data.user = session.user.id;

  const newTrans = await Transaction.create(data);
  return NextResponse.json({ transaction: newTrans });
}