"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/validators";
import type * as yup from "yup";
import { Box, Button, Container, TextField, Typography, Alert, Paper, Stack } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    if (res.ok) { 
      setSuccess("Account created successfully! Redirecting to login..."); 
      setTimeout(() => router.push("/login"), 1500); 
    } else { 
      const d = await res.json(); 
      setError(d.error ?? "Registration failed"); 
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
            Create a new account to get started.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField 
              label="Name (Optional)" 
              fullWidth 
              margin="normal" 
              {...register("name")} 
              error={!!errors.name} 
              helperText={errors.name?.message?.toString()}
              autoComplete="name"
            />
            <TextField 
              label="Email" 
              fullWidth 
              margin="normal" 
              {...register("email")} 
              error={!!errors.email} 
              helperText={errors.email?.message}
              autoComplete="email"
            />
            <TextField 
              label="Password" 
              type="password" 
              fullWidth 
              margin="normal" 
              {...register("password")} 
              error={!!errors.password} 
              helperText={errors.password?.message?.toString()}
              autoComplete="new-password"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Button component={Link} href="/login" variant="text" size="small">
                Login
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
