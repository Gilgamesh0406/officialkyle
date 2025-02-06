"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TablePagination,
  Box,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  userid: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  balance: number;
  time_create: bigint;
}

const UsersList: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/users`, {
        params: {
          searchTerm,
          page,
          rowsPerPage,
        },
      });
      setUsers(response.data.rows);
      setTotalCount(response.data.count);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  }, [searchTerm, page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSave = async () => {
    if (!editUser) return;

    try {
      await axios.put(`${BACKEND_URL}/api/users/${editUser.id}`, editUser);
      setOpenDialog(false);
      fetchUsers();
      toast.success("User updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  const handleModerate = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>UserID</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Steam ID</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userid}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={user.avatar} alt={user.name} />
                  <Typography>{user.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{user.userid}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>${Number(user.balance).toFixed(2)}</TableCell>
              <TableCell>{user.email || "Not linked"}</TableCell>
              <TableCell>
                {new Date(Number(user.time_create) * 1000).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleModerate(user.userid)}
                >
                  Moderate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Role"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Balance"
                type="number"
                value={editUser.balance}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    balance: parseFloat(e.target.value),
                  })
                }
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersList;
