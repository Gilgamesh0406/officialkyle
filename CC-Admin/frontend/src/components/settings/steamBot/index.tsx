"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import SteamBotsList from "./SteamBotsList";
import AddSteamBotForm from "./AddSteamBotForm";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SteamBots: React.FC = () => {
  const [steamBots, setSteamBots] = useState<
    {
      accountName: string;
      password: string;
      sharedSecret: string;
      apiKey: string;
    }[]
  >([]);
  const [newBot, setNewBot] = useState({
    accountName: "",
    password: "",
    sharedSecret: "",
    apiKey: "",
  });

  // Fetch bot data from backend on mount
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/steam-bots`);
        setSteamBots(response.data); // Assuming the response is an array of bots
      } catch (err) {
        console.log(err);
        toast.error("Failed to load Steam bots.");
      }
    };

    fetchBots();
  }, []);

  // Handle new bot form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBot((prev) => ({ ...prev, [name]: value }));
  };

  // Add new bot to backend and update UI
  const handleAddSteamBot = async () => {
    const { accountName, password, sharedSecret, apiKey } = newBot;
    if (accountName && password && sharedSecret && apiKey) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/steam-bots`,
          newBot
        );
        setSteamBots((prev) => [...prev, response.data]); // Append the newly created bot
        setNewBot({
          accountName: "",
          password: "",
          sharedSecret: "",
          apiKey: "",
        });
        toast.success("Steam bot added successfully.");
      } catch (err) {
        console.log(err);
        toast.error("Failed to add Steam bot.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // Remove bot from backend and update UI
  const handleRemoveSteamBot = async (index: number) => {
    const botToRemove = steamBots[index];
    try {
      await axios.post(`${BACKEND_URL}/api/steam-bots/delete`, {
        accountName: botToRemove.accountName,
      });
      const updatedBots = steamBots.filter((_, i) => i !== index);
      setSteamBots(updatedBots);
      toast.success("Steam bot removed successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove Steam bot.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Steam Bots
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <SteamBotsList
            steamBots={steamBots}
            onRemove={handleRemoveSteamBot}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AddSteamBotForm
            newBot={newBot}
            onInputChange={handleInputChange}
            onAdd={handleAddSteamBot}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SteamBots;
