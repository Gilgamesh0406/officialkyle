import { Box, Checkbox, FormControl, FormControlLabel } from "@mui/material";

const DepositToggle: React.FC<{
  depositEnabled: boolean;
  label: string;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ depositEnabled, label, onToggle }) => (
  <Box sx={{ mb: 4 }}>
    <FormControl component="fieldset">
      <FormControlLabel
        control={
          <Checkbox
            checked={depositEnabled}
            onChange={onToggle}
            color="primary"
          />
        }
        label={label}
      />
    </FormControl>
  </Box>
);
export default DepositToggle;
