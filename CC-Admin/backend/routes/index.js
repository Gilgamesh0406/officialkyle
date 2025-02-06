const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const settingRoutes = require("./settingRoutes");
const steamBotsRoutes = require("./steamBotsRoutes");
const caseRoutes = require("./caseRoutes");
const supportRoutes = require("./supportRoutes");
const authRoutes = require("./authRoutes");
const bonusRoutes = require("./bonusRoutes");
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/setting", settingRoutes);
router.use("/case", caseRoutes);
router.use("/bonus", bonusRoutes);
router.use("/steam-bots", steamBotsRoutes);
router.use("/support", authMiddleware, supportRoutes);
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://${process.env.DOMAIN}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
