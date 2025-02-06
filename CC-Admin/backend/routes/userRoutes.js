// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:userid", userController.getUserById);
router.post("/users/rank/:userid", userController.setUserRank);
router.post("/users/balance/:userid", userController.setUserBalance);

module.exports = router;
