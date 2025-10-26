import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Project Management Tool
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4} maxWidth="600px">
          Organize your projects and tasks efficiently. Track progress, manage deadlines, and collaborate with your team.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            sx={{ px: 4 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="outlined"
            size="large"
            sx={{ px: 4 }}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
