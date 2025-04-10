import connectMongoDB from "@/lib/dbConnect";
import Signing from "@/models/signing";
import { NextResponse } from "next/server";

export async function POST(request) {

    const signing = await request.json()

    await connectMongoDB()

    const singing = await Signing.create(signing)

    console.log(singing)

    return NextResponse.json({ message: "Signing Created" })

}