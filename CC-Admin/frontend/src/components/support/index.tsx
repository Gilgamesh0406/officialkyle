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
  Container,
  TextField,
  TablePagination,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";

interface SupportTicket {
  id: string;
  userid: string;
  name: string;
  avatar: string;
  xp: number;
  title: string;
  closed: boolean;
  department: number;
}
interface SupportMessage {
  id: number;
  userid: string;
  name: string;
  avatar: string;
  xp: number;
  supportid: number;
  response: number;
  message: string;
  time: number;
  image?: string;
}

const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData);
      return response.data.imageUrl;
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleRespond = async (ticketId: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/support/${ticketId}/messages`
      );
      setMessages(response.data);
      setSelectedTicket(ticketId);
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() && !selectedImage) return;

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await handleImageUpload();
      }

      await axios.post(`${BACKEND_URL}/api/support/${selectedTicket}/reply`, {
        message: replyMessage,
        image: imageUrl,
      });

      const response = await axios.get(
        `${BACKEND_URL}/api/support/${selectedTicket}/messages`
      );
      setMessages(response.data);
      setReplyMessage("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Reply sent successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/support`, {
          params: {
            searchTerm,
            page,
            rowsPerPage,
          },
        });
        setTickets(response.data.rows);
        setTotalCount(response.data.count);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load support tickets.");
      }
    };
    fetchTickets();
  }, [page, rowsPerPage, searchTerm]);

  const handleClose = async (ticketId: string) => {
    try {
      await axios.put(`${BACKEND_URL}/api/support/${ticketId}/close`);
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, closed: true as const } : ticket
      );
      setTickets(updatedTickets);
      toast.success("Ticket closed successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to close ticket.");
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
      <Typography variant="h4" gutterBottom>
        Support Tickets
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>XP</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.userid}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={ticket.avatar} alt={ticket.name} />
                  <Typography>{ticket.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{ticket.xp}</TableCell>
              <TableCell>
                {ticket.department === 0
                  ? "General / Others"
                  : ticket.department === 1
                  ? "Bug report"
                  : ticket.department === 2
                  ? "Trade offer issue"
                  : ticket.department === 3
                  ? "Improvements / Ideas"
                  : ticket.department === 4
                  ? "Marketing / Partnerships"
                  : "Ranking up"}
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell
                sx={{
                  color: ticket.closed ? "error.main" : "success.main",
                }}
              >
                {ticket.closed ? "Closed" : "Opened"}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleRespond(ticket.id)}
                  color="primary"
                >
                  <ChatIcon />
                </IconButton>
                {!ticket.closed && (
                  <IconButton
                    onClick={() => handleClose(ticket.id)}
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
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
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Support Conversation</DialogTitle>
        <DialogContent>
          <List sx={{ mb: 2 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent:
                    message.response === 1 ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Avatar
                      src={message.avatar}
                      alt={message.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="subtitle2">{message.name}</Typography>
                  </Box>
                  <ListItemText
                    primary={message.message}
                    secondary={new Date(message.time).toLocaleString()}
                  />
                  {message.image && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={message.image || ""}
                        alt="Attached"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            {selectedImage && (
              <Box sx={{ p: 1, border: "1px dashed grey", borderRadius: 1 }}>
                <Typography variant="body2">
                  Selected: {selectedImage.name}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                <IconButton
                  color="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() && !selectedImage}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setSelectedImage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupportPage;
