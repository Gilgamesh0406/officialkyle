import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const SteamBotsList: React.FC<{
  steamBots: {
    accountName: string;
    password: string;
    sharedSecret: string;
    apiKey: string;
  }[];
  onRemove: (index: number) => void;
}> = ({ steamBots, onRemove }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom>
      Steam Trade Bots
    </Typography>
    <List>
      {steamBots.map((bot, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`Account Name: ${bot.accountName}`}
            secondary={`API Key: ${bot.apiKey}`}
          />
          <IconButton onClick={() => onRemove(index)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default SteamBotsList;
