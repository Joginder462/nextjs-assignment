"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    if (res?.ok) router.push("/dashboard");
    else setError(res?.error || "Invalid credentials");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField label="Email" fullWidth margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" fullWidth margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" variant="contained" disabled={isSubmitting}>Login</Button>
      </Box>
    </Container>
  );
}
