"use client";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

const theme = createTheme({
  palette: { mode: "light" },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
