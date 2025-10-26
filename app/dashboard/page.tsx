"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { Box, Button, CircularProgress, Container, List, ListItem, ListItemText, Stack, Typography, Pagination } from "@mui/material";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: string;
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function DashboardPage() {
  const { status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      loadProjects(1);
    }
  }, [status]);

  const loadProjects = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/projects?page=${page}&limit=10`);
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    loadProjects(value);
  };

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
        <>
          <List>
            {projects.map((p) => (
              <ListItem key={p._id} component={Link} href={`/projects/${p._id}`}>
                <ListItemText primary={p.title} secondary={p.status} />
              </ListItem>
            ))}
          </List>
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination 
                count={pagination.totalPages} 
                page={pagination.page} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
