"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import BlockedSkinsList from "./BlockedSkinsList";
import AddBlockedSkinForm from "./AddBlockedSkinForm";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";

const BlockSkins: React.FC = () => {
  const [blockMethod, setBlockMethod] = useState<string>("value");
  const [blockValue, setBlockValue] = useState<string>("");
  const [blockedSkins, setBlockedSkins] = useState<
    { id: number; blockMethod: string; blockValue: string }[]
  >([]);

  useEffect(() => {
    const fetchSkins = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/setting/block-skin/list`
        );
        setBlockedSkins(response.data); // Assuming the response is an array of bots
      } catch (err) {
        console.log(err);
        toast.error("Failed to load Steam bots.");
      }
    };

    fetchSkins();
  }, []);

  const handleBlockValueChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBlockValue(event.target.value);
  };
  const handleBlockMethodChanged = (value: string) => {
    setBlockMethod(value);
  };

  const handleAddBlockedSkin = async () => {
    if (blockMethod && blockValue) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/setting/block-skin`,
          {
            blockMethod,
            blockValue,
          }
        );
        setBlockedSkins((prev) => [...prev, response.data]); // Append the newly created bot
        setBlockMethod("value");
        setBlockValue("");
        toast.success("Steam bot added successfully.");
      } catch (err) {
        console.log(err);
        toast.error("Failed to add Steam bot.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const handleRemoveBlockedSkin = async (index: number) => {
    const skinToRemove = blockedSkins[index];
    try {
      await axios.delete(
        `${BACKEND_URL}/api/setting/block-skin/${skinToRemove.id}`
      );
      const updatedSkins = blockedSkins.filter((_, i) => i !== index);
      setBlockedSkins(updatedSkins);
      toast.success("Blocked skin removed successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove blocked skin.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Block Skin
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <BlockedSkinsList
            blockedSkins={blockedSkins}
            onRemove={handleRemoveBlockedSkin}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AddBlockedSkinForm
            blockValue={blockValue}
            blockMethod={blockMethod}
            onMethodChange={handleBlockMethodChanged}
            onValueChange={handleBlockValueChanged}
            onAdd={handleAddBlockedSkin}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlockSkins;
