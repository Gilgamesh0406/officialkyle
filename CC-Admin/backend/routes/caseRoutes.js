const express = require("express");
const caseController = require("../controllers/caseController");

const router = express.Router();

router.get("/", caseController.loadCases);
router.get("/:caseid", caseController.loadCase);
router.get("/item/list", caseController.loadItems);
router.post("/", caseController.addCase);
router.put("/", caseController.updateCase);
router.delete("/:caseid", caseController.deleteCase);

module.exports = router;
