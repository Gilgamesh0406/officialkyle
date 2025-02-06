import React from "react";
import {
  Typography,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { AddPhotoAlternate as AddPhotoIcon } from "@mui/icons-material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";

interface BaseCaseDataProps {
  caseName: string;
  setCaseName: (name: string) => void;
  caseImage: string | null;
  setCaseImage: (image: string | null) => void;
  canBattle: boolean;
  setCanBattle: (canBattle: boolean) => void;
  priceOffset: number;
  setPriceOffset: (offset: number) => void;
  caseType: "daily" | "unboxing";
  setCaseType: (type: "daily" | "unboxing") => void;
}

const BaseCaseData: React.FC<BaseCaseDataProps> = ({
  caseName,
  setCaseName,
  caseImage,
  setCaseImage,
  canBattle,
  setCanBattle,
  priceOffset,
  setPriceOffset,
  caseType,
  setCaseType,
}) => {
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          BACKEND_URL + "/api/upload",
          formData
        );

        const data = await response.data;
        const uploadedImageUrl = data.imageUrl;
        setCaseImage(uploadedImageUrl);
      } catch (err) {
        console.log(err);
        console.error("Image upload failed");
      }
    }
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Base Case Data
        </Typography>
        <TextField
          label="Case Name"
          variant="outlined"
          fullWidth
          value={caseName}
          onChange={(e) => setCaseName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="h6" gutterBottom>
          Case Image
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoIcon />}
          sx={{ mb: 2 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        {caseImage && (
          <Box
            sx={{
              width: "100%",
              maxHeight: 200,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img src={caseImage} alt="Case" />
          </Box>
        )}
      </Box>
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={canBattle}
              onChange={(e) => setCanBattle(e.target.checked)}
              color="primary"
            />
          }
          label="Can Battle (Include in Casebattle and Unboxing)"
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>Price Offset: {priceOffset}%</Typography>
        <Slider
          value={priceOffset}
          onChange={(e, value) => setPriceOffset(value as number)}
          min={-20}
          max={20}
          step={1}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Case Type
        </Typography>
        <Select
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as "daily" | "unboxing")}
          fullWidth
        >
          <MenuItem value="daily">Daily Case</MenuItem>
          <MenuItem value="unboxing">Unboxing/Casebattle Case</MenuItem>
        </Select>
      </Box>
    </>
  );
};

export default BaseCaseData;
