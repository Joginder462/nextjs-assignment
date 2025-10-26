import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { taskSchema } from "@/lib/validators";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const project = await Project.findOne({ _id: params.id, user: (session.user as { id: string }).id }).lean();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const status = req.nextUrl.searchParams.get("status");
  const filter: { project: string; status?: string } = { project: params.id };
  if (status) filter.status = status;
  const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = await taskSchema.validate(body, { abortEarly: false, stripUnknown: true });
    await dbConnect();
    const project = await Project.findOne({ _id: params.id, user: (session.user as { id: string }).id }).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const created = await Task.create({ ...data, project: params.id });
    return NextResponse.json({ task: created });
  } catch (err: unknown) {
    if (err?.name === "ValidationError")
      return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
