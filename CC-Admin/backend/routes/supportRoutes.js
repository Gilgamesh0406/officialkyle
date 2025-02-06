const express = require("express");
const supportController = require("../controllers/supportController");
const router = express.Router();

router.get("/", supportController.getTickets);
router.put("/:ticketId/close", supportController.closeTicket);

router.get("/:ticketId/messages", supportController.getMessages);
router.post("/:ticketId/reply", supportController.addReply);

module.exports = router;
