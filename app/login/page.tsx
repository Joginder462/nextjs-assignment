"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Container, TextField, Typography, Alert, Paper, Stack } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    if (res?.ok) router.push(callbackUrl);
    else setError(res?.error || "Invalid credentials");
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
            Welcome back! Please login to your account.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?
              </Typography>
              <Button component={Link} href="/register" variant="text" size="small">
                Register
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
