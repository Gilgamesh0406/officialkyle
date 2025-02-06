const supportService = require("../services/supportService");

const getTickets = async (req, res) => {
  try {
    const tickets = await supportService.getTickets(req.query);
    res.status(200).json(tickets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch support tickets" });
  }
};

const closeTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    await supportService.closeTicket(ticketId);
    res.status(200).json({ message: "Ticket closed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to close ticket" });
  }
};

const getMessages = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const messages = await supportService.getMessages(ticketId);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const addReply = async (req, res) => {
  const { ticketId } = req.params;
  const { message, image } = req.body;
  const staffData = {
    userid: req.user.userid,
    name: req.user.name,
    avatar: req.user.avatar,
  };

  try {
    const newMessage = await supportService.addReply(
      ticketId,
      staffData,
      message,
      image
    );
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    if (
      error.message === "Ticket not found" ||
      error.message === "Cannot reply to a closed ticket"
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to send reply" });
    }
  }
};

module.exports = {
  getTickets,
  closeTicket,
  getMessages,
  addReply,
};
