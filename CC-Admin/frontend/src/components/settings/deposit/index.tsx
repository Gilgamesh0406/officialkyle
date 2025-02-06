"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import DepositToggle from "./DepositToggle";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DepositWithSteam from "./DepositWithSteam";
import DepositWithP2P from "./DepositWithP2P";
import DepositWithCryptoCurrency from "./DepositWithCryptoCurrency";
import DepositWithRealMoney from "./DepositWithRealMoney";

const DepositSettings: React.FC = () => {
  const [depositEnabled, setDepositEnabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepositSetting = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/api/setting/deposit");
        const data = response.data;
        setDepositEnabled(data.value === "true");
      } catch (err) {
        console.log(err);
        toast.error("Failed to load deposit setting.");
      }
    };

    fetchDepositSetting();
  }, []);

  const handleDepositToggle = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = event.target.checked;

    try {
      await axios.post(BACKEND_URL + "/api/setting", {
        key: "deposit",
        value: newStatus,
      });
      setDepositEnabled(newStatus);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update deposit setting. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Deposit Setting
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <DepositToggle
            label={(depositEnabled ? "Disable" : "Enable") + " Deposit Feature"}
            depositEnabled={depositEnabled}
            onToggle={handleDepositToggle}
          />
          {depositEnabled ? (
            <>
              <DepositWithSteam />
              <DepositWithP2P />
              <DepositWithCryptoCurrency />
              <DepositWithRealMoney />
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DepositSettings;
