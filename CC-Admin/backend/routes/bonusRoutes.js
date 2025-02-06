const express = require("express");
const bonusController = require("../controllers/bonusController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, bonusController.createBonus);
router.get("/list", authMiddleware, bonusController.listBonuses);
router.delete("/:id", authMiddleware, bonusController.deleteBonus);
router.post("/claim/:code", authMiddleware, bonusController.claimBonus);

module.exports = router;
