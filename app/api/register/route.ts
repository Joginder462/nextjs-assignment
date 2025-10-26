import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await registerSchema.validate(body, { abortEarly: false, stripUnknown: true });

    await dbConnect();
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    await User.create({ email: data.email, passwordHash, name: data.name ?? undefined });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err?.name === "ValidationError") {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
