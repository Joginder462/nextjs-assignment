"use client";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Box, Container, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useSWR(params?.id ? `/api/projects/${params.id}` : null, fetcher);
  const { data: tasksData } = useSWR(params?.id ? `/api/projects/${params.id}/tasks` : null, fetcher);

  const project = data?.project;
  const tasks = tasksData?.tasks || [];

  if (!project) return <Container><Typography>Loading...</Typography></Container>;

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4">{project.title}</Typography>
        <Typography color="text.secondary">{project.description}</Typography>
      </Box>
      <Typography variant="h6" gutterBottom>Tasks</Typography>
      <List>
        {tasks.map((t: { _id: string; title: string; description: string; status: string }) => (
          <ListItem key={t._id}>
            <ListItemText primary={t.title} secondary={t.description} />
            <Chip label={t.status} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
