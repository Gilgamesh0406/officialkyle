"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  TextField,
  TablePagination,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";
import EditCase from "./Edit";

interface Case {
  id: string;
  caseid: string;
  name: string;
  image: string;
  type: string;
  battle: boolean;
  price: number;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]); // Replace with actual data fetching logic
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editCaseId, setEditCaseId] = useState<string>("");
  const [caseType, setCaseType] = useState<"daily" | "unboxing">("unboxing");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/case`, {
          params: {
            searchTerm,
            caseType,
            page,
            rowsPerPage,
          },
        });
        setCases(response.data.rows);
        setTotalCount(response.data.count);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load items.");
      }
    };
    fetchItems();
  }, [page, rowsPerPage, searchTerm, caseType]);

  const handleEdit = (caseId: string) => {
    setEditCaseId(caseId);
  };

  const handleDelete = async (caseId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/case/${caseId}`);
      setCases((prevCases) => prevCases.filter((c) => c.caseid !== caseId));
      setDeleteDialogOpen(false);
      toast.success("Case deleted.");
    } catch (err) {
      setDeleteDialogOpen(false);
      console.log(err);
      toast.error("Failed to delete case.");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {editCaseId !== "" ? (
        <EditCase caseid={editCaseId} closeEdit={() => setEditCaseId("")} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Case List
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={caseType}
              sx={{ width: 280 }}
              onChange={(e) =>
                setCaseType(e.target.value as "daily" | "unboxing")
              }
            >
              <MenuItem value="daily">Daily Case</MenuItem>
              <MenuItem value="unboxing">Unboxing/Casebattle Case</MenuItem>
            </Select>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Can Battle</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.caseid}>
                  <TableCell>{caseItem.caseid}</TableCell>
                  <TableCell>{caseItem.name}</TableCell>
                  <TableCell>
                    <img src={caseItem.image} alt={caseItem.name} width="50" />
                  </TableCell>
                  <TableCell>{caseItem.battle ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {Math.round(caseItem.price * 1000) / 1000}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(caseItem.caseid)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setCaseToDelete(caseItem.caseid);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this case?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => caseToDelete && handleDelete(caseToDelete)}
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default CaseList;
