import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { taskSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = await taskSchema.validate(body, { abortEarly: false, stripUnknown: true });
    await dbConnect();
    const task = await Task.findById(params.id).lean();
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const project = await Project.findOne({ _id: task.project, user: (session.user as { id: string }).id }).lean();
    if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const updated = await Task.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json({ task: updated });
  } catch (err: unknown) {
    if (err?.name === "ValidationError")
      return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const task = await Task.findById(params.id).lean();
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const project = await Project.findOne({ _id: task.project, user: (session.user as { id: string }).id }).lean();
  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await Task.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
