"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  Box, 
  Container, 
  Typography, 
  Card,
  CardContent,
  Chip, 
  CircularProgress, 
  Pagination,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Stack,
  Grid
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon, 
  Add as AddIcon
} from "@mui/icons-material";

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
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProject = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${params.id}`);
      setProject(data.project);
      setError(null);
    } catch (err) {
      console.error("Error loading project:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("Project not found");
        } else if (err.response?.status === 401) {
          setError("Unauthorized - please log in again");
        } else {
          setError(err.response?.data?.error || "Failed to load project");
        }
      } else {
        setError("Failed to load project");
      }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Project not found"}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push("/dashboard")}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => router.push("/dashboard")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            color={project.status === "active" ? "success" : "default"}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {project.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {project.description || "No description provided"}
            </Typography>
          </CardContent>
        </Card>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {pagination.total} task{pagination.total !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
          >
            New Task
          </Button>
        </Stack>

        {tasksLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Card sx={{ py: 8, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first task to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            <Grid container spacing={2}>
              {tasks.map((t) => (
                <Grid item xs={12} key={t._id}>
                  <Card 
                    sx={{ 
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {t.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.description || "No description"}
                          </Typography>
                        </Box>
                        <Chip 
                          label={t.status} 
                          color={getStatusColor(t.status)}
                          size="small"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {pagination.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination 
                  count={pagination.totalPages} 
                  page={pagination.page} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
