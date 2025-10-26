"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema } from "@/lib/validators";
import type * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";

type FormValues = yup.InferType<typeof taskSchema>;

type TaskFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  task?: {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate?: string | null;
  } | null;
};

export default function TaskFormDialog({
  open,
  onClose,
  onSuccess,
  projectId,
  task,
}: TaskFormDialogProps) {
  const isEdit = !!task;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status as "todo" | "in-progress" | "done",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        dueDate: null,
      });
    }
  }, [task, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const url = isEdit
        ? `/api/tasks/${task._id}`
        : `/api/projects/${projectId}/tasks`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        setError("root", { message: data.error || "Failed to save task" });
        return;
      }

      onSuccess();
      onClose();
      reset();
    } catch {
      setError("root", { message: "An error occurred" });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            autoFocus
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            select
            defaultValue="todo"
            {...register("status")}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextField
                label="Due Date"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? new Date(value) : null);
                }}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message?.toString()}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
