const express = require("express");
const multer = require("multer");
const path = require("path");

const checkAuth = require("../middleware/check-auth");
const UserController = require("../controllers/user");
const FinanceUser = require("../controllers/financeUser");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    //cb(error, "../images/");
    console.log("service oathm" + path.join(__dirname, "../images/"));
    cb(null, path.join(__dirname, "../images/"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(".").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(
      null,
      name + "-" + new Date().toISOString().replace(/:/g, "-") + "." + ext
    );
  },
});

var uploading = multer({ storage: storage }).single("userProfilePic");

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/getAllUser", FinanceUser.getAllUsers);
router.get("/getUserById/:id", FinanceUser.getUserById);
router.post("/addNewUser", checkAuth, uploading, FinanceUser.addNewUser);
router.put("/updateUser/:id", checkAuth, uploading, FinanceUser.updateUser);
router.delete("/deleteUser/:id", checkAuth, FinanceUser.deleteUser);

module.exports = router;
