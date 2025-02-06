"use client";
import React from "react";
import UsersList from "@/components/users";
import { Container, Typography } from "@mui/material";

const UsersPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>
      <UsersList />
    </Container>
  );
};

export default UsersPage;
