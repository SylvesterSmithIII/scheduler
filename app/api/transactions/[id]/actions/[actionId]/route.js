import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";
import dbConnect from "@/lib/dbConnect.js";
import Transaction from "@/models/Transaction.js";
import { Types } from "mongoose";

export async function PATCH(req, context) {
  const params = await context.params;
  const { id, actionId } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(actionId)) {
    return NextResponse.json({ error: "Invalid ID(s)" }, { status: 400 });
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  if (transaction.user.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actionIndex = transaction.actions.findIndex(a => a._id.toString() === actionId);
  if (actionIndex === -1) {
    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    body = {};
  }

  if (Object.keys(body).length === 0) {
    // If no body provided, assume this PATCH call is to mark the action complete
    transaction.actions[actionIndex].status = "Completed";
  } else {
    if (body.notes !== undefined) {
      transaction.actions[actionIndex].notes = body.notes;
    }
    if (body.status !== undefined) {
      transaction.actions[actionIndex].status = body.status;
    }
  }

  await transaction.save();
  return NextResponse.json({ transaction });
}


export async function DELETE(req, context) {
  const params = await context.params;
  const { id, actionId } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid transaction id" }, { status: 400 });
  }
  if (!Types.ObjectId.isValid(actionId)) {
    return NextResponse.json({ error: "Invalid action id" }, { status: 400 });
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  // Ensure the transaction belongs to the user
  if (transaction.user.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Remove the action from the transaction's actions array
  transaction.actions = transaction.actions.filter(a => a._id.toString() !== actionId);
  await transaction.save();

  return NextResponse.json({ transaction });
}