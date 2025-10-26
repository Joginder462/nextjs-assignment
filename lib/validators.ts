import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/[a-z]/, "One lowercase letter required")
    .matches(/[0-9]/, "One number required")
    .matches(/[^A-Za-z0-9]/, "One special character required"),
  name: yup.string().optional(),
});

export const projectSchema = yup.object({
  title: yup.string().required().max(120),
  description: yup.string().default("").optional(),
  status: yup.mixed<"active" | "completed">().oneOf(["active", "completed"]).optional(),
});

export const taskSchema = yup.object({
  title: yup.string().required().max(200),
  description: yup.string().default("").optional(),
  status: yup
    .mixed<"todo" | "in-progress" | "done">()
    .oneOf(["todo", "in-progress", "done"]) 
    .optional(),
  dueDate: yup.date().nullable().optional(),
});
