const SupportMessage = require("../models/SupportMessage");
const SupportTicket = require("../models/SupportTicket");
const { Op } = require("sequelize");

const getTickets = async (query) => {
  const { searchTerm, page, rowsPerPage } = query;

  const currentPage = parseInt(page) + 1 || 1;
  const itemsPerPage = parseInt(rowsPerPage) || 10;
  const offset = (currentPage - 1) * itemsPerPage;

  return await SupportTicket.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${searchTerm || ""}%`,
      },
    },
    limit: itemsPerPage,
    offset,
    order: [["time", "DESC"]],
  });
};

const closeTicket = async (ticketId) => {
  const ticket = await SupportTicket.findByPk(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }
  ticket.closed = true;
  await ticket.save();
  return ticket;
};

const getMessages = async (ticketId) => {
  const messages = await SupportMessage.findAll({
    where: {
      supportid: ticketId,
    },
    order: [["time", "ASC"]],
  });
  return messages;
};

const addReply = async (ticketId, staffData, message, image = null) => {
  const ticket = await SupportTicket.findByPk(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const newMessage = await SupportMessage.create({
    supportid: ticketId,
    userid: staffData.userid,
    name: staffData.name,
    avatar: staffData.avatar,
    message: message,
    image: image,
    response: 1,
    time: Date.now(),
    xp: 0,
  });

  return newMessage;
};

module.exports = {
  getTickets,
  closeTicket,
  getMessages,
  addReply,
};
