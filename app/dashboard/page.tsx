"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  Card,
  CardContent,
  CardActions,
  Grid,
  Stack, 
  Typography, 
  Pagination,
  Chip,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { Add as AddIcon, Logout as LogoutIcon } from "@mui/icons-material";
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

  if (status === "loading") {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status !== "authenticated") {
    return (
      <Container>
        <Typography>Please log in.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Management Tool
          </Typography>
          <IconButton color="inherit" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Your Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {pagination.total} project{pagination.total !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
          >
            New Project
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Card sx={{ py: 8, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first project to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            <Grid container spacing={3}>
              {projects.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Card 
                    sx={{ 
                      height: "100%", 
                      display: "flex", 
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {p.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {p.description || "No description"}
                      </Typography>
                      <Chip 
                        label={p.status} 
                        size="small"
                        color={p.status === "active" ? "success" : "default"}
                      />
                    </CardContent>
                    <CardActions>
                      <Button 
                        component={Link} 
                        href={`/projects/${p._id}`}
                        size="small"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
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
