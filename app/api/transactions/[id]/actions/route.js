import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";
import dbConnect from "@/lib/dbConnect.js";
import Transaction from "@/models/Transaction.js";
import { Types } from "mongoose";

export async function PATCH(req, context) {
  const { id, actionId } = context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const actionIndex = transaction.actions.findIndex(action => action.id === actionId);
  if (actionIndex === -1) {
    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    body = {};
  }
  if ('notes' in body) {
    transaction.actions[actionIndex].notes = body.notes;
  }
  if ('status' in body) {
    transaction.actions[actionIndex].status = body.status;
  }
  // If neither 'notes' nor 'status' are provided, default to marking the action complete
  if (!('notes' in body) && !('status' in body)) {
    transaction.actions[actionIndex].status = "Completed";
  }

  await transaction.save();
  return NextResponse.json({ transaction });
}

export async function POST(req, { params }) {
    const { id } = params;
  
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    await dbConnect();
  
    // Validate transaction ID
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
  
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
  
    // Ensure the transaction belongs to the logged-in user
    if (transaction.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  
    // Attempt to read the JSON body
    let body = {};
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  
    // Make sure both "action" and "status" fields are provided
    if (!body.action || !body.status) {
      return NextResponse.json({ error: "Both action and status are required" }, { status: 400 });
    }
  
    // Append the new action to the transaction
    transaction.actions.push({ action: body.action, status: body.status });
    await transaction.save();
  
    return NextResponse.json({ transaction });
  }