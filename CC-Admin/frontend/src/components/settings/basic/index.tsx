"use client";
import { BACKEND_URL } from "@/utils/const";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BasicSetting: React.FC = () => {
  const [updatePriceTime, setUpdatePriceTime] = useState<number>(20);
  const handleSavePriceInterval = async () => {
    try {
      await axios.post(BACKEND_URL + "/api/setting", {
        key: "update_rust_skins",
        value: updatePriceTime,
      });
      toast.success("Updated successfuly. Please restart Bakcend.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update setting setting. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await axios.get(
          BACKEND_URL + "/api/setting/update_rust_skins"
        );
        const data = response.data;
        setUpdatePriceTime(parseInt(data.value));
      } catch (err) {
        console.log(err);
        toast.error("Failed to load setting.");
      }
    };

    fetchSetting();
  }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Basic Setting
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Update Rsut Skin prices every {updatePriceTime} min
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <TextField
                label="Set Interval"
                variant="outlined"
                fullWidth
                type="number"
                value={updatePriceTime}
                onChange={(e) => setUpdatePriceTime(parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSavePriceInterval}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BasicSetting;
