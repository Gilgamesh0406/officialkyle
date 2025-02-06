import { Box, Button, TextField } from "@mui/material";

const AddSteamBotForm: React.FC<{
  newBot: {
    accountName: string;
    password: string;
    sharedSecret: string;
    apiKey: string;
  };
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}> = ({ newBot, onInputChange, onAdd }) => (
  <Box sx={{ mb: 4 }}>
    <TextField
      label="Account Name"
      name="accountName"
      variant="outlined"
      fullWidth
      value={newBot.accountName}
      onChange={onInputChange}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Password"
      name="password"
      variant="outlined"
      fullWidth
      value={newBot.password}
      onChange={onInputChange}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Shared Secret"
      name="sharedSecret"
      variant="outlined"
      fullWidth
      value={newBot.sharedSecret}
      onChange={onInputChange}
      sx={{ mb: 2 }}
    />
    <TextField
      label="API Key"
      name="apiKey"
      variant="outlined"
      fullWidth
      value={newBot.apiKey}
      onChange={onInputChange}
      sx={{ mb: 2 }}
    />
    <Button variant="contained" color="primary" onClick={onAdd} fullWidth>
      Add Steam Bot
    </Button>
  </Box>
);

export default AddSteamBotForm;
