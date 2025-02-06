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
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";

const DepositWithSteam: React.FC = () => {
  const [depositEnabled, setDepositEnabled] = useState<boolean>(false);
  // const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [depositPercentage, setDepositPercentage] = useState<number>(0);
  const [editPercentage, setEditPercentage] = useState<boolean>(false); // Toggle for editing state
  const [tempPercentage, setTempPercentage] = useState<number>(0); // Temporary percentage during edit

  useEffect(() => {
    const fetchDepositSetting = async () => {
      try {
        const depost_steam_data = await axios.get(
          BACKEND_URL + "/api/setting/deposit_steam"
        );
        const depost_steam_percentage = await axios.get(
          BACKEND_URL + "/api/setting/deposit_steam_percentage"
        );
        setDepositEnabled(depost_steam_data.data.value === "true");
        setDepositPercentage(
          parseFloat(depost_steam_percentage.data.value) || 0
        );
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
        key: "deposit_steam",
        value: newStatus,
      });
      setDepositEnabled(newStatus);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update deposit setting. Please try again.");
    }
  };

  const handlePercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPercentage = parseInt(event.target.value, 10);
    setTempPercentage(isNaN(newPercentage) ? 0 : newPercentage);
  };

  const handleSavePercentage = async () => {
    if (tempPercentage >= 0 && tempPercentage <= 200) {
      try {
        await axios.post(BACKEND_URL + "/api/setting", {
          key: "deposit_steam_percentage",
          value: tempPercentage,
        });
        setDepositPercentage(tempPercentage);
        setEditPercentage(false); // Exit edit mode
        toast.success("Deposit with steam percentage updated.");
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to update deposit with steam percentage. Please try again."
        );
      }
    } else {
      toast.error("Percentage must be between 0 and 200.");
    }
  };

  const handleEditToggle = () => {
    setEditPercentage(true); // Enter edit mode
    setTempPercentage(depositPercentage); // Set temp value to current percentage
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
        Deposit with Steam
      </Typography>
      <DepositToggle
        label="Toggle Method"
        depositEnabled={depositEnabled}
        onToggle={handleDepositToggle}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {editPercentage ? (
          <>
            <TextField
              label="Multiplier %"
              type="number"
              value={tempPercentage}
              onChange={handlePercentageChange}
              inputProps={{ min: 0, max: 200 }}
              sx={{ width: "100px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePercentage}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography>Multiplier: {depositPercentage}%</Typography>
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
          <ToggleButton value="CSGO" sx={{ flexDirection: "column" }}>
            <img
              src="/images/csgo.png"
              alt="CSGO"
              style={{ width: 160, height: 60 }}
            />
            CSGO
          </ToggleButton>
          <ToggleButton value="DOTA2" sx={{ flexDirection: "column" }}>
            <img
              src="/images/dota2.png"
              alt="DOTA2"
              style={{ width: 160, height: 60 }}
            />
            DOTA2
          </ToggleButton>
          <ToggleButton value="TF2" sx={{ flexDirection: "column" }}>
            <img
              src="/images/tf2.png"
              alt="TF2"
              style={{ width: 160, height: 60 }}
            />
            TF2
          </ToggleButton>
          <ToggleButton value="RUST" sx={{ flexDirection: "column" }}>
            <img
              src="/images/rust.png"
              alt="RUST"
              style={{ width: 160, height: 60 }}
            />
            RUST
          </ToggleButton>
          <ToggleButton value="H1Z1" sx={{ flexDirection: "column" }}>
            <img
              src="/images/h1z1.png"
              alt="H1Z1"
              style={{ width: 160, height: 60 }}
            />
            H1Z1
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default DepositWithSteam;
