import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";

interface Item {
  itemid: string;
  name: string;
  image: string;
  price: number;
  blocked: boolean;
}

interface RustSkinsManagerProps {
  priceOffset: number;
  rustSkins: { itemid: string; name: string; chance: number; price: number }[];
  setRustSkins: (
    skins: { itemid: string; name: string; chance: number; price: number }[]
  ) => void;
}

const RustSkinsManager: React.FC<RustSkinsManagerProps> = ({
  priceOffset,
  rustSkins,
  setRustSkins,
}) => {
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [itemSum, setItemSum] = useState<number>(0);
  const [chance, setChance] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/case/item/list`, {
          params: {
            searchTerm,
            page,
            rowsPerPage,
          },
        });
        setItemsList(response.data.rows);
        setTotalCount(response.data.count);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load items.");
      }
    };
    fetchItems();
  }, [page, rowsPerPage, searchTerm]);

  const handleAddRustSkin = () => {
    if (selectedItem && chance > 0) {
      setRustSkins([
        ...rustSkins,
        {
          itemid: selectedItem.itemid,
          name: selectedItem.name,
          chance,
          price: selectedItem.price,
        },
      ]);
      setSelectedItem(null);
      setChance(0);
    }
  };

  const handleRemoveRustSkin = (index: number) => {
    const updatedSkins = rustSkins.filter((_, i) => i !== index);
    setRustSkins(updatedSkins);
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

  useEffect(() => {
    let sum = 0;
    rustSkins.forEach((v) => {
      sum += (v.chance / 100) * v.price;
    });
    setItemSum(sum * (1 + priceOffset / 100));
  }, [rustSkins, priceOffset]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Search Items
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" gutterBottom>
        Items List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell sx={{ width: "120px" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemsList?.map((item) => (
            <TableRow key={item.itemid}>
              <TableCell>{item.itemid}</TableCell>
              <TableCell>
                <img src={item.image} alt={item.name} width="50" />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell sx={{ width: "120px" }}>
                {item.blocked ? (
                  "BLOCKED"
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedItem(item)}
                  >
                    Select
                  </Button>
                )}
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

      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <DialogTitle>Set Chance</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Selected Item: {selectedItem?.name}
          </Typography>
          <TextField
            label="Chance (%)"
            type="number"
            variant="outlined"
            fullWidth
            value={chance}
            onChange={(e) => setChance(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddRustSkin}
            color="primary"
            disabled={chance <= 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Rust Skins and Chances (Total ${Math.round(itemSum * 10000) / 10000})
      </Typography>
      <List>
        {rustSkins.map((skin, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleRemoveRustSkin(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${skin.itemid} -  ${skin.name} - ${skin.chance}%`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RustSkinsManager;
