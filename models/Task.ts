import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Task = models.Task || model("Task", TaskSchema);
