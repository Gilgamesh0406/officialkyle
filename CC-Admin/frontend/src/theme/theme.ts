import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#2563eb", // Modern blue
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        secondary: {
          main: "#8b5cf6", // Modern purple
          light: "#a78bfa",
          dark: "#7c3aed",
        },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
        },
        secondary: {
          main: "#a78bfa",
          light: "#c4b5fd",
          dark: "#8b5cf6",
        },
        background: {
          default: "#0f172a",
          paper: "#1e293b",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

export default theme;
