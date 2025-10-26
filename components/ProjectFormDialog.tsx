"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "@/lib/validators";
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

type FormValues = yup.InferType<typeof projectSchema>;

type ProjectFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: {
    _id: string;
    title: string;
    description: string;
    status: string;
  } | null;
};

export default function ProjectFormDialog({
  open,
  onClose,
  onSuccess,
  project,
}: ProjectFormDialogProps) {
  const isEdit = !!project;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        status: project.status as "active" | "completed",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "active",
      });
    }
  }, [project, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const url = isEdit ? `/api/projects/${project._id}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        setError("root", { message: data.error || "Failed to save project" });
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
      <DialogTitle>{isEdit ? "Edit Project" : "Create New Project"}</DialogTitle>
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
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                label="Status"
                fullWidth
                margin="normal"
                select
                {...field}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
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
