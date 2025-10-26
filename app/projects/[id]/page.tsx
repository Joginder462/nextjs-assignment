"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Box, Container, Typography, List, ListItem, ListItemText, Chip, CircularProgress, Pagination } from "@mui/material";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: string;
};

type Task = {
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

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  const loadProject = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${params.id}`);
      setProject(data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (page: number) => {
    setTasksLoading(true);
    try {
      const { data } = await axios.get(`/api/projects/${params.id}/tasks?page=${page}&limit=10`);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      loadProject();
      loadTasks(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    loadTasks(value);
  };

  if (loading) return <Container><CircularProgress /></Container>;
  if (!project) return <Container><Typography>Project not found</Typography></Container>;

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4">{project.title}</Typography>
        <Typography color="text.secondary">{project.description}</Typography>
      </Box>
      <Typography variant="h6" gutterBottom>Tasks</Typography>
      {tasksLoading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {tasks.map((t) => (
              <ListItem key={t._id}>
                <ListItemText primary={t.title} secondary={t.description} />
                <Chip label={t.status} />
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
