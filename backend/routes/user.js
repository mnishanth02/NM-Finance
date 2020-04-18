const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const UserController = require("../controllers/user");
const FinanceUser = require("../controllers/financeUser");

const router = express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/getAllUser", FinanceUser.getAllUsers);
router.get("/getUserById/:id", FinanceUser.getUserById);
router.post("/addNewUser", checkAuth, extractFile, FinanceUser.addNewUser);
router.put("/updateUser/:id", checkAuth, extractFile, FinanceUser.updateUser);
router.delete("/deleteUser/:id", checkAuth, FinanceUser.deleteUser);

module.exports = router;
