"use client";

import React from "react";
import Button from "@mui/material/Button";
import { useAuth } from "@/contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Button color="inherit" onClick={logout} sx={{ color: "text.primary" }}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
