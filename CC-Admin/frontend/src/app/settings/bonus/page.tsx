"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Paper,
  Avatar,
  Chip,
  IconButton,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface BonusUser {
  userid: string;
  name: string;
  avatar: string;
  claimed_at: string;
}

interface Bonus {
  id: string;
  code: string;
  amount: number;
  createdAt: string;
  expires_at: string;
  max_claims: number;
  users: BonusUser[];
}

const generateBonusCode = () => {
  return `BONUS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const BonusPage: React.FC = () => {
  const router = useRouter();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBonus, setNewBonus] = useState({
    code: "",
    amount: 0,
    expires_at: "",
    max_claims: 5,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBonuses = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/bonus/list`);
      setBonuses(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bonuses");
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, []);

  useEffect(() => {
    setNewBonus({
      code: generateBonusCode(),
      amount: 0,
      expires_at: "",
      max_claims: 5,
    });
  }, [openDialog]);

  const handleCreateBonus = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/bonus/create`, newBonus);
      toast.success("Bonus created successfully");
      setOpenDialog(false);
      fetchBonuses();
      setNewBonus({
        code: "",
        amount: 0,
        expires_at: "",
        max_claims: 5,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create bonus");
    }
  };

  const handleDeleteBonus = async (bonusId: string) => {
    if (!window.confirm("Are you sure you want to delete this bonus?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/bonus/${bonusId}`);
      toast.success("Bonus deleted successfully");
      fetchBonuses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete bonus");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Bonus Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
              },
            }}
          >
            Create New Bonus
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchBonuses}
            sx={{
              ml: 2,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Code
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Created
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Expires
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Claims
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Users
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bonuses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bonus) => (
                <TableRow
                  key={bonus.id}
                  sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                >
                  <TableCell>
                    <Chip
                      label={bonus.code}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ color: "success.main", fontWeight: "bold" }}
                    >
                      ${bonus.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(bonus.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(bonus.expires_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {bonus.users.length}/{bonus.max_claims}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {bonus.users.map((user, idx) => (
                        <Avatar
                          key={user.userid + idx}
                          src={user.avatar}
                          alt={user.name}
                          sx={{ width: 30, height: 30, cursor: "pointer" }}
                          title={`${user.name} - ${new Date(
                            user.claimed_at
                          ).toLocaleDateString()}`}
                          onClick={() => {
                            router.push(`/users/${user.userid}`);
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteBonus(bonus.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={bonuses.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          Create New Bonus
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Bonus Code"
              fullWidth
              value={newBonus.code}
              disabled
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 2 }}
              helperText="Bonus code will be generated automatically"
            />
            <TextField
              label="Amount ($)"
              type="number"
              fullWidth
              value={newBonus.amount}
              onChange={(e) =>
                setNewBonus({ ...newBonus, amount: Number(e.target.value) })
              }
            />
            <TextField
              label="Expiration Date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newBonus.expires_at}
              onChange={(e) =>
                setNewBonus({ ...newBonus, expires_at: e.target.value })
              }
            />
            <TextField
              label="Max Claims"
              type="number"
              fullWidth
              value={newBonus.max_claims}
              onChange={(e) =>
                setNewBonus({ ...newBonus, max_claims: Number(e.target.value) })
              }
              inputProps={{ min: 1, max: 5 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBonus}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BonusPage;
