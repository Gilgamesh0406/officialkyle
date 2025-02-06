"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Container maxWidth="sm">
        <Box
          sx={() => ({
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            margin: -2,
            padding: 2,
          })}
        >
          <Paper
            elevation={24}
            sx={(theme) => ({
              p: 4,
              width: "100%",
              borderRadius: 3,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(30, 30, 30, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
            })}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={(theme) => ({
                fontWeight: 700,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #00b4db 30%, #0083B0 90%)"
                    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                mb: 4,
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              })}
            >
              Welcome Back
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={(theme) => ({
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(0, 0, 0, 0.4)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.7)",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  },
                })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={(theme) => ({
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(0, 0, 0, 0.4)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.7)",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  },
                })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={(theme) => ({
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #00b4db 30%, #0083B0 90%)"
                      : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 3px 5px 2px rgba(0, 180, 219, .2)"
                      : "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  "&:hover": {
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(45deg, #0083B0 30%, #006285 90%)"
                        : "linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)",
                  },
                })}
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
