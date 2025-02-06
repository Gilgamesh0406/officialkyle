import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const BlockedSkinsList: React.FC<{
  blockedSkins: { blockMethod: string; blockValue: string }[];
  onRemove: (index: number) => void;
}> = ({ blockedSkins, onRemove }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom>
      Blocked Skins
    </Typography>
    <List>
      {blockedSkins.map((skin, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`Skin ${skin.blockMethod}: ${skin.blockValue}`}
          />
          <IconButton onClick={() => onRemove(index)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default BlockedSkinsList;
