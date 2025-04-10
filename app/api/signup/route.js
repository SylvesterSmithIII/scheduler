// app/api/signup/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbConnect.js";
import User from "../../../models/User.js";

export async function POST(req) {
  try {
    const { username, firstName, password, passphrase } = await req.json();

    if (passphrase !== process.env.SIGNUP_PASSPHRASE) {
      return NextResponse.json({ error: "Invalid signup code" }, { status: 403 });
    }
    await dbConnect();
    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, firstName, password: hashed });
    return NextResponse.json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}