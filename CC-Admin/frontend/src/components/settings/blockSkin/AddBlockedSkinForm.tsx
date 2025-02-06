import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const AddBlockedSkinForm: React.FC<{
  blockMethod: string;
  blockValue: string;
  onMethodChange: (method: string) => void;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}> = ({ blockMethod, blockValue, onMethodChange, onValueChange, onAdd }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Block Method
        </Typography>
        <Select
          value={blockMethod}
          onChange={(e) => onMethodChange(e.target.value as "value" | "name")}
          fullWidth
        >
          <MenuItem value="value">Value</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </Box>
      <TextField
        label="Block Steam Skin"
        variant="outlined"
        fullWidth
        value={blockValue}
        onChange={onValueChange}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={onAdd} fullWidth>
        Add Blocked Skin
      </Button>
    </Box>
  );
};
export default AddBlockedSkinForm;
