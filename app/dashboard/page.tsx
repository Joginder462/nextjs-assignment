"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/projectsSlice";
import { Box, Button, CircularProgress, Container, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function DashboardPage() {
  const { status } = useSession();
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.projects);

  useEffect(() => {
    if (status === "authenticated") {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  if (status === "loading") return <Container><CircularProgress /></Container>;
  if (status !== "authenticated") return <Container><Typography>Please log in.</Typography></Container>;

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h4">Your Projects</Typography>
        <Button variant="outlined" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
      </Stack>
      {loading ? (
        <Box><CircularProgress /></Box>
      ) : (
        <List>
          {items.map((p) => (
            <ListItem key={p._id} component={Link} href={`/projects/${p._id}`}>
              <ListItemText primary={p.title} secondary={p.status} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
