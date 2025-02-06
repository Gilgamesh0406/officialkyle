const express = require("express");
const settingController = require("../controllers/settingController");

const router = express.Router();

router.post("/", settingController.updateSetting);
router.get("/:key", settingController.getSetting);
router.post("/block-skin", settingController.blockSkin);
router.get("/block-skin/list", settingController.getBlockedSkins);
router.delete("/block-skin/:id", settingController.deleteBlockedSkin);

module.exports = router;
