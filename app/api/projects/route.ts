import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const projects = await Project.find({ user: (session.user as { id: string }).id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = await projectSchema.validate(body, { abortEarly: false, stripUnknown: true });
    await dbConnect();
    const created = await Project.create({ ...data, user: (session.user as { id: string }).id });
    return NextResponse.json({ project: created });
  } catch (err: unknown) {
    if (err?.name === "ValidationError")
      return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
