"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fake login request
    const fakeToken = "sampletoken123"; // Replace this with actual API call
    dispatch(login({ user: username, token: fakeToken }));

    // Redirect to home page after successful login
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-2xl text-gray-800 dark:text-white font-bold mb-6 text-center">
          Welcome Back
        </h2>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-6"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover fieldset": {
                borderColor: "#6366f1",
              },
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-8"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover fieldset": {
                borderColor: "#6366f1",
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            borderRadius: "12px",
            padding: "12px",
            textTransform: "none",
            fontSize: "1.1rem",
            background: "linear-gradient(to right, #6366f1, #4f46e5)",
            "&:hover": {
              background: "linear-gradient(to right, #4f46e5, #4338ca)",
            },
          }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
