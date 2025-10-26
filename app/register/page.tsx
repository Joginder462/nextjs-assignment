"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/validators";
import type * as yup from "yup";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormValues = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null); setSuccess(null);
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (res.ok) { setSuccess("Account created. You can now log in."); setTimeout(()=> router.push("/login"), 800); }
    else { const d = await res.json(); setError(d.error ?? "Registration failed"); }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField label="Name" fullWidth margin="normal" {...register("name")} error={!!errors.name} helperText={errors.name?.message?.toString()} />
        <TextField label="Email" fullWidth margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" fullWidth margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message?.toString()} />
        <Button type="submit" variant="contained" disabled={isSubmitting}>Create account</Button>
      </Box>
    </Container>
  );
}
