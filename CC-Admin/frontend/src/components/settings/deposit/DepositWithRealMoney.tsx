import { useEffect, useState } from "react";
import DepositToggle from "./DepositToggle";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
} from "@mui/material";
import { BACKEND_URL } from "@/utils/const";
import axios from "axios";
import { toast } from "react-toastify";

const DepositWithRealMoney: React.FC = () => {
  const [depositEnabled, setDepositEnabled] = useState<boolean>(false);
  const [depositMultiplier, setDepositMultiplier] = useState<number>(0);
  const [editMultiplier, setEditMultiplier] = useState<boolean>(false); // Toggle for editing state
  const [tempMultiplier, setTempMultiplier] = useState<number>(0); // Temporary multiplier during edit
  // const [selectedGames, setSelectedGames] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepositSetting = async () => {
      try {
        const depositRealMoneyResponse = await axios.get(
          `${BACKEND_URL}/api/setting/deposit_real_money`
        );
        const depositMultiplierResponse = await axios.get(
          `${BACKEND_URL}/api/setting/deposit_real_money_multiplier`
        );

        setDepositEnabled(depositRealMoneyResponse.data.value === "true");
        setDepositMultiplier(
          parseFloat(depositMultiplierResponse.data.value) || 0
        );
      } catch (err) {
        console.log(err);
        toast.error("Failed to load deposit settings.");
      }
    };

    fetchDepositSetting();
  }, []);

  const handleDepositToggle = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = event.target.checked;

    try {
      await axios.post(`${BACKEND_URL}/api/setting`, {
        key: "deposit_real_money",
        value: newStatus,
      });
      setDepositEnabled(newStatus);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update deposit setting. Please try again.");
    }
  };

  const handleMultiplierChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMultiplier = parseInt(event.target.value, 10);
    setTempMultiplier(isNaN(newMultiplier) ? 0 : newMultiplier);
  };

  const handleSaveMultiplier = async () => {
    if (tempMultiplier >= 0 && tempMultiplier <= 200) {
      try {
        await axios.post(`${BACKEND_URL}/api/setting`, {
          key: "deposit_real_money_multiplier",
          value: tempMultiplier,
        });
        setDepositMultiplier(tempMultiplier);
        setEditMultiplier(false); // Exit edit mode
        toast.success("Deposit multiplier updated.");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update deposit multiplier. Please try again.");
      }
    } else {
      toast.error("Multiplier must be between 0 and 200.");
    }
  };

  const handleEditToggle = () => {
    setEditMultiplier(true); // Enter edit mode
    setTempMultiplier(depositMultiplier); // Set temp value to current multiplier
  };

  // const handleGameToggle = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newSelectedGames: string[]
  // ) => {
  //   // setSelectedGames(newSelectedGames);
  // };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Deposit with Real Money
      </Typography>
      <DepositToggle
        label="Toggle Method"
        depositEnabled={depositEnabled}
        onToggle={handleDepositToggle}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
        {editMultiplier ? (
          <>
            <TextField
              label="Multiplier %"
              type="number"
              value={tempMultiplier}
              onChange={handleMultiplierChange}
              inputProps={{ min: 0, max: 200 }}
              sx={{ width: "100px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveMultiplier}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography>Multiplier: {depositMultiplier}%</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEditToggle}
            >
              Change
            </Button>
          </>
        )}
      </Box>

      {depositEnabled && (
        <ToggleButtonGroup
          color="primary"
          // value={selectedGames}
          // onChange={handleGameToggle}
          sx={{ mt: 2 }}
        >
          <ToggleButton value="CARD" sx={{ flexDirection: "column" }}>
            <img
              src="/images/cards_shop.png"
              alt="CARD"
              style={{ width: 80, height: 80 }}
            />
            Credit Card
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default DepositWithRealMoney;
